import { BehaviorSubject } from 'rxjs';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

export class DataService extends BehaviorSubject<GridDataResult> {
  private originalData = [];
  private latestState: any | State = {
    group: null,
    skip: 0,
    take: 1000,
    sort: null,
    filter: null
  };

  constructor(data: any = [], state: State) {
    super(process(data, state));
    this.originalData = data;
    this.latestState = state;
  }

  updateData(data: any) {
    this.originalData = data;
    this.latestState.skip = 0;
    super.next(process(this.originalData, this.latestState));
  }

  public processGridState(state: DataStateChangeEvent): void {
    this.latestState = Object.assign(state);
    if (this.latestState.take) {
      this.latestState.take = +this.latestState.take;
    }
    super.next(process(this.originalData, this.latestState));
  }
}
