import React, { useState, useEffect, useCallback } from 'react';
import * as Io from 'react-icons/io5';
import '../assets/css/FormularioParcelas.css';
import { Routes } from '../Routes/Routes';

interface Parcela {
  id: number;
  tipo: 'Gasto' | 'Ingreso';
  numParcelas: number;
  valor: number;
  nota: string;
  quien: string;
  fecha: string;
}

export default function FormularioParcelas() {
  const [tipoParcela, setTipoParcela] = useState<'Gasto' | 'Ingreso'>('Gasto');
  const [filtroVista, setFiltroVista] = useState<'Todos' | 'Gasto' | 'Ingreso'>('Todos');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [listaParcelas, setListaParcelas] = useState<Parcela[]>([]);

  const [formData, setFormData] = useState({
    numParcelas: '',
    valor: '',
    nota: '',
    responsableGasto: 'Ambos',
    pagadorIngreso: '',
  });

  const cargarParcelas = useCallback(async () => {
    try {
      const response = await fetch(`${Routes.Listar_Parcelas}`);
      if (response.ok) {
        const data = await response.json();
        setListaParcelas(data);
      }
    } catch (error) {
      console.error("Error al obtener parcelas:", error);
    }
  }, []);

  useEffect(() => {
    cargarParcelas();
  }, [cargarParcelas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevaParcela = {
      tipo: tipoParcela,
      numParcelas: formData.numParcelas,
      valor: formData.valor,
      nota: formData.nota,
      quien: tipoParcela === 'Gasto' ? formData.responsableGasto : formData.pagadorIngreso,
      fecha: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch(`${Routes.Ag_parcelas}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaParcela),
      });

      if (response.ok) {
        setFormData({ ...formData, numParcelas: '', valor: '', nota: '', pagadorIngreso: '' });
        cargarParcelas();
        alert("✅ Parcela registrada");
      }
    } catch (error) {
      alert("❌ Error de conexión");
    }
  };

  const parcelasFiltradas = listaParcelas.filter(p => {
    const coincideTipo = filtroVista === 'Todos' || p.tipo === filtroVista;
    const coincideBusqueda = 
      (p.nota || '').toLowerCase().includes(busqueda.toLowerCase()) || 
      (p.quien || '').toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  return (
    <div className="layout-parcelas-grid">
      
      {/* FORMULARIO */}
      <div className="container-formulario area-formulario">
        <h3 className="tipografia-titulo" style={{ textAlign: 'center', marginBottom: '15px' }}>Nueva Parcela</h3>

        <div className="tipo-selector-container">
          <button type="button" className={tipoParcela === 'Gasto' ? 'active gasto' : ''} onClick={() => setTipoParcela('Gasto')}>Gasto</button>
          <button type="button" className={tipoParcela === 'Ingreso' ? 'active ingreso' : ''} onClick={() => setTipoParcela('Ingreso')}>Ingreso</button>
        </div>

        <form onSubmit={handleSubmit} className="form-parcelas">
          <div className="row-inputs">
            <div className="input-group floating flex-1">
              <input type="number" placeholder=" " required value={formData.numParcelas} onChange={(e) => setFormData({...formData, numParcelas: e.target.value})} />
              <label className="floating-label">N° Parcelas</label>
            </div>
            <div className="input-group floating flex-1">
              <input type="number" step="0.01" placeholder=" " required value={formData.valor} onChange={(e) => setFormData({...formData, valor: e.target.value})} />
              <label className="floating-label">Valor Cuota</label>
            </div>
          </div>

          {tipoParcela === 'Gasto' ? (
            <div className="input-group">
              <label className="tipografia-datos">Responsable</label>
              <div className="radio-group">
                {['Ambos', 'Héctor', 'Oscar'].map((op) => (
                  <label key={op} className={`radio-label ${formData.responsableGasto === op ? 'active-gasto' : ''}`}>
                    <input type="radio" value={op} checked={formData.responsableGasto === op} onChange={(e) => setFormData({...formData, responsableGasto: e.target.value})} />
                    {op}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="input-group floating">
              <input type="text" placeholder=" " required value={formData.pagadorIngreso} onChange={(e) => setFormData({...formData, pagadorIngreso: e.target.value})} />
              <label className="floating-label">¿Quién paga?</label>
            </div>
          )}

          <div className="input-group floating">
            <textarea placeholder=" " value={formData.nota} onChange={(e) => setFormData({...formData, nota: e.target.value})} />
            <label className="floating-label">Nota / Descripción</label>
          </div>

          <button type="submit" className={`btn-guardar-parcela ${tipoParcela.toLowerCase()}`}>Registrar Parcela</button>
        </form>
      </div>

      {/* LISTADO */}
      <div className="container-lista-parcelas area-lista">
        <div className="header-lista">
          <div className="titulo-lupa">
            <h4 className="tipografia-titulo">Listado</h4>
            <button className="btn-lupa" onClick={() => setMostrarBusqueda(true)}><Io.IoSearchOutline size={20} /></button>
          </div>
          <div className="radio-group filtro-lista">
            {['Todos', 'Gasto', 'Ingreso'].map((f) => (
              <label key={f} className={`radio-label-mini ${filtroVista === f ? `active-${f.toLowerCase()}` : ''}`}>
                <input type="radio" name="filtro" onChange={() => setFiltroVista(f as any)} /> {f}
              </label>
            ))}
          </div>
        </div>

        <div className="tabla-parcelas">
          {parcelasFiltradas.length === 0 ? (
            <p className="no-datos">Sin parcelas.</p>
          ) : (
            parcelasFiltradas.map((p) => (
              <div key={p.id} className={`card-parcela ${p.tipo.toLowerCase()}`}>
                <div className="info">
                  <strong className="tipografia-titulo">{p.nota || 'Sin descripción'} </strong>
                  <span className="tipografia-datos"> {p.numParcelas}x de R${p.valor}</span>
                  <small style={{display: 'block', opacity: 0.6}}>{p.fecha}</small>
                </div>
                <div className="tag-responsable">{p.quien}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL BÚSQUEDA */}
      {mostrarBusqueda && (
        <div className="modal-overlay" onClick={() => setMostrarBusqueda(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="input-group floating">
               <input type="text" placeholder=" " className="search-input" autoFocus value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
               <label className="floating-label">Buscar nota o persona...</label>
            </div>
            <button className="btn-cerrar" onClick={() => setMostrarBusqueda(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}