import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorRecetasComponent } from './visualizador-recetas.component';

describe('VisualizadorRecetasComponent', () => {
  let component: VisualizadorRecetasComponent;
  let fixture: ComponentFixture<VisualizadorRecetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizadorRecetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizadorRecetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
