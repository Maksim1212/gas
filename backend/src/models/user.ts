import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'double precision' })
    threshold: number;

    @Column({ type: 'boolean', default: false })
    active: boolean;

    @Column({ type: 'varchar', unique: true, default: uuidv4() })
    uuid: string;
}
