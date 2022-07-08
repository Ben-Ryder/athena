import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, OneToMany
} from 'typeorm';
import { NoteEntity } from "../../notes/database/notes.database.entity";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        unique: true,
        length: 50
    })
    username!: string;

    @Column({
        unique: true,
    })
    email!: string;

    @Column()
    passwordHash!: string;

    @Column()
    encryptionSecret!: string;

    @Column({
        default: false
    })
    isVerified!: boolean;

    @CreateDateColumn({type: 'timestamp'})
    createdAt!: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt!: Date;

    // Inverse Relationships
    @OneToMany(
        type => NoteEntity, note => note.user
    )
    notes!: NoteEntity[];
}
