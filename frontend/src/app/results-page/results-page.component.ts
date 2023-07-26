import { Component, OnInit } from '@angular/core';
import { ApiService, Material } from '../api.service';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent implements OnInit {

  results: Material[] = []
  
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.searchResults.subscribe((results) => {
      this.results = results
    })
      this.api.parseUrl()
      this.api.search()
      
  }

  onSearchQueryChanged(query: string) {
    this.api.processSearchQuery(query)
    this.api.adjustSearchUrl()
    this.api.search()
  }

  onSubjectsChanged(subjects: string[]) {
    this.api.subjects = subjects
    this.api.adjustSearchUrl()
    this.api.search()
  }

  onGradesChanged(grades: string[]) {
    this.api.grades = grades
    this.api.adjustSearchUrl()
    this.api.search()
  }

  onGetResults(materials: Material[]) {
    this.results = materials
    console.log("GOT RESULTS", materials, this.results)
  }

  onTypeChanged(type: string) {
    this.api.type = type
    this.api.adjustSearchUrl()
    this.api.search()
  }

}
