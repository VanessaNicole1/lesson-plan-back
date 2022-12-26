import { User } from 'src/modules/user/user-entity';
import {
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Schedule, (schedule) => schedule.teacher)
  schedule: Schedule[];
}
