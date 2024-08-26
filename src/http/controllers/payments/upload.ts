import { makeCreateDocumentWithFilesUseCase } from '@/use-cases/factories/make-document-use-case';
import { FileFormat, FileType } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { promisify } from 'util';
import { pipeline } from 'stream';
const pump = promisify(pipeline);

export async function payment(request: FastifyRequest, reply: FastifyReply) {
  const fileSchema = z.object({
    name: z.string(),
    format: z.nativeEnum(FileFormat),
    type: z.nativeEnum(FileType),
    studentId: z.number(),
  });

  const createDocumentWithFilesSchema = z.object({
    enrollmentId: z.number(),
    files: z.array(fileSchema).nonempty(),
  });

  const uploadDir = path.join(__dirname, '..', '..', '..', '..', 'uploads/enrollments');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const files: Array<{ name: string; path: string; format: FileFormat; type: FileType; identityCardNumber?: string }> = [];
  let enrollmentId: number | undefined;
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/docx'];
  const parts = request.parts();

  try {
    for await (const part of parts) {
      if (part.type === 'file') {
        const { fieldname, filename } = part;

        if (!allowedMimeTypes.includes(part.mimetype)) {
          return reply.status(400).send({ message: 'Invalid file type' });
        }

        // Verificação de tamanho de arquivo
        let fileSize = 0;
        part.file.on('data', chunk => {
          fileSize += chunk.length;
          if (fileSize > 5 * 1024 * 1024) {
            part.file.resume(); // Descartar o restante do arquivo
            return reply.status(400).send({ error: 'File size exceeds 2MB limit' });
          }
        });

        const filepath = path.join(__dirname, '..', '..', '..', '..', 'uploads/enrollments', filename);

        await pump(part.file, fs.createWriteStream(filepath));

        let type: FileType
        switch (fieldname) {
          case "IDENTITY_CARD": { type = FileType.IDENTITY_CARD } break;
          case "REPORT_CARD": { type = FileType.REPORT_CARD } break;
          case "TUITION_RECEIPT": { type = FileType.TUITION_RECEIPT } break;
          default: type = FileType.IDENTITY_CARD
        }
        files.push({
          name: filename,
          path: filepath,
          format: FileFormat.PDF,
          type
        });
      } else {
        const field = part.value as string;
        if (part.type === 'field' && part.fieldname === 'enrollmentId') {
          enrollmentId = parseInt(field, 10);
        }
      }
    }

    if (enrollmentId === undefined) {
      return reply.status(400).send({ message: 'enrollmentId is required' });
    }

    const createDocumentWithFilesUseCase = makeCreateDocumentWithFilesUseCase();
    const result = await createDocumentWithFilesUseCase.execute({ enrollmentId, files });
    return reply.status(201).send(result);
  } catch (err: unknown | any) {
    if (err.code === 'FST_REQ_FILE_TOO_LARGE') {
      return reply.status(413).send({ message: 'File size limit exceeded' });
    }

    return reply.status(500).send({ message: 'Internal Server Error', error: err });
  }
}
