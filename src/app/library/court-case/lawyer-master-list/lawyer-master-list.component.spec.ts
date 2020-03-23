import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerMasterListComponent } from './lawyer-master-list.component';

describe('LawyerMasterListComponent', () => {
  let component: LawyerMasterListComponent;
  let fixture: ComponentFixture<LawyerMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
