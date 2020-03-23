import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCaseMasterListComponent } from './court-case-master-list.component';

describe('CourtCaseMasterListComponent', () => {
  let component: CourtCaseMasterListComponent;
  let fixture: ComponentFixture<CourtCaseMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtCaseMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtCaseMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
