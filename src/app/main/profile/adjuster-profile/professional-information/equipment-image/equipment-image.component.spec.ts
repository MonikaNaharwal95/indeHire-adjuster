import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentImageComponent } from './equipment-image.component';

describe('EquipmentImageComponent', () => {
  let component: EquipmentImageComponent;
  let fixture: ComponentFixture<EquipmentImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
