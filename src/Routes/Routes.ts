// const number = [1 , 30]
// const IP_COMPU = `192.168.${number[0]}.${number[1]}`; // <--- Pon la IP real que te dio el ipconfig
// const Url = `http://${IP_COMPU}:5000`;
const Url ="https://anmahel.pythonanywhere.com";
export const Routes = {
    // esto es para ver home
    Balance: Url + '/api/balance',
    // para la torta
    Torta: Url + '/api/balance_detallado',
    Resumen_anual:Url + '/api/resumen_anual',
    TortaDetalle: Url+ "/api/detalle_grafico/",
    Cambios: Url + '/api/torta',
    BaseUrl: Url , // Asegúrate que esta sea tu IP/Puerto correcto
    Gastos: Url + "/api/gastos",
    Categorias: Url +"/api/categorias_lista",
    Ag_gastos:Url + "/api/gastos/agregar",

    // esto es para guardar
    Parcelas: Url + '/api/parcelas',

    // ingreso
    Ingresos: Url + '/api/ingresos/agregar',
    ingresos_lista: Url + '/api/ingresos/lista',
    
    // parcelas
    Ag_parcelas:Url + '/api/parcelas/agregar',
    Listar_Parcelas:Url + '/api/parcelas/lista',
    Listar_Parcelas_activas:Url + '/api/parcelas/activas',

// gastos fijos
    Ag_Servicios: Url + '/api/gastos_fijos/agregar', // Cambiado para coincidir con @app.route
    Listar_Servicios: Url + '/api/gastos_fijos',     // Cambiado para coincidir con @app.route
    Eli_Servicios: Url + '/api/gastos_fijos/eliminar/', // Sin el <int:id>, se concatena en el fetch

}