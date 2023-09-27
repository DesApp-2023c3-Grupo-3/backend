import { PartialType } from '@nestjs/swagger';
import { CreateAdvertisingScheduleDto } from './create-advertising-schedule.dto';

export class UpdateAdvertisingScheduleDto extends PartialType(
  CreateAdvertisingScheduleDto,
) {}
