import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EgretExampleViewerComponent } from './example-viewer.component';

describe('ExampleViewerComponent', () => {
  let component: EgretExampleViewerComponent;
  let fixture: ComponentFixture<EgretExampleViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgretExampleViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgretExampleViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
