import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerPanelComponent } from './lawyer-panel.component';

describe('LawyerPanelComponent', () => {
  let component: LawyerPanelComponent;
  let fixture: ComponentFixture<LawyerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
