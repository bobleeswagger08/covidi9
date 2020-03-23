import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtMasterComponent } from './court-master.component';

describe('CourtMasterComponent', () => {
  let component: CourtMasterComponent;
  let fixture: ComponentFixture<CourtMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
