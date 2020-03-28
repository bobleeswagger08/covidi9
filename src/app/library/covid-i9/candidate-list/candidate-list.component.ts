import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IListCandidate, IListUPHC, IListWard, CandidateSearchFilter, SelectedUPHC } from '../model/candidate-input';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CovidI9Service } from '../services/covid-i9.service';

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
  displayedColumns: string[] = ['referenceNo', 'source', 'serialNo', 'arivalDate', 'name', 'mobileNo','uphc','lastContactDate',  'updatebutton', 'updateStatus'];
  listCandidate: IListCandidate[];
  listOfUpHC : IListUPHC[]=[];
  listOfWards : IListWard[]=[];

  selectedUphc : IListUPHC[] = [];

  set uphcFilter(value : IListUPHC[])
  {
    console.log("setting data");
    this.candidateFilter.upscs=[];
    if(value)
    {
      for(let currentSelection of value)
      {
        let selectedItem :SelectedUPHC ={uphc : currentSelection.uphc};
        this.candidateFilter.upscs.push(selectedItem);
      }
    }
  }

  get uphcFilter(): IListUPHC[]
  {
    console.log("reading data");
    let filter : IListUPHC[] =[];
    if( this.candidateFilter.upscs)
    {
      for(let currentSelection of this.candidateFilter.upscs)
      {
        let selectedItem :IListUPHC ={uphc :  currentSelection.uphc };
        this.candidateFilter.upscs.push(selectedItem);
      }
    }

    return filter;
  }

  candidateFilter: CandidateSearchFilter = {};

  dataSource: MatTableDataSource<IListCandidate>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private router: Router, private cdr: ChangeDetectorRef, private SpinnerService: NgxSpinnerService,private covidService:CovidI9Service) {
    this.candidateFilter.isEverContacted=null;
    this.candidateFilter.upscs=[];
    this.candidateFilter.words=[];
   // this.candidateFilterP.names=[];
    this.candidateFilter.selectedStatuses=[];
    this.filterSource();
   ;
   }

  ngOnInit() {  
    this.getUPHCList();
    this.getWardList();

  }

  getUPHCList() {
    this.covidService.getUPHCList()
      .subscribe((listU:IListUPHC[]) => {
        this.listOfUpHC = listU;
      });
  }

  getWardList() {
    this.covidService.getWardList()
      .subscribe((listW:IListWard[]) => {
        this.listOfWards = listW
      });
  }

  setUPHCList()
  {
    this.candidateFilter.upscs=[];
    if(this.selectedUphc)
    {
      for(let currentSelection of this.selectedUphc)
      {
        let selectedItem :SelectedUPHC ={uphc : currentSelection.uphc};
        this.candidateFilter.upscs.push(selectedItem);
      }
    }

  }

  filterSource()
  {
    this.setUPHCList();
    this.covidService.getCandidateList(this.candidateFilter)
    .subscribe((cList:IListCandidate[]) => {
      //this.listServiceRequest = srList;
      this.dataSource = new MatTableDataSource(cList);
     this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.SpinnerService.hide();
    }, (e) => {
      alert("An unexpected error occurred")
      this.SpinnerService.hide();
    })
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
    this.router.navigate(['covidi9/candidate', 'null',0]);
  }

}

