import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({ nullable: true })
    description?: string;
    @Column({ type: "timestamptz" })
    date: string;
    @Column({nullable:true})
    authorEmail:string;
    @ManyToOne((type) => User, (user) => user.events)
    author: User;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: string;
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: string;

    constructor(
        title: string,
        description: string | undefined,
        date: string,
        author: User
    ) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.author = author;
    }
}
