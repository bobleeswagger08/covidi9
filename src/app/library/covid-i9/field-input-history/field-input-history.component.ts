import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { IFieldData } from '../model/candidate-input';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as XLSX from "xlsx";


@Component({
  selector: 'app-field-input-history',
  templateUrl: './field-input-history.component.html',
  styleUrls: ['./field-input-history.component.scss']
})
export class FieldInputHistoryComponent implements OnInit  {
  displayedColumns: string[] = [/*'isEverContacted',*/ 'dateOfContacted','reasonForNotContacted', 'isSymptomatic', 'isReferredForMedicalCare',  'isReleasedFromSurveillance','commentByMOIC'];
  listField: IFieldData[] =[];
  dataSource: MatTableDataSource<IFieldData>;
  @Input('field-history') ilistField: IFieldData[];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor( private cdr: ChangeDetectorRef) {
     
   }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.ilistField);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  exportToExcelWithId(tableId: string, name?: string) {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  

}
