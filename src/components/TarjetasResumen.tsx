import { 
  IoArrowUpCircle, IoArrowDownCircle, IoWallet, IoTrendingUp, 
  IoCaretUp, IoCaretDown 
} from 'react-icons/io5';
import '../assets/css/TarjetasResumen.css';

interface ResumenProps {
  datos: {
    ingresos: number;           // Cambiado para coincidir con el JSON del server
    ingresos_tendencia: number; // Nuevo
    gastos: number;             // Cambiado
    gastos_tendencia: number;   // Nuevo
    capital_neto: number;       // Cambiado
    balance_tendencia: number;  // Nuevo
    porcentaje_gastado: number;
  };
}

export default function TarjetasResumen({ datos }: ResumenProps) {
  const formatoR$ = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  // Componente interno para la etiqueta de tendencia
const TrendTag = ({ valor, inverso = false }: { valor: number, inverso?: boolean }) => {
    const esSubida = valor > 0;
    const esCero = valor === 0;
    
    if (esCero) {
        return <div className="trend-tag" style={{ color: '#94a3b8' }}><span>0%</span></div>;
    }
    // Para gastos, una subida es "mala" (rojo), para ingresos es "buena" (verde)
    const color = (esSubida && !inverso) || (!esSubida && inverso) ? '#2ed573' : '#ff4757';
    
    return (
      <div className="trend-tag" style={{ color }}>
        {esSubida ? <IoCaretUp /> : <IoCaretDown />}
        <span>{Math.abs(valor)}%</span>
      </div>
    );
  };

  return (
    <div className="resumen-container">
      {/* Tarjeta de Ingresos */}
      <div className="card-resumen ingreso">
        <div className="card-icon">
          <IoArrowUpCircle size={32} />
        </div>
        <div className="card-info">
          <div className="label-container">
            <span className="label">Ingresos</span>
            <TrendTag valor={datos.ingresos_tendencia} />
          </div>
          <h2 className="monto">{formatoR$(datos.ingresos)}</h2>
        </div>
      </div>

      {/* Tarjeta de Gastos */}
      <div className="card-resumen gasto">
        <div className="card-icon">
          <IoArrowDownCircle size={32} />
        </div>
        <div className="card-info">
          <div className="label-container">
            <span className="label">Gastos</span>
            {/* inverso={true} porque si el gasto sube, es alerta roja */}
            <TrendTag valor={datos.gastos_tendencia} inverso={true} />
          </div>
          <h2 className="monto">{formatoR$(datos.gastos)}</h2>
        </div>
      </div>

      {/* Tarjeta de Balance Neto */}
      <div className="card-resumen balance">
        <div className="card-icon">
          <IoWallet size={32} />
        </div>
        <div className="card-info">
          <div className="label-container">
            <span className="label">Balance Neto</span>
            <TrendTag valor={datos.balance_tendencia} />
          </div>
          <h2 className={`monto ${datos.capital_neto >= 0 ? 'positivo' : 'negativo'}`}>
            {formatoR$(datos.capital_neto)}
          </h2>
        </div>
      </div>

      {/* Tarjeta de Salud Financiera */}
      <div className="card-resumen salud">
        <div className="card-icon">
          <IoTrendingUp size={32} />
        </div>
        <div className="card-info">
          <span className="label">Uso del Capital</span>
          <h2 className="monto">{datos.porcentaje_gastado}%</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(datos.porcentaje_gastado, 100)}%`,
                backgroundColor: datos.porcentaje_gastado > 90 ? '#ff4757' : '#2ed573'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}