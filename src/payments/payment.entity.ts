import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  trasnferCode: string;

  @Column()
  amount: number;

  @Column()
  email: string;

  @Column()
  currency: string;
}