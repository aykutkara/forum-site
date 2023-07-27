import {Component, Input, OnInit} from '@angular/core';
import {ITopic} from "../../interfaces/topic.interface";

@Component({
  selector: 'app-topic-card',
  templateUrl: './topic-card.component.html',
  styleUrls: ['./topic-card.component.scss']
})
export class TopicCardComponent implements OnInit{

    @Input() topic : ITopic[] | any;
    constructor() { }

    ngOnInit(): void {
      console.log(this.topic)
    }
}
