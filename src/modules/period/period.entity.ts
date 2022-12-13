import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @OneToMany(() => Degree, (degree) => degree.period)
  degrees: Degree[];
}
