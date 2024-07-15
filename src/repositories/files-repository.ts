import { File, FileFormat, FileType } from '@prisma/client';

export interface CreateFileInput {
  name: string;
  path: string;
  format: FileFormat;
  type: FileType;
  studentId: number;
}

export interface UpdateFileInput {
  name?: string;
  path?: string;
  format?: FileFormat;
  type?: FileType;
}

export interface FilesRepository {
  create(data: CreateFileInput): Promise<File>;
  findById(id: number): Promise<File | null>;
  findAllByStudentId(studentId: number): Promise<File[]>;
  update(id: number, data: UpdateFileInput): Promise<File | null>;
  destroy(id: number): Promise<void>;
}
