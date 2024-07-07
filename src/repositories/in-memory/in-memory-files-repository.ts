import { randomInt } from "crypto";
import { FilesRepository, FilesType } from "../files-repository";

export class InMemoryFilesRepository implements FilesRepository {
  public items: FilesType[] = []

  async create(data: FilesType): Promise<FilesType> {
    let newFile: FilesType = {
      id: data.id ?? randomInt(9999),
      format: data.format,
      path: data.path,
      state: data.state,
      studentId: data.studentId,
      type: data.type,
      created_at: data.created_at ?? new Date(),
      update_at: data.update_at ?? new Date()
    }
    this.items.push(newFile)
    return newFile
  }
  async findById(fileId: number): Promise<FilesType | null> {
    return this.items.find(file => file.id === fileId) || null
  }
  async destroy(fileId: number): Promise<void> {
    this.items = this.items.filter(file => file.id !== fileId)
  }

}
