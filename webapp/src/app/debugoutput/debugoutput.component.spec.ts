import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugoutputComponent } from './debugoutput.component';

describe('DebugoutputComponent', () => {
  let component: DebugoutputComponent;
  let fixture: ComponentFixture<DebugoutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugoutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
