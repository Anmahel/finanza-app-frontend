import { useState,useEffect} from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import SimpleBarChart from './Barra_home';
import { Routes } from '../Routes/Routes';
import * as Io5 from 'react-icons/io5'; // Importamos todos los iconos de IO5

import '../assets/css/TortaHome.css';
import '../assets/css/tipografia.css';


const botones = [
 { name: 'Balance'},
 { name: 'Capital'}
];
// #endregion
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) return null;

  // AJUSTE: Bajamos de 0.5 a 0.45 para alejar el texto del borde exterior
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.45; 
  
  const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="black" 
      textAnchor="middle" // "middle" es mejor que start/end para centrar en tajadas pequeñas
      dominantBaseline="central" 
      fontSize="16" 
      fontWeight="bold"
      style={{ pointerEvents: 'none' } } 
      className='tipografia-titulo'
          >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};




// ... (imports y renderCustomizedLabel se mantienen igual)

export default function MyTortaHom({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  const [button, setButton] = useState('Balance');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [datosGrafico, setDatosGrafico] = useState<any[]>([]);

  useEffect(() => {
    fetch(Routes.Torta)
      .then(res => res.json())
      .then(data => {
        // Asegúrate de que data sea un array
        setDatosGrafico(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  const renderIcon = (iconName: string) => {
    const IconComponent = (Io5 as any)[iconName];
    return IconComponent ? <IconComponent size={24}/> : <Io5.IoHelpOutline size={24} />;
  };

  return (
    <div className='container-mayor-torta'>
      <div className='container-mayor-boton'>
        <div className='container-boton'>
          {botones.map(({ name }) => (
            <button 
              key={name} 
              className={button === name ? 'activee btn-balance tipografia-titulo' : 'btn-balance tipografia-titulo'}
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

      <div className='container-Torta'>   
        <div className="Torta-wrapper">
          <PieChart 
            className='Torta' 
            style={{ width: '100%', aspectRatio: 1, outline: 'none', height: '203px' }}
          >
            <Pie
              data={datosGrafico}
              labelLine={false}
              label={renderCustomizedLabel}
              dataKey="value"
              outerRadius="100%"
              innerRadius="0%"
              isAnimationActive={hasAnimated ? false : isAnimationActive}
              activeShape={false}
            >
              {datosGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
        
        <SimpleBarChart />

        <nav className="Categorias_torta Menu_nav navigation">
          <ul className="Categorias-container">
            {/* CORRECCIÓN AQUÍ: Quitamos ({cat}) y usamos (item) o desestructuramos bien */}
            {datosGrafico.map((item, index) => (
              <li key={index} className="sub-categoria">
                <button className="de-categoria" style={{ backgroundColor: '#3e5871' }}>
                  <p className="icon tipografia-titulo">
                    {renderIcon(item.icon)}
                    <p style={{ color: item.color }}>{item.name}</p>
                  </p>
                  <p className="gastado tipografia-datos">
                    R${typeof item.value === 'number' ? item.value.toFixed(2) : '0.00'}
                  </p>
                </button>

     
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}