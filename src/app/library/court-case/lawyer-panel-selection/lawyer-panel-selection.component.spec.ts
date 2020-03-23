import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerPanelSelectionComponent } from './lawyer-panel-selection.component';

describe('LawyerPanelSelectionComponent', () => {
  let component: LawyerPanelSelectionComponent;
  let fixture: ComponentFixture<LawyerPanelSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerPanelSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerPanelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
