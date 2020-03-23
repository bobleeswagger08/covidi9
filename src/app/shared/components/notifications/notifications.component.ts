import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { NotifyMessage, IMessageForUser } from 'app/model/notification';
import { HubConnection } from '@aspnet/signalr';
//import { NotificationService } from '../../../services/shared/notification.service';
//import { NotifiSignalRService } from '../../../services/shared/notifi-signal-r.service';
import { AppError } from '../../../shared/commonerror/app-error';
import { NotFoundError } from '../../../shared/commonerror/not-found-error';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { LoggedInUser } from 'app/model/user';
import { NotificationService } from 'app/services/shared/notification.service';
// import { LogInUser } from 'app/model/user';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;
  listAllNotification=new Array<IMessageForUser>();
  nfMessages=new Array<IMessageForUser>();
  loginUser:LoggedInUser;
  // Dummy notifications
  // notifications = [{
  //   message: 'New contact added',
  //   icon: 'assignment_ind',
  //   time: '1 min ago',
  //   route: '/inbox',
  //   color: 'primary'
  // }, {
  //   message: 'New message',
  //   icon: 'chat',
  //   time: '4 min ago',
  //   route: '/chat',
  //   color: 'accent'
  // }, {
  //   message: 'Server rebooted',
  //   icon: 'settings_backup_restore',
  //   time: '12 min ago',
  //   route: '/charts',
  //   color: 'warn'
  // }]
   notificationMessages=new Array<NotifyMessage>();
  // nfMessages=new Array<NotifyMessage>();
   notificationMsg =new NotifyMessage();
  // public _hubConnecton: HubConnection;

  constructor(private router: Router,private notifiService:NotificationService, private _ngZone:NgZone,private snackBar:MatSnackBar, private configlist : ConfigurationlistService) {
    this.subscribeToEvents();
  //   this.notifiRService.getAll()
  //         .subscribe(notifi=>{
  //           this.notificationMessages=notifi;
  //           this.nfMessages=notifi;
  //  });
  }
  private subscribeToEvents(): void {
    this.notifiService.messageReceived.subscribe((message: NotifyMessage) => {
      this._ngZone.run(() => { 
          this.notificationMsg=message;
          //console.log(this.notificationMsg);
          this.notificationMessages.push(this.notificationMsg);
          this.openSnackBar(this.notificationMsg.nSummary);
    });
  });
  }
  openSnackBar(snackMsg) {
    this.snackBar.open(snackMsg, "close", {
      duration: 2000,
    });
  }
//   deleteNotifi(dataNotification){
//     let index= this.notificationMessages.indexOf(dataNotification);
//     this.notificationMessages.splice(index,1)
//     this.noticationRSignal.delete(dataNotification.nId)
//     .subscribe(
//       null,
//     (error: AppError) => {
//       this.notificationMessages.splice(index,0, );
//       if(error instanceof NotFoundError){
//         alert('This post has already been deleted.')
//       }
//       else throw error;
//     });

// }

  ngOnInit() {
    if(localStorage.getItem('loginuser'))
    {
     this.loginUser = JSON.parse(localStorage.getItem('loginuser'));
     let userId = this.loginUser.id;
     this.getAllNotificationList(userId);
    // this.userName = userName[0].toUpperCase() + userName.slice(1);
    }
    
    // this.router.events.subscribe((routeChange) => {
    //     if (routeChange instanceof NavigationEnd) {
    //       this.notificPanel.close();
    //     }
    // });
  }
  getAllNotificationList(id){
    this.configlist.getAllNotication(id)
      .subscribe(messageList => {
        this.listAllNotification = messageList;
        this.nfMessages = messageList;
        // console.log(this.listAllNotification);
      });
  }
  filterAlert(value){
    this.nfMessages = this.listAllNotification.filter(ntype=>ntype.type===value);
  }
  // clearAll(e) {
  //   e.preventDefault();
  //   //this.notifications = [];
  // }
}
