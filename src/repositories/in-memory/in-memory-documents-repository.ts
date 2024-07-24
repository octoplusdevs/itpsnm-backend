import { Document } from '@prisma/client';
import { DocumentsRepository } from '../documents-repository';

export class InMemoryDocumentsRepository implements DocumentsRepository {
  private items: Document[] = [];

  async create(data: { enrollmentId: number; }): Promise<Document> {
    const document: Document = {
      id: this.items.length + 1,
      enrollmentId: data.enrollmentId,
      created_at: new Date(),
      update_at: new Date(),
    };

    this.items.push(document);
    return document;
  }
  async findById(DocumentId: number): Promise<Document | null> {
    return this.items.find(file => file.id === DocumentId) || null
  }
  async destroy(DocumentId: number): Promise<Boolean> {
    const index = this.items.findIndex((item) => item.id === DocumentId)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }

}
