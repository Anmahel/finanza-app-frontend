import React, { useState } from 'react';
import '../assets/css/aside.css';
import * as Io from 'react-icons/io5';
import MenuAcciones from './MenuAcciones';

const MENU_ITEMS = [
  { name: 'Inicio', icon: Io.IoHomeOutline },
  { name: 'Gastos', icon: Io.IoTrendingDownOutline },
  { name: 'Ingresos', icon: Io.IoTrendingUpOutline },
  { name: 'Parcelas', icon: Io.IoPieChartOutline },
  { name: 'Mas', icon: Io.IoAddCircleOutline }, // Usé AddCircle para que resalte un poco más en el menú
];

interface AsideProps {
  active: string;
  setActive: (name: string) => void;
}

export const Aside = ({ active, setActive }: AsideProps) => { 
  const [menuAbierto, setMenuAbierto] = useState(false);
  const themeColor = '#2ecc71';

  return (
    <>
      <aside className="aside-container flex flex-col items-center">
        <nav className="Menu_nav navigation">
          <ul className='Menu_iten' style={{ display: 'flex', alignItems: 'center' }}>
            {MENU_ITEMS.map(({ name, icon: Icon }) => (
              <li
                key={name}
                // Evitamos que "Mas" se quede marcado como "active" cuando lo tocamos
                className={active === name && name !== 'Mas' ? 'active' : ''}
                onClick={() => {
                  if (name === 'Mas') {
                    setMenuAbierto(true); // Si es Mas, abre el menú flotante
                  } else {
                    setActive(name); // Si es otro, cambia de pestaña
                  }
                }}
                style={{ '--clr': themeColor } as React.CSSProperties}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <p className="icon"><Icon size={name === 'Mas' ? 30 : 24} /></p>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* EL MENÚ SUPERPUESTO */}
      <MenuAcciones 
        isOpen={menuAbierto} 
        onClose={() => setMenuAbierto(false)} 
        onNavigate={(ruta) => {
          setActive(ruta); // Cambiamos de vista
          setMenuAbierto(false); // Cerramos el menú
        }} 
      />
    </>
  ); 
};