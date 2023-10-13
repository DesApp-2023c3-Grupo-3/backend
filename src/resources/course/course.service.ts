import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateClassroomDto,
  CreateCourseDto,
  CreateScheduleDto,
  CreateSectorDto,
  CreateSubjectDto,
  UpdateCourseDto,
} from 'cartelera-unahur';
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
  public async findBySector(sectorId: number) {
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
    startDate: Date,
    endDate: Date,
    sector: string,
  ) {
    try {
      const jsonCommisionPromise = this.serviceImage.createJson(file);
      const jsonCommision = await jsonCommisionPromise;
      const sectores = await this.createSectors(sector);
      const materias = await this.createSubjects(
        jsonCommision.map((subject) => subject['Nombre materia']),
      );

      const classroom = await this.createClassrooms(
        jsonCommision.map((aula) => aula['Aula']),
      );

      const createSchedules = await jsonCommision.map((schedule) =>
        this.createSchedule(
          startDate,
          endDate,
          schedule['Turno'],
          schedule['Turno'],
          schedule['Dia'],
        ),
      );
      const schedules = await this.scheduleService.createMultiple(
        await Promise.all(createSchedules),
      );

      const createCursos = await jsonCommision.map(async (curso, index) => ({
        name: curso['Nombre'],
        classroom: {
          id: this.searchByName(classroom, curso['Aula'].toString()),
        },
        sector: { id: this.searchByName(sectores, sector) },
        subject: { id: this.searchByName(materias, curso['Nombre materia']) },
        schedule: {
          id: schedules[index].id,
        },
      }));
      const courses = await Promise.all(createCursos);
      const cursosCreados = await this.createMultiple(courses);
      return {
        message: 'Cursos creados exitosamente desde el archivo Excel',
        cursosCreados,
      };
    } catch (error) {
      throw new HttpException(
        'Error en el proceso de carga',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private searchByName(array: any[], name: string) {
    const objetoEncontrado = array.find((obj) => {
      return obj['name'] === name;
    });
    return objetoEncontrado.id;
  }
  private async createSchedule(
    startDate,
    endDate,
    startHour,
    endHour,
    dayCode,
  ) {
    const schedule: CreateScheduleDto = {
      startDate: startDate,
      endDate: endDate,
      startHour: rangeHours.find((hora) => hora.turno === startHour).startHour,
      endHour: rangeHours.find((hora) => hora.turno === endHour).endHour,
      dayCode: dayCode,
    };
    return schedule;
  }

  private async createSectors(sector: string) {
    const nombreSectores = [sector];
    const sectoresActuales = await this.sectorService.findSectorsNotInArray(
      nombreSectores,
    );

    const sectoresAValidar = await sectoresActuales.map(
      (sector) => sector.name,
    );
    const sectoresFiltrados = nombreSectores.filter(
      (sector) => !sectoresAValidar.includes(sector),
    );
    const nuevosSectores: CreateSectorDto[] = sectoresFiltrados.map(
      (sector) => ({
        name: sector,
        topic: sector,
      }),
    );
    const sectoresCreados = await this.sectorService.createMultiple(
      nuevosSectores,
    );
    sectoresCreados.forEach((sector) => sectoresActuales.push(sector));
    return sectoresActuales;
  }

  private async createSubjects(materias: string[]) {
    const nombreMaterias = this.removeDuplicates(materias);
    const materiasActuales = await this.subjectService.findSubjectsNotInArray(
      nombreMaterias,
    );
    const materiaAValidar = await materiasActuales.map(
      (materia) => materia.name,
    );
    const materiasFiltradas = nombreMaterias.filter(
      (materia) => !materiaAValidar.includes(materia),
    );
    const nuevasMaterias: CreateSubjectDto[] = materiasFiltradas.map(
      (materia) => ({
        name: materia,
      }),
    );
    const materiasCreadas = await this.subjectService.createMultiple(
      nuevasMaterias,
    );
    materiasCreadas.forEach((materia) => materiasActuales.push(materia));
    return materiasActuales;
  }

  private async createClassrooms(aulas: number[]) {
    const numeroAString = aulas.map((aula) => aula.toString());
    const nombreAulas = this.removeDuplicates(numeroAString);
    const aulasActuales = await this.classroomService.findClassroomsNotInArray(
      nombreAulas,
    );
    const aulaAValidar = await aulasActuales.map((aula) => aula.name);
    const aulasFiltradas = nombreAulas.filter(
      (aula) => !aulaAValidar.includes(aula),
    );
    const nuevasAulas: CreateClassroomDto[] = await aulasFiltradas.map(
      (aula) => ({
        name: aula,
      }),
    );
    const aulasCreadas = await this.classroomService.createMultiple(
      nuevasAulas,
    );
    aulasCreadas.forEach((aula) => aulasActuales.push(aula));
    return aulasActuales;
  }

  private removeDuplicates(array: any[]) {
    const sinDuplicar = new Set(array);
    const nuevoArray = Array.from(sinDuplicar);
    return nuevoArray;
  }
}
