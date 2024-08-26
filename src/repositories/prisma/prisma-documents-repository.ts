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
    const findDocument = await prisma.document.findFirst({
      where: {
        enrollmentId: data.enrollmentId,
      }
    })
    if (findDocument) {
      return await prisma.document.update({
        where: {
          id: findDocument.id
        },
        data: {
          enrollmentId: data.enrollmentId,
        },
      });
    }
    const document = await prisma.document.create({
      data: {
        enrollmentId: data.enrollmentId,
      },
    });
    return document;
  }
}
