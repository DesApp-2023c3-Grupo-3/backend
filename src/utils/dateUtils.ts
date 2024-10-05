export const getNewLocalDate = () => {
  const newDate = new Date();
  newDate.setHours(newDate.getHours() - 3);
  return newDate;
};

export const getNewLocalDateCompareDate = () => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  const hours = String(newDate.getHours()).padStart(2, '0');
  const minutes = String(newDate.getMinutes()).padStart(2, '0');
  const seconds = String(newDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(newDate.getMilliseconds()).padStart(3, '0');
  const timezoneOffset = -newDate.getTimezoneOffset();
  const timezoneOffsetHours = String(
    Math.abs(Math.floor(timezoneOffset / 60)),
  ).padStart(2, '0');
  const timezoneOffsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(
    2,
    '0',
  );
  const formattedTimezoneOffset = `${
    timezoneOffset >= 0 ? '+' : '-'
  }${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  return `${formattedDate} ${formattedTimezoneOffset}`;
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
