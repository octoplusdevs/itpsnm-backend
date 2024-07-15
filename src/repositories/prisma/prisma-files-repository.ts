import { prisma } from '@/lib/prisma';
import { File } from '@prisma/client';
import { CreateFileInput, FilesRepository, UpdateFileInput } from '../files-repository';

class PrismaFilesRepository implements FilesRepository {
  async create(data: CreateFileInput): Promise<File> {
    const newFile = await prisma.file.create({
      data: {
        name: data.name,
        path: data.path,
        format: data.format,
        type: data.type,
        studentId: data.studentId,
      },
    });
    return newFile;
  }

  async findById(id: number): Promise<File | null> {
    const file = await prisma.file.findUnique({
      where: { id },
    });
    return file;
  }

  async findAllByStudentId(studentId: number): Promise<File[]> {
    const files = await prisma.file.findMany({
      where: { studentId },
    });
    return files;
  }

  async update(id: number, data: UpdateFileInput): Promise<File | null> {
    const updatedFile = await prisma.file.update({
      where: { id },
      data: {
        ...data,
      },
    });
    return updatedFile;
  }

  async destroy(id: number): Promise<void> {
    await prisma.file.delete({
      where: { id },
    });
  }
}

export { PrismaFilesRepository };
