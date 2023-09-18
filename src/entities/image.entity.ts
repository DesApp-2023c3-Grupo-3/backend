import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Image' })
export class Image {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  originalName: string;

  @Column()
  path: string;
}
