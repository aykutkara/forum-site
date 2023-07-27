import { Injectable } from '@angular/core';
import {ITopic} from "../interfaces/topic.interface";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  api :string = "http://localhost:3000";
  topics :Observable<ITopic[]>;
  constructor(private _http: HttpClient) {
    this.topics = this.getTopics();
  }

  getTopics(){
    return this._http.get<ITopic[]>(this.api + "/topics");
  }
}
