import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressEditorComponent } from './adress-editor.component';

describe('AdressEditorComponent', () => {
  let component: AdressEditorComponent;
  let fixture: ComponentFixture<AdressEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdressEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdressEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
