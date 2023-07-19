import { Component, OnInit } from '@angular/core';
import { ApiService, Material } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent {

  query: string = ""
  subjects: string[] = []
  grades: string[] = []
  tags: string[] = []

  results: Material[] = []
  
  constructor(private api: ApiService, private route: ActivatedRoute) {}

  search() {
    console.log(this.query, this.subjects, this.grades, this.tags)
    this.api.search(this.query, this.subjects, this.grades, this.tags).subscribe((materials) => {
      this.results = materials
    })
  }

  onQueryChanged(query: string) {
    this.query = query
    this.search()
  }

  onSubjectsChanged(subjects: string) {
    this.subjects = subjects.split(",")
    this.search()
  }

  onGradesChanged(grades: string) {
    this.grades = grades.split(",")
    this.search()
  }

  onTagsChanged(tags: string) {
    this.tags = tags.split(",")
    this.search()
  }
}
