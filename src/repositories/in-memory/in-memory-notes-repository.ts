import { Note } from '@prisma/client'
import { randomInt } from 'crypto'
import { NotesRepository, notes } from '../notes-repository'

export class InMemoryNotesRepository implements NotesRepository {


  public items: Note[] = []

  async addNote(data: notes) {
    const note: Note = {
      id: data.id ?? randomInt(99999),
      p1: data.p1 ?? parseFloat("0"),
      p2: data.p2 ?? parseFloat("0"),
      exam: data.exam ?? parseFloat("0"),
      nee: data.nee ?? parseFloat("0"),
      resource: data.resource ?? parseFloat("0"),
      mester: data.mester,
      studentId: data.studentId ?? null,
      subjectId: data.subjectId ?? null,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(note)
    return note
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
      studentId: data.studentId ?? this.items[findNoteIndex].studentId,
      subjectId: data.subjectId ?? this.items[findNoteIndex].subjectId,
      update_at: new Date(),
    };

    this.items[findNoteIndex] = updatedNote;

    return updatedNote;
  }

  async destroy(id: number): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }
  async searchMany(criteria: Partial<Note>): Promise<Note[]> {
    return this.items.filter((note) => {
      return Object.entries(criteria).every(([key, value]) => {
        return note[key as keyof Note] === value;
      });
    });
  }

}
