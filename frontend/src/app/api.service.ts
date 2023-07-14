import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getSubjects() : Observable<Subject[]> {
    return this.http.get<Subject[]>("/api/subjects")
  }

  getMaterial(id: string) : Observable<Material> {
    return this.http.get<Material>("/api/materials/"+id)
  }

  search(query: string) : Observable<Material[]> {
    return this.http.get<Material[]>("/api/search", {
      params: {
        query: query
      }
    })
  }

  complete(text: string) : Observable<string[]> {
    return this.http.get<string[]>("/api/complete", {
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
