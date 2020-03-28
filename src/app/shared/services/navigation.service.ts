import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  constructor() {}

  plainMenu: IMenuItem[] = [
    // {
    //   name: "ADMIN",
    //   type: "dropDown",
    //   tooltip: "Address",
    //   icon: "address",
    //   state: "address",
    //   disabled: false,
    //   sub: [
    //     // { name: "NewAddress", state: "newaddress" },
    //     // { name: "TextEditor", state: "texteditor" },
    //     // { name: "UserRolePermission", state: "rolepermission" },
    //     // { name: "NewUserRolePermission", state: "rolepermission" },
    //     // { name: "GenericTable", state: "gentable" },
    //      { name: "Office Master", state: "officelist" }
    //     ,{ name: "User Master", state: "user/null" }
    //   ]
    // },
    // {
    //   name: "Administration",
    //   type: "dropDown",
    //   tooltip: "Administration Module",
    //   icon: "address",
    //   state: "administration",
    //   sub: [
    //     { name:"Masters",type:"dropDown", sub:[
    //       {name:"User Role", state: "rolemasterlist"},
    //       {name:"User", state: "userlist"},
    //       {name:"User Role Assignment", state:"userroleassignment"},
    //       {name:"Role Access Permissions", state:"rolepermission"}
    //       // {name:"AddressComponent", state:"newaddress"}
    //      // {name:"Reset Password", state: "changepassword/null"}
    //     ]}
    //   ]},
  // {
  //   name: "Common",
  //   type: "dropDown",
  //   tooltip: "Common Module",
  //   icon: "address",
  //   state: "administration",
  //   sub: [
  //     { name: "Candidate", state: "candidate" },
  //    //{ name: "TextEditor", state: "texteditor" },
  //     //{ name: "UserRolePermission", state: "rolepermission" },
  //   ]},
  {
    name: "Covid 19",
    type: "dropDown",
    tooltip: "Covid 19",
    icon: "address",
    state: "covidi9",
    sub: [
      { name: "Candidate", state: "candidatelist" },
     // { name: "Candidate Master", state: "candidate/null/0" },
     // { name: "Field Input", state: "candidate/null/1" },
      { name: "Excel Upload", state: "excelupload" },
      { name: "Candidate Analysis", state: "candidateanalysis" }
     //{ name: "TextEditor", state: "texteditor" },
      //{ name: "UserRolePermission", state: "rolepermission" },
    ]},
    // {
    //   name: "Court Case",
    //   type: "dropDown",
    //   tooltip: "Court Case Module",
    //   icon: "address",
    //   state: "courtcase",
    //   sub: [
    //     { name:"Masters",type:"dropDown", sub:[
    //       {name:"Court", state: "courtmasterlist"}, 
    //       {name:"Lawyer", state: "lawyermasterlist"},
    //       {name:"Lawyer Panel", state: "lawyerpanel"},
    //       {name:"Lawyer Assignment", state: "lawyerassign"}
          
    //     ]},
    //     { name:"Activities",type:"dropDown", sub:[
    //       {name:"Court Case", state: "courtcasemasterlist"},
    //       {name:"Incoming Legal Document", state: "courtcaseorderlist/true"},
    //       {name:"Outgoing Legal Document", state: "courtcaseorderlist/false"}  
    //     ]}
    //   ]},
  //   {
  //     name: "RTPS",
  //     type: "dropDown",
  //     tooltip: "RTPS Module",
  //     icon: "address",
  //     state: "rtps",
  //     sub: [
  //       { name:"Master",type:"dropDown", sub:[
  //         {name:"SetUp", state: ""},
  //         {name:"Service Master", state: "svcmasterlist"},
  //         {name:"Form (I) Access Delegation", state:"formiaccessdelegation"}
  //       ]},
  //       { name:"Activities",type:"dropDown", sub:[
  //         {name:"Issue Form (I)", state: "svcrequestlist"},
  //         {name:"Update Status", state: "servicerequeststatus/null"}
  //       ]},
  //       { name:"Reports",type:"dropDown", sub:[
  //         {name:"Form (IV) Register", state: "formivreport"},
  //         {name:"Service Request Analysis", state: "dashboardchart"},
  //         {name:"Department Wise Analysis", state: "dwiseanalysis"}
  //        // {name:"Dash Board", state:"dashboardchart"}
  //        ]}
       

  //       // { name: "RoleMaster", state: "rolemaster" },
  //       // { name: "ServiceMaster", state: "servicemaster/null" },
  //       // { name: "ServiceRole", state: "servicerole" },
  //       // { name: "ServiceRequestForm", state: "servicerequestform/null" },
  //       // { name: "ServiceRequestStatus", state: "servicerequeststatus/null" },
        
  // ]}
    // {
    //   name: "DOC",
    //   type: "extLink",
    //   tooltip: "Documentation",
    //   icon: "library_books",
    //   state: "http://demos.ui-lib.com/egret-doc/"
    // }
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.plainMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.

  publishNavigationChange(menuType: string) {
    // switch (menuType) {
    //   case "separator-menu":
    //     this.menuItems.next(this.separatorMenu);
    //     break;
    //   case "icon-menu":
    //     this.menuItems.next(this.iconMenu);
    //     break;
    //   default:
    //     this.menuItems.next(this.plainMenu);
    // }
  }
}
