import {Component, OnInit} from '@angular/core';
import {TopicService} from "./services/topic.service";
import {ITopic} from "./interfaces/topic.interface";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  topics : Observable<ITopic[]> |any = [];
  topFiveTags: [string, number][] = [];
  constructor(private topicService: TopicService, private router: Router) {
  }
  ngOnInit(): void {
    this.getTopics();

  }
  getTopics() {
    this.topics = this.topicService.topics.subscribe(
        (data : ITopic[]) => {
          this.topics = data;
          this.filterByTag();
        }
    );
  }
  countTags(topics: any[]): Map<string, number> {
    const tagCounts = new Map<string, number>();

    topics.forEach((topic) => {
      topic.tags.forEach((tag: string) => {
        if (tagCounts.has(tag)) {
          // @ts-ignore
          tagCounts.set(tag, tagCounts.get(tag) + 1);
        } else {
          tagCounts.set(tag, 1);
        }
      });
    });
    return tagCounts;
  }


  filterByTag() {
    const tagCounts = this.countTags(this.topics);
    const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);

    this.topFiveTags = sortedTags.slice(0, 5);
  }

  tagClick(tagName: any) {
    this.router.navigate(['best-tags',tagName])
        .then(() => {
          console.log('Yönlendirme başarılı.');
        })
        .catch((error) => {
          console.error('Yönlendirme hatası:', error);
        });
  }
}
