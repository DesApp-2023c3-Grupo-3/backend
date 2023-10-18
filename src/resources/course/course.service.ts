import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from 'cartelera-unahur';
import { SocketService } from 'src/plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import { coursesStub } from './stubs/courses.stub';
import * as xlsx from 'xlsx';
import { ImageService } from '../image/image.service';
import { SectorService } from '../sector/sector.service';
import { ScheduleService } from '../schedule/schedule.service';
import { SubjectService } from '../subject/subject.service';
import { ClassroomService } from '../classroom/classroom.service';
import { rangeHours } from './stubs/rangeDate.Stub';

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
      action: 'CREATE_COURSE',
      data: {
        subject: created.subject.name,
        classroom: created.classroom.name,
        schedule: `${created.schedule.startHour} - ${created.schedule.endHour}`,
      },
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
    return coursesStub;
  }

  async createCommissionTemplate() {
    const data = [['Nombre', 'Nombre materia', 'Aula', 'Turno', 'Dia']];
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
    commencementDate: string,
    conclusionDate: string,
    sector: string,
  ) {
    try {
      const startDate = new Date(commencementDate);
      const endDate = new Date(conclusionDate);
      const jsonCommision = this.serviceImage.createJson(file);
      const sectors = await this.createSectors(sector);
      const subjects = await this.createSubjects(
        jsonCommision.map((subject) => subject['Nombre materia']),
      );
      const classroom = await this.createClassrooms(
        jsonCommision.map((aula) => aula['Aula']),
      );
      const schedulesToCreate = jsonCommision.map((schedule) =>
        this.createSchedules(startDate, endDate, schedule),
      );
      const schedulesCreated = await this.scheduleService.createMultiple(
        schedulesToCreate,
      );
      const coursesToCreate = jsonCommision.map((course, index) => ({
        name: course['Nombre'],
        classroom: {
          id: this.searchByName(classroom, course['Aula'].toString()),
        },
        sector: { id: this.searchByName(sectors, sector) },
        subject: { id: this.searchByName(subjects, course['Nombre materia']) },
        schedule: {
          id: schedulesCreated[index].id,
        },
      }));
      const coursesCreated = await this.createMultiple(coursesToCreate);
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

  private searchByName(array: any[], name: string) {
    const foundObject = array.find((obj) => {
      return obj['name'] === name;
    });
    return foundObject.id;
  }

  private createSchedules(startDate, endDate, schedule) {
    const scheduleToCreate = this.scheduleService.createEntity({
      startDate: startDate,
      endDate: endDate,
      startHour: rangeHours.find((hour) => hour.turno === schedule['Turno'])
        .startHour,
      endHour: rangeHours.find((hour) => hour.turno === schedule['Turno'])
        .endHour,
      dayCode: schedule['Dia'],
    });
    return scheduleToCreate;
  }

  private async createSectors(sector: string) {
    const sectorNames = [sector];
    const currentSectors = await this.sectorService.findSectorsNotInArray(
      sectorNames,
    );
    const sectorsToValidate = currentSectors.map((sector) => sector.name);
    const filteredSectors = sectorNames.filter(
      (sector) => !sectorsToValidate.includes(sector),
    );
    const sectorstToCreate = filteredSectors.map((sector) =>
      this.sectorService.createEntity({
        name: sector,
        topic: sector,
      }),
    );
    const createdSectors = await this.sectorService.createMultiple(
      sectorstToCreate,
    );
    return [...currentSectors, ...createdSectors];
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
