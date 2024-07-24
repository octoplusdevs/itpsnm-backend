import { Document } from "@prisma/client";

export interface DocumentsRepository {
  create(data: { enrollmentId: number; }): Promise<Document>
  findById(fileId: number): Promise<Document | null>
  destroy(fileId: number): Promise<Boolean>
}
