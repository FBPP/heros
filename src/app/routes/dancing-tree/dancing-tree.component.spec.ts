import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DancingTreeComponent } from './dancing-tree.component';

describe('DancingTreeComponent', () => {
  let component: DancingTreeComponent;
  let fixture: ComponentFixture<DancingTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DancingTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DancingTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
