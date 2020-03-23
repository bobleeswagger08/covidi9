import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class EditorService extends DataService{

  constructor(http:Http) {
    super("https://localhost:5001/api/TextEditor",http);
   }
}
