import { Note, LevelName } from '@prisma/client';

export type NotesData = {
  id?: number;
  pf1?: number;
  pf2?: number;
  pft?: number;
  ps1?: number;
  ps2?: number;
  pst?: number;
  pt1?: number;
  pt2?: number;
  ptt?: number;
  nee?: number | null;
  resource?: number;
  mt1?: number | null;
  mt2?: number | null;
  mt3?: number | null;
  mfd?: number | null;
  mf?: number | null;
  level?: LevelName;
  created_at?: Date;
  update_at?: Date;
  enrollmentId: number;
  subjectId?: number;
}

export interface NotesRepository {
  addNote(data: NotesData): Promise<Note>;
  update(id: number, data: Partial<Note>): Promise<Note | null>;
  destroy(id: number): Promise<boolean>;
  searchMany(criteria: Partial<Note>): Promise<NotesData[]>;
  getNoteWithFullGrades(criteria: NotesData): Promise<any | null>;
}
