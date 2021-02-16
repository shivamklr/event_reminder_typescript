import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
} from "typeorm";

@Entity("users")
export class User {
    //TODO: implement jwt
    @PrimaryColumn()
    email: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    dob?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    token: string;
}
