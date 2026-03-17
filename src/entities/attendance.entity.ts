import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    LEAVE = 'LEAVE',
    ABSENT = 'ABSENT',
}

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    user_id: string;

    @ManyToOne(() => User, (user) => user.attendances)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'timestamp', nullable: true })
    check_in: Date;

    @Column({ type: 'timestamp', nullable: true })
    check_out: Date;

    @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
    status: AttendanceStatus;

    @CreateDateColumn()
    created_at: Date;
}
