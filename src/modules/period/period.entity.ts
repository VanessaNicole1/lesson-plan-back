import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany(() => Degree, (degree) => degree.period)
  degrees: Degree[];
}
