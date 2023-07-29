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
    this.topicService.getTopic(this.topicId).subscribe((data: ITopic) => {
      this.topic = data;
      console.log(this.topic);
      // @ts-ignore
      for (let tag of this.topic.tags) {
        console.log(tag);
      }
    });
    this.userService.getUsers().subscribe(data => {
      this.currentUser = data.find(user => user.id === this.topic?.userId);
    });

  }

}
