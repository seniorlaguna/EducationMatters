import { Component, Input } from '@angular/core';
import { Material } from '../api.service';

@Component({
  selector: 'app-material-card',
  templateUrl: './material-card.component.html',
  styleUrls: ['./material-card.component.css']
})
export class MaterialCardComponent {

  @Input() material: Material | null = null

  getThumbnailUrl() : string {
    if (this.material?.thumbnails.length == 0) {
      return "https://raw.githubusercontent.com/seniorlaguna/EducationMattersLibrary/main/default/thumbnail.webp"
    }
    return `https://raw.githubusercontent.com/seniorlaguna/EducationMattersLibrary/main/${this.material?.id}/thumbnails/${this.material?.thumbnails[0]}`

  }

}
