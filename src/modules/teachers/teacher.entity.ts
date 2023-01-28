import { User } from 'src/modules/user/user-entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.teacher)
  user: User;

  @OneToMany(() => Schedule, (schedule) => schedule.teacher)
  schedule: Schedule[];
}
