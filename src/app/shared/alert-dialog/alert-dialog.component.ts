import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'inde-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {


  @ViewChild('dialog', { static: false }) private indeAlert: AlertDialogComponent;
  @Input() public header: string;
  @Input() public message: string;
  @Input() public type: 'success' | 'error' | 'warning' | 'info' = 'warning';
  @Input() public positiveButton = 'Yes';
  @Input() public negativeButton = 'No';
  @Output() public positiveButtonClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() public negativeButtonClick: EventEmitter<Event> = new EventEmitter<Event>();
  public opened: boolean;

  constructor() { }

  get nativeElement() {
    return this.indeAlert;
  }

  ngOnInit() {
  }

  public onPositiveButtonClick(ev: Event): void {
    this.positiveButtonClick.emit(ev);
  }

  public onNegativeButtonClick(ev: Event): void {
    this.negativeButtonClick.emit(ev);
  }

  public close(): void {
    this.opened = false;
  }

  public show(): void {
    this.opened = true;
  }

}
