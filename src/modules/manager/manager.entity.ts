import { User } from 'src/modules/user/user-entity';
import { OneToOne, JoinColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Degree)
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
