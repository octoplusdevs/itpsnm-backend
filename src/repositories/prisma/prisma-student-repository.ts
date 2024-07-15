import { Student } from '@prisma/client';
import { StudentCreateInput, StudentsRepository } from '../student-repository'
import { prisma } from '@/lib/prisma';

export class PrismaStudentsRepository implements StudentsRepository {
  async findById(id: number): Promise<Student | null> {
    let findStudent = await prisma.student.findUnique({
      where: {
        id
      }
    })
    return findStudent
  }
  async findByIdentityCardNumber(identityCardNumber: string): Promise<Student | null> {
    let findStudent = await prisma.student.findUnique({
      where: {
        identityCardNumber
      }
    })
    return findStudent
  }
  async findByAlternativePhone(phone: string): Promise<Student | null> {
    let findStudent = await prisma.student.findUnique({
      where: {
        alternativePhone: phone
      }
    })
    return findStudent
  }
  async findByPhone(phone: string): Promise<Student | null> {
    let findStudent = await prisma.student.findUnique({
      where: {
        phone
      }
    })
    return findStudent
  }
  findByName(name: string): Promise<Student | null> {
    throw new Error('Method not implemented.');
  }
  async findByEmail(email: string): Promise<Student | null> {
    let findStudent = await prisma.student.findUnique({
      where: {
        email
      }
    })
    return findStudent
  }
  async create(data: Student): Promise<Student> {
    let {
      id,
      countyId,
      dateOfBirth,
      email,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      password,
      phone,
      provinceId,
      residence,
      type,
      alternativePhone
    } = data

    let student = await prisma.student.create({
      data: {
        id,
        countyId,
        dateOfBirth,
        email,
        emissionDate,
        expirationDate,
        father,
        fullName,
        gender,
        height,
        identityCardNumber,
        maritalStatus,
        mother,
        password,
        phone,
        provinceId,
        residence,
        type,
        alternativePhone
      }
    })
    return student
  }
  async searchMany(query: string, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Student[];
  }> {
    let pageSize = 20
    const totalItems = await prisma.student.count();

    const totalPages = Math.ceil(totalItems / pageSize);

    let students = await prisma.student.findMany({
      where: {
        fullName: {
          contains: query,
          mode: 'insensitive'
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: students
    };
  }
  async destroy(id: number): Promise<boolean> {
    let destroyStudent = await prisma.student.delete({
      where: {
        id
      }
    })
    return destroyStudent ? true : false
  }

}
