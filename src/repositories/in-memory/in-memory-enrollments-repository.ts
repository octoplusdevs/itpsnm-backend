import { EnrollementState, Enrollment, Prisma, Student } from '@prisma/client'
import { EnrollmentsRepository } from '../enrollment-repository'

export class InMemoryEnrollmentRepository implements EnrollmentsRepository {
  public enrollments: Enrollment[] = []
  public students: Student[] = []

  checkStatus(studentId: number): Promise<Enrollment | null> {
    throw new Error('Method not implemented.')
  }
  toggleStatus(studentId: number, state: EnrollementState): Promise<Enrollment | null> {
    throw new Error('Method not implemented.')
  }
  destroy(studentId: number): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async create(data: Prisma.StudentCreateInput): Promise<Enrollment> {
    const newStudent: Student = {
      id: 1,
      type: data.type,
      full_name: data.full_name,
      password: data.password || "123456",
      father: data.father,
      mother: data.mother,
      date_of_birth: new Date(data.date_of_birth),
      height: data.height,
      identity_card_number: data.identity_card_number,
      gender: data.gender,
      emission_date: new Date(data.expiration_date),
      expiration_date: new Date(data.expiration_date),
      marital_status: data.marital_status,
      residence: data.residence,
      phone: data.phone,
      email: data.email,
      alternativePhone: data.alternativePhone || null,
      provincesId: null,
      countyId: null,
      course_id: 0,
      class_id: 0,
      level_id: 0,
      id_province: 0,
      id_county: 0,
    }
    this.students.push(newStudent)

    let newEnrollment: Enrollment = {
      id: 1,
      created_at: new Date(),
      update_at: new Date(),
      state: 'PENDING',
      studentsId: newStudent.id
    }
    return newEnrollment

  }
  fetchAllPending(): Promise<Enrollment> {
    throw new Error('Method not implemented.')
  }
}
