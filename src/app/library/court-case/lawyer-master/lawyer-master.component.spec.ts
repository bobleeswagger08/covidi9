import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerMasterComponent } from './lawyer-master.component';

describe('LawyerMasterComponent', () => {
  let component: LawyerMasterComponent;
  let fixture: ComponentFixture<LawyerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
