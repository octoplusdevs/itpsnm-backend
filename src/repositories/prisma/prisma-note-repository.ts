import { PrismaClient, Note } from '@prisma/client';
import { NotesRepository, NotesData } from '../notes-repository';

const prisma = new PrismaClient();

export class PrismaNotesRepository implements NotesRepository {

  async addNote(data: NotesData): Promise<Note> {
    const findNote = await prisma.note.findFirst({
      where: {
        level: data.level,
        enrollmentId: data.enrollmentId,
        subjectId: data.subjectId,
      }
    });

    if (!findNote) {
      const newNote = await prisma.note.create({
        data: {
          pf1: data.pf1 ?? 0,
          pf2: data.pf2 ?? 0,
          pft: data.pft ?? 0,
          ps1: data.ps1 ?? 0,
          ps2: data.ps2 ?? 0,
          pst: data.pst ?? 0,
          pt1: data.pt1 ?? 0,
          pt2: data.pt2 ?? 0,
          ptt: data.ptt ?? 0,
          nee: data.nee ?? 0,
          resource: data.resource ?? 0,
          level: data.level!,
          enrollmentId: data.enrollmentId,
          subjectId: data.subjectId!,
          created_at: data.created_at ?? new Date(),
          update_at: new Date(),
        },
      });
      return newNote
    }

    const updated =  await prisma.note.update({
      where: {
        id: findNote.id
      },
      data: {
        resource: data.resource ?? findNote.resource,
        pf1: data.pf1 ?? findNote.pf1,
        pf2: data.pf2 ?? findNote.pf2,
        pft: data.pft ?? findNote.pft,
        ps1: data.ps1 ?? findNote.ps1,
        ps2: data.ps2 ?? findNote.ps2,
        pst: data.pst ?? findNote.pst,
        pt1: data.pt1 ?? findNote.pt1,
        pt2: data.pt2 ?? findNote.pt2,
        ptt: data.ptt ?? findNote.ptt,
        nee: data.nee ?? findNote.nee,
        level: data.level,
        update_at: new Date(),
      }
    });
    return updated

  }


  async update(id: number, data: Partial<Note>): Promise<Note | null> {
    const note = await prisma.note.update({
      where: { id },
      data: {
        ...data,
        update_at: new Date(),
      },
    }).catch(() => null);

    return note;
  }

  async destroy(id: number): Promise<boolean> {
    try {
      await prisma.note.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async searchMany(criteria: Partial<Note>): Promise<NotesData[]> {
    const notes = await prisma.note.findMany({
      where: criteria,
    });

    return notes
  }

  async getNoteWithFullGrades(criteria: NotesData
  ): Promise<NotesData[] | null> {
    const notes = await prisma.note.findMany({
      where: {
        enrollmentId: criteria.enrollmentId,
        OR: [
          {
            level: criteria.level,
            subjectId: criteria.subjectId,
          }
        ]
      },
      include: {
        enrollments: false,  // Inclui os dados do estudante
        subjects: true,  // Inclui os dados da disciplina
      },
    });

    if (!notes.length) return null;

    return notes;
  }

}
