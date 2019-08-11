import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ServerService {
  constructor (private http: HttpClient) {}
  storeServer(data: any[]) {
    return this.http.get('http://localhost:8000/jiralog/list/');
    return this.http.get('http://localhost:8000/jiralog/dashboard/');
    return this.http.post('http://localhost:8000/jiralog/new/', data);
  }
}
