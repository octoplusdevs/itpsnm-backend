import { Employee, Prisma, $Enums } from '@prisma/client';
import { EmployeeRepository } from '../employee-repository';
import { prisma } from '@/lib/prisma';

export class PrismaEmployeeRepository implements EmployeeRepository {
  async findByIdentityCardNumber(identityCardNumber: string): Promise<{ id: number; fullName: string; dateOfBirth: Date; identityCardNumber: string; gender: $Enums.Gender; emissionDate: Date; expirationDate: Date; maritalStatus: $Enums.MaritalStatus; residence: string; phone: string; alternativePhone: string | null; created_at: Date; update_at: Date; } | null> {
    const employee = await prisma.employee.findUnique({
      where: {
        identityCardNumber
      }
    })
    return employee
  }
  async findByAlternativePhone(phone: string): Promise<{ id: number; fullName: string; dateOfBirth: Date; identityCardNumber: string; gender: $Enums.Gender; emissionDate: Date; expirationDate: Date; maritalStatus: $Enums.MaritalStatus; residence: string; phone: string; alternativePhone: string | null; created_at: Date; update_at: Date; } | null> {
    const employee = await prisma.employee.findFirst({
      where: {
        alternativePhone: phone
      }
    })
    return employee
  }
  async findByPhone(phone: string): Promise<{ id: number; fullName: string; dateOfBirth: Date; identityCardNumber: string; gender: $Enums.Gender; emissionDate: Date; expirationDate: Date; maritalStatus: $Enums.MaritalStatus; residence: string; phone: string; alternativePhone: string | null; created_at: Date; update_at: Date; } | null> {
    const employee = await prisma.employee.findFirst({
      where: {
         phone
      }
    })
    return employee
  }
  async findByName(name: string): Promise<{ id: number; fullName: string; dateOfBirth: Date; identityCardNumber: string; gender: $Enums.Gender; emissionDate: Date; expirationDate: Date; maritalStatus: $Enums.MaritalStatus; residence: string; phone: string; alternativePhone: string | null; created_at: Date; update_at: Date; } | null> {
    const employee = await prisma.employee.findFirst({
      where: {
        fullName: {
          contains: name,
          mode: 'insensitive'
        }
      }
    })
    return employee
  }
  async searchMany(page: number): Promise<{ totalItems: number; currentPage: number; totalPages: number; items: Employee[]; }> {
    let pageSize = 20
    const totalItems = await prisma.employee.count();

    const totalPages = Math.ceil(totalItems / pageSize);

    let students = await prisma.employee.findMany({
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
    let find = await prisma.employee.delete({
      where: {
        id
      }
    })
    return find ? true : false
  }

  async findById(id: number): Promise<Employee | null> {
    return prisma.employee.findUnique({ where: { id } });
  }

  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return prisma.employee.create({
      data: {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        alternativePhone: data.alternativePhone,
        gender: data.gender,
        identityCardNumber: data.identityCardNumber,
        emissionDate: data.emissionDate,
        expirationDate: data.expirationDate,
        maritalStatus: data.maritalStatus,
        phone: data.phone,
        residence: data.residence,
        created_at: new Date(),
        update_at: new Date(),
      },
    });
  }

}
