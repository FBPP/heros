import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullDownToRefreshIndexComponent } from './pull-down-to-refresh-index.component';

describe('PullDownToRefreshIndexComponent', () => {
  let component: PullDownToRefreshIndexComponent;
  let fixture: ComponentFixture<PullDownToRefreshIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullDownToRefreshIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullDownToRefreshIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
