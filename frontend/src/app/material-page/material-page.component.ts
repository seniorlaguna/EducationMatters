import { Component, OnInit } from '@angular/core';
import { ApiService, Material } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material-page',
  templateUrl: './material-page.component.html',
  styleUrls: ['./material-page.component.css']
})
export class MaterialPageComponent implements OnInit {

  material: Material | null = null
  thumbnails : string[] = []
  currentThumbnailIndex = 0

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.api.getMaterial(this.route.snapshot.paramMap.get("id") ?? "").subscribe((material) => {
        this.material = material
        this.thumbnails = this.material.thumbnails.map((name) => {
          return `https://raw.githubusercontent.com/seniorlaguna/EducationMattersLibrary/main/${this.material!.id}/thumbnails/${name}`
        })
      })
  }

  getThumbnail() : string {
    if (this.thumbnails.length == 0) {
      return "https://raw.githubusercontent.com/seniorlaguna/EducationMattersLibrary/main/default/thumbnail.webp"
    }
    return this.thumbnails[this.currentThumbnailIndex]
  }

}
