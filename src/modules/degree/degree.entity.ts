import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Grade } from '../grade/grade.entity';

@Entity()
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Grade, (grade) => grade.degree)
  grades: Grade[];
}
