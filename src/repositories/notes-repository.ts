import { Mester, Note } from '@prisma/client'

export type notes = {
  id: number;
  p1?: number;
  p2?: number;
  exam?: number;
  nee?: number;
  resource?: number;
  mester: Mester;
  created_at: Date;
  update_at: Date;
  studentId: number;
  subjectId: number;
}

export interface NotesRepository {
  destroy(id: number): Promise<boolean>
  update(id: number, data: Partial<Note>): Promise<Note | null>
  addNote(data: notes): Promise<Note>
  searchMany(criteria: Partial<Note>): Promise<Note[]>
}
