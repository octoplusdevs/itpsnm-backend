import { EnrollementState } from '@prisma/client'
import { EnrollmentType, EnrollmentsRepository } from '../enrollment-repository'
import { randomInt } from 'crypto';

export class InMemoryEnrollmentRepository implements EnrollmentsRepository {

  public items: EnrollmentType[] = []


  async findById(enrollmentId: number): Promise<EnrollmentType | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    return enrollment
  }

  async findByStudentId(studentId: number): Promise<EnrollmentType | null> {
    const enrollment = this.items.find((item) => item.id === studentId)
    if (!enrollment) {
      return null
    }
    return enrollment
  }

  async checkStatus(enrollmentId: number): Promise<{ id: number; state: EnrollementState } | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    return {
      id: enrollment.id!,
      state: enrollment.state
    }
  }
  async toggleStatus(enrollmentId: number, state: EnrollementState): Promise<{ id: number; status: EnrollementState } | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    enrollment.state = state
    return {
      id: enrollment.id!,
      status: enrollment.state
    }
  }
  async destroy(enrollmentId: number): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === enrollmentId)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }
  async create(data: EnrollmentType): Promise<EnrollmentType> {
    const enrollment: EnrollmentType = {
      id: data.id ?? randomInt(9999),
      state: data.state,
      studentId: data.studentId,
      classeId: data.classeId,
      courseId: data.courseId,
      levelId: data.levelId,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(enrollment)

    return enrollment

  }
  async searchMany(state: EnrollementState, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: EnrollmentType[];
  }> {
    const pageSize = 20;

    // Filtrar itens pelo estado
    const filteredItems = this.items.filter((item) => item.state === state);

    // Calcular o número total de itens
    const totalItems = filteredItems.length;

    // Calcular o número total de páginas
    const totalPages = Math.ceil(totalItems / pageSize);

    // Pegar itens para a página atual
    const items = filteredItems.slice((page - 1) * pageSize, page * pageSize);

    return {
      totalItems,
      currentPage: page,
      totalPages,
      items,
    };
  }

}
