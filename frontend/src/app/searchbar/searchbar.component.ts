import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Subject } from '../api.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output() queryOutput : EventEmitter<string> = new EventEmitter()
  @Output() subjectsOutput : EventEmitter<string> = new EventEmitter()
  @Output() gradesOutput : EventEmitter<string> = new EventEmitter()
  @Output() tagsOutput : EventEmitter<string> = new EventEmitter()
  
  availableSubjects: Subject[] = []

  query: string = ""
  selectedSubjects: string[] = []
  grades: string[] = []
  tags: string[] = []

  suggestions: string[] = []

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {}

  private setQuery(query: string) {
    this.query = query
    this.queryOutput.emit(this.query)
  }
  private setSubjects(subjects: string[]) {
    this.selectedSubjects = subjects
    this.subjectsOutput.emit(this.selectedSubjects.join(","))
  }
  private setGrades(grades: string[]) {
    this.grades = grades
    this.gradesOutput.emit(this.grades.join(","))
  }
  private setTags(tags: string[]) {
    this.tags = tags
    this.tagsOutput.emit(this.tags.join(","))
  }

  ngOnInit(): void {
        this.api.getSubjects().subscribe((subjects) => {
          this.availableSubjects = subjects
        })

        this.setQuery(this.route.snapshot.queryParamMap.get("query") || "") 
        this.setSubjects(this.route.snapshot.queryParamMap.get("subjects")?.split(",") || []) 
        this.setGrades(this.route.snapshot.queryParamMap.get("grades")?.split(",") || [])
        this.setTags(this.route.snapshot.queryParamMap.get("tags")?.split(",") || [])   
  }

  submit() {
    this.router.navigateByUrl(`/search?query=${this.query}&subjects=${this.selectedSubjects.join(",")}&grades=${this.grades.join(",")}&tags=${this.tags.join(",")}`)
    document.getElementById("searchbar")?.blur()
  }

  getSuggestions(event: Event) {
    this.setQuery((event.target as any).value)
    
    this.api.complete(this.query).subscribe((suggestions) => {
      this.suggestions = suggestions
    })
  }

  toggleSubject(subject: string) {
    let index = this.selectedSubjects.indexOf(subject)
    if (index >= 0) {
      this.selectedSubjects.splice(index, 1)
    } else {
      this.selectedSubjects.push(subject)
    }
    this.setSubjects(this.selectedSubjects)
  }

}
