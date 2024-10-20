-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('Declaração', 'Certificado', 'Passe', 'Uniforme');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "type" "InvoiceType";
