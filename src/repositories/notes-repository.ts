import { Note, Mester, LevelName } from '@prisma/client';

export type NotesData = {
  id?: number;
  p1?: number;
  p2?: number;
  exam?: number;
  mt1?: number | null;
  mt2?: number | null;
  mt3?: number | null;
  mfd?: number | null;
  mf?: number | null;
  nee?: number | null;
  resource?: number;
  mester: Mester;
  level: LevelName;
  created_at?: Date;
  update_at?: Date;
  enrollmentId: number;
  subjectId: number;
}

export interface NotesRepository {
  addNote(data: NotesData): Promise<Note>;
  update(id: number, data: Partial<Note>): Promise<Note | null>;
  destroy(id: number): Promise<boolean>;
  searchMany(criteria: Partial<Note>): Promise<NotesData[]>;
  getNoteWithFullGrades(criteria: NotesData): Promise<any | null>;
}
