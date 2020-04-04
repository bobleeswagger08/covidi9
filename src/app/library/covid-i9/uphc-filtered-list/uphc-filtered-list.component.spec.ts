import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UphcFilteredListComponent } from './uphc-filtered-list.component';

describe('UphcFilteredListComponent', () => {
  let component: UphcFilteredListComponent;
  let fixture: ComponentFixture<UphcFilteredListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UphcFilteredListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UphcFilteredListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
