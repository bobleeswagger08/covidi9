import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCaseMasterComponent } from './court-case-master.component';

describe('CourtCaseMasterComponent', () => {
  let component: CourtCaseMasterComponent;
  let fixture: ComponentFixture<CourtCaseMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtCaseMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtCaseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
