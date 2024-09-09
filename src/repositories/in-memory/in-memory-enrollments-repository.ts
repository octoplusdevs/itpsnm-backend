import { EnrollementState, Enrollment } from '@prisma/client'
import { EnrollT, EnrollmentType, EnrollmentsRepository } from '../enrollment-repository'
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

  async findByIdentityCardNumber(identityCardNumber: string): Promise<EnrollmentType | null> {
    const enrollment = this.items.find((item) => item.identityCardNumber === identityCardNumber)
    if (!enrollment) {
      return null
    }
    return enrollment
  }

  async checkStatus(enrollmentId: number): Promise<EnrollT | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    return {
      id: enrollment.id!,
      paymentState: enrollment.paymentState,
      docsState: enrollment.docsState,
      identityCardNumber: enrollment.identityCardNumber,
      classeId: enrollment.classeId!,
      courseId: enrollment.courseId!,
      levelId: enrollment.levelId,
      created_at: enrollment.created_at!,
      update_at: enrollment.update_at!,
    }
  }
  async toggleStatus(enrollmentId: number, docsState: EnrollementState, paymentState: EnrollementState): Promise<{ id: number; docsState: EnrollementState; paymentState: EnrollementState } | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    enrollment.paymentState = paymentState
    enrollment.docsState = docsState
    return {
      id: enrollment.id!,
      paymentState: enrollment.paymentState,
      docsState: enrollment.docsState
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
      docsState: data.docsState,
      paymentState: data.paymentState,
      identityCardNumber: data.identityCardNumber,
      courseId: data.courseId,
      levelId: data.levelId,
      classeId: data.classeId ?? null,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(enrollment)

    return enrollment

  }
  async searchMany(paymentState: EnrollementState, docsState: EnrollementState, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: EnrollmentType[];
  }> {
    const pageSize = 20;

    // Filtrar itens pelo estado
    const filteredItems = this.items.filter(item => item.docsState.includes(docsState) || item.paymentState.includes(paymentState))

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
