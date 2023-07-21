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

  actions: any[] = []

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.api.getMaterial(this.route.snapshot.paramMap.get("id") ?? "").subscribe((material) => {
        this.material = material
        this.thumbnails = this.material.thumbnails.map((name) => {
          return `https://raw.githubusercontent.com/seniorlaguna/EducationMattersLibrary/main/${this.material!.id}/thumbnails/${name}`
        })
        this.initActions()
      })
  }

  getThumbnail() : string {
    if (this.thumbnails.length == 0) {
      return "https://raw.githubusercontent.com/seniorlaguna/EducationMattersLibrary/main/default/thumbnail.webp"
    }
    return this.thumbnails[this.currentThumbnailIndex]
  }

  initActions() {
    if (this.material == null) return
    console.log("INIT ACTIONS")

    switch (this.material.type) {
      case "DOC":
        this.actions.push({
          name: "Ansehen",
          action: this.viewAction()
        })
        this.actions.push({
          name: "Speichern",
          action: this.saveAction
        })
        break
      case "WEB":
        this.actions.push({
          name: "Starten",
          action: this.startAction()
        })
        break
    
      default:
        console.log("ERROR UNKNOWN MATERIAL TYPE")
        break
    }
  }

  viewAction() {
    if (this.material == null) return () => {console.log("ERROR")}
    return () => {
      let url = `https://raw.githubusercontent.com/seniorlaguna/EducationMattersLibrary/main/${this.material!.id}/${this.material!.file}`
      window.open(url, "_blank")
    }
  }

  saveAction() {}

  startAction() {
    if (this.material == null) return () => {console.log("ERROR")}
    return () => {
      window.open(this.material!.file, "_blank")
    }
  }
}
