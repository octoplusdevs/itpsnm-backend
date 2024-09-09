import { LevelName, Note } from '@prisma/client';
import { randomInt } from 'crypto';
import { NotesRepository, NotesData } from '../notes-repository';

export class InMemoryNotesRepository implements NotesRepository {
  public items: Note[] = [];

  private calculateGrades(note: Note) {
    const { p1, p2, exam, resource, mester, level } = note;

    let mt1 = null;
    let mt2 = null;
    let mt3 = null;
    let mfd = null;
    let mf = null;

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

  async addNote(data: NotesData) {
    const note: Note = {
      id: data.id ?? randomInt(99999),
      p1: data.p1 ?? 0,
      p2: data.p2 ?? 0,
      exam: data.exam ?? 0,
      nee: data.nee ?? 0,
      resource: data.resource ?? 0,
      mester: data.mester,
      level: data.level,
      enrollmentId: data.enrollmentId,
      subjectId: data.subjectId,
      created_at: new Date(),
      update_at: new Date(),
    };

    this.items.push(note);
    return note;
  }

  async update(id: number, data: Partial<Note>): Promise<Note | null> {
    const findNoteIndex = this.items.findIndex((item) => item.id === id);

    if (findNoteIndex === -1) {
      return null;
    }

    const updatedNote: Note = {
      ...this.items[findNoteIndex],
      id: id,
      p1: data.p1 ?? this.items[findNoteIndex].p1,
      p2: data.p2 ?? this.items[findNoteIndex].p2,
      exam: data.exam ?? this.items[findNoteIndex].exam,
      nee: data.nee ?? this.items[findNoteIndex].nee,
      resource: data.resource ?? this.items[findNoteIndex].resource,
      mester: data.mester ?? this.items[findNoteIndex].mester,
      level: data.level ?? this.items[findNoteIndex].level,
      enrollmentId: data.enrollmentId ?? this.items[findNoteIndex].enrollmentId,
      subjectId: data.subjectId ?? this.items[findNoteIndex].subjectId,
      update_at: new Date(),
    };

    this.items[findNoteIndex] = updatedNote;
    return updatedNote;
  }

  async destroy(id: number): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  async searchMany(criteria: Partial<Note>): Promise<NotesData[]> {
    return this.items
      .filter((note) => {
        return Object.entries(criteria).every(([key, value]) => {
          return note[key as keyof Note] === value;
        });
      })
      .map((note) => {
        return {
          ...note,
          ...this.calculateGrades(note),
        };
      });
  }

  async getNoteWithFullGrades(criteria: NotesData): Promise<any | null> {
    const note = this.items.find((note) => {
      return Object.entries(criteria).every(([key, value]) => {
        return note[key as keyof Note] === value;
      });
    });

    if (!note) return null;

    const grades = this.calculateGrades(note);

    return {
      ...note,
      ...grades,
    };
  }
}
