import { useState } from 'react';
import { Aside } from './components/Aside';
import MyTortaHom from './components/TortaHome';
import FormularioGastos from './components/FormularioGastos';
import FormularioCapital from './components/FormularioCapital';

function App() {
  // El estado vive aquí ahora
  const [active, setActive] = useState('Inicio');

  return (
    <div className="app-layout">
      {/* Pasamos el estado y la función al menú */}
      <Aside active={active} setActive={setActive} />

      <main className="content-area">
        {/* Renderizado Condicional: Si 'active' es X, muestra el componente X */}
        
        {active === 'Inicio' && (
          <div className="fade-in">
            <MyTortaHom />
            {/* Aquí puedes poner tus otros gráficos */}
          </div>
        )}

        {active === 'Gastos' && (
          <div className="fade-in">
            <FormularioGastos />
          </div>
        )}

        {active === 'Ingresos' && (
          <div className="fade-in">
            <FormularioCapital />
          </div>
        )}

        {active === 'Configuración' && (
          <div className="fade-in">
            <h2 className="tipografia-titulo">Configuración de la cuenta</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;