// Definir los colores default de la aplicación
import { indigo, teal, green, sky, yellow, red } from 'tailwindcss/colors';
import type { ColorPalette } from '@interfaces/common/color-palette.interface';

// Al inicio de la aplicación se guardan los colores en el local storage y se asignan a las variables de la aplicación
// Si se hace algún cambio en la sección de > Preferencias > Paleta de colores, se actualizarán los colores en el local storage
export const colorPaletteMap: ColorPalette = {
  primary: indigo,
  secondary: teal,
  success: green,
  info: sky,
  warning: yellow,
  danger: red,
}

// export const noEditableColors: boolean = false;

// Ejemplo de mapa usando colores hexadecimales (en caso de no usar tailwindcss)
// export const colorPaletteMap = {
//   primary: {
//     50: '#eef2ff',
//     100: '#e0e7ff',
//     200: '#c7d2fe',
//     300: '#a5b4fc',
//     400: '#818cf8',
//     500: '#6366f1',
//     600: '#4f46e5',
//     700: '#4338ca',
//     800: '#3730a3',
//     900: '#312e81',
//     950: '#1e1b4b',
//   },
//   secondary: teal,
//   success: green,
//   info: sky,
//   warning: yellow,
//   danger: red
// }
