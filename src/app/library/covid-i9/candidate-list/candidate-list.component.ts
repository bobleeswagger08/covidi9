import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IListCandidate, IListUPHC, IListWard, CandidateSearchFilter, SelectedUPHC, ColsedReason } from '../model/candidate-input';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CovidI9Service } from '../services/covid-i9.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
  /*
         id?: string;
            referenceNo?: number;
            source?: string | undefined;
            serialNo?: string | undefined;
            arivalDate?: string | undefined;
            name?: string | undefined;
            mobileNo?: string | undefined;
            uphc?: string | undefined;
            wardNo?: string | undefined;
            lastContactDate?: Date | undefined;
            address?: string | undefined;
            */
  displayedColumns: string[] = ['referenceNo', 'source', 'serialNo', 'arivalDate', 'name', 'mobileNo', 'uphc', 'lastContactDate','status', 'updatebutton', 'updateStatus'];
  listCandidate: IListCandidate[];
  listOfUpHC: IListUPHC[] = [];
  listOfWards: IListWard[] = [];
  listStatus : ColsedReason[];
  filterParameter : CandidateListFilterParameter;

  selectedUphc: IListUPHC[] = [];
  candidateFilter: CandidateSearchFilter;
  dataSource: MatTableDataSource<IListCandidate>;
  noDataMessage:string="No records found";
  panelOpenState:boolean=false;

  // set uphcFilter(value: IListUPHC[]) {
  //   console.log("setting data");
  //   this.candidateFilter.uphcs = [];
  //   if (value) {
  //     for (let currentSelection of value) {
  //       let selectedItem: SelectedUPHC = { uphc: currentSelection.uphc };
  //       this.candidateFilter.uphcs.push(selectedItem);
  //     }
  //   }
  // }

  // get uphcFilter(): IListUPHC[] {
  //   console.log("reading data");
  //   let filter: IListUPHC[] = [];
  //   if (this.candidateFilter.uphcs) {
  //     for (let currentSelection of this.candidateFilter.uphcs) {
  //       let selectedItem: IListUPHC = { uphc: currentSelection.uphc };
  //       this.candidateFilter.uphcs.push(selectedItem);
  //     }
  //   }

  //   return filter;
  // }



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(sort: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = sort;
    }
    //this.selectedSortiments.sort = sort;
  }

  constructor(private router: Router, private cdr: ChangeDetectorRef, private SpinnerService: NgxSpinnerService,
     private covidService: CovidI9Service) {
      this.filterParameter = new CandidateListFilterParameter();
     }

  ngOnInit() {
    this.filterParameter.inputDate = new Date();
    this.getUPHCList();
    this.getWardList();
    this.filterSource();
    this.getStatusList();
  }

  getUPHCList() {
    this.covidService.getUPHCList()
      .subscribe((listU: IListUPHC[]) => {
        this.listOfUpHC = listU;
      });
  }

  getWardList() {
    this.covidService.getWardList()
      .subscribe((listW: IListWard[]) => {
        this.listOfWards = listW
      });
  }

  // setUPHCList() {
  //   this.candidateFilter.uphcs = [];
  //   if (this.selectedUphc) {
  //     for (let currentSelection of this.selectedUphc) {
  //       let selectedItem: SelectedUPHC = { uphc: currentSelection.uphc };
  //       this.candidateFilter.uphcs.push(selectedItem);
  //     }
  //   }

  // }

  filterSource() {
   // this.setUPHCList();
   console.log(this.filterParameter.uphcSelectedValues)
   this.candidateFilter ={
     isEverContacted : "",
     wards:[],
     uphcs:this.filterParameter.uphcSelectedValues? this.filterParameter.uphcSelectedValues.reduce(function(s, a){
      s.push({uphc: a});
      return s;}, []):[],
     selectedStatuses:this.filterParameter.statusSelectedValue? this.filterParameter.statusSelectedValue.reduce(function(s, a){
      s.push({statusId: a});
      return s;}, []):[],
    //  inputDate:formatDate(this.filterParameter.inputDate, 'yyyy-MM-dd', 'en-US')
     inputDate:this.filterParameter.inputDate
   }
   this.SpinnerService.show();
    this.covidService.getCandidateList(this.candidateFilter)
      .subscribe((cList: IListCandidate[]) => {
        //this.listServiceRequest = srList;
        if (cList.length == 0) 
        this.noDataMessage ="Filter criteria does not match any record"

        this.panelOpenState = !this.panelOpenState;
        this.dataSource = new MatTableDataSource<IListCandidate>(cList);
        this.dataSource.paginator = this.paginator;
       // this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.SpinnerService.hide();
      }, (e) => {
        alert("An unexpected error occurred")
        this.SpinnerService.hide();
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id) {
    this.router.navigate(['covidi9/candidate', id, 0])
  }
  gotoStatusUpdatePage(id) {
    // this.router.navigate(['covidi9/candidate', id,1], { queryParams: { tabIndex: '1' } })
    this.router.navigate(['covidi9/candidate', id, 1])
  }
  goToAddPage() {
    this.router.navigate(['covidi9/candidate', 'null', 0]);
  }
  getStatusList() {
    this.covidService.getCandidateClosedReason()
      .subscribe((ls: ColsedReason[]) => {
        this.listStatus = ls;
        this.cdr.detectChanges();
      });
  }
}
export class CandidateListFilterParameter
{
  uphcSelectedValues : string[];
  statusSelectedValue : string[];
  inputDate:Date;
}
