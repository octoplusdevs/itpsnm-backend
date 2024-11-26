import { Classe, ClasseType, PeriodType } from '@prisma/client';
import { CourseAlreadyExistsError } from '../errors/course-already-exists-error';
import { ClasseRepository } from '@/repositories/classe-repository';
import { ClassroomRepository } from '@/repositories/classroom-repository';
import { CoursesRepository } from '@/repositories/course-repository';
import { LevelsRepository } from '@/repositories/level-repository';
import { CourseNotFoundError } from '../errors/course-not-found';
import { LevelNotFoundError } from '../errors/level-not-found';
import { ClassroomNotFoundError } from '../errors/classroom-not-found-error';

interface UseCaseRequest {
  name: ClasseType;
  period: PeriodType;
  levelId: number;
  id_classroom: number;
  courseId: number;
}

interface UseCaseResponse {
  classe: Classe;
}

export class CreateClasseUseCase {
  constructor(
    private classeRepository: ClasseRepository,
    private classroomRepository: ClassroomRepository,
    private coursesRepository: CoursesRepository,
    private levelsRepository: LevelsRepository,
  ) { }

  async execute({ name, period, levelId, courseId, id_classroom }: UseCaseRequest): Promise<UseCaseResponse> {
    const existingClasse = await this.classeRepository.findByName(name);

    if (existingClasse) {
      throw new CourseAlreadyExistsError();
    }

    const findClassroom = await this.classroomRepository.findById(id_classroom);
    if (!findClassroom) {
      throw new ClassroomNotFoundError();
    }

    const findCourse = await this.coursesRepository.findById(courseId);
    if (!findCourse) {
      throw new CourseNotFoundError();
    }

    const findLevel = await this.levelsRepository.findById(levelId);
    if (!findLevel) {
      throw new LevelNotFoundError();
    }

    // Cria a nova classe usando o Prisma
    const classe = await this.classeRepository.create({
      name,
      period,
      levelId,
      courseId,
      id_classroom
    });

    return {
      classe,
    };
  }
}
