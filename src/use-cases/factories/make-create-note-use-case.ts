import { NotesRepository } from '@/repositories/notes-repository'
import { CreateNoteUseCase } from '../note/add-note'
import { PrismaNotesRepository } from '@/repositories/prisma/prisma-note-repository'
import { EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { PrismaSubjectRepository } from '@/repositories/prisma/prisma-subject-repository'
import { SubjectsRepository } from '@/repositories/subject-repository'

// Função de fábrica para criar uma instância de CreateNoteUseCase
export function makeCreateNoteUseCase(): CreateNoteUseCase {
  // Cria uma instância do repositório de notas, você pode substituir por outro tipo de repositório se necessário
  const notesRepository: NotesRepository = new PrismaNotesRepository()
  const enrollmentsRepository: EnrollmentsRepository = new PrismaEnrollmentsRepository()
  const subjectsRepository: SubjectsRepository = new PrismaSubjectRepository()

  // Retorna uma instância do CreateNoteUseCase com o repositório
  return new CreateNoteUseCase(notesRepository, enrollmentsRepository, subjectsRepository)
}
