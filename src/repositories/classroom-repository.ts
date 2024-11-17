import { Classroom, PeriodType } from '@prisma/client'

export type dataType = {
  courseId: number,
  levelId: number,
  periodType: PeriodType
}
export interface ClassroomRepository {
  findAvailableClassroom(data: dataType): Promise<Classroom | any>;
  incrementClassroomOccupancy(classroomId: number): Promise<void>;
}
