import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Schedule, (schedule) => schedule.subject)
  schedule: Schedule[];
}
