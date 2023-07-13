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
      this.api.search().subscribe((materials) => {
        this.results = materials
      })
  }
}
