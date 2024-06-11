import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  GridDataResult,
  PagerSettings,
  DataStateChangeEvent,
  ColumnMenuSettings,
  FilterableSettings,
  GroupableSettings,
  SortSettings,
  CellClickEvent,
  DetailCollapseEvent,
  DetailExpandEvent,
  RowClassArgs,
  SelectionEvent
} from '@progress/kendo-angular-grid';
import { State, SortDescriptor, CompositeFilterDescriptor, GroupDescriptor } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GridComponent as KendoGrid } from '@progress/kendo-angular-grid';
import { DataService } from './grid.service';
import * as _ from 'lodash';
import { GridColumn } from './grid.model';

@Component({
  selector: 'inde-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit {

  private initialized = false;
  public state: State = {
    group: null,
    skip: 0,
    take: 10000,
    sort: null,
    filter: null
  };
  private dataService: DataService;
  @ViewChild(KendoGrid, { static: true }) private grid: KendoGrid;
  @Input() public hideExpandIcon: boolean;
  @Input() public noData: string;
  @Input() public showClearFilter = true;
  @Input() public columns: GridColumn[];
  @Input() public columnMenu: boolean | ColumnMenuSettings;
  public griddataSource: Array<any>;
  @Input() set  dataSource(dataSource: Array<any>) {
    this.griddataSource = dataSource;
    if (this.initialized && this.dataService) {
      this.dataService.updateData(this.griddataSource);
    }
  }
  @Input() public customDataGrid: boolean;
  private gridCustomDataObservable: Observable<GridDataResult>;
  @Input()
  set customDataObservable(customDataObservable: Observable<GridDataResult>) {
    this.gridCustomDataObservable = customDataObservable;
    if (this.initialized && this.customDataGrid) {
      this.view = this.gridCustomDataObservable;
    }
  }
  private gridDefaultFilter: CompositeFilterDescriptor;
  @Input()
  set defaultFilter(defaultFilter: CompositeFilterDescriptor) {
    this.gridDefaultFilter = _.cloneDeep(defaultFilter);
  }
  private gridfilter: CompositeFilterDescriptor;
  @Input()
  set filter(filter: CompositeFilterDescriptor) {
    this.gridfilter = filter;
    if (this.initialized && this.gridfilter) {
      this.state.filter = this.gridfilter;
      this.dataStateChanged(Object.assign(this.state));
    }
  }
  public gridfilterable: any;
  @Input() public set filterable(filterable: FilterableSettings) {
    this.gridfilterable = filterable;
  }
  @Input() public groupable: GroupableSettings | boolean = false;
  public gridGroups: GroupDescriptor[];
  @Input()
  set groups(groups: GroupDescriptor[]) {
    this.gridGroups = groups;
    if (this.initialized && this.gridGroups) {
      this.state.group = this.gridGroups;
      this.dataStateChanged(Object.assign(this.state));
    }
  }
  @Input() public height: string;
  @Input() public hideHeader: boolean;
  @Input() public loading: boolean;
  @Input() public navigable: boolean;
  public gridPageSize: number;
  @Input()
  set pageSize(pageSize: number) {
    this.gridPageSize = pageSize;
    if (this.initialized && this.gridPageSize) {
      this.state.take = this.gridPageSize;
      this.dataStateChanged(Object.assign(this.state));
    }
  }
  @Input() public pageable: PagerSettings | boolean = false;
  @Input() public reorderable: boolean;
  @Input() public resizable: boolean;
  public gridSortable: SortSettings = {
    mode: 'single',
    allowUnsort: false
  };
  @Input()
  set sortable(sortable: SortSettings) {
    if (sortable === true || sortable === 'true') {
      this.gridSortable = {
        mode: 'single',
        allowUnsort: false
      };
    } else {
      this.gridSortable = sortable;
    }
  }
  @Input() public scrollable: 'none' | 'scrollable' | 'virtual';
  public gridSkip: number;
  @Input()
  set skip(skip: number) {
    this.gridSkip = skip;
    if (this.initialized && (this.gridSkip || this.gridSkip === 0)) {
      this.state.skip = this.gridSkip;
      this.dataStateChanged(Object.assign(this.state));
    }
  }
  public gridSort: Array<SortDescriptor>;
  @Input()
  set sort(sort: Array<SortDescriptor>) {
    this.gridSort = sort;
    if (this.initialized && this.gridSort) {
      this.state.sort = this.gridSort;
      this.dataStateChanged(Object.assign(this.state));
    }
  }
  @Input() public showColumnSelector: boolean;
  @Input() public cssClass = '';
  @Output() public rowSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dataStateChange: EventEmitter<DataStateChangeEvent> = new EventEmitter<DataStateChangeEvent>();
  @Output() public cellClick: EventEmitter<CellClickEvent> = new EventEmitter<CellClickEvent>();
  @Output() public detailCollapse: EventEmitter<DetailCollapseEvent> = new EventEmitter<DetailCollapseEvent>();
  @Output() public detailExpand: EventEmitter<DetailExpandEvent> = new EventEmitter<DetailExpandEvent>();
  @Input() public rowDetailTemplate: TemplateRef<any>;
  @Input() public toolbarTemplate: TemplateRef<any>;
  view: Observable<GridDataResult>;
  @Input() public rowClass: (context: RowClassArgs) => any = () => '';
  @Input() public rowDetailShowIf: (dataItem: any, index: number) => boolean = (
    dataItem: any,
    index: number
  ) => {
    return true;
  }
  constructor(private http: HttpClient) {}
  get nativeElement() {
    return this.grid;
  }
  ngOnInit() {
    if (this.gridSkip || this.gridSkip === 0) {
      this.state.skip = this.gridSkip;
    }
    if (this.gridSort) {
      this.state.sort = this.gridSort;
    }
    if (this.gridfilter) {
      this.state.filter = this.gridfilter;
    }
    if (this.gridGroups) {
      this.state.group = this.gridGroups;
    }
    if (this.gridPageSize) {
      this.state.take = this.gridPageSize;
    }
    if (this.customDataGrid) {
      this.view = this.gridCustomDataObservable;
    } else {
      if (!this.griddataSource) {
        this.griddataSource = [];
      }
      this.dataService = new DataService(this.griddataSource, this.state);
      this.view = this.dataService;
    }
    this.initialized = true;
  }
  public dataStateChanged(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.customDataGrid) {
    } else {
      this.dataService.processGridState(state);
    }
    this.dataStateChange.emit(state);
  }
  public onRowSelected(event: SelectionEvent) {
    this.rowSelected.emit(event);
  }
  public cellClickHandler(event: CellClickEvent) {
    this.cellClick.emit(event);
  }
  public expandRow(rowIndex: number) {
    this.grid.expandRow(rowIndex);
  }
  public collapseRow(rowIndex: number) {
    this.grid.collapseRow(rowIndex);
  }
  public detailCollapsed(event: DetailCollapseEvent) {
    this.detailCollapse.emit(event);
  }
  public detailExpanded(event: DetailExpandEvent) {
    this.detailExpand.emit(event);
  }
  clearFilter() {
    if (this.gridDefaultFilter) {
      this.state.filter = _.cloneDeep(this.gridDefaultFilter);
    } else {
      this.state.filter = null;
    }
    this.dataStateChanged(Object.assign(this.state));
  }

  public expandedChanged(expanded, rowIndex) {
    if (expanded) {
      this.expandRow(rowIndex);
    } else {
      this.collapseRow(rowIndex);
    }
  }

}
