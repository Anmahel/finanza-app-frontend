import { useState } from 'react';
import { Aside } from './components/Aside';
import { Home } from './components/Home';
// import MyTortaHom from './components/TortaHome';
import FormularioCapital from './components/FormularioCapital';
import FormularioGastos from './components/FormularioGastos';
import FormularioParcelas from './components/FormularioParcelas';
// En la parte de arriba de tu App.tsx
import FormularioGastoFijo from './components/FormularioGastoFijo'; // Si hiciste el formulario aparte
// import TarjetasResumen from './components/TarjetasResumen';
 

function App() {
  const [active, setActive] = useState('Inicio');
  return (
    <div className="flex" style={{
          height: '100%',
          background: '#fff',
          flexDirection: 'column',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          overflow: 'hidden',
    }}>
      <main className="main">
        {/* la capital y gastos del mes  */}
     {/* el gráfico de torta */}
             {active === 'Inicio' && (
               <div className="fade-in">
                 <Home />
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
                <FormularioGastoFijo /> {/* Para agregar nuevos */}
              </div>
             )}
              {active === 'Parcelas' && (
                <div className="fade-in">
                 <FormularioParcelas />
               </div>
             )}

             {active === 'Tarjetas' && (
                <div className="fade-in">
                 {/* <TarjetasResumen /> */}
               </div>
             )} 
        <Aside active={active} setActive={setActive} />

      </main>

    </div>
  );
}

export default App;