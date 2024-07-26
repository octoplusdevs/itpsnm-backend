import { DocumentsRepository } from '@/repositories/documents-repository';
import { FilesRepository } from '@/repositories/files-repository';
import { FileFormat, FileType } from '@prisma/client';
import { EnrollmentsRepository } from '@/repositories/enrollment-repository';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found';

interface CreateDocumentWithFilesRequest {
  enrollmentId: number;
  files: {
    name: string;
    path: string;
    format: FileFormat;
    type: FileType;
    identityCardNumber?: string;
  }[];
}

export class CreateDocumentWithFilesUseCase {
  constructor(
    private documentRepository: DocumentsRepository,
    private fileRepository: FilesRepository,
    private enrollmentRepository: EnrollmentsRepository,
  ) {}

  async execute(request: CreateDocumentWithFilesRequest) {
    const { enrollmentId, files } = request;

    const findEnrollment = await this.enrollmentRepository.checkStatus(enrollmentId)

    if(findEnrollment === null || !findEnrollment){
      throw new EnrollmentNotFoundError();
    }

    const document = await this.documentRepository.create({ enrollmentId });

    const createdFiles = await Promise.all(files.map(file =>
      this.fileRepository.create({
        ...file,
        documentId: document.id,
        identityCardNumber: findEnrollment.identityCardNumber!
      })
    ));

    return {
      document,
      files: createdFiles
    };
  }
}
