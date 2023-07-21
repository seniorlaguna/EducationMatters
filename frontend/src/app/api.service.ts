import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';

const DEV_MODE=true
const HOST=DEV_MODE ? "http://localhost:8000" : ""

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  searchBarQuery: string = ""
  query: string = ""
  subjects: string[] = []
  grades: string[] = []
  tags: string[] = []
  persons: string[] = []

  searchResults: Subject<Material[]> = new Subject()
  availableSubjects: ReplaySubject<EdumaSubject[]> = new ReplaySubject()

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.initAvailableSubjects()
  }

  private createParams() : any {
    let params : any = {}
    if (this.query.length > 0) params.query = this.query
    if (this.subjects.length > 0) params.subjects = this.subjects.join(",")
    if (this.grades.length > 0) params.grades = this.grades.join(",")
    if (this.tags.length > 0) params.tags = this.tags.join(",")
    if (this.persons.length > 0) params.persons = this.persons.join(",")
    return params
  }

  private initAvailableSubjects() {
    this.http.get<EdumaSubject[]>(`${HOST}/api/subjects`).subscribe((subjects) => {
      this.availableSubjects.next(subjects)
    })
  }

  private createSearchBarQuery() : string {
    let queryParts = []

    if (this.query.length > 0) {
      queryParts.push(this.query)
    }
    if (this.tags.length > 0) {
      queryParts.push(this.tags.map((t) => `#${t}`).join(" "))
    }
    if (this.persons.length > 0) {
      queryParts.push(this.persons.map((p) => `@${p}`).join(" "))
    }

    return queryParts.join(" ")
  }

  parseUrl() {
    let params = this.route.snapshot.queryParamMap
    this.query = params.get("query") || ""
    this.subjects = params.get("subjects")?.split(",") || []
    this.grades = params.get("grades")?.split(",") || []
    this.tags = params.get("tags")?.split(",") || []
    this.persons = params.get("persons")?.split(",") || []

    this.searchBarQuery = this.createSearchBarQuery()
  }

  adjustSearchUrl() {
    this.router.navigate(["search"], {
      queryParams: this.createParams()
    })
  }

  getMaterial(id: string) : Observable<Material> {
    return this.http.get<Material>(`${HOST}/api/materials/${id}`)
  }

  processSearchQuery(query: string) {

    let terms = query.split(" ")
    let queryTerms = []
    let tags = []
    let persons = []

    for (let i in terms) {
      let term = terms[i]

      if (term.startsWith("#")) {
        if (term.length == 1) continue
        tags.push(term.substring(1))
      } else if (term.startsWith("@")) {
        if (term.length == 1) continue
        persons.push(term.substring(1))
      } else {
        queryTerms.push(term)
      }
    }

    this.query = queryTerms.join(" ")
    this.tags = tags
    this.persons = persons
  }

  search() {
    this.http.get<Material[]>(`${HOST}/api/search`, {
      params: this.createParams()
    }).subscribe((results) => {
      this.searchResults.next(results)
    })
  }

  complete(text: string) : Observable<string[]> {
    return this.http.get<string[]>(`${HOST}/api/complete`, {
      params: {
        text: text
      }
    })
  }

}

export interface EdumaSubject {
  id: string,
  name: string
}

export interface Material {
  id: string,
  name: string,
  description: string,
  tags: string[],
  type: string,
  subjects: string[],
  grades: number[],
  thumbnails: string[],
  file: string
}
