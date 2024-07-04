import { Gender, MaritalStatus, Student, StudentType } from '@prisma/client'

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
  phone: number
  email: string
  alternativePhone?: number
  countyId: number
  courseId: number
  classeId: number
  levelId: number
  provinceId: number
}


export interface StudentsRepository {
  findById(id: number): Promise<Student | null>
  findByIdentityCardNumber(identityCardNumber: string): Promise<Student | null>
  findByAlternativePhone(phone: number): Promise<Student | null>
  findByPhone(phone: number): Promise<Student | null>
  findByName(name: string): Promise<Student | null>
  findByEmail(email: string): Promise<Student | null>
  create(data: StudentCreateInput): Promise<Student>
  searchMany(query: string, page: number): Promise<Student[]>
  destroy(id: number): Promise<boolean>;
}
