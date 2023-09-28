import { CourseDto, ResponseCourseDto } from 'cartelera-unahur';

export const coursesStub: ResponseCourseDto[] = [
  {
    id: 2,
    name: 'Programación Avanzada',
    classroom: {
      id: 2,
      name: 'Aula 203',
    },
    user: {
      id: 2,
      name: 'Maria Garcia',
      dni: '56789012',
      password: 'p@ssw0rd',
      role: {
        id: 2,
        name: 'Profesor',
      },
    },
    sector: {
      id: 2,
      name: 'Edificio San Luis',
      topic: 'Materias',
    },
    schedule: {
      id: 2,
      startDate: new Date(),
      endDate: new Date(),
      startHour: new Date(),
      endHour: new Date(),
      dayCode: '2023-9-18, 2023-9-20, 2023-9-25',
    },
    subject: {
      id: 2,
      name: 'Programación Avanzada en Java',
    },
  },
];
