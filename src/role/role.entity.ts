import { User } from 'src/user/user-entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @ManyToMany(() => User, (user) => user.roles, {
    cascade: true,
  })
  users: User[];
}
