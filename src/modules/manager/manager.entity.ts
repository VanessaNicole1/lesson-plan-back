import { User } from 'src/modules/user/user-entity';
import {
  OneToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Degree, (degree) => degree.manager)
  degree: Degree[];
}
