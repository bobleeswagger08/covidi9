import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandiateStatusChartComponent } from './candiate-status-chart.component';

describe('CandiateStatusChartComponent', () => {
  let component: CandiateStatusChartComponent;
  let fixture: ComponentFixture<CandiateStatusChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandiateStatusChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandiateStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
