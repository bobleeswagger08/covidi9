import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IListCandidate } from '../model/candidate-input';
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
  displayedColumns: string[] = ['serialNo', 'source', 'name', 'flightNo','countryVisited', 'age', 'sex', 'updatebutton', 'updateStatus'];
  listCandidate: IListCandidate[];
  dataSource: MatTableDataSource<IListCandidate>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private router: Router, cdr: ChangeDetectorRef, private SpinnerService: NgxSpinnerService,private covidService:CovidI9Service) {
    let candidateFilterP: any = {};
    candidateFilterP.isEverContacted=""
    candidateFilterP.words=[]
    candidateFilterP.upscs=[]
    candidateFilterP.names=[]
    candidateFilterP.selectedStatuses=[]
    this.covidService.getCandidateList(candidateFilterP)
    .subscribe((cList:IListCandidate[]) => {
      //this.listServiceRequest = srList;
      this.dataSource = new MatTableDataSource(cList);
     cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.SpinnerService.hide();
    }, () => {
      this.SpinnerService.hide();
    });
   }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id) {
    this.router.navigate(['covidi9/candidate', id], { queryParams: { tabIndex: '0' } })
  }
  gotoStatusUpdatePage(id) {
    this.router.navigate(['covidi9/candidate', id], { queryParams: { tabIndex: '1' } })
  }
  goToAddPage() {
    this.router.navigate(['covidi9/candidate', 'null']);
  }

}
