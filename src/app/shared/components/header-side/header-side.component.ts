import { Component, OnInit, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoggedInUser } from 'app/model/user';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
//import { LogInUser } from '../../../model/user'

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
  userName: string;
  loginUser: LoggedInUser;
  public availableLangs = [{
    name: 'EN',
    code: 'en',
    flag: 'flag-icon-us'
  }, {
    name: 'ES',
    code: 'es',
    flag: 'flag-icon-es'
  }]
  currentLang = this.availableLangs[0];

  public egretThemes;
  public layoutConf: any;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private systemEnvironmentService: ApplicationEnvironmentService,
    private renderer: Renderer2,
    private router: Router
  ) { }
  ngOnInit() {
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
    this.translate.use(this.currentLang.code);
    
    if (this.systemEnvironmentService.userSession.loggedInUser) {
      this.loginUser = this.systemEnvironmentService.userSession.loggedInUser;
      let userName = this.loginUser.userFirstName;
      this.userName = userName[0].toUpperCase() + userName.slice(1);
    }
    else {
      this.userName = "Unknown";
      this.router.navigate(['/']);
    }
  
  }
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }
  changeTheme(theme) {
    // this.themeService.changeTheme(theme);
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      })
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      }, { transitionClass: true })
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    }, { transitionClass: true })

  }

  onSearch(e) {
    //   console.log(e)
  }
  signOut() {
    this.systemEnvironmentService.userSession.logout();
    this.router.navigate(['/home']);
  }
  UpdateProfile() {
    this.router.navigate(['/administration/user', this.loginUser.id])
    // this.router.navigate(['/roleservice/user','4872b3a2-3212-11ea-ab85-02151f5d67f6'])
  }
  UpdatePassword() {
    this.router.navigate(['/administration/changepassword', this.loginUser.id]);
    // this.router.navigate(['/roleservice/changepassword','4872b3a2-3212-11ea-ab85-02151f5d67f6']);
  }
  UnlockUser() {
    this.router.navigate(['/administration/unlockuser']);
  }
}