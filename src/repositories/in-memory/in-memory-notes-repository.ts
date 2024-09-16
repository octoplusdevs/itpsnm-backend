import { Note } from '@prisma/client';
import { randomInt } from 'crypto';
import { NotesRepository, NotesData } from '../notes-repository';

export class InMemoryNotesRepository implements NotesRepository {
  public items: Note[] = [];

  async addNote(data: NotesData) {
    const note: Note = {
      id: data.id ?? randomInt(99999),
      pf1: data.pf1 ?? 0,
      pf2: data.pf2 ?? 0,
      pft: data.pft ?? 0,
      nee: data.nee ?? 0,
      resource: data.resource ?? 0,
      level: data.level!,
      enrollmentId: data.enrollmentId,
      subjectId: data.subjectId!,
      created_at: new Date(),
      update_at: new Date(),
      ps1: data.ps1 ?? 0,
      ps2: data.ps2 ?? 0,
      pst: data.pst ?? 0,
      pt1: data.pt1 ?? 0,
      pt2: data.pt2 ?? 0,
      ptt: data.ptt ?? 0,
      mt1: null,
      mt2: null,
      mt3: null,
      mf: null,
      mfd: null
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
      pf1: data.pf1 ?? this.items[findNoteIndex].pf1,
      pf2: data.pf2 ?? this.items[findNoteIndex].pf2,
      pft: data.pft ?? this.items[findNoteIndex].pft,
      ps1: data.pf1 ?? this.items[findNoteIndex].ps1,
      ps2: data.pf2 ?? this.items[findNoteIndex].ps2,
      pst: data.pft ?? this.items[findNoteIndex].pst,
      pt1: data.pf1 ?? this.items[findNoteIndex].pt1,
      pt2: data.pf2 ?? this.items[findNoteIndex].pt2,
      ptt: data.pft ?? this.items[findNoteIndex].ptt,
      nee: data.nee ?? this.items[findNoteIndex].nee,
      resource: data.resource ?? this.items[findNoteIndex].resource,
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
  }

  async getNoteWithFullGrades(criteria: NotesData): Promise<any | null> {
    const note = this.items.find((note) => {
      return Object.entries(criteria).every(([key, value]) => {
        return note[key as keyof Note] === value;
      });
    });

    if (!note) return null;


    return {
      ...note,
    };
  }
}
