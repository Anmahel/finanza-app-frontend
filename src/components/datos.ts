import * as Io from 'react-icons/io5'; // Importación masiva para limpiar el encabezado

// En tu HTML:
// <h2>Capital Disponible: R${resumen.capital_neto}</h2>

const Categorias = [
 { name: 'Uber', icon: Io.IoCarOutline, value: 120, color: "#e67e22" },  // Carrot Orange
 { name: 'Comida', icon: Io.IoPizzaOutline, value: 80, color: "#f1c40f" }, // Sun Flower
 { name: 'Mercado', icon: Io.IoCartOutline, value: 200, color: '#3498db' }, // Peter River Blue
 { name: 'Otros', icon: Io.IoWalletOutline, value: 150, color: '#9b59b6' }, // Amethyst Purple
 { name: 'Otros1', icon: Io.IoWalletOutline, value: 150, color: '#Fb59b6' }, // Amethyst Purple
 { name: 'Otros2', icon: Io.IoWalletOutline, value: 130, color: '#F1550F' }, // Amethyst Purple
 { name: 'Otros3', icon: Io.IoWalletOutline, value: 180, color: '#FF0F00' }, // Amethyst Purple
];
const COLORS = Categorias.map(cat => cat.color);

let costoTotal = 0;
Categorias.forEach(({ value }) => {
 costoTotal += value;
});
let capital = 3000.00;  // Valor fijo para capital

export { Categorias, COLORS, costoTotal ,capital};