import { Component, OnInit } from '@angular/core';
import { ApiService, Subject } from '../api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  subjects: Subject[] = []

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSubjects().subscribe((subjects) => {
      this.subjects = subjects
    })
}
}
