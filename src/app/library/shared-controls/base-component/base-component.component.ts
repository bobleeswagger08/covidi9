import { Component, ChangeDetectorRef } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-base-component',
  template: `
    <p>
      base-component works!
    </p>
  `,
  styles: []
})
export class BaseComponent {
  pendingRequests: RequestQueueItem[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    
  }
  // registerDataRequest(id: string) {
  //   this.pendingRequests.push(new RequestQueueItem(id))
  // }
  registerDataRequest():string {
    let id = uuid();
    this.pendingRequests.push(new RequestQueueItem(id))
    return id;
  }
  formatDateAsDDMMYYYY(value){
    if(!value)
    {
      return null;
    }
    else{
      return formatDate(value,'dd-MM-yyyy','en-US');
    }
  }

  signalDataRequestCompletion(id: string) {
    // find the item with the id and remove from array
    let currentRequestIndex = this.pendingRequests.findIndex(r=> r.id == id);
    if(currentRequestIndex >= 0)
    {
      this.pendingRequests.splice(currentRequestIndex, 1);
    }

    if(this.pendingRequests.length == 0)
    {
      this.cdr.detectChanges();
    }
  }
}

class RequestQueueItem {
  constructor(public id:string)
  {

  }
}


