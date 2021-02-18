import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    OneToMany,
} from "typeorm";
import {Event} from "./Event"

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

    @OneToMany(type=>Event, eventobj=>eventobj.author)
    events:Event[];

    token: string;
}
