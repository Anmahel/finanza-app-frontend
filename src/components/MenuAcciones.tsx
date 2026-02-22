import React from 'react';
import { 
  IoClose, 
  IoCardOutline, 
  IoWalletOutline, 
  IoCalendarNumberOutline, 
  IoTrendingDownOutline ,
  IoCalendarOutline
} from 'react-icons/io5';
import '../assets/css/MenuAcciones.css';

interface MenuAccionesProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (ruta: string) => void;
}

export default function MenuAcciones({ isOpen, onClose, onNavigate }: MenuAccionesProps) {
  if (!isOpen) return null;

const acciones = [
  { 
    id: 'gasto', 
    label: 'Gasto Variable', 
    icon: <IoTrendingDownOutline />, 
    color: '#ff4757', 
    ruta: 'Gastos' // Exactamente como en tu active === 'Gastos'
  },
  { 
    id: 'gasto-fijo', 
    label: 'Gasto Fijo', 
    icon: <IoCalendarNumberOutline />, 
    color: '#57606f', 
    ruta: 'Configuración' // Te llevará a la sección de configuración
  },
  { 
    id: 'ingreso', 
    label: 'Ingreso Capital', 
    icon: <IoWalletOutline />, 
    color: '#2ed573', 
    ruta: 'Ingresos' // Exactamente como en tu active === 'Ingresos'
  },
  { 
    id: 'parcela', 
    label: 'Nueva Parcela', 
    icon: <IoCardOutline />, 
    color: '#3742fa', 
    ruta: 'Parcelas' // Exactamente como en tu active === 'Parcelas'
  },
  { 
    id: 'Parcelas_Activas', 
    label: 'Parcelas Activas', 
    icon: <IoCalendarOutline />, 
    color: '#fae637', 
    ruta: 'Listar_Parcelas_activas' // Exactamente como en tu active === 'Parcelas'
  },

];

  return (
    <div className="menu-acciones-overlay">
      <div className="menu-acciones-content">
        <button className="btn-cerrar-menu" onClick={onClose}>
          <IoClose size={35} />
        </button>
        
        <h2 className="tipografia-titulo">¿Qué deseas registrar?</h2>
        
        <div className="grid-acciones">
          {acciones.map((acc) => (
// Dentro del map de acciones en MenuAcciones.tsx
<button 
  key={acc.id} 
  className="btn-accion-item"
  onClick={() => { onNavigate(acc.ruta); onClose(); }}
>
  <div className="icon-box" style={{ backgroundColor: acc.color }}>
    {acc.icon}
  </div>
  <div className="text-box">
    <span className="label-principal">{acc.label}</span>
    <span className="label-sub">Registrar ahora</span>
  </div>
</button>
          ))}
        </div>
      </div>
    </div>
  );
}