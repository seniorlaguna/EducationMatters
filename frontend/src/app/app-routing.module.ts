import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsPageComponent } from './results-page/results-page.component';
import { MaterialPageComponent } from './material-page/material-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: "", component: HomePageComponent
  },
  {
    path: "search", component: ResultsPageComponent
  },
  {
    path: "material/:id", component: MaterialPageComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
