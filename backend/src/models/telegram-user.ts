import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Telegram {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    chatId: number;

    @Column({ type: 'double precision' })
    threshold: number;
}
