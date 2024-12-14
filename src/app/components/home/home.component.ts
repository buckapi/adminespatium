import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { RealtimeCiudadesService } from '../../services/realtime-ciudades.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
interface Area {
  local: string;
  area: number;
  num?: number;  // Agregamos el número de espacios
  factor: number;
  tamanoPorFactor: number;
  incluido: boolean;
}
interface OpcionConstruccion {
  valor: string;
  descripcion: string;
  tipoConstruccion: string;
}
interface OpcionCanceleria {
  valor: string;
  descripcion: string;
  tipoConstruccion: string;
}

interface OpcionPisos {
  valor: string;
  descripcion: string;
  tipoConstruccion: string;
}

interface OpcionFormaMaterial {
  valor: string;
  descripcion: string;
  tipoConstruccion: string;
}

interface OpcionMueblesBano {
  valor: string;
  descripcion: string;
  tipoConstruccion: string;
}

interface OpcionIluminacion {
  valor: string;
  descripcion: string;
  tipoConstruccion: string;
}
interface Extra {
  nombre: string;
  cantidad: number;
  costoPorUnidad: number;
  total: number;
  incluido: boolean;
}

interface InstalacionEspecial {
  nombre: string;
  costoPorM2: number;
  total: number;
  incluido: boolean;
}

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
  tipoPuertasInteriores: string = '';
  tipoClosetsVestidores: string = '';
  tipoCocinaIntegral: string = '';
  tipoCanceleria: string = '';
  tipoPisos: string = '';
  tipoFormaMaterial: string = '';
  tipoMueblesBano: string = '';
  tipoIluminacion: string = '';
  tipoComplementosCirculacion: string = '';
  tipoEspaciosSinTecho: string = '';
  tipoAcabadosConstruccion: string = '';
  tipoAlbercas: string = '';

  tiposConstruccion = ['Media', 'Semi Lujo', 'Residencial', 'Residencial Plus'];
  areas: Area[] = [
    { local: 'Entrada', num: 1, area: 7.50, factor: 1.00, tamanoPorFactor: 7.50, incluido: true },
    { local: 'Medio baño', num: 1, area: 2.34, factor: 1.00, tamanoPorFactor: 2.34, incluido: true },
    { local: 'Estancia', num: 1, area: 20.35, factor: 1.50, tamanoPorFactor: 30.53, incluido: true },
    { local: 'Despacho / Home office', num: 1, area: 7.47, factor: 1.00, tamanoPorFactor: 7.47, incluido: true },
    { local: 'Gran Sala de Estar', num: 1, area: 0.00, factor: 1.50, tamanoPorFactor: 0.00, incluido: false },
    { local: 'Comedor (abierto)', num: 1, area: 11.10, factor: 1.50, tamanoPorFactor: 16.65, incluido: true },
    { local: 'Cocina (abierta)', num: 1, area: 9.00, factor: 1.00, tamanoPorFactor: 9.00, incluido: true },
    { local: 'Área para comer de Cocina abierta', num: 1, area: 2.25, factor: 1.00, tamanoPorFactor: 2.25, incluido: true },
    { local: 'Despensa', num: 1, area: 1.08, factor: 1.00, tamanoPorFactor: 1.08, incluido: true },
    { local: 'Sala familiar', num: 1, area: 0.00, factor: 1.00, tamanoPorFactor: 0.00, incluido: false },
    { local: 'Lavandería', num: 1, area: 13.32, factor: 1.00, tamanoPorFactor: 13.32, incluido: true },
    { local: 'Sala de T.V', num: 1, area: 0.00, factor: 1.00, tamanoPorFactor: 0.00, incluido: false },
    { local: 'Recámara 1 principal', num: 1, area: 1.08, factor: 1.00, tamanoPorFactor: 1.08, incluido: true },
    { local: 'Vestidor', num: 1, area: 0.00, factor: 1.00, tamanoPorFactor: 0.00, incluido: false },
    { local: 'Baño Principal', num: 1, area: 27.00, factor: 1.00, tamanoPorFactor: 27.00, incluido: true },
    { local: 'Recámara Secundaria', num: 2, area: 9.00, factor: 1.00, tamanoPorFactor: 18.00, incluido: true },
    { local: 'Walk in Closet', num: 2, area: 2.16, factor: 1.00, tamanoPorFactor: 4.32, incluido: true },
    { local: 'Baño Secundario', num: 2, area: 4.95, factor: 1.00, tamanoPorFactor: 9.90, incluido: true },
    { local: 'Closet Blancos', num: 1, area: 0.43, factor: 1.00, tamanoPorFactor: 0.43, incluido: true },
    { local: 'Terraza cubierta / salón de juegos', num: 1, area: 16.65, factor: 0.50, tamanoPorFactor: 8.33, incluido: true },
    { local: 'Taller', num: 1, area: 0.00, factor: 0.50, tamanoPorFactor: 0.00, incluido: false },
    { local: 'Garage Cubierto', num: 1, area: 44.83, factor: 1.00, tamanoPorFactor: 44.83, incluido: true },
    { local: 'Garage /Semisótano', num: 1, area: 0.00, factor: 1.50, tamanoPorFactor: 0.00, incluido: false },
    { local: 'Bodega', num: 1, area: 1.80, factor: 1.00, tamanoPorFactor: 1.80, incluido: true }
  ];

  totalAreaConFactor: number = 268.28;

  opcionesPuertasAcceso: OpcionConstruccion[] = [
    { valor: 'MADERA_SOLIDA', descripcion: 'Madera Sólida', tipoConstruccion: 'todos' },
    { valor: 'ACERO', descripcion: 'Acero', tipoConstruccion: 'todos' },
    { valor: 'ACERO_Y_MADERA', descripcion: 'Acero y Madera', tipoConstruccion: 'todos' },
    { valor: 'BLINDADA', descripcion: 'Blindada', tipoConstruccion: 'todos' }
  ];

  opcionesPuertasInteriores: OpcionConstruccion[] = [
    { valor: 'TAMBOR_MDF_FOIL_PVC', descripcion: 'Tambor y MDF acabado foil PVC', tipoConstruccion: 'Media' },
    { valor: 'TAMBOR_TRIPLAY_MADERA', descripcion: 'Tambor de triplay madera', tipoConstruccion: 'Residencial Plus' },
    { valor: 'TAMBOR_MDF_LAQUEADO', descripcion: 'Tambor de MDF acabado laqueado', tipoConstruccion: 'Semi Lujo' },
    { valor: 'SEMISOLIDA_MDF_FOIL_PVC', descripcion: 'Semisólida MDF acabado foil PVC', tipoConstruccion: 'Semi Lujo' },
    { valor: 'SEMISOLIDA_MDF_MELAMINA', descripcion: 'Semisólida MDF acabado melamina', tipoConstruccion: 'Semi Lujo' },
    { valor: 'SEMISOLIDA_TRIPLAY_MADERA', descripcion: 'Semisólida de triplay madera', tipoConstruccion: 'Residencial' },
    { valor: 'SEMISOLIDA_MDF_LAQUEADO', descripcion: 'Semisólida de MDF acabado laqueado', tipoConstruccion: 'Residencial' },
    { valor: 'SOLIDA_MDF_FOIL_PVC', descripcion: 'Sólida MDF acabado foil PVC', tipoConstruccion: 'Residencial' },
    { valor: 'SOLIDA_MDF_CHAPA_MADERA', descripcion: 'Sólida MDF acabado chapa de madera', tipoConstruccion: 'Residencial Plus' },
    { valor: 'SOLIDA_MDF_LAQUEADO', descripcion: 'Sólida de MDF acabado laqueado', tipoConstruccion: 'Residencial Plus' }
  ];

  opcionesClosetsVestidores = [
    {
      valor: 'media',
      descripcion: 'Frentes con melamina tipo madera, interiores cajones y maletero con tableros melamina blanca',
      tipoConstruccion: 'Media'
    },
    {
      valor: 'semilujo',
      descripcion: 'Frentes e interiores, cajones y maletero con melamina tipo madera',
      tipoConstruccion: 'Semi Lujo'
    },
    {
      valor: 'residencial',
      descripcion: 'Frentes con MDF acabado laqueado, interiores cajones y maletero con melamina blanca',
      tipoConstruccion: 'Residencial'
    },
    {
      valor: 'residencialplus',
      descripcion: 'Frentes con MDF acabado chapa de madera, interiores cajones y maletero con melamina tipo madera',
      tipoConstruccion: 'Residencial Plus'
    }
  ];
  opcionesCocinaIntegral = [
    {
      valor: 'basica',
      descripcion: '3 M DE DESARROLLO CUBIERTA POSTFORMADA, MARCA KOBER, PUERTAS ALACENA Y GABINETES INFERIORES CON MELAMINA TIPO MADERA, INTERIORES CON TABLEROS MELAMINA BLANCA, HERRAJES BOTE DE BASURA, EXTARIBLE PARA BOTELLAS',
      tipoConstruccion: 'Media'
    },
    {
      valor: 'intermedia',
      descripcion: '4 M DE DESARROLLO CUBIERTA GRANITO CALIDAD NACIONAL, PUERTAS ALACENA Y GABINETES INFERIORES CON MELAMINA TIPO MADERA, HERRAJES BOTE DE BASURA 4 CUBETAS, EXTARIBLE PARA BOTELLAS',
      tipoConstruccion: 'Semi Lujo'
    },
    {
      valor: 'alta',
      descripcion: '5 M DE DESARROLLO CUBIERTA GRANITO IMPORTADO, PUERTAS ALACENA Y GABINETES INFERIORES CON HERRAJES CIERRE LENTO Y CON ACABADO LAQUEADO Y CRISTAL, INTERIORES MELAMINA BLANCA HERRAJES CAJONES CIERRE LENTO HERRAJES BLUM, BOTE DE BASURA 4 CUBETAS, EXTARIBLE PARA BOTELLAS, DESPENSA BAJO FREGADERO',
      tipoConstruccion: 'Residencial'
    },
    {
      valor: 'premium',
      descripcion: '7 M DE DESARROLLO CUBIERTA DE QUARZO PUERTAS ALACENA Y GABINETES INFERIORES CON HERRAJES CIERRE LENTO Y CON ACABADO CHAPA DE MADERA INTERIORES MELAMINA BLANCA HERRAJES CAJONES CIERRE Y APERTURA ELECTRICA HERRAJES BLUM, BOTE DE BASURA 4 CUBETAS, EXTARIBLE PARA BOTELLAS, DESPENSA BAJO FREGADERO',
      tipoConstruccion: 'Residencial Plus'
    }
  ];
  opcionesCanceleria: OpcionCanceleria[] = [
    {
      valor: 'aluminio_2',
      descripcion: 'CANCELERIA DE ALUMINIO DE 2" Y CRISTAL CLARO 6MM',
      tipoConstruccion: 'Media'
    },
    {
      valor: 'aluminio_3',
      descripcion: 'CANCELERIA DE ALUMINIO DE 3" Y CRISTAL CLARO 6MM',
      tipoConstruccion: 'Semi Lujo'
    },
    {
      valor: 'pvc_cristal',
      descripcion: 'CANCELERIA DE PVC Y CRISTAL TEMPLADO EVO CLARO 6MM',
      tipoConstruccion: 'Residencial'
    },
    {
      valor: 'pvc_doble',
      descripcion: 'CANCELERIA DE PVC Y DOBLE CRISTAL CLARO TEMPLADO 6MM / 12MM AIRE / EVO 50 TEMPLADO 6MM',
      tipoConstruccion: 'Residencial Plus'
    }
  ];
  
  opcionesPisos: OpcionPisos[] = [
    {
      valor: 'ceramicos',
      descripcion: 'MATERIALES MANUFACTAURADOS CERAMICOS PASTAS TEXTURIZADAS',
      tipoConstruccion: 'Media'
    },
    {
      valor: 'porcelanatos',
      descripcion: 'MATERIALES MANUFACTAURADOS PORCELANATOS WPC',
      tipoConstruccion: 'Semi Lujo'
    },
    {
      valor: 'marmol_granito',
      descripcion: 'MATERIALES NATURALES MARMOL GRANITO MADERA',
      tipoConstruccion: 'Residencial'
    },
    {
      valor: 'marmol_granito_ingenieria',
      descripcion: 'MATERIALES NATURALES MARMOL GRANITO MADERA DE INGENIERIA',
      tipoConstruccion: 'Residencial Plus'
    }
  ];
  
  opcionesFormaMaterial: OpcionFormaMaterial[] = [
    {
      valor: 'cuadrados_media',
      descripcion: 'CUADRADOS RECTANGULARES',
      tipoConstruccion: 'Media'
    },
    {
      valor: 'cuadrados_semilujo',
      descripcion: 'CUADRADOS RECTANGULARES',
      tipoConstruccion: 'Semi Lujo'
    },
    {
      valor: 'cuadrados_residencial',
      descripcion: 'CUADRADOS RECTANGULARES',
      tipoConstruccion: 'Residencial'
    },
    {
      valor: 'grandes_formatos',
      descripcion: 'GRANDES FORMATOS',
      tipoConstruccion: 'Residencial Plus'
    }
  ];

  opcionesMueblesBano: OpcionMueblesBano[] = [
    {
      valor: 'media',
      descripcion: 'Media: Mezcladoras y accesorios básicos',
      tipoConstruccion: 'Media'
    }
  ];

  opcionesIluminacion: OpcionIluminacion[] = [
    {
      valor: 'media',
      descripcion: 'Media: Mezcladoras y accesorios básicos',
      tipoConstruccion: 'Media'
    }
  ];

  extras: Extra[] = [
    {
      nombre: 'ILUMINACIÓN EXTERIOR',
      cantidad: 0,
      costoPorUnidad: 265.50,
      total: 0,
      incluido: false
    },
    {
      nombre: 'CCTV POR CÁMARA O ESPACIO',
      cantidad: 0,
      costoPorUnidad: 73.53,
      total: 0,
      incluido: false
    },
    {
      nombre: 'DOMOTICA PARA CASA INTELIGENTE',
      cantidad: 0,
      costoPorUnidad: 1165.00,
      total: 0,
      incluido: false
    },
    {
      nombre: 'UNIDAD DE RE CARGA ELÉCTRICA VEHICULAR',
      cantidad: 0,
      costoPorUnidad: 12000.00,
      total: 0,
      incluido: false
    }
  ];

  totalExtras: number = 0;
 

  tipoConstruccionSeleccionado: string = '';
  mostrarResultados: boolean = false;

  subtotalArea: number = 0;
  areaCirculacion: number = 0;

  instalacionesEspeciales: InstalacionEspecial[] = [
    {
      nombre: 'AIRE ACONDICIONADO MINI SPLIT',
      costoPorM2: 350.00,
      total: 0,
      incluido: false
    },
    {
      nombre: 'AIRE ACONDICIONADO DUCTOS TECHO',
      costoPorM2: 2100.00,
      total: 0,
      incluido: false
    },
    {
      nombre: 'CALEFACCIÓN RADIADORES',
      costoPorM2: 200.00,
      total: 0,
      incluido: false
    },
    {
      nombre: 'CALEFACCIÓN PISO RADIANTE',
      costoPorM2: 900.00,
      total: 0,
      incluido: false
    }
  ];

  totalInstalaciones: number = 0;

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

  onPuertasInterioresChange(event: any) {
    this.tipoPuertasInteriores = event.target.value;
    this.calcularPrecioEstimado();
  }

  onClosetsVestidoresChange(event: any) {
    this.tipoClosetsVestidores = event.target.value;
    this.calcularPrecioEstimado();
  }

   
  onCocinaIntegralChange(event: any) {
    this.tipoCocinaIntegral = event.target.value;
    this.calcularPrecioEstimado();
  }

  onCanceleriaChange(event: any) {
    this.tipoCanceleria = event.target.value;
    this.calcularPrecioEstimado();
  }
  
  onPisosChange(event: any) {
    this.tipoPisos = event.target.value;
    this.calcularPrecioEstimado();
  }
  
  onFormaMaterialChange(event: any) {
    this.tipoFormaMaterial = event.target.value;
    this.calcularPrecioEstimado();
  }
  onMueblesBanoChange(event: any) {
    this.tipoMueblesBano = event.target.value;
    this.calcularPrecioEstimado(); // Si tienes un método para calcular el precio total
  }

  // Método para manejar cambios en iluminación
  onIluminacionChange(event: any) {
    this.tipoIluminacion = event.target.value;
    this.calcularPrecioEstimado(); // Si tienes un método para calcular el precio total
  }

  // Método para manejar el cambio de tipo de construcción
  onTipoConstruccionChange(event: any) {
    this.tipoConstruccionSeleccionado = event.target.value;
    // Resetear selecciones previas si es necesario
    // Actualizar precio estimado
    this.calcularPrecioEstimado();
  }


  calcularTamanoPorFactor(index: number) {
    const area = this.areas[index];
    area.tamanoPorFactor = (area.num || 1) * area.area * area.factor;
    this.actualizarTotales();
  }
 

  actualizarTotales() {
    // Calcular subtotal sumando todos los tamaños por factor de las áreas incluidas
    this.subtotalArea = this.areas
      .filter(area => area.incluido)
      .reduce((total, area) => total + area.tamanoPorFactor, 0);

    // Calcular área de circulación (15% del subtotal)
    this.areaCirculacion = this.subtotalArea * 0.15;

    // Calcular total
    this.totalAreaConFactor = this.subtotalArea + this.areaCirculacion;

    // Actualizar el precio estimado
    this.calcularPrecioEstimado();
  }
  calcularTotalExtra(index: number) {
    const extra = this.extras[index];
    
    if (extra.incluido) {
      // Para la unidad de recarga eléctrica, usar solo el costo por unidad
      if (extra.nombre === 'UNIDAD DE RE CARGA ELÉCTRICA VEHICULAR') {
        extra.total = extra.cantidad * extra.costoPorUnidad;
      } else {
        // Para los dem��s extras, multiplicar por el área total con factor
        extra.total = extra.cantidad * extra.costoPorUnidad * this.totalAreaConFactor;
      }
    } else {
      extra.total = 0;
    }
    
    this.actualizarTotalesExtras();
  }

  actualizarTotalesExtras() {
    this.totalExtras = this.extras
      .filter(extra => extra.incluido)
      .reduce((total, extra) => total + extra.total, 0);
    
    // Actualizar el precio estimado total incluyendo los extras
    this.calcularPrecioEstimado();
  }

  calcularPrecioEstimado() {
    if (this.factorCostoCiudad && this.totalAreaConFactor) {
      // Precio base por área
      const precioBase = this.factorCostoCiudad * this.totalAreaConFactor;
      // Sumar los extras y las instalaciones especiales
      this.precioEstimado = precioBase + this.totalExtras + this.totalInstalaciones;
    }
  }
  /* calcularPrecioEstimado() {
    if (this.factorCostoCiudad && this.totalAreaConFactor) {
      // Precio base por área
      const precioBase = this.factorCostoCiudad * this.totalAreaConFactor;
      // Sumar los extras
      this.precioEstimado = precioBase + this.totalExtras;
    }
  
  } */

  calcularTotalInstalacion(index: number) {
    const instalacion = this.instalacionesEspeciales[index];
    if (instalacion.incluido) {
      instalacion.total = instalacion.costoPorM2 * this.totalAreaConFactor;
    } else {
      instalacion.total = 0;
    }
    this.actualizarTotalesInstalaciones();
  }

  actualizarTotalesInstalaciones() {
    this.totalInstalaciones = this.instalacionesEspeciales
      .filter(instalacion => instalacion.incluido)
      .reduce((total, instalacion) => total + instalacion.total, 0);
    
    // Actualizar el precio estimado total
    this.calcularPrecioEstimado();
  }
}

