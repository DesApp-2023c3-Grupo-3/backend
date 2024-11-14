import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from 'cartelera-unahur';
import { SocketService } from 'src/plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import * as xlsx from 'xlsx';
import { ImageService } from '../image/image.service';
import { SectorService } from '../sector/sector.service';
import { ScheduleService } from '../schedule/schedule.service';
import { SubjectService } from '../subject/subject.service';
import { ClassroomService } from '../classroom/classroom.service';
import { rangeHours, getTurnoByHour } from './stubs/rangeDate.Stub';
import * as DateUtils from 'src/utils/dateUtils';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly socketService: SocketService,
    @Inject(ImageService)
    private readonly serviceImage: ImageService,
    @Inject(ScheduleService)
    private readonly scheduleService: ScheduleService,
    @Inject(SectorService)
    private readonly sectorService: SectorService,
    @Inject(SubjectService)
    private readonly subjectService: SubjectService,
    @Inject(ClassroomService)
    private readonly classroomService: ClassroomService,
  ) {}

  public async create(createCourseDto: CreateCourseDto) {
    const newCourse = this.courseRepository.create(createCourseDto);
    const created = await this.courseRepository.save(newCourse);
    this.socketService.sendMessage(created.sector.topic, {
      id: 1,
      action: 'CREATE_COURSES',
      data: [
        {
          name: created.name,
          subject: created.subject.name,
          classroom: created.classroom.name,
          startHour: created.schedule.startHour.toLocaleTimeString(),
          endHour: created.schedule.startHour.toLocaleTimeString(),
        },
      ],
    });
    return created;
  }

  public async createMultiple(createCourseDto: CreateCourseDto[]) {
    const courseToCreate = createCourseDto.map((createCourseDto) =>
      this.courseRepository.create(createCourseDto),
    );
    return this.courseRepository.save(courseToCreate);
  }

  public async findAll() {
    return this.courseRepository.find({
      relations: {
        classroom: true,
        schedule: true,
        sector: true,
        subject: true,
      },
    });
  }

  public async findPageAndLimit(page: number, limit: number, search = '') {
    const offset = (page - 1) * limit;
    const applySearchFilter = (qb) => {
      if (search.length > 1) {
        qb.andWhere(
          new Brackets((qb2) => {
            qb2
              .where('LOWER(c."name") LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              })
              .orWhere('LOWER(su."name") LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              })
              .orWhere('LOWER(sec."name") LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              })
              .orWhere('LOWER(cl."name") LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              });
          }),
        );
      }
    };
    const query = this.courseRepository
      .createQueryBuilder('c')
      .select([
        'c.*',
        `jsonb_build_object(
           'id', sh.id,
           'startDate', sh."startDate",
           'endDate', sh."endDate",
           'startHour', sh."startHour",
           'endHour', sh."endHour",
           'dayCode', sh."dayCode"
         ) AS "schedule"`,
        `jsonb_build_object(
            'id', cl.id,
            'name', cl."name"
          ) AS classroom`,
        `jsonb_build_object(
            'id', su.id,
            'name', su."name"
          ) AS subject`,
        `jsonb_build_object(
            'id', sec.id,
            'name', sec."name"
          ) AS sector`,
      ])
      .innerJoin('Sector', 'sec', 'sec.id = c."sectorId"')
      .innerJoin('Schedule', 'sh', 'sh.id = c."scheduleId"')
      .innerJoin('Subject', 'su', 'su.id = c."subjectId"')
      .innerJoin('Classroom', 'cl', 'cl.id = c."classroomId"')
      .where('c."deletedAt" IS NULL')
      .offset(offset)
      .limit(limit);

    applySearchFilter(query);

    const data = await query.getRawMany();
    const totalQuery = this.courseRepository
      .createQueryBuilder('c')
      .select('COUNT(*)', 'count')
      .innerJoin('Sector', 'sec', 'sec.id = c."sectorId"')
      .innerJoin('Schedule', 'sh', 'sh.id = c."scheduleId"')
      .innerJoin('Subject', 'su', 'su.id = c."subjectId"')
      .innerJoin('Classroom', 'cl', 'cl.id = c."classroomId"')
      .where('c."deletedAt" IS NULL');

    applySearchFilter(totalQuery);

    const totalResult = await totalQuery.getRawOne();
    const total = parseInt(totalResult.count, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      total,
      limit,
      totalPages,
    };
  }

  async findAllBySector(id: number) {
    const data = await this.courseRepository.find({
      where: { sector: { id }, deletedAt: IsNull() },
      relations: {
        classroom: true,
        schedule: true,
        sector: true,
        subject: true,
      },
    });
    return data;
  }

  public async findOne(id: number) {
    try {
      return this.courseRepository.find({
        where: { id },
        relations: {
          classroom: true,
          schedule: true,
          sector: true,
          subject: true,
        },
      });
    } catch (error) {
      throw new HttpException('Course not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      return this.courseRepository.update({ id }, updateCourseDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    const course = await this.findOne(id);
    this.scheduleService.remove(course[0].schedule.id);
    try {
      return this.courseRepository.update(
        { id },
        {
          id,
          deletedAt: new Date(),
        },
      );
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }

  public async findTodayCoursesBySector(sectorId: number) {
    const currentDayCode = this.scheduleService.getDayCode(
      DateUtils.getNewLocalDate().getDay(),
    );
    return this.courseRepository.find({
      where: {
        deletedAt: IsNull(),
        sector: { id: sectorId },
        schedule: { dayCode: currentDayCode },
      },
      relations: {
        classroom: true,
        schedule: true,
        sector: true,
        subject: true,
      },
    });
  }

  async createCommissionTemplate(id: number) {
    const courses = await this.findAllBySector(id);
    const jsonInfo = courses.map((course) => {
      return {
        Nombre: course.name,
        'Nombre materia': course.subject.name,
        Aula: course.classroom.name,
        Turno: getTurnoByHour(course.schedule.startHour),
        Dia: course.schedule.dayCode,
      };
    });
    const data = [['Nombre', 'Nombre materia', 'Aula', 'Turno', 'Dia']];
    jsonInfo.forEach((course) => {
      data.push([
        course.Nombre,
        course['Nombre materia'],
        course.Aula,
        course.Turno,
        course.Dia,
      ]);
    });
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Comisiones');
    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    return excelBuffer;
  }

  async uploadCommission(
    file: Express.Multer.File,
    startDate: string,
    endDate: string,
    sectorId: number,
  ) {
    try {
      await this.removeMultiple(sectorId);
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      const jsonCommision = this.serviceImage.createJson(file);
      const sector = await this.sectorService.findOne(sectorId);
      const subjects = await this.createSubjects(
        jsonCommision.map((subject) => subject['Nombre materia']),
      );
      const classrooms = await this.createClassrooms(
        jsonCommision.map((aula) => aula['Aula']),
      );
      const schedulesToCreate = jsonCommision.map((schedule) =>
        this.createSchedules(newStartDate, newEndDate, schedule),
      );
      const schedulesCreated = await this.scheduleService.createMultiple(
        schedulesToCreate,
      );
      const coursesToCreate = jsonCommision.map((course, index) => ({
        name: course['Nombre'],
        classroom: {
          id: this.searchByName(classrooms, course['Aula'].toString()),
        },
        sector,
        subject: { id: this.searchByName(subjects, course['Nombre materia']) },
        schedule: {
          id: schedulesCreated[index].id,
        },
      }));
      const coursesCreated = await this.createMultiple(coursesToCreate);
      const { coursesToday } = coursesCreated.reduce(
        (reducer, courseCreated) => {
          const scheduleFound = schedulesCreated.find(
            (scheduleCreated) =>
              courseCreated.schedule.id === scheduleCreated.id,
          );
          const subjectFound = subjects.find(
            (subject) => courseCreated.subject.id === subject.id,
          );
          const classroomFound = classrooms.find(
            (classroom) => courseCreated.classroom.id === classroom.id,
          );
          if (
            ['active', 'today'].includes(
              this.scheduleService.getScheduleStatus(scheduleFound),
            )
          ) {
            reducer.coursesToday.push({
              ...courseCreated,
              schedule: scheduleFound,
              subject: subjectFound,
              sector,
              classroom: classroomFound,
            });
          }
          return reducer;
        },
        { coursesToday: [] },
      );
      if (coursesToday.length) {
        this.socketService.sendMessage(sector.topic, {
          id: 1,
          action: 'CREATE_COURSES',
          data: coursesToday.map((courseToday) => ({
            name: courseToday.name,
            subject: courseToday.subject.name,
            classroom: courseToday.classroom.name,
            startHour: courseToday.schedule.startHour,
            endHour: courseToday.schedule.endHour,
          })),
        });
      }
      return {
        message: 'Courses created successfully from the Excel file',
        coursesCreated,
      };
    } catch (error) {
      throw new HttpException(
        'Error in the loading process',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeMultiple(id) {
    const courses = await this.courseRepository.find({
      where: { sector: { id: id } },
    });
    await Promise.all(
      courses.map((course) => {
        course.deletedAt = new Date();
        return this.courseRepository.save(course);
      }),
    );
  }

  private searchByName(array: any[], name: string) {
    const foundObject = array.find((obj) => {
      return obj['name'] === name;
    });
    return foundObject.id;
  }

  private createSchedules(startDate: Date, endDate: Date, schedule: any) {
    const scheduleToCreate = this.scheduleService.createEntity({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startHour: rangeHours.find((hour) => hour.turno === schedule['Turno'])
        .startHour,
      endHour: rangeHours.find((hour) => hour.turno === schedule['Turno'])
        .endHour,
      dayCode: String(schedule['Dia']).toUpperCase().trim(),
    });
    return scheduleToCreate;
  }

  private async createSubjects(subjects: string[]) {
    const subjectNames = this.removeDuplicates(subjects);
    const currentSubjects = await this.subjectService.findSubjectsNotInArray(
      subjectNames,
    );
    const subjectToValidate = currentSubjects.map((subject) => subject.name);
    const filteredSubjects = subjectNames.filter(
      (subject) => !subjectToValidate.includes(subject),
    );
    const subjectToCreate = filteredSubjects.map((subject) =>
      this.subjectService.createEntity({ name: subject }),
    );
    const createdSubjects = await this.subjectService.createMultiple(
      subjectToCreate,
    );
    return [...currentSubjects, ...createdSubjects];
  }

  private async createClassrooms(classrooms: number[]) {
    const classroomNames = this.removeDuplicates(
      classrooms.map((classroom) => classroom.toString()),
    );
    const currentClassrooms =
      await this.classroomService.findClassroomsNotInArray(classroomNames);
    const classroomToValidate = currentClassrooms.map(
      (classroom) => classroom.name,
    );
    const filteredClassrooms = classroomNames.filter(
      (classroom) => !classroomToValidate.includes(classroom),
    );
    const classroomToCreate = filteredClassrooms.map((classroom) =>
      this.classroomService.createEntity({ name: classroom }),
    );
    const createdClassrooms = await this.classroomService.createMultiple(
      classroomToCreate,
    );
    return [...currentClassrooms, ...createdClassrooms];
  }

  private removeDuplicates(array: any[]) {
    const uniqueSet = new Set(array);
    const uniqueArray = Array.from(uniqueSet);
    return uniqueArray;
  }
}
