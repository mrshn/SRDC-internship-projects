import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMessagesIOComponent } from './get-messages-io.component';

describe('GetMessagesIOComponent', () => {
  let component: GetMessagesIOComponent;
  let fixture: ComponentFixture<GetMessagesIOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetMessagesIOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetMessagesIOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
