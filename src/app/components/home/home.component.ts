import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { RealtimeCiudadesService } from '../../services/realtime-ciudades.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentStep: number = 1;
  precioEstimado: number = 0;
  isFormValid: boolean = false;
  alturaSeleccionada: number = 0;
  tamanoTerrenoSeleccionado: number = 0;
  coeficienteOcupacion: number = 0.50;
  areaConstructible: number = 0;
  areaLibre: number = 0;
  factorCostoCiudad: number = 0;
  ciudadSeleccionada: string = '';
  tipoPuertaAcceso: string = '';
  opcionesPuertas = [
    { valor: 'MADERA SOLIDA', descripcion: 'Madera Sólida' },
    { valor: 'ACERO', descripcion: 'Acero' },
    { valor: 'ACERO Y MADERA', descripcion: 'Acero y Madera' },
    { valor: 'BLINDADA', descripcion: 'Blindada' }
  ];
  mostrarResultados: boolean = false;

constructor(public global: GlobalService,
  private http: HttpClient,
  public realtimeciudad: RealtimeCiudadesService
){
  this.realtimeciudad.ciudades$.subscribe((res: any) => {
    console.log(res);
  });

}

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }
  calcularAreas() {
    this.areaConstructible = this.tamanoTerrenoSeleccionado * this.coeficienteOcupacion;
    this.areaLibre = this.tamanoTerrenoSeleccionado - this.areaConstructible;
    this.calcularPrecioEstimado();
  }

  onCiudadChange(event: any) {
    const ciudadId = event.target.value;
    this.realtimeciudad.ciudades$.subscribe((ciudades: any[]) => {
      const ciudadSeleccionada = ciudades.find(ciudad => ciudad.id === ciudadId);
      if (ciudadSeleccionada) {
        this.factorCostoCiudad = ciudadSeleccionada.factorCosto;
        this.ciudadSeleccionada = ciudadSeleccionada.ciudades;
        this.calcularPrecioEstimado();
      }
    });
  }

  onTamanoTerrenoChange(event: any) {
    this.tamanoTerrenoSeleccionado = parseFloat(event.target.value);
    this.calcularAreas();
  }

  onAlturaChange(event: any) {
    this.alturaSeleccionada = parseFloat(event.target.value);
    this.calcularPrecioEstimado();
  }

  onPuertaChange(event: any) {
    this.tipoPuertaAcceso = event.target.value;
    this.calcularPrecioEstimado();
  }
  calcularPrecioEstimado() {
    if (this.factorCostoCiudad && this.areaConstructible) {
      this.precioEstimado = this.factorCostoCiudad * this.areaConstructible;
    }
  }
}

