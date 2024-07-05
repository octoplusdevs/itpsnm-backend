import { Student } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { StudentsRepository } from '@/repositories/student-repository'

interface GetStudentUseCaseRequest {
  id?: number;
  identityCardNumber?: string;
  alternativePhone?: number;
  phone?: number;
  name?: string;
  email?: string;
}

export class GetStudentUseCase {
  constructor(private studentRepository: StudentsRepository) { }

  async execute({
    id,
    alternativePhone,
    email,
    identityCardNumber,
    name,
    phone
  }: GetStudentUseCaseRequest): Promise<Student | null> {
    let student: Student | null = null
    if (id !== undefined) {
      student = await this.studentRepository.findById(id);
    }
    if (identityCardNumber !== undefined) {
      student = await this.studentRepository.findByIdentityCardNumber(identityCardNumber);
    }
    if (alternativePhone !== undefined) {
      student = await this.studentRepository.findByAlternativePhone(alternativePhone);
    }
    if (phone !== undefined) {
      student = await this.studentRepository.findByPhone(phone);
    }
    if (name !== undefined) {
      student = await this.studentRepository.findByName(name);
    }
    if (email !== undefined) {
      student = await this.studentRepository.findByEmail(email);
    }
    if (!student) {
      throw new ResourceNotFoundError()
    }
    return student
  }
}
