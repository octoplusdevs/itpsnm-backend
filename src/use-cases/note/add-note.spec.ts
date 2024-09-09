import { expect, describe, it, beforeEach } from 'vitest'
import { CreateNoteUseCase } from './add-note'
import { InMemoryNotesRepository } from '@/repositories/in-memory/in-memory-notes-repository'
import { Mester } from '@prisma/client'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'

let notesRepository: InMemoryNotesRepository
let subjectsRepository: InMemorySubjectsRepository
let enrollmentsRepository: InMemoryEnrollmentRepository
let sut: CreateNoteUseCase

describe('Create Note Use Case', () => {
  beforeEach(() => {
    notesRepository = new InMemoryNotesRepository()
    enrollmentsRepository = new InMemoryEnrollmentRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new CreateNoteUseCase(notesRepository, enrollmentsRepository, subjectsRepository)

  })

  it('should create a new note', async () => {
    await subjectsRepository.create({
      name: "Matematica",
      id: 1
    })
    await enrollmentsRepository.create({
      id: 123,
      docsState: 'APPROVED',
      paymentState: 'APPROVED',
      identityCardNumber: '1234567890',
      courseId: 1,
      levelId: 1,
    })
    const response = await sut.execute({
      p1: 15,
      p2: 17,
      exam: 20,
      nee: 5,
      resource: 10,
      mester: Mester.FIRST, // Usando o enum Mester
      enrollmentId: 123,
      subjectId: 1,
      level: 'CLASS_10'
    })

    expect(response.note).toHaveProperty('id')
    expect(response.note.p1).toEqual(15)
    expect(response.note.p2).toEqual(17)
    expect(response.note.exam).toEqual(20)
    expect(response.note.nee).toEqual(5)
    expect(response.note.resource).toEqual(10)
    expect(response.note.mester).toEqual(Mester.FIRST)
    expect(response.note.enrollmentId).toEqual(123)
    expect(response.note.subjectId).toEqual(1)
    expect(response.note.created_at).toBeInstanceOf(Date)
    expect(response.note.update_at).toBeInstanceOf(Date)
  })

  it('should assign default values when fields are not provided', async () => {
    await subjectsRepository.create({
      name: "Matematica",
      id: 1
    })
    await enrollmentsRepository.create({
      id: 1,
      docsState: 'APPROVED',
      paymentState: 'APPROVED',
      identityCardNumber: '1234567890',
      courseId: 1,
      levelId: 1,
    })

    const response = await sut.execute({
      mester: Mester.FIRST,
      enrollmentId: 1,
      subjectId: 1,
      level: 'CLASS_10'
    })

    expect(response.note.p1).toEqual(0)
    expect(response.note.p2).toEqual(0)
    expect(response.note.exam).toEqual(0)
    expect(response.note.nee).toEqual(0)
    expect(response.note.resource).toEqual(0)
    expect(response.note.mester).toEqual(Mester.FIRST)
    expect(response.note.enrollmentId).toEqual(1)
    expect(response.note.subjectId).toEqual(1)
  })

  it('should save the note in the repository', async () => {
    await subjectsRepository.create({
      name: "Matematica",
      id: 1
    })
    await enrollmentsRepository.create({
      id: 456,
      docsState: 'APPROVED',
      paymentState: 'APPROVED',
      identityCardNumber: '1234567890',
      courseId: 1,
      levelId: 1,
    })
    let nen = await sut.execute({
      p1: 10,
      p2: 12,
      exam: 18,
      nee: 4,
      resource: 7,
      mester: Mester.SECOND,
      enrollmentId: 456,
      subjectId: 1,
      level: 'CLASS_10'
    })

    const notes = await notesRepository.searchMany({ enrollmentId: 456 })

    expect(notes).toHaveLength(1)
    expect(notes[0].enrollmentId).toEqual(456)
    expect(notes[0].subjectId).toEqual(1)
    expect(notes[0].mester).toEqual(Mester.SECOND)
  })
})
