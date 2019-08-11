import {NgModule} from '@angular/core';
import {Routes , RouterModule} from '@angular/router';
import {NewIssueComponent} from "./new-issue/new-issue.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const appRouts: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'new-issue'},
  {path: 'new-issue', component: NewIssueComponent},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  // imports: [RouterModule.forRoot(appRouts,  { enableTracing: true })],
  imports: [RouterModule.forRoot(appRouts, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
