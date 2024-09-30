import { Student } from '@prisma/client'
import { StudentsRepository } from '@/repositories/student-repository'
import { StudentNotFoundError } from '../errors/student-not-found';

interface GetStudentUseCaseRequest {
  id?: number;
  identityCardNumber?: string;
  alternativePhone?: string;
  phone?: string;
  name?: string;
  email?: string;
}

export class GetStudentUseCase {
  constructor(private studentRepository: StudentsRepository) { }

  async execute({
    id,
    alternativePhone,
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
    if (!student) {
      throw new StudentNotFoundError()
    }
    return student
  }
}
