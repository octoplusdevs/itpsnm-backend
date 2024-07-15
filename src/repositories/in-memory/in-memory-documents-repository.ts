import { randomInt } from "crypto";
import { DocumentsRepository, DocumentsType } from "../documents-repository";

export class InMemoryDocumentsRepository implements DocumentsRepository {
  public items: DocumentsType[] = []

  async create(data: DocumentsType): Promise<DocumentsType> {
    let newDocument: DocumentsType = {
      id: data.id ?? randomInt(9999),
      enrollment_id: data.enrollment_id,
      created_at: data.created_at ?? new Date(),
      update_at: data.update_at ?? new Date()
    }
    this.items.push(newDocument)
    return newDocument
  }
  async findById(DocumentId: number): Promise<DocumentsType | null> {
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
