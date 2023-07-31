import {IUser} from "./user.interface";

export interface IComment {
    id: number;
    userId: number;
    comment: string;
    date: string;
    user?: IUser;
}



