import { AdvertisingMessageDto } from './AdvertisingMessage.dto';
import { ConnectionMessageDto } from './ConnectionMessage.dto';
import { CourseMessageDto } from './CourseMessage.dto';

export class MessageDto {
  id: number;
  action: 'START_CONNECTION' | 'CREATE_ADVERTISING' | 'CREATE_COURSE';
  data: AdvertisingMessageDto | CourseMessageDto | ConnectionMessageDto;
}
