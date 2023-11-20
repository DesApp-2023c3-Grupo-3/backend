import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Image' })
export class Image {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  originalName: string;

  @Column({ type: 'text' })
  base64Data: string;
}
