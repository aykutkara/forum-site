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
  getTopic(id: number): Observable<ITopic>{
    return this._http.get<ITopic>(this.api + "/topics/" + id);
  }

  addTopic(topic: ITopic): Observable<ITopic>{
    return this._http.post<ITopic>(this.api + "/topics", topic);
  }
  deleteTopic(id: number): Observable<ITopic>{
    return this._http.delete<ITopic>(this.api + "/topics/" + id);
  }
  updateTopic(topic: ITopic): Observable<ITopic>{
    return this._http.put<ITopic>(this.api + "/topics/" + topic.id, topic);
  }
}
