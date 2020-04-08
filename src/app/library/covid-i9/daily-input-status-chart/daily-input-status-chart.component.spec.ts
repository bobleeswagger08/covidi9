import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInputStatusChartComponent } from './daily-input-status-chart.component';

describe('DailyInputStatusChartComponent', () => {
  let component: DailyInputStatusChartComponent;
  let fixture: ComponentFixture<DailyInputStatusChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyInputStatusChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyInputStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
