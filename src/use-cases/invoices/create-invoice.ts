import { InvoiceRepository } from "@/repositories/invoices-repository";
import { EnrollmentsRepository } from "@/repositories/enrollment-repository";
import { EmployeeRepository } from "@/repositories/employee-repository";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found";
import { EmployeeNotFoundError } from "../errors/employee-not-found";
import { Decimal } from "@prisma/client/runtime/library";
import { InvoiceItemRepository } from "@/repositories/invoices-item-repository";
import { InvoiceType, MonthName, PAY_STATUS } from "@prisma/client";
import { ItemPricesRepository } from "@/repositories/item-prices-repository";

interface CreateInvoiceDTO {
  enrollmentId: number;
  employeeId: number;
  dueDate: Date;
  issueDate: Date;
  type: InvoiceType;
  items: Array<{
    month?: MonthName | null;
    qty: number;
    itemPriceId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
}


export class CreateInvoiceUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private enrollmentsRepository: EnrollmentsRepository,
    private employeeRepository: EmployeeRepository,
    private invoiceItemRepository: InvoiceItemRepository,
    private itemPricesRepository: ItemPricesRepository,
  ) { }

  async execute(data: CreateInvoiceDTO) {
    // Verifica se a matrícula (enrollment) existe
    const enrollment = await this.enrollmentsRepository.checkStatus(data.enrollmentId);
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    // Verifica se o funcionário existe
    const employee = await this.employeeRepository.findById(data.employeeId);
    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    // Calcula o valor total dos itens
    let totalAmount = new Decimal(0)

    for(const item of data.items){
      let itemPrice = await this.itemPricesRepository.findById(item.itemPriceId)
      totalAmount = new Decimal(itemPrice?.priceWithIva!)
    }
    // Cria a fatura (invoice)
    const invoice = await this.invoiceRepository.createInvoice({
      enrollmentId: data.enrollmentId,
      employeeId: data.employeeId,
      totalAmount: new Decimal(totalAmount),
      dueDate: data.dueDate,
      status: PAY_STATUS.PENDING,
      created_at:  new Date(),
      update_at: new Date(),
      issueDate: data.issueDate,
      type: data.type
    });

    // Cria os itens da fatura (invoice items)
    for (const item of data.items) {
      let itemPrice = await this.itemPricesRepository.findById(item.itemPriceId)
      await this.invoiceItemRepository.createInvoiceItem({
        invoiceId: invoice.id,
        description: itemPrice?.itemName!,
        amount: new Decimal(itemPrice?.basePrice!),
        created_at: item.createdAt ?? new Date(),
        update_at: item.updatedAt ?? new Date(),
        status: PAY_STATUS.PENDING,
        total_amount: new Decimal(item.qty * Number(itemPrice?.priceWithIva)),
        QTY: item.qty,

        month: data.type === "TUITION" ? item.month! : null
      });
    }

    return invoice;
  }
}
