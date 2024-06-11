import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { AssignmentDetail } from 'src/app/models/home-page.model';

@Component({
  selector: 'inde-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  @Output() valueChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() maxstartDate: Date;
  @Input() minstartDate: Date;
  @Input() highLightRecord: AssignmentDetail[];

  constructor(
    private validatorService: ValidatorService,
  ) { }

  public value: Date;

  ngOnInit(): void {
    this.value = new Date();
  }

  public change(value: Date): void {
    this.valueChange.emit(value);
   }

   public isMeeting(date: Date): string {
    for (const record of this.highLightRecord) {
      if (!record.assignmentActionDate) {
        continue;
      }
      const eventDate = new Date(record.assignmentActionDate).setHours(0, 0, 0, 0);
      const dateOnCalender = new Date(date).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      if ((today > dateOnCalender) && (dateOnCalender === eventDate)) {
        return 'pastMeeting';
      }
      if ((today < dateOnCalender) && (dateOnCalender === eventDate)) {
        return 'upcomingMeeting';
      }
    }
  }


}
