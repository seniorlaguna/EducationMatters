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
  @Output() personsOutput : EventEmitter<string> = new EventEmitter()
  
  availableSubjects: Subject[] = []

  query: string = ""
  selectedSubjects: string[] = []
  grades: string[] = []
  tags: string[] = []
  persons: string[] = []

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

  private setPersons(persons: string[]) {
    this.persons = persons
    this.personsOutput.emit(this.persons.join(","))
  }

  ngOnInit(): void {
        this.api.getSubjects().subscribe((subjects) => {
          this.availableSubjects = subjects
        })

        this.setQuery(this.route.snapshot.queryParamMap.get("query") || "") 
        this.setSubjects(this.route.snapshot.queryParamMap.get("subjects")?.split(",") || []) 
        this.setGrades(this.route.snapshot.queryParamMap.get("grades")?.split(",") || [])
        this.setTags(this.route.snapshot.queryParamMap.get("tags")?.split(",") || []) 
        this.setPersons(this.route.snapshot.queryParamMap.get("persons")?.split(",") || []) 
  }

  submit() {
    this.router.navigateByUrl(`/search?query=${this.query}&subjects=${this.selectedSubjects.join(",")}&grades=${this.grades.join(",")}&tags=${this.tags.join(",")}`)
    document.getElementById("searchbar")?.blur()
  }

  onTextAreaChanged(event: Event) {
    let input : string = (event.target as any).value
    let terms = input.split(" ")

    let query: string[] = []
    let tags: string[] = []
    let persons: string[] = []

    for (let i in terms) {
      let term: string = terms[i]
      if (term.startsWith("#")) {
        tags.push(term.substring(1))
      } else if (term.startsWith("@")) {
        persons.push(term.substring(1))
      } else {
        query.push(term)
      }
    }


    console.log(input, terms, query, query.join(" "), tags, persons)

    this.setQuery(input)
    this.setTags(tags)
    this.setPersons(persons)

    this.getSuggestions(query.join(" "))
  }

  
  getSuggestions(query: string) {
    this.api.complete(query).subscribe((suggestions) => {
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
