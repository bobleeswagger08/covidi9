import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTrackerDashboardComponent } from './data-tracker-dashboard.component';

describe('DataTrackerDashboardComponent', () => {
  let component: DataTrackerDashboardComponent;
  let fixture: ComponentFixture<DataTrackerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTrackerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTrackerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
