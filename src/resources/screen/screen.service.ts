import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateScreenDto, UpdateScreenDto } from 'cartelera-unahur';
import { Screen } from 'src/entities/screen.entity';
import { SocketService } from 'src/plugins/socket/socket.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class ScreenService {
  constructor(
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
    @Inject(SocketService)
    private readonly socketService: SocketService,
  ) {}

  async create(createScreenDto: CreateScreenDto) {
    const newScreen = this.screenRepository.create(createScreenDto);
    const created = await this.screenRepository.save(newScreen);
    return created;
  }

  async findAll(): Promise<Screen[]> {
    return this.screenRepository.find({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: number): Promise<Screen> {
    try {
      const [response] = await this.screenRepository.find({
        where: { id, deletedAt: null },
        relations: {
          sector: true,
        },
      });
      return response;
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
  }

  async update(updateScreenDtos: UpdateScreenDto[]) {
    try {
      const ids = updateScreenDtos.map((updateScreenDto) => updateScreenDto.id);
      const screenFounds = await this.screenRepository.find({
        where: { id: In(ids) },
        relations: {
          sector: true,
        },
      });
      if (screenFounds.length !== updateScreenDtos.length) {
        throw new HttpException('Screen Not Found', HttpStatus.BAD_REQUEST);
      }
      const screensToUpdate = screenFounds.map((screenFound) => {
        const updateScreenDtoToUpdate = updateScreenDtos.find(
          (updateScreenDto) => {
            return updateScreenDto.id === screenFound.id;
          },
        );
        return this.screenRepository.create({
          ...screenFound,
          ...updateScreenDtoToUpdate,
        });
      });
      const screensUpdated = await this.screenRepository.save(screensToUpdate);
      if (screensUpdated.length) {
        screensUpdated.map((screenUpdated) => {
          this.socketService.sendSubscriptionMessage(
            screenUpdated.sector.topic,
            screenUpdated.subscription,
            {
              id: -1,
              action: 'UPDATE_SCREEN_CONFIGURATION',
              data: {
                sector: screenUpdated.sector,
                screen: screenUpdated,
              },
            },
          );
        });
      }
      return {
        message: 'Screens updated successfully',
        totalUpdated: screensUpdated.length,
        data: screensUpdated,
      };
    } catch (error) {
      console.error('UPDATE_SCREEN ERROR: ', error);
      throw error;
    }
  }

  public async remove(id: number) {
    try {
      return this.screenRepository.update(
        { id },
        {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      );
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }

  public async remoteDisconnect(id: number) {
    try {
      const screenFound = await this.findOne(id);
      await this.socketService.sendMessage(screenFound.sector.topic, {
        id: -1,
        action: 'SCREEN_REMOTE_DISCONNECT',
        data: {
          sector: screenFound.sector,
          screen: screenFound,
        },
      });
      return { message: `Screen ${id} disconnected` };
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }
}
