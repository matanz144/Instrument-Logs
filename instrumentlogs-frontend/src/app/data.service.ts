import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable()
export class DataService {
  public logsList;
  subject = new Subject<any>();

  constructor(private httpClient: HttpClient) {


    this.httpClient.get('jiralog/dashboard/').subscribe(
      (response: any) => {
        this.logsList = response;
        this.subject.complete();
      }

    );

  }

  init() {
  }

}
