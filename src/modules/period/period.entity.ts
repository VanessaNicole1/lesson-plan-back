import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @OneToMany(() => Degree, (degree) => degree.period)
  degrees: Degree[];
}
