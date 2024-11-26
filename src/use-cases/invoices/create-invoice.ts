import { InvoiceRepository } from "@/repositories/invoices-repository";
import { EnrollmentsRepository } from "@/repositories/enrollment-repository";
import { EmployeeRepository } from "@/repositories/employee-repository";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found";
import { EmployeeNotFoundError } from "../errors/employee-not-found";
import { Decimal } from "@prisma/client/runtime/library";
import { InvoiceItemRepository } from "@/repositories/invoices-item-repository";
import { InvoiceType, MonthName, PAY_STATUS } from "@prisma/client";
import { ItemPricesRepository } from "@/repositories/item-prices-repository";
import { LevelsRepository } from "@/repositories/level-repository";
import { LevelNotFoundError } from "../errors/level-not-found";

interface CreateInvoiceDTO {
  enrollmentId: number;
  employeeId: number;
  dueDate: Date;
  issueDate: Date;
  type: InvoiceType;
  items: Array<{
    month?: MonthName[] | null;
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
    let totalAmount = 0

    // Cria a fatura (invoice)
    const invoice = await this.invoiceRepository.createInvoice({
      enrollmentId: data.enrollmentId,
      employeeId: data.employeeId,
      totalAmount: new Decimal(totalAmount),
      dueDate: data.dueDate,
      status: PAY_STATUS.PENDING,
      created_at: new Date(),
      update_at: new Date(),
      issueDate: data.issueDate,
      type: data.type
    });

    // Cria os itens da fatura (invoice items)
    for (const item of data.items) {
      let itemPrice = await this.itemPricesRepository.findById(item.itemPriceId)
      if ((data.type === "TUITION" || data.type === "TUITION_PENALTY" || data.type === "ENROLLMENT" || data.type === "ENROLLMENT_CONFIRMATION") && item.month !== null && item.month !== undefined) {
        for (let month of item.month) {
          await this.invoiceItemRepository.createInvoiceItem({
            invoiceId: invoice.id,
            description: itemPrice?.itemName!,
            amount: new Decimal(itemPrice?.basePrice!),
            created_at: item.createdAt ?? new Date(),
            update_at: item.updatedAt ?? new Date(),
            status: PAY_STATUS.PENDING,
            total_amount: new Decimal(itemPrice?.priceWithIva!),
            QTY: 1,
            month
          });
        }
      } else {
        await this.invoiceItemRepository.createInvoiceItem({
          invoiceId: invoice.id,
          description: itemPrice?.itemName!,
          amount: new Decimal(itemPrice?.basePrice!),
          created_at: item.createdAt ?? new Date(),
          update_at: item.updatedAt ?? new Date(),
          status: PAY_STATUS.PENDING,
          total_amount: new Decimal(item.qty * Number(itemPrice?.priceWithIva)),
          QTY: item.qty,
          month: null
        });
      }

    }
    let items = await this.invoiceItemRepository.findInvoiceItemsByInvoiceId(invoice.id);
    let finalTotal = 0;
    items.forEach((item) => {
      finalTotal += Number(item.total_amount!)
    })
    let finalInvoice = await this.invoiceRepository.updateInvoice(invoice.id, {
      totalAmount: finalTotal
    });

    return finalInvoice;
  }
}
