import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({nullable:true})
    description?: string;
    @Column({type:"timestamptz"})
    date: string;
    @ManyToOne(() => User)
    author: User;

    @CreateDateColumn({type:"timestamptz"})
    createdAt: string;
    @UpdateDateColumn({type:"timestamptz"})
    updatedAt: string;
    
    constructor(title:string, description:string|undefined, date:string, author:User){
        this.title = title;
        this.description = description;
        this.date = date;
        this.author = author;
    }
}
