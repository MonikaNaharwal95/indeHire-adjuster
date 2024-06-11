import { Component, OnInit, ViewChild, Input, Output, TemplateRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'inde-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent implements OnInit {

  public isVisible: boolean;
  @ViewChild('dialog', {static: false}) public indeDialog: DialogComponent;
  @Input() loader: boolean;
  @Input() headerNew: boolean = true;
  @Input() positiveButtonDisabled: boolean;
  @Input() infoCircleShow: boolean = false;
  @Input() negativeButtonDisabled: boolean;
  @Input() public header: string;
  @Input() public dialogWidth: string | number = '400';
  @Input() public positiveButton: string;
  @Input() public negativeButton: string;
  @Input() public neutralButton: string;
  @Output() public positiveButtonClickEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() public negativeButtonClickEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() public neutralButtonClickEvent: EventEmitter<Event> = new EventEmitter<Event>();
  // @Input() public buttonRowTemplate: TemplateRef<any>;
  constructor() { }

  get nativeElement(): DialogComponent {
    return this.indeDialog;
  }

  public ngOnInit(): void {
  }

  public positiveButtonClick(event: Event): void {
    this.positiveButtonClickEvent.emit(event);
  }

  public negativeButtonClick(event: Event): void {
    this.negativeButtonClickEvent.emit(event);
  }

  public neutralButtonClick(event: Event): void {
    this.neutralButtonClickEvent.emit(event);
  }

  public hideDialog(): void {
    this.isVisible = false;
  }

  public showDialog(): void {
    this.isVisible = true;
  }

}
