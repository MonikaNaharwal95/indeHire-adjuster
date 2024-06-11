import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'inde-latest-update',
  templateUrl: './latest-update.component.html',
  styleUrls: ['./latest-update.component.scss']
})
export class LatestUpdateComponent implements OnInit {
  @Input() latestUpdates: any;
  constructor() { }

  ngOnInit() {
  }

}
