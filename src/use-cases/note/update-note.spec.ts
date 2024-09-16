import { expect, describe, it, beforeEach } from 'vitest'
import { UpdateNoteUseCase } from './update-note'
import { InMemoryNotesRepository } from '@/repositories/in-memory/in-memory-notes-repository'

let notesRepository: InMemoryNotesRepository
let sut: UpdateNoteUseCase

describe('Update Note Use Case', () => {
  beforeEach(() => {
    notesRepository = new InMemoryNotesRepository()
    sut = new UpdateNoteUseCase(notesRepository)
  })

  it('should update an existing note', async () => {
    // Adiciona uma nota inicial no repositório
    const note = await notesRepository.addNote({
      id: 1,
      pf1: 10,
      pf2: 15,
      pft: 20,
      nee: 5,
      resource: 7,
      enrollmentId: 123,
      subjectId: 1,
      created_at: new Date(),
      update_at: new Date(),
    })

    // Atualiza a nota criada
    const response = await sut.execute({
      id: 1,
      pf1: 12,
      pf2: 18,
      pft: 19,
    })

    expect(response.note).toBeTruthy()
    expect(response.note?.pf1).toEqual(12)
    expect(response.note?.pf2).toEqual(18)
    expect(response.note?.pft).toEqual(19)
  })

  it('should return null if note is not found', async () => {
    const response = await sut.execute({
      id: 999, // ID não existente
      pf1: 12,
      pf2: 18,
    })

    expect(response.note).toBeNull()
  })
})
