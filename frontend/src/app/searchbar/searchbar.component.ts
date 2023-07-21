import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService, EdumaSubject } from '../api.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output() onTextChanged: EventEmitter<string> = new EventEmitter()
  @Output() onSubjectsChanged: EventEmitter<string[]> = new EventEmitter()
  @Output() onGradesChanged: EventEmitter<string[]> = new EventEmitter()
  @Output() onSubmitted: EventEmitter<any> = new EventEmitter()

  text: string = ""
  availableSubjects: EdumaSubject[] = []
  selectedSubjects: string[] = []
  selectedGrades: string[] = []


  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.text = this.api.searchBarQuery
    this.selectedSubjects = this.api.subjects
    this.selectedGrades = this.api.grades
    this.api.availableSubjects.subscribe((subjects) => {
      this.availableSubjects = subjects
    })
  }

  setText(event: Event) {
    this.text = (event.target as any).value
    this.onTextChanged.emit(this.text)
  }

  submit(event: Event) {
    event.preventDefault()
    this.onSubmitted.emit()
  }

  toggleSubject(subject: EdumaSubject) {
    let i = this.selectedSubjects.indexOf(subject.id)
    if (0 <= i) {
      this.selectedSubjects.splice(i, 1)
    } else {
      this.selectedSubjects.push(subject.id)
    }

    this.onSubjectsChanged.emit(this.selectedSubjects)
  }

  toggleGrade(grade: string) {
    let i = this.selectedGrades.indexOf(grade)
    if (0 <= i) {
      this.selectedGrades.splice(i, 1)
    } else {
      this.selectedGrades.push(grade)
    }

    this.onGradesChanged.emit(this.selectedGrades)
  }
}
