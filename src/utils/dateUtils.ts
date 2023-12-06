export const getNewLocalDate = () => {
  const newDate = new Date();
  newDate.setHours(newDate.getHours() - 3);
  return newDate;
};

export const getLocalDate = (date: string) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() - 3);
  return newDate;
};

export const getNewUtcDate = () => {
  return new Date();
};

export const getUtcDate = (date: string) => {
  return new Date(date);
};

export const getDateTimeString = (date: Date): string => {
  const [hours, minutes] = date.toISOString().split('T')[1].split(':');
  return `${hours}:${minutes}:${'00'}`;
};
