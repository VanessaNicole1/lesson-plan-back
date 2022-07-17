import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Degree)
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;
}
