import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonceEditComponent } from './annonce-edit.component';

describe('AnnonceEditComponent', () => {
  let component: AnnonceEditComponent;
  let fixture: ComponentFixture<AnnonceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnonceEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnonceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
