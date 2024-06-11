import { ColumnSortSettings } from '@progress/kendo-angular-grid';
import { TemplateRef } from '@angular/core';

export interface GridColumnOptionalProperty {
  columnMenu?: boolean;
  class?: string;
  editable?: boolean;
  editor?: 'text' | 'numeric' | 'date' | 'boolean';
  filter?: 'text' | 'numeric' | 'date' | 'boolean';
  filterable?: boolean;
  format?: any;
  groupable?: boolean;
  hidden?: boolean;
  includeInChooser?: boolean;
  lockable?: boolean;
  locked?: boolean;
  reorderable?: boolean;
  sortable?: boolean | ColumnSortSettings;
  width?: number;
  cellTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  wrapText?: boolean;
  expandable?: boolean;
  customFilter?: 'dropdown';
  customFilterList?: Array<any>;
  customFilterTextField?: string;
  customFilterValueField?: string;
}

export class GridColumn {
  constructor(
    public field: string,
    public title: string,
    optionalObj?: GridColumnOptionalProperty
  ) {
    const defaults: GridColumnOptionalProperty = {
      columnMenu: false,
      editable: true,
      class: '',
      editor: 'text',
      filter: 'text',
      filterable: false,
      format: null,
      groupable: true,
      hidden: false,
      includeInChooser: true,
      lockable: true,
      locked: false,
      reorderable: true,
      sortable: true,
      width: null ,
      cellTemplate: null,
      headerTemplate: null,
      wrapText: false,
      expandable: false,
      customFilter: null,
      customFilterList: [],
      customFilterTextField: null,
      customFilterValueField: null
    };
    const mergedConfig = { ...defaults, ...optionalObj };
    this.columnMenu = mergedConfig.columnMenu;
    this.class = mergedConfig.class;
    this.editable = mergedConfig.editable;
    this.editor = mergedConfig.editor;
    this.filter = mergedConfig.filter;
    this.filterable = mergedConfig.filterable;
    this.format = mergedConfig.format;
    this.groupable = mergedConfig.groupable;
    this.hidden = mergedConfig.hidden;
    this.includeInChooser = mergedConfig.includeInChooser;
    this.lockable = mergedConfig.lockable;
    this.locked = mergedConfig.locked;
    this.reorderable = mergedConfig.reorderable;
    this.sortable = mergedConfig.sortable;
    this.width = mergedConfig.width;
    this.cellTemplate = mergedConfig.cellTemplate;
    this.headerTemplate = mergedConfig.headerTemplate;
    this.wrapText = mergedConfig.wrapText;
    this.expandable = mergedConfig.expandable;
    this.customFilter = mergedConfig.customFilter;
    this.customFilterList = mergedConfig.customFilterList;
    this.customFilterTextField = mergedConfig.customFilterTextField;
    this.customFilterValueField = mergedConfig.customFilterValueField;
  }
  public columnMenu: boolean;
  public class: string;
  public editable: boolean;
  public editor: 'text' | 'numeric' | 'date' | 'boolean';
  public filter: 'text' | 'numeric' | 'date' | 'boolean';
  public filterable: boolean;
  public format: any;
  public groupable: boolean;
  public hidden: boolean;
  public includeInChooser: boolean;
  public lockable: boolean;
  public locked: boolean;
  public reorderable: boolean;
  public sortable: boolean | ColumnSortSettings;
  public width: number;
  public cellTemplate: TemplateRef<any>;
  public headerTemplate: TemplateRef<any>;
  public wrapText: boolean;
  public expandable: boolean;
  public customFilter: 'dropdown';
  public customFilterList: Array<any>;
  public customFilterTextField: string;
  public customFilterValueField: string;
}
