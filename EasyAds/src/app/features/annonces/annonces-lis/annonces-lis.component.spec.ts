import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesLisComponent } from './annonces-lis.component';

describe('AnnoncesLisComponent', () => {
  let component: AnnoncesLisComponent;
  let fixture: ComponentFixture<AnnoncesLisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnoncesLisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnoncesLisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
