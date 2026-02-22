import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/mas_capital.css';
import { Routes } from '../Routes/Routes';

export default function FormularioCapital() {
  const [listaCapital, setListaCapital] = useState<any[]>([]);
  const [periodo, setPeriodo] = useState({ mes: "02", anio: "2026" });
  
  const [formData, setFormData] = useState({
    procedencia: '',
    cantidad: '',
    socio: 'Ambos',
    fecha: new Date().toISOString().split('T')[0]
  });

  // 1. Cargar Historial de Ingresos
  const cargarHistorial = useCallback(async () => {
    try {
      const url = `${Routes.ingresos_lista}?mes=${periodo.mes}&anio=${periodo.anio}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setListaCapital(data);
      }
    } catch (err) {
      console.error("Error cargando ingresos:", err);
    }
  }, [periodo]);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  // 2. Manejador de Guardado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Routes.Ingresos}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ ...formData, procedencia: '', cantidad: '' });
        
        // Refrescar si el ingreso es del periodo actual
        const [anioI, mesI] = formData.fecha.split('-');
        if (mesI === periodo.mes && anioI === periodo.anio) {
          cargarHistorial();
        } else {
          setPeriodo({ mes: mesI, anio: anioI });
        }
        alert("✅ Ingreso guardado con éxito");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error de conexión");
    }
  };

  const listaMeses = [
    { mes: "12", anio: "2025", label: "Diciembre 2025" },
    { mes: "01", anio: "2026", label: "Enero 2026" },
    { mes: "02", anio: "2026", label: "Febrero 2026" },
  ];

  return (
    <div className="layout-capital-grid" style={{ gridTemplateRows: 'auto' }}>
      <div className="container-formulario area-formulario">
        <h3 className="tipografia-titulo" style={{ textAlign: 'center', margin: '15px 0' }}>Nuevo Ingreso</h3>
        
        <form onSubmit={handleSubmit} className="form-capital">
          <div className="input-group floating">
            <input 
              type="text" 
              id="procedencia"
              value={formData.procedencia}
              onChange={(e) => setFormData({...formData, procedencia: e.target.value})}
              required
              placeholder=" "
            />
            <label htmlFor="procedencia" className="tipografia-datos floating-label">Procedencia</label>
          </div>

          <div className="input-group floating">
            <input 
              type="number" 
              step="0.01"
              id="cantidad"
              value={formData.cantidad}
              onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
              required
              placeholder=" "
            />
            <label htmlFor="cantidad" className="tipografia-datos floating-label">Cantidad (R$)</label>
          </div>

          <div className="input-group">
            <label className="tipografia-datos">Aportado por</label>
            <div className="radio-group">
              {['Ambos', 'Héctor', 'Oscar'].map((opcion) => (
                <label key={opcion} className={`radio-label ${formData.socio === opcion ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    value={opcion}
                    checked={formData.socio === opcion}
                    onChange={(e) => setFormData({...formData, socio: e.target.value})}
                  />
                  {opcion}
                </label>
              ))}
            </div>
          </div>

      

          <button type="submit" className="btn-guardar tipografia-titulo">
            Guardar Capital
          </button>
        </form>
      </div>

      <div className="container-lista-registros area-estadistica" style={{overflow: "hidden"}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 className="tipografia-titulo" style={{ margin: 0 }}>Historial</h3>
          <select 
            value={`${periodo.mes}-${periodo.anio}`}
            onChange={(e) => {
              const [m, a] = e.target.value.split('-');
              setPeriodo({ mes: m, anio: a });
            }}
            className="select-periodo-capital"
          >
            {listaMeses.map((m, i) => (
              <option key={i} value={`${m.mes}-${m.anio}`}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="scroll-lista" style={{ width: 'auto', height: "100%" }}>
          {listaCapital.length === 0 ? (
            <p className="no-datos tipografia-datos">No hay ingresos para este mes.</p>
          ) : (
            listaCapital.map((item, index) => (
              <div key={index} className="card-registro">
                <div className="info-registro">
                  <span className="procedencia-txt tipografia-titulo">{item.procedencia}</span>
                  <span className="socio-txt">{item.socio} • {item.fecha}</span>
                </div>
                <div className="monto-registro tipografia-datos">
                  + R${Number(item.cantidad).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}