import {Injectable} from '@angular/core';
import {IUser} from "../interfaces/user.interface";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api :string = "http://localhost:3000";

  constructor(private _http: HttpClient) {

  }


  getUsers(): Observable<IUser[]> {
    return this._http.get<IUser[]>(this.api + "/users");
  }
}
