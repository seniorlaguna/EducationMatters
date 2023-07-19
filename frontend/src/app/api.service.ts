import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const DEV_MODE=true
const HOST=DEV_MODE ? "http://localhost:8000" : ""

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) { }

  getSubjects() : Observable<Subject[]> {
    return this.http.get<Subject[]>(`${HOST}/api/subjects`)
  }

  getMaterial(id: string) : Observable<Material> {
    return this.http.get<Material>(`${HOST}/api/materials/${id}`)
  }

  search(query: string, subjects: string[], grades: string[], tags: string[]) : Observable<Material[]> {

    let params : any = {}
    if (query.length > 0) params.query = query
    if (subjects.length > 0) params.subjects = subjects.join(",")
    if (grades.length > 0) params.grades = grades.join(",")
    if (tags.length > 0) params.tags = tags.join(",")

    return this.http.get<Material[]>(`${HOST}/api/search`, {
      params: params
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

export interface Subject {
  _id: string,
  _rev: string,
  name: string
}

export interface Material {
  _id: string,
  _rev: string,
  name: string,
  description: string,
  tags: string[],
  type: string,
  subjects: string[],
  grades: number[]
}
