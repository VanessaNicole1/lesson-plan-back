import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
