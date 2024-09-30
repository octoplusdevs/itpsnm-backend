import { FileFormat, FileType } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { makeCreateFileUseCase } from '@/use-cases/factories/make-file-use-case';
const pump = promisify(pipeline);

export async function upload(request: FastifyRequest, reply: FastifyReply) {
  const fileSchema = z.object({
    name: z.string(),
    format: z.nativeEnum(FileFormat),
    identityCardNumber: z.string(),
  });

  const uploadDir = path.join(__dirname, '..', '..', '..', '..', 'uploads/photos');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let identityCardNumber: string | undefined;
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  const parts = request.parts();

  try {
    let file: { name: string; path: string; format: FileFormat; type: FileType; identityCardNumber: string; documentId: number | null } | null = null;

    for await (const part of parts) {
      if (part.type === 'field') {
        const field = part.value as string;
        if (part.fieldname === 'identityCardNumber') {
          identityCardNumber = field;
        }
      }
      if (part.type === 'file') {
        const { filename } = part;

        if (!allowedMimeTypes.includes(part.mimetype)) {
          return reply.status(400).send({ message: 'Invalid file type' });
        }

        // Verificação de tamanho de arquivo
        let fileSize = 0;
        part.file.on('data', chunk => {
          fileSize += chunk.length;
          if (fileSize > 5 * 1024 * 1024) {
            part.file.resume(); // Descartar o restante do arquivo
            return reply.status(400).send({ error: 'File size exceeds 5MB limit' });
          }
        });

        const filepath = path.join(uploadDir, filename);

        await pump(part.file, fs.createWriteStream(filepath));

        if (identityCardNumber === undefined) {
          return reply.status(400).send({ message: 'identityCardNumber is required' });
        }

        file = {
          name: filename,
          path: filepath,
          format: part.mimetype === 'image/jpeg' ? FileFormat.JPEG : FileFormat.PNG,
          type: FileType.PHOTO,
          identityCardNumber,
          documentId: null,
        };
      }
    }

    if (file === null) {
      return reply.status(400).send({ message: 'No file uploaded' });
    }

    const createFileUseCase = makeCreateFileUseCase();
    const result = await createFileUseCase.execute(file);
    return reply.status(201).send(result);
  } catch (err: unknown | any) {
    if (err.code === 'FST_REQ_FILE_TOO_LARGE') {
      return reply.status(413).send({ message: 'File size limit exceeded' });
    }

    return reply.status(500).send({ message: 'Internal Server Error', error: err });
  }
}
