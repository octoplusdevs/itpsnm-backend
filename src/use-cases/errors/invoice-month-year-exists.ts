import { MonthName } from "@prisma/client";

export class InvoiceMonthYearAlreadyExistsError extends Error {
  constructor(academicYear: string, month: MonthName) {
    super(`An invoice for month ${month} already exists for the academic year ${academicYear}`);
  }
}
