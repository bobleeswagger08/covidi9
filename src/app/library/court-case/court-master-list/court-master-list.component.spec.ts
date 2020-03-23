import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtMasterListComponent } from './court-master-list.component';

describe('CourtMasterListComponent', () => {
  let component: CourtMasterListComponent;
  let fixture: ComponentFixture<CourtMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
