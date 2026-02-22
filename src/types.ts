// 1. Tabla Categoria
export interface Categoria {
  ID_Categorias: number;
  Nombre: string;
  Icono: string; // Ej: 'IoCarOutline'
  Color: string; // Ej: '#e67e22'
}

// 2. Tabla Gastos
export interface Gasto {
  ID_Gastos: number;
  Responsable: 'Ambos' | 'Hector' | 'Oscar';
  Categoria_ID: number; // Relación con la tabla Categoria
  Gasto: number;        // Monto
  Nota: string;
  Fecha: string;        // YYYY-MM-DD
}

// 3. Tabla Ingresos
export interface Ingreso {
  ID_Ingreso: number;
  Ingresos: number;     // Monto
  Procedencia: string;  // Corregido (antes Prosedencia)
  De_Quien: 'Ambos' | 'Hector' | 'Oscar';
  Fecha: string;
}

// 4. Tabla Parcelas
export interface Parcela {
  ID_Parcelas: number;  // Corregido (antes ID_Paecelas)
  Tipo: 'Gasto' | 'Ingreso';
  Cantidad: number;     // Número de cuotas
  Monto: number;        // Valor por cuota
  Responsable: string;  // Quién paga o recibe
  Nota: string;
  Fecha: string;        // Fecha de inicio
}

// Interfaz auxiliar para cuando mezclamos Gastos y Cuotas en la lista del Home
export interface Transaccion extends Gasto {
  esParcela?: boolean;
  parcelaInfo?: string; // Ej: "1/10"
  NombreCategoria?: string; // Para mostrar el nombre en vez del ID
  IconoCategoria?: string;
  ColorCategoria?: string;
}