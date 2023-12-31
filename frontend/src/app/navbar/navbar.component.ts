import { Component, OnInit } from '@angular/core';
import { ApiService, EdumaSubject } from '../api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  subjects: EdumaSubject[] = []

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.availableSubjects.subscribe((subjects) => {
      this.subjects = subjects
    })
}
}
