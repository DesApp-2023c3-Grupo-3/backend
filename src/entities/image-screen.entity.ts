import {
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
} from 'typeorm';
import { Image } from './image.entity';
import { Screen } from './screen.entity';

@Entity({ name: 'ImageScreen' })
export class ImageScreen {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Image, (image) => image.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  image: Image;

  @ManyToOne(() => Screen, (screen) => screen.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  screen: Screen;
}
