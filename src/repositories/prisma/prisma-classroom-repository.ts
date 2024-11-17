import { prisma } from "@/lib/prisma";
import { ClassroomRepository, dataType } from "../classroom-repository";
import { Classroom } from "@prisma/client";

export class PrismaClassroomRepository implements ClassroomRepository {
  async findAvailableClassroom({ levelId, courseId, periodType }: dataType): Promise<Classroom | any> {

    const result = await prisma.classroom.findFirst({
      where: {
        currentOccupancy: {
          lt: prisma.classroom.fields.capacity, // Salas com vagas
        },
        classes: {
          some: {
            courseId: courseId,
            period: periodType,
            levelId: levelId,
          },
        },
      },
      include: {
        classes: {
          where: {
            courseId: courseId,
            period: periodType,
            levelId: levelId,
          },
        },
      },
      orderBy: {
        currentOccupancy: "asc", // Ordena pelas menos ocupadas
      },
    });

    return result;
  }


  async incrementClassroomOccupancy(classroomId: number): Promise<void> {
    await prisma.classroom.update({
      where: { id: classroomId },
      data: {
        currentOccupancy: {
          increment: 1,
        },
      },
    });
  }
}
