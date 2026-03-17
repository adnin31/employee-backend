import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Attendance } from './attendance.entity';

export enum UserRole {
    EMPLOYEE = 'EMPLOYEE',
    HRD = 'HRD',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    phone_number: string;

    @Column()
    position: string;

    @Column({ type: 'text', nullable: true })
    photo_url: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
    role: UserRole;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Attendance, (attendance) => attendance.user)
    attendances: Attendance[];
}
