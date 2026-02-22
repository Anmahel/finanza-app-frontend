import { useState, useEffect } from 'react';
import MyTortaHom from './TortaHome';
import TarjetasResumen from './TarjetasResumen';
import '../assets/css/home.css';
import '../assets/css/tipografia.css';
import { Routes } from '../Routes/Routes';

interface ParcelaActiva {
  nombre: string;
  monto: number;
  tipo: 'Gasto' | 'Ingreso';
}

interface DataBalance {
  ingresos: number;
  ingresos_tendencia: number;
  gastos: number;
  gastos_tendencia: number;
  capital_neto: number;
  balance_tendencia: number;
  parcelas_activas: ParcelaActiva[];
}

export function Home() {
  const [data, setData] = useState<DataBalance>({ 
    ingresos: 0, 
    ingresos_tendencia: 0, 
    gastos: 0, 
    gastos_tendencia: 0, 
    capital_neto: 0,
    balance_tendencia: 0,
    parcelas_activas: [] 
  });

  const listaMeses = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + (i - 5));
    return {
      mes: (d.getMonth() + 1).toString().padStart(2, '0'),
      anio: d.getFullYear().toString(),
      label: d.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    };
  });

  const [periodo, setPeriodo] = useState({ 
    mes: listaMeses[5].mes, 
    anio: listaMeses[5].anio,
    label: listaMeses[5].label 
  });

  const formatoR$ = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  useEffect(() => {
    fetch(`${Routes.Balance}?mes=${periodo.mes}&anio=${periodo.anio}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error balance:", err));
  }, [periodo]);

  const porcentaje = data.ingresos > 0 ? Math.round((data.gastos / data.ingresos) * 100) : 0;

  // Filtrado y Cálculos de Totales por columna
  const servicios = data.parcelas_activas.filter(p => !p.nombre.includes('/'));
  const parcelas = data.parcelas_activas.filter(p => p.nombre.includes('/'));

  const totalServicios = servicios.reduce((acc, p) => acc + p.monto, 0);
  const totalParcelas = parcelas.reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="fade-in">
      <header className="header">
        <div className="contenedor-titulo-selector" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' ,height: "50px", padding: 10 }}>
          <select 
            className="selector-mes tipografia-titulo" 
            value={`${periodo.mes}-${periodo.anio}`}
            onChange={(e) => {
              const [m, a] = e.target.value.split('-');
              const infoMes = listaMeses.find(item => item.mes === m && item.anio === a);
              setPeriodo({ mes: m, anio: a, label: infoMes?.label || '' });
            }}
            style={{ background: 'transparent', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color:"white" }}
          >
            {listaMeses.map((m, i) => (
              <option key={i} value={`${m.mes}-${m.anio}`} style={{ background: '#2c3e50' }}>
                {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </header>

      <TarjetasResumen datos={{ ...data, porcentaje_gastado: porcentaje }} />

      <div style={{ marginTop: '20px', padding: '0 10px' }}>
        <div className="contenedor-dinamico">
          {data.ingresos > 0 ? (
            <div className="seccion-torta fade-in">
                <MyTortaHom mes={periodo.mes} anio={periodo.anio} />
            </div>
          ) : (
            <div className="planificador-vacio fade-in">
              
              <div className="grid-compromisos">
                {/* COLUMNA SERVICIOS */}
                <div className="columna-compromisos" style={{overflow: "hidden"}}>
                  <h3 className="subtitulo-columna">
                    Servicios <span className="material-icons">{formatoR$(totalServicios)}</span>  
                  </h3>
                  <div className="scroll-lista" style={{overflowY: "scroll"}}>
                    {servicios.map((p, i) => (
                      <div key={i} className="item-prediccion mini">
                        <span>{p.nombre}</span>
                        <span className="monto-prediccion">{formatoR$(p.monto)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMNA PARCELAS */}
                <div className="columna-compromisos">
                  <h3 className="subtitulo-columna">
                    Parcelas <span className="material-icons">{formatoR$(totalParcelas)}</span> 
                  </h3>
                  <div className="scroll-lista">
                    {parcelas.map((p, i) => (
                      <div key={i} className="item-prediccion mini">
                        <span>{p.nombre}</span>
                        <span className="monto-prediccion">{formatoR$(p.monto)}</span>
                      </div>
                    ))}
                  </div>
                 
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}