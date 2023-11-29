export const rangeDate = [
  {
    cuatrimestre: 'C1',
    startDate: new Date('2023-01-01T00:00:00Z'),
    endDate: new Date('2023-06-30T00:00:00Z'),
  },
  {
    cuatrimestre: 'C2',
    startDate: new Date('2023-07-01T00:00:00Z'),
    endDate: new Date('2023-12-30T00:00:00Z'),
  },
];

export const rangeHours = [
  {
    turno: 'MA',
    startHour: new Date('2023-10-06 08:00:00.000 -0300'),
    endHour: new Date('2023-10-06 12:00:00.000 -0300'),
  },
  {
    turno: 'TA',
    startHour: new Date('2023-10-06 14:00:00.000 -0300'),
    endHour: new Date('2023-10-06 18:00:00.000 -0300'),
  },
  {
    turno: 'NO',
    startHour: new Date('2023-10-06 18:00:00.000 -0300'),
    endHour: new Date('2023-10-06 22:00:00.000 -0300'),
  },
  {
    turno: 'TO',
    startHour: new Date('2023-10-06 00:00:00.000 -0300'),
    endHour: new Date('2023-10-06 23:59:00.000 -0300'),
  },
];

export function getTurnoByHour(hour) {
  const hora = new Date(hour);

  for (const turno of rangeHours) {
    if (hora.getTime() === turno.startHour.getTime()) {
      return turno.turno;
    }
  }
}
