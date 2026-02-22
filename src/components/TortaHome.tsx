import { useState, useEffect } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import SimpleBarChart from './Barra_home'; // Asegúrate de que el archivo exista
import { Routes } from '../Routes/Routes';
import * as Io5 from 'react-icons/io5'; 

import '../assets/css/TortaHome.css';
import '../assets/css/tipografia.css';

const botones = [
 { name: 'Balance'},
 { name: 'Capital'},
 { name: 'Grafico'},
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) return null;
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.45; 
  const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text 
      x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" 
      fontSize="16" fontWeight="bold" style={{ pointerEvents: 'none' } } 
      className='tipografia-titulo'
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

// ... (mismos imports anteriores)

export default function MyTortaHom({ isAnimationActive = true, mes, anio }: { isAnimationActive?: boolean, mes: string, anio: string }) {
  const [button, setButton] = useState('Balance');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [datosGrafico, setDatosGrafico] = useState<any[]>([]);

  useEffect(() => {
    if (button === 'Grafico') return;
    setDatosGrafico([]); 
    const cacheBuster = `&t=${new Date().getTime()}`;
    fetch(`${Routes.Cambios}?tipo=${button}&mes=${mes}&anio=${anio}${cacheBuster}`)
      .then(res => res.json())
      .then(data => setDatosGrafico(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando datos:", err));
  }, [button, mes, anio]);

  const renderIcon = (iconName: string) => {
    const IconComponent = (Io5 as any)[iconName];
    return IconComponent ? <IconComponent size={24} /> : <Io5.IoCashOutline size={24} />;
  };

  return (
    <div className='container-mayor-torta'>
      <div className='container-mayor-boton'>
    <div className='container-boton'>
        {botones.map(({ name }) => (
            <button 
                key={name} 
                // Añadimos 'tipografia-titulo' para mantener tu fuente
                className={`btn-balance tipografia-titulo ${button === name ? 'activee' : ''}`}
                onClick={() => {
                    setButton(name);
                    setHasAnimated(true); 
                }}
            >
                {name}
            </button> 
        ))}
    </div>
</div>

      {/* AÑADIMOS CLASE DINÁMICA AQUÍ */}
      <div className={`container-Torta ${button === 'Grafico' ? 'modo-full' : ''}`}>   
        {button === 'Grafico' ? (
          <div className="BarChart-wrapper">
             <SimpleBarChart mes={mes} anio={anio} />
          </div>
        ) : (
          <>
            <div className="Torta-wrapper">
              <PieChart className='Torta' style={{ width: '100%', aspectRatio: 1, height: '203px' }}>
                <Pie
                  data={datosGrafico}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  dataKey="value"
                  outerRadius="100%"
                  isAnimationActive={hasAnimated ? false : isAnimationActive}
                >
                  {datosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            <nav className="Categorias_torta Menu_nav navigation">
              <ul className="Categorias-container">
                {datosGrafico.map((item, index) => (
                  <li key={index} className="sub-categoria">
                    <button className="de-categoria" style={{ backgroundColor: '#3e5871' }}>
                      <div className="icon tipografia-titulo">
                        {renderIcon(item.icon)}
                        <p style={{ color: "white"}} >{item.name}</p> 
                      </div>
                      <p className="gastado tipografia-datos" style={{ color: item.color, fontSize: 20, fontWeight: 'bold' }}>
                        R${typeof item.value === 'number' ? item.value.toFixed(2) : '0.00'}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}