import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
} from "typeorm";

@Entity("users")
export class User {
    
    @PrimaryColumn()
    email: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    password?: string;

    @Column({type:"timestamptz" ,nullable: true })
    dob?: string;

    @CreateDateColumn({type:"timestamptz"})
    createdAt: string;

    @UpdateDateColumn({type:"timestamptz"})
    updatedAt: string;

    token: string;
}
