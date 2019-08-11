import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, FormControl} from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { NewIssueComponent } from './new-issue/new-issue.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import {PlotlyModule} from "angular-plotly.js";
import {DataService} from "./data.service";


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewIssueComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    PlotlyModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
