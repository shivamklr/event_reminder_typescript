import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    //TODO: implement jwt
    @Column({ nullable: false })
    name: string;

    @PrimaryGeneratedColumn()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    dob?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
