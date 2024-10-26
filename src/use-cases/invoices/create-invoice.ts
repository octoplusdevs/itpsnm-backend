import { InvoiceRepository } from "@/repositories/invoices-repository";
import { EnrollmentsRepository } from "@/repositories/enrollment-repository";
import { EmployeeRepository } from "@/repositories/employee-repository";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found";
import { EmployeeNotFoundError } from "../errors/employee-not-found";
import { Decimal } from "@prisma/client/runtime/library";
import { InvoiceItemRepository } from "@/repositories/invoices-item-repository";
import { InvoiceType, MonthName, PAY_STATUS } from "@prisma/client";

interface CreateInvoiceDTO {
  enrollmentId: number;
  employeeId: number;
  dueDate: Date;
  issueDate: Date;
  type: InvoiceType;
  items: Array<{
    description: string;
    amount: number;
    month: MonthName | null;
    qty: number;
  }>;
}


export class CreateInvoiceUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private enrollmentsRepository: EnrollmentsRepository,
    private employeeRepository: EmployeeRepository,
    private invoiceItemRepository: InvoiceItemRepository
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
    const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

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
      await this.invoiceItemRepository.createInvoiceItem({
        invoiceId: invoice.id,
        description: item.description,
        amount: new Decimal(item.amount),
        created_at: new Date(),
        update_at: new Date(),
        status: PAY_STATUS.PENDING,
        total_amount: new Decimal(item.amount * item.qty),
        QTY: item.qty,
        month: data.type === "TUITION" ? item.month : null
      });
    }

    return invoice;
  }
}
