import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryNotesRepository } from '@/repositories/in-memory/in-memory-notes-repository';
import { Mester } from '@prisma/client';

let notesRepository: InMemoryNotesRepository;

describe('Search Many Notes Use Case', () => {
  beforeEach(() => {
    notesRepository = new InMemoryNotesRepository();
  });

  it('should return notes with calculated grades that match the search criteria', async () => {
    await notesRepository.addNote({
      id: 1,
      p1: 10,
      p2: 15,
      exam: 20,
      nee: 0,
      resource: 12,
      level: 'CLASS_10',
      mester: Mester.FIRST,
      studentId: 123,
      subjectId: 1,
      created_at: new Date(),
      update_at: new Date(),
    });

    await notesRepository.addNote({
      id: 2,
      p1: 5,
      p2: 10,
      exam: 15,
      nee: 0,
      resource: 8,
      mester: Mester.SECOND,
      level: 'CLASS_10',
      studentId: 123,
      subjectId: 1,
      created_at: new Date(),
      update_at: new Date(),
    });

    const response = await notesRepository.searchMany({
      studentId: 123,
      subjectId: 1,
    });

    expect(response.length).toBe(2);
    expect(response[0].studentId).toEqual(123);
    expect(response[0].subjectId).toEqual(1);

    console.log(response)
    // Verify the calculated grades
    expect(response[0].mt1).toBeCloseTo((10 + 15 + 12) / 3);
    expect(response[1].mt2).toBeCloseTo((5 + 10 + 8) / 3);
  });
});
