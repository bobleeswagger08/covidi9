import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WebDataRocksPivot } from 'app/library/rtps/webdatarocks/webdatarocks.angular4';
import { IListCandidate } from 'app/library/covid-i9/model/candidate-input';
import { CovidI9Service } from 'app/library/covid-i9/services/covid-i9.service';

@Component({
  selector: 'app-blank',
  templateUrl: './app-blank.component.html',
  styleUrls: ['./app-blank.component.css']
})
export class AppBlankComponent implements OnInit {
  
  constructor() {
    
   }

  ngOnInit() {
  }


}
