import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/FormularioGastos.css';
import { Routes } from '../Routes/Routes';

export default function FormularioGastos() {
  // --- ESTADOS ---
  const [gastos, setGastos] = useState<any[]>([]);
  const [categoriasDB, setCategoriasDB] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState({ mes: "02", anio: "2026" });

  const [formData, setFormData] = useState({
    quienGasto: 'Ambos',
    categoria: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    nota: ''
  });

  // --- FUNCIONES DE CARGA (BACKEND) ---

  // 1. Cargar Historial (Ruta GET separada)
  const cargarHistorial = useCallback(async () => {
    try {
      // Usamos la nueva ruta /api/gastos/lista
      const url = `${Routes.BaseUrl}/api/gastos/lista?mes=${periodo.mes}&anio=${periodo.anio}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setGastos(data);
      }
    } catch (err) {
      console.error("Error cargando historial:", err);
    }
  }, [periodo]);

  // 2. Cargar Categorías
  useEffect(() => {
    fetch(`${Routes.Categorias}`)
      .then(res => res.json())
      .then(data => setCategoriasDB(data))
      .catch(err => {
        console.error("Error:", err);
        setCategoriasDB(["Uber trabajo", "Mercado", "Salud", "Casa", "Otros"]);
      });
  }, []);

  // 3. Efecto para recargar cuando cambie el selector de mes/año
  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  // --- MANEJADORES ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Usamos la nueva ruta /api/gastos/agregar
      const response = await fetch(`${Routes.Ag_gastos}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Limpiamos campos manteniendo responsable y fecha
        setFormData({ ...formData, categoria: '', monto: '', nota: '' });
        
        // Verificamos si el gasto guardado pertenece al mes que estamos viendo para refrescar
        const [anioG, mesG] = formData.fecha.split('-');
        if (mesG === periodo.mes && anioG === periodo.anio) {
          cargarHistorial(); 
        } else {
          setPeriodo({ mes: mesG, anio: anioG });
        }
        
        alert("✅ Gasto registrado con éxito");
      } else {
        const errorData = await response.json();
        alert("❌ Error: " + (errorData.error || "No se pudo guardar"));
      }
    } catch (error) {
      console.error("Error en conexión:", error);
      alert("❌ Error de conexión con el servidor. ¿Está Flask encendido?");
    }
  };

  const listaMeses = [
    { mes: "12", anio: "2025", label: "Diciembre 2025" },
    { mes: "01", anio: "2026", label: "Enero 2026" },
    { mes: "02", anio: "2026", label: "Febrero 2026" },
    { mes: "03", anio: "2026", label: "Marzo 2026" },
  ];

  return (
    <div className="layout-gastos-grid">
      
      {/* SECCIÓN FORMULARIO */}
      <div className="container-formulario-gastos area-formulario">
        <h3 className="tipografia-titulo" style={{ textAlign: 'center', margin: '0px' }}>Nuevo Gasto</h3>
        
        <form onSubmit={handleSubmit} className="form-gastos">
          <div className="input-group">
            <label className="tipografia-datos">Responsable</label>
            <div className="radio-group">
              {['Ambos', 'Héctor', 'Oscar'].map((op) => (
                <label key={op} className={`radio-label ${formData.quienGasto === op ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    value={op} 
                    checked={formData.quienGasto === op}
                    onChange={(e) => setFormData({...formData, quienGasto: e.target.value})} 
                  />
                  {op}
                </label>
              ))}
            </div>
          </div>

          <div className="row-inputs">
            <div className="input-group flex-2"  style={{height: "-webkit-fill-available"}}>
              <label className="tipografia-datos">Categoría *</label>
              <select 
              className='categotiass'
                required
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              >
                <option value="" disabled>Seleccionar...</option>
                {categoriasDB.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="input-group flex-1">
              <label className="tipografia-datos">Monto *</label>
              <input 
              style={{maxWidth: "130px"}}
                className='monto'
                type="number" 
                step="0.01" 
                required 
                placeholder="0.00"
                value={formData.monto} 
                onChange={(e) => setFormData({...formData, monto: e.target.value})} 
              />
            </div>
          </div>

        

          <div className="input-group">
            <label className="tipografia-datos">Nota</label>
            <textarea 
              placeholder="¿Qué se pagó?"
              value={formData.nota}
              onChange={(e) => setFormData({...formData, nota: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-guardar-gasto tipografia-titulo">
            Registrar Gasto
          </button>
        </form>
      </div>

      {/* SECCIÓN HISTORIAL */}
      <div className="container-lista-gastos area-gasto">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '1px' }}>
          <h4 className="tipografia-titulo" style={{ margin: 0 }}>Historial</h4>
          
          <select 
            className="tipografia-datos"
            value={`${periodo.mes}-${periodo.anio}`}
            onChange={(e) => {
              const [m, a] = e.target.value.split('-');
              setPeriodo({ mes: m, anio: a });
            }}
            style={{ width: 'auto', padding: '5px', backgroundColor: '#3e5871', borderRadius: '8px', color: 'white' }}
          >
            {listaMeses.map((m, i) => (
              <option key={i} value={`${m.mes}-${m.anio}`}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="tabla-gastos">
          {gastos.length === 0 ? (
            <p className="no-datos" style={{ textAlign: 'center', marginTop: '30px', opacity: 0.6 }}>
                No hay registros para este mes.
            </p>
          ) : (
            gastos.map((g, i) => (
              <div key={i} className="item-gasto">
                <div className="gasto-info">
                  <span className="gasto-cat tipografia-titulo" style={{ color:  '#fff' }}>
                    {g.categoria}
                  </span>
                  <span className="gasto-nota">{g.nota || 'Sin nota'}</span>
                  <small style={{ color: '#bdc3c7' }}>
                    {g.fecha} • {g.quienGasto}
                  </small>
                </div>
                <div className="gasto-monto tipografia-datos">
                    R${Number(g.monto).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}