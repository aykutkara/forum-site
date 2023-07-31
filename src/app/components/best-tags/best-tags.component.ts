import {Component, OnInit} from '@angular/core';
import {TopicService} from "../../services/topic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ITopic} from "../../interfaces/topic.interface";
import {Observable} from "rxjs";


@Component({
  selector: 'app-best-tags',
  templateUrl: './best-tags.component.html',
  styleUrls: ['./best-tags.component.scss']
})
export class BestTagsComponent implements OnInit{
  tagName: string = '';
  topics : Observable<ITopic[]> |any = [];
  filteredTopics: ITopic[] = [];
  constructor(private topicService: TopicService,private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tagName = params['index'];
      console.log(this.tagName);
    });
    this.getTopics();
  }

  getTopics() {
    this.topics = this.topicService.topics.subscribe(
        (data : ITopic[]) => {
          this.topics = data;
          this.topicsFilter();
        }
    );
  }

  topicsFilter(tagName: string = this.tagName) {
    this.filteredTopics = this.topics.filter((topic: ITopic) => topic.tags?.find(
        (tag: string) => tag === tagName)
    );
    console.log(this.filteredTopics);
  }

  protected readonly JSON = JSON;
}
