import {Component, OnInit} from '@angular/core';
import {DataService} from "./data.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  constructor(private dataService: DataService) {

  }
  ngOnInit(): void {
    console.log('in app init');
    this.dataService.subject.subscribe((response: any) => {
      console.log('got response from subject in app');
    }, (error: any) => {
      console.log('got error from subject in app');
    }, () => {
      console.log('got complete from subject in app');
    });
    // this.dataService.logsObserver.subscribe(
    //   (response: any) => {
    //     console.log('logs has arrived to app');
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
}
