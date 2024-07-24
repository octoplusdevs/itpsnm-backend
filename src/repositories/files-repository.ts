import { File, FileFormat, FileType } from '@prisma/client';

export interface CreateFileInput {
  name: string;
  path: string;
  format: FileFormat;
  type: FileType;
  identityCardNumber: string;
  documentId: number
}

export interface UpdateFileInput {
  name?: string;
  path?: string;
  format?: FileFormat;
  type?: FileType;
  documentId: number
}

export interface FilesRepository {
  create(data: CreateFileInput): Promise<File>;
  findById(id: number): Promise<File | null>;
  findAllFilesStudentByIdentityCardNumber(identityCardNumber: string): Promise<File[]>;
  update(id: number, data: UpdateFileInput): Promise<File | null>;
  destroy(id: number): Promise<void>;
}
