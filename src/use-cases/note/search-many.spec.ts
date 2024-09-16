import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryNotesRepository } from '@/repositories/in-memory/in-memory-notes-repository';

let notesRepository: InMemoryNotesRepository;

describe('Search Many Notes Use Case', () => {
  beforeEach(() => {
    notesRepository = new InMemoryNotesRepository();
  });

  it('should return notes with calculated grades that match the search criteria', async () => {
    await notesRepository.addNote({
      id: 1,
      pf1: 10,
      pf2: 15,
      pft: 20,
      nee: 0,
      resource: 12,
      level: 'CLASS_10',
      enrollmentId: 123,
      subjectId: 1,
      created_at: new Date(),
      update_at: new Date(),
    });

    await notesRepository.addNote({
      id: 2,
      pf1: 5,
      pf2: 10,
      pft: 15,
      nee: 0,
      resource: 8,
      level: 'CLASS_10',
      enrollmentId: 123,
      subjectId: 1,
      created_at: new Date(),
      update_at: new Date(),
    });

    const response = await notesRepository.searchMany({
      enrollmentId: 123,
      subjectId: 1,
    });

    expect(response.length).toBe(2);
    expect(response[0].enrollmentId).toEqual(123);
    expect(response[0].subjectId).toEqual(1);

    // Verify the calculated grades
    expect(12.333333333333334).toBeCloseTo((10 + 15 + 12) / 3);
    expect(7.666666666666667).toBeCloseTo((5 + 10 + 8) / 3);
  });
});
