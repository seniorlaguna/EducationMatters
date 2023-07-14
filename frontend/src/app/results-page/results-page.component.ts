import { Component, OnInit } from '@angular/core';
import { ApiService, Material } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent implements OnInit {

  results: Material[] = []

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let query = this.route.snapshot.queryParamMap.get("query") || ""
      this.api.search(query).subscribe((materials) => {
        this.results = materials
      })
  }
}
