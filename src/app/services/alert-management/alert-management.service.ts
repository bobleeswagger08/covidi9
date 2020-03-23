import { Injectable } from '@angular/core';
import { DialogConfirmComponent } from '../../library/shared-controls/dialog-confirm/dialog-confirm.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertManagementService {

  constructor(public dialog: MatDialog) { }

  public showConfirmationDialog(confirmationText: string, title?: string): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      caption: title?title:"Please Confirm",
      text: confirmationText
    };

    // dialogConfig.position = {
    //   top: 100,
    //   left: 100
    // };

    // dialogConfig.height = '200px';
    // dialogConfig.width = '250px'

    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogConfig);

    return dialogRef.afterClosed();
  }
}
