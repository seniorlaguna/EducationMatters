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

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.api.getMaterial(this.route.snapshot.paramMap.get("id") ?? "").subscribe((material) => {
        this.material = material
      })
  }

}
