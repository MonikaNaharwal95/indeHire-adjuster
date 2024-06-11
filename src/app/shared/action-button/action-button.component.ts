import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActionButtonModel } from './action-button.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'inde-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  @ViewChild('ellipsis', { static: false }) icon: ElementRef;
  showList: boolean;
  @Input() public actionArray: ActionButtonModel[];
  @Output() actionButtonClicked: EventEmitter<string | number> = new EventEmitter<string | number>();

  constructor() {
    document.addEventListener('click', this.handleOutsideClick.bind(this));
   }

  ngOnInit() {
  }

  public actionButtonOutput(ID: string | number): void {
    this.actionButtonClicked.emit(ID);
  }

  private handleOutsideClick(event: Event): void {
    if (!this.icon.nativeElement.contains(event.target)) {
      this.showList = false;
    }
  }

}
