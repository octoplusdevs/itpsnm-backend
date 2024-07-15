import { Gender, MaritalStatus, Student, StudentType } from '@prisma/client'
import { EnrollmentType } from './enrollment-repository'

export interface StudentCreateInput {
  id?: number
  type: StudentType
  fullName: string
  password: string
  father: string
  mother: string
  dateOfBirth: Date
  height: number
  identityCardNumber: string
  gender: Gender
  emissionDate: Date
  expirationDate: Date
  maritalStatus: MaritalStatus
  residence: string
  phone: string
  email: string
  alternativePhone?: string
  countyId: number
  provinceId: number
}


export interface StudentsRepository {
  findById(id: number): Promise<Student | null>
  findByIdentityCardNumber(identityCardNumber: string): Promise<Student | null>
  findByAlternativePhone(phone: string): Promise<Student | null>
  findByPhone(phone: string): Promise<Student | null>
  findByName(name: string): Promise<Student | null>
  findByEmail(email: string): Promise<Student | null>
  create(data: Student): Promise<Student>
  searchMany(query: string, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Student[];
  }>
  destroy(id: number): Promise<boolean>;
}
