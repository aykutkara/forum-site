import {Component, OnInit} from '@angular/core';
import {ITopic} from "../../interfaces/topic.interface";
import {TopicService} from "../../services/topic.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-forum-topics',
  templateUrl: './forum-topics.component.html',
  styleUrls: ['./forum-topics.component.scss']
})
export class ForumTopicsComponent implements OnInit {


  topics :Observable<ITopic[]> | any =[];

  constructor(private topicService : TopicService) { }

  ngOnInit(): void {
    this.topics = this.topicService.topics.subscribe(
      (data : ITopic[]) => {
        this.topics = data;
        console.log(this.topics);
      }
    )
  }


}
