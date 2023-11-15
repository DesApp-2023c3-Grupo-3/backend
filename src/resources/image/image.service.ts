import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Image } from 'src/entities/image.entity';
import * as xlsx from 'xlsx';
import * as QRCode from 'qrcode';

@Injectable()
export class ImageService {
  private generatedPlaneQr: string = null;
  constructor(
    @InjectRepository(Image)
    public readonly imageRepository: Repository<Image>,
  ) {}

  public async create(file: Express.Multer.File) {
    const newImage = this.imageRepository.create({
      originalName: file.originalname,
      path: file.path,
    });
    const created = await this.imageRepository.save(newImage);
    return created;
  }

  findByIdAndArchivoNotIsNull(id: number) {
    return this.imageRepository.findOneOrFail({
      select: ['originalName', 'path'],
      where: { id, originalName: Not(IsNull()) },
    });
  }

  public createJson(file: Express.Multer.File) {
    if (
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // XLSX
      file.mimetype === 'application/vnd.ms-excel' || // XLS
      file.mimetype === 'text/csv' // CSV
    ) {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      return jsonData;
    } else {
      throw new Error('El archivo no es un archivo Excel válido.');
    }
  }

  async createExcelFromJSON(data: any, fileName: string) {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    return {
      buffer: excelBuffer,
      fileName: `${fileName}.xlsx`,
    };
  }

  async createQr(url: string): Promise<string> {
    try {
      const qr = await QRCode.toDataURL(url, {
        width: 300,
        type: 'image/jpeg',
        quality: 0.3,
        color: {
          light: '#0000',
        },
      });
      return qr;
    } catch (error) {
      throw new HttpException(
        'Error generating qr code',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async qrPlane(): Promise<string> {
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || '3001';
    if (!this.generatedPlaneQr) {
      this.generatedPlaneQr = await this.createQr(
        `${HOST}:${PORT}/image/plane`,
      );
    }
    return this.generatedPlaneQr;
  }
}
