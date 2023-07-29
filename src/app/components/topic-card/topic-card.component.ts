import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITopic} from "../../interfaces/topic.interface";
import {IUser} from "../../interfaces/user.interface";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-topic-card',
  templateUrl: './topic-card.component.html',
  styleUrls: ['./topic-card.component.scss']
})
export class TopicCardComponent implements OnInit{

    @Input() topic : ITopic[] | any;
    @Output() sendMessage = new EventEmitter<string>();
    users: IUser[] = [];
    currentUser: IUser | any =[];


    constructor(private userService : UserService) { }

    ngOnInit(): void {
      this.getUsers();
    }
    getUsers(){
      this.userService.getUsers().subscribe(data => {
        this.users = data;
        this.getCurrentUser(this.topic.userId);
      })
    }

    getCurrentUser(userId: number) {
      this.currentUser = this.users.find(user => user.id === userId);
    }

    deleteOrEdit(message: string,event:any){
      this.sendMessage.emit(message);
      event.stopPropagation();
    }


  openMenu(event: MouseEvent) {
    event.stopPropagation();
  }
}
