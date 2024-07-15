import { File } from '@prisma/client';
import { CreateFileInput, FilesRepository, UpdateFileInput } from '../files-repository';

class InMemoryFilesRepository implements FilesRepository {
  private files: File[] = [];
  private fileIdSequence: number = 1;

  async create(data: CreateFileInput): Promise<File> {
    const newFile: File = {
      id: this.fileIdSequence++,
      name: data.name,
      path: data.path,
      format: data.format,
      type: data.type,
      studentId: data.studentId,
      created_at: new Date(),
      update_at: new Date(),
    };
    this.files.push(newFile);
    return newFile;
  }

  async findById(id: number): Promise<File | null> {
    const file = this.files.find(file => file.id === id);
    return file || null;
  }

  async findAllByStudentId(studentId: number): Promise<File[]> {
    return this.files.filter(file => file.studentId === studentId);
  }

  async update(id: number, data: UpdateFileInput): Promise<File | null> {
    const fileIndex = this.files.findIndex(file => file.id === id);
    if (fileIndex === -1) return null;

    const updatedFile: File = {
      ...this.files[fileIndex],
      ...data,
      update_at: new Date(),
    };
    this.files[fileIndex] = updatedFile;
    return updatedFile;
  }

  async destroy(id: number): Promise<void> {
    this.files = this.files.filter(file => file.id !== id);
  }
}

export { InMemoryFilesRepository };
