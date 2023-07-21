import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, EdumaSubject } from '../api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private api: ApiService) {}

  onSubmit() {
    this.api.adjustSearchUrl()
  }

  onSearchQueryChanged(query: string) {
    this.api.processSearchQuery(query)
  }

}
