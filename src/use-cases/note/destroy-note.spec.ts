import { expect, describe, it, beforeEach } from 'vitest'
import { DestroyNoteUseCase } from './destroy-note'
import { InMemoryNotesRepository } from '@/repositories/in-memory/in-memory-notes-repository'
import { Mester } from '@prisma/client'

let notesRepository: InMemoryNotesRepository
let sut: DestroyNoteUseCase

describe('Destroy Note Use Case', () => {
  beforeEach(() => {
    notesRepository = new InMemoryNotesRepository()
    sut = new DestroyNoteUseCase(notesRepository)
  })

  it('should destroy an existing note', async () => {
    // Adiciona uma nota inicial no repositório
    const note = await notesRepository.addNote({
      id: 1,
      p1: 10,
      p2: 15,
      exam: 20,
      nee: 5,
      resource: 7,
      mester: Mester.FIRST,
      studentId: 123,
      subjectId: 1,
      created_at: new Date(),
      update_at: new Date(),
    })

    // Exclui a nota criada
    const response = await sut.execute({
      id: note.id,
    })

    expect(response.success).toBe(true)
    expect(notesRepository.items.length).toBe(0) // Verifica se a nota foi removida do repositório
  })

  it('should return false if note is not found', async () => {
    const response = await sut.execute({
      id: 999, // ID não existente
    })

    expect(response.success).toBe(false)
  })
})
