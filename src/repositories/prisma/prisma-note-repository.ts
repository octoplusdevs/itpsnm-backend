import { PrismaClient, Note } from '@prisma/client';
import { NotesRepository, NotesData } from '../notes-repository';

const prisma = new PrismaClient();

export class PrismaNotesRepository implements NotesRepository {
  private calculateGrades(note: Note) {
    const { p1, p2, exam, resource, mester, level } = note;

    let mt1 = null;
    let mt2 = null;
    let mt3 = null;
    let mfd = null;
    let mf = null;

    // if (!((p1 | p2) >= 0 && (p1 | p2) <= 20)) {
    //   return
    // }
    if (mester === 'FIRST') {
      mt1 = (p1! + p2! + (resource || 0)) / 3;
    }

    if (mester === 'SECOND') {
      mt2 = (p1! + p2! + (resource || 0)) / 3;
    }

    if (mester === 'THIRD') {
      if (level === 'CLASS_10' || level === 'CLASS_11') {
        mt3 = (p1! + p2! + (resource || 0)) / 3;
        if (mt1 !== null && mt2 !== null) {
          mfd = (mt1 + mt2 + mt3!) / 3;
        }
      } else if (level === 'CLASS_12') {
        mfd = (p1! + p2!) / 2;
        if (exam !== undefined) {
          mf = mfd * 0.6 + exam * 0.4;
        }
      }
    }

    return { mt1, mt2, mt3, mfd, mf };
  }

  async addNote(data: NotesData): Promise<Note> {
    const findNote = await prisma.note.findFirst({
      where: {
        mester: data.mester,
        level: data.level,
        enrollmentId: data.enrollmentId,
        subjectId: data.subjectId,
      }
    })
    if (!findNote) {
      return await prisma.note.create({
        data: {
          p1: data.p1 ?? 0,
          p2: data.p2 ?? 0,
          exam: data.exam ?? 0,
          nee: data.nee ?? 0,
          resource: data.resource ?? 0,
          mester: data.mester,
          level: data.level,
          enrollmentId: data.enrollmentId,
          subjectId: data.subjectId,
          created_at: data.created_at ?? new Date(),
          update_at: data.update_at ?? new Date(),
        },
      });
    }

    const update = await prisma.note.update({
      data: {
        p1: data.p1 ?? 0,
        p2: data.p2 ?? 0,
        exam: data.exam ?? 0,
        nee: data.nee ?? 0,
        resource: data.resource ?? 0,
        mester: data.mester,
        level: data.level
      },
      where: {
        id: findNote.id
      }
    })

    return findNote
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

    return notes.map(note => ({
      ...note,
      ...this.calculateGrades(note),
    }));
  }

  async getNoteWithFullGrades(criteria: NotesData
  ): Promise<NotesData[] | null> {
    const notes = await prisma.note.findMany({
      where: {
        enrollmentId: criteria.enrollmentId,
        OR: {
          level: criteria.level,
          subjectId: criteria.subjectId,
          mester: criteria.mester
        }
      },
      include: {
        enrollments: false,  // Inclui os dados do estudante
        subjects: true,  // Inclui os dados da disciplina
      },
    });

    if (!notes.length) return null;

    const notesWithGrades = notes.map((note) => {
      const grades = this.calculateGrades(note);
      return {
        ...note,
        ...grades,
      };
    });

    return notesWithGrades;
  }

}
