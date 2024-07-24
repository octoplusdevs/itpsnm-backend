import { Student } from '@prisma/client'
import { StudentsRepository } from '../student-repository'
import { randomInt } from 'crypto'

export class InMemoryStudentRepository implements StudentsRepository {

  public items: Student[] = []

  async findById(id: number): Promise<Student | null> {
    const student = this.items.find((item) => item.id === id)
    if (!student) {
      return null
    }
    return student
  }
  async findByName(name: string): Promise<Student | null> {
    const student = this.items.filter((item) => item.fullName.includes(name))
    if (!student) {
      return null
    }
    return student[0]
  }
  async create(data: Student): Promise<Student> {
    const newStudent: Student = {
      id: data.id ?? randomInt(9999),
      type: data.type,
      fullName: data.fullName,
      password: data.password,
      father: data.father,
      mother: data.mother,
      dateOfBirth: new Date(data.dateOfBirth),
      height: data.height,
      identityCardNumber: data.identityCardNumber,
      gender: data.gender,
      emissionDate: new Date(data.emissionDate),
      expirationDate: new Date(data.expirationDate),
      maritalStatus: data.maritalStatus,
      residence: data.residence,
      phone: data.phone,
      email: data.email,
      alternativePhone: data.alternativePhone ?? null,
      countyId: data.countyId,
      provinceId: data.provinceId,
      created_at: data.created_at ?? new Date(),
      update_at: data.update_at ?? new Date(),
    }
    this.items.push(newStudent)
    return newStudent
  }
  async searchMany(query: string, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Student[];
  }> {
    const pageSize = 20;

    // Filtrar itens pelo nome
    const filteredItems = this.items.filter((item) => item.fullName.includes(query));

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
  async destroy(id: number): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }
  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email)
    if (!student) {
      return null
    }
    return student
  }
  async findByPhone(phone: string): Promise<Student | null> {
    const student = this.items.find((item) => item.phone === phone)
    if (!student) {
      return null
    }
    return student
  }
  async findByAlternativePhone(phone: string): Promise<Student | null> {
    const student = this.items.find((item) => item.alternativePhone === phone)
    if (!student) {
      return null
    }
    return student
  }
  async findByIdentityCardNumber(identityCardNumber: string): Promise<Student | null> {
    const student = this.items.find((item) => item.identityCardNumber === identityCardNumber)
    if (!student) {
      return null
    }
    return student
  }

}
