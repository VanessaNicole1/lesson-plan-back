import { User } from 'src/user/user-entity';
import {
  JoinColumn,
  ManyToOne,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grade, (grade) => grade.students)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
