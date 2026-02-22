import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'; 
import { Routes } from '../Routes/Routes'; 
import '../assets/css/TortaHome.css';
import '../assets/css/tipografia.css';

interface Props {
  mes: string;
  anio: string;
}

const SimpleBarChart = ({ mes, anio }: Props) => {
  const [mesesData, setMesesData] = useState<any[]>([]);

  useEffect(() => {
    const url = `${Routes.Resumen_anual}?anio=${anio}&mes=${mes}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => setMesesData(data))
      .catch(err => console.error("Error en barras:", err));
  }, [anio, mes]);

  const mesesVisibles = mesesData.slice(-6);

  const maxValor = mesesVisibles.length > 0 
    ? Math.max(...mesesVisibles.flatMap(m => [m.Gastos, m.Capital])) 
    : 1000;
  
  const superiorLimit = Math.ceil(maxValor / 500) * 500 + 500;

  const ticksY = [];
  for (let i = 0; i <= superiorLimit; i += 500) {
    ticksY.push(i);
  }

  // Función para que los números grandes no ocupen tanto espacio (Ej: 1500 a 1.5k)
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(1)}k`;
    return tickItem.toString();
  };

  return (
    <div className='bara' style={{ width: '100%', height: '400px', backgroundColor: 'transparent', paddingBottom: '20px' }}> 
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
            key={`${mes}-${anio}`} 
            data={mesesVisibles}
            // Ajustamos left a -10 para ganar espacio sin sacar los números de la pantalla
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }} 
            barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#fff', fontSize: 12 }}
            dy={5}
          />
          
          <YAxis 
            domain={[0, superiorLimit]} 
            ticks={ticksY} 
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a4b0be', fontSize: 11 }}
            // Aumentamos width a 50 para que el "1.5k" o "500" quepa bien
            width={50} 
          />

          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)', stroke: 'none' }}
            contentStyle={{ backgroundColor: '#2c3e50', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ fontSize: '12px' }}
          />
          
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            height={40}
            wrapperStyle={{ paddingTop: '0px', paddingRight: '10px' }}
          />

          <Bar 
            dataKey="Gastos" 
            name="Gastos"
            fill="#ff4757" 
            radius={[4, 4, 0, 0]} 
            barSize={20} // Un poco más gruesas para que se vean mejor
          />

          <Bar 
            dataKey="Capital" 
            name="Ingresos"
            fill="#2ed573" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;