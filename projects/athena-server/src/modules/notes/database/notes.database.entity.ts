import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, ManyToOne
} from 'typeorm';
import { UserEntity } from "../../users/database/users.database.entity";


@Entity('notes')
export class NoteEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    title!: string;

    @Column({
        type: 'varchar'
    })
    body!: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt!: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt!: Date;

    @ManyToOne(
      type => UserEntity,
        user => user.notes,
      {nullable: false}
    )
    user!: UserEntity;
}
