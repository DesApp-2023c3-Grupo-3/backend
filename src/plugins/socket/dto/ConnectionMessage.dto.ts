import { Sector } from 'src/entities/sector.entity';
import { Screen } from 'src/entities/screen.entity';

export class ConnectionMessageDto {
  sector: Sector;
  screen: Screen;
}
