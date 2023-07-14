import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Subject } from '../api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  query: string = ""
  subjects: Subject[] = []
  suggestions: string[] = []

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
      this.api.getSubjects().subscribe((subjects) => {
        this.subjects = subjects
      })
  }

  submit() {
    this.router.navigateByUrl(`/search?query=${this.query}`)
  }

  getSuggestions(event: Event) {
    this.query = (event.target as any).value

    this.api.complete(this.query).subscribe((suggestions) => {
      this.suggestions = suggestions
      console.log(suggestions)
    })
  }

}
