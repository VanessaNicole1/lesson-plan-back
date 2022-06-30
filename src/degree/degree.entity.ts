import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
