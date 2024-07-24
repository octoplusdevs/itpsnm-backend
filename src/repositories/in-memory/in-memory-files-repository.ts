import { File, FileFormat, FileType } from '@prisma/client';
import { FilesRepository, UpdateFileInput } from '../files-repository';

export class InMemoryFilesRepository implements FilesRepository {
  private items: File[] = [];

  async create(data: { name: string; path: string; format: FileFormat; type: FileType; identityCardNumber: string; documentId: number }): Promise<File> {
    const file: File = {
      id: this.items.length + 1,
      name: data.name,
      path: data.path,
      format: data.format,
      type: data.type,
      created_at: new Date(),
      update_at: new Date(),
      identityCardNumber: data.identityCardNumber,
      documentId: data.documentId,
    };

    this.items.push(file);
    return file;
  }
  async findById(id: number): Promise<File | null> {
    const file = this.items.find(file => file.id === id);
    return file || null;
  }

  async findAllFilesStudentByIdentityCardNumber(identityCardNumber: string): Promise<File[]> {
    return this.items.filter(file => file.identityCardNumber === identityCardNumber);
  }

  async update(id: number, data: UpdateFileInput): Promise<File | null> {
    const fileIndex = this.items.findIndex(file => file.id === id);
    if (fileIndex === -1) return null;

    const updatedFile: File = {
      ...this.items[fileIndex],
      ...data,
      update_at: new Date(),
    };
    this.items[fileIndex] = updatedFile;
    return updatedFile;
  }

  async destroy(id: number): Promise<void> {
    this.items = this.items.filter(file => file.id !== id);
  }

}
