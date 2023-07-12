import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ResultsPageComponent } from './results-page/results-page.component';
import { MaterialPageComponent } from './material-page/material-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ResultsPageComponent,
    MaterialPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
