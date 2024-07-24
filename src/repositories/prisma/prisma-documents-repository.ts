import { prisma } from '@/lib/prisma';
import { Document } from '@prisma/client';
import { DocumentsRepository } from '../documents-repository';

export class PrismaDocumentRepository implements DocumentsRepository {
  findById(fileId: number): Promise<Document | null> {
    throw new Error('Method not implemented.');
  }
  destroy(fileId: number): Promise<Boolean> {
    throw new Error('Method not implemented.');
  }
  async create(data: { enrollmentId: number; }): Promise<Document> {
    const document = await prisma.document.create({
      data: {
        enrollmentId: data.enrollmentId,
      },
    });
    return document;
  }
}
