import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFlippingIndexComponent } from './table-flipping-index.component';

describe('TableFlippingIndexComponent', () => {
  let component: TableFlippingIndexComponent;
  let fixture: ComponentFixture<TableFlippingIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableFlippingIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFlippingIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
