import {Component, OnInit} from '@angular/core';
import {TopicService} from "../../services/topic.service";
import {ITopic} from "../../interfaces/topic.interface";
import {ActivatedRoute} from "@angular/router";
import {IUser} from "../../interfaces/user.interface";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private userService : UserService) { }

  // @ts-ignore
  topicId: number;
  // @ts-ignore
  topic :ITopic | undefined;
  currentUser : IUser | undefined;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.topicId = +params['id'];
    });
    this.getTopic();
    this.getCurrentUser();

  }
  getTopic() {
    this.topicService.getTopic(this.topicId).subscribe((data: ITopic) => {
      this.topic = data;
      this.updateViewCount();
    });
  }

  getCurrentUser() {
    this.userService.getUsers().subscribe(data => {
      this.currentUser = data.find(user => user.id === this.topic?.userId);
    });
  }

  updateViewCount() {
    if (this.topic){
      this.topic.views++;
      console.log(this.topic.views,"views");
      this.topicService.updateTopic(this.topic).subscribe();
    }
  }
}
