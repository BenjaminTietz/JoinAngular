import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDesktopComponent } from './header-desktop.component';

describe('HeaderDesktopComponent', () => {
  let component: HeaderDesktopComponent;
  let fixture: ComponentFixture<HeaderDesktopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderDesktopComponent]
    });
    fixture = TestBed.createComponent(HeaderDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
