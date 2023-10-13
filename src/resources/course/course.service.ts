import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateClassroomDto,
  CreateCourseDto,
  CreateScheduleDto,
  CreateSectorDto,
  CreateSubjectDto,
  ScheduleDto,
  SectorDto,
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
import { rangeDate, rangeHours } from './stubs/rangeDate.Stub';

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
    this.socketService.sendMessage('course', {
      id: 1,
      title: 'comision default',
      subject: 'materia default',
      classroom: 'aula default',
      schedule: 'horario default',
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
    return this.courseRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.courseRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Course not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      return this.courseRepository.update({ id }, updateCourseDto); // TODO: Revisar el output del update
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
          deletedAt: Date.now(), // TODO: Probar el borrado logico de @DeletedAtColumn
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
    const data = [
      [
        'Nombre',
        'Sector',
        'Nombre materia',
        'Aula',
        'Cuatrimestre',
        'Turno',
        'Dia',
      ],
    ];

    const worksheet = xlsx.utils.aoa_to_sheet(data);

    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
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
    sector: SectorDto[],
  ) {
    try {
      const jsonCommisionPromise = this.serviceImage.createJson(file);
      const jsonCommision = await jsonCommisionPromise;

      // Creo nuevos sectores si hace falta.
      const sectores = await this.crearSectores(
        jsonCommision.map((sector) => sector['Sector']),
      );
      //console.log(sectores)

      // Creo nuevas materias se hace falta.
      const materias = await this.crearMaterias(
        jsonCommision.map((subject) => subject['Nombre materia']),
      );
      // console.log(materias)

      //Creo aulas si hace falta.
      const classroom = await this.crearAulas(
        jsonCommision.map((aula) => aula['Aula']),
      );
      //console.log(classroom)

      const createCursos = await jsonCommision.map(async (curso) => ({
        name: curso['Nombre'],
        classroom: {
          id: this.buscaPorNombre(classroom, curso['Aula'].toString()),
        },
        sector: { id: this.buscaPorNombre(sectores, curso['Sector']) },
        subject: { id: this.buscaPorNombre(materias, curso['Nombre materia']) },
        schedule: {
          id: await this.crearSchedule(
            startDate,
            endDate,
            curso['Turno'],
            curso['Turno'],
            curso['Dia'],
          ),
        },
      }));
      const courses = await Promise.all(createCursos);
      //console.log('cursos', courses);

      this.createMultiple(courses);

      return {
        message: 'Cursos creados exitosamente desde el archivo Excel',
      };
    } catch (error) {
      throw new HttpException(
        'Error en el proceso de carga',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private buscaPorNombre(array: any[], name: string) {
    const objetoEncontrado = array.find((obj) => {
      return obj['name'] === name;
    });
    return objetoEncontrado.id;
  }
  private async crearSchedule(startDate, endDate, startHour, endHour, dayCode) {
    const schedule: CreateScheduleDto = {
      startDate: startDate,
      endDate: endDate,
      startHour: rangeHours.find((hora) => hora.turno === startHour).startHour,
      endHour: rangeHours.find((hora) => hora.turno === endHour).endHour,
      dayCode: dayCode,
    };
    const scheduleCreate = await this.scheduleService.create(schedule);
    return scheduleCreate.id;
  }

  private async crearSectores(sectores: string[]) {
    const nombreSectores = this.sacarDuplicados(sectores);
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

  private async crearMaterias(materias: string[]) {
    const nombreMaterias = this.sacarDuplicados(materias);
    const materiasActuales = await this.subjectService.findMateriasNotInArray(
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

  private async crearAulas(aulas: number[]) {
    const numeroAString = aulas.map((aula) => aula.toString());
    const nombreAulas = this.sacarDuplicados(numeroAString);
    const aulasActuales = await this.classroomService.findAulasNotInArray(
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

    console.log('Aula creada: ', nuevasAulas);
    const aulasCreadas = await this.classroomService.createMultiple(
      nuevasAulas,
    );
    aulasCreadas.forEach((aula) => aulasActuales.push(aula));
    return aulasActuales;
  }

  private sacarDuplicados(array: any[]) {
    const sinDuplicar = new Set(array);
    const nuevoArray = Array.from(sinDuplicar);
    return nuevoArray;
  }
}

// TODO: Al descargar template tiene que traer datos si ya hay?
// TODO: Hacer validaciones
