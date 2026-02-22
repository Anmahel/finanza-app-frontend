import React, { useState, useEffect, useCallback } from 'react';
import { IoTrashOutline, IoCalendarOutline, IoCashOutline, IoRefreshOutline } from 'react-icons/io5';
import { Routes } from '../Routes/Routes';
import '../assets/css/FormularioGastoFijo.css';
interface Servicio {
    ID_GastoFijo: number;
    Nombre: string;
    Monto: number;
    DiaCobro: number;
}

export default function GastosFijosManager() {
    const [formData, setFormData] = useState({
        nombre: '',
        monto: '',
        dia: '1'
    });
    const [servicios, setServicios] = useState<Servicio[]>([]);

    const cargarServicios = useCallback(async () => {
        try {
            const res = await fetch(`${Routes.Listar_Servicios}`);
            if (res.ok) {
                const data = await res.json();
                setServicios(data);
            }
        } catch (error) {
            console.error("Error al cargar:", error);
        }
    }, []);

    useEffect(() => { cargarServicios(); }, [cargarServicios]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${Routes.Ag_Servicios}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // MAPEAMOS EXACTAMENTE A LOS NOMBRES DE TU TABLA
                body: JSON.stringify({
                    Nombre: formData.nombre,
                    Monto: parseFloat(formData.monto),
                    DiaCobro: parseInt(formData.dia),
                    Categoria_ID: 1,
                    Activo: 1
                }),
            });

            if (res.ok) {
                setFormData({ nombre: '', monto: '', dia: '1' });
                cargarServicios();
            } else {
                alert("Error en el servidor. Revisa si el ID es autoincremental.");
            }
        } catch (error) {
            alert("Error de conexión");
        }
    };

const eliminarServicio = async (id: number) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    try {
        // Usamos la ruta Eli_Servicios que definimos arriba
        const res = await fetch(`${Routes.Eli_Servicios}${id}`, { 
            method: 'DELETE' 
        });
        
        if (res.ok) {
            cargarServicios();
        } else {
            alert("Error al eliminar del servidor");
        }
    } catch (error) {
        alert("Error de conexión");
    }
};

    return (
        <div className="manager-container fade-in">
            {/* Formulario */}
            <div className="container-formulario">
                <h3 className="tipografia-titulo">Nuevo Gasto Fijo</h3>
                <form onSubmit={handleSubmit} className="form-parcelas">
                    <div className="input-group floating">
                        <input type="text" value={formData.nombre} required placeholder=" " onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                        <label className="floating-label">Nombre del Servicio</label>
                    </div>
                    <div className="row-inputs">
                        <div className="input-group floating flex-1">
                            <input type="number" step="0.01" value={formData.monto} required placeholder=" " onChange={(e) => setFormData({...formData, monto: e.target.value})} />
                            <label className="floating-label">Monto (R$)</label>
                        </div>
                        <div className="input-group floating flex-1">
                            <input type="number" min="1" max="31" value={formData.dia} required placeholder=" " onChange={(e) => setFormData({...formData, dia: e.target.value})} />
                            <label className="floating-label">Día de Cobro</label>
                        </div>
                    </div>
                    <button type="submit" className="btn-guardar-parcela gasto">Guardar en Servicios</button>
                </form>
            </div>

            {/* Lista debajo del formulario */}
<div className="container-lista-registros area-estadistica" style={{ gridArea: "lis" }}>
        <div className="scroll-lista">
            {servicios.map((s) => (
              <div key={s.ID_GastoFijo} className="card-registro">
                <div className="info-registro">
                  <span className="procedencia-txt tipografia-titulo">{s.Nombre}</span>
                  <span className="socio-txt">R$ {Number(s.Monto).toFixed(2)} — Día {s.DiaCobro}</span>
                </div>
                <button 
                            onClick={() => eliminarServicio(s.ID_GastoFijo)}
                            style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer' }}
                        >
                            <IoTrashOutline size={20} />
                        </button>
              </div>
            ))}

      </div>
        </div>
        </div>
    );
}


