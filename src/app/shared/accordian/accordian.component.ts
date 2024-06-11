import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'inde-accordian',
  templateUrl: './accordian.component.html',
  styleUrls: ['./accordian.component.scss']
})
export class AccordianComponent implements OnInit {

  @Input() expanded = true;
  @Input() title = '';
  @Input() upload = '';
  @Input() isEditible = true;
  @Output() editClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() accordianClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public uploadButtonClickEvent: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() { }

  ngOnInit() {
  }

  public editIconClick(evt: Event): void {
    evt.stopPropagation();
    this.editClickEvent.emit();
  }

  public clickAccordian(): void {
    this.accordianClickEvent.emit();
  }
  public uploadButtonClick(event: Event): void {
    this.uploadButtonClickEvent.emit(event);
  }

}
