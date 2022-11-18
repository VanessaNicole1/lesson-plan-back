import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  day: string;

  @Column()
  hour: string;
}
