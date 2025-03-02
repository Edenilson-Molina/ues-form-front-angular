// Este archivo contiene la paleta de colores de la aplicación
// Se ha utilizado en tailwind.config.js para configurar los colores de la aplicación
// Pero también se puede utilizar el hexadecimal en cualquier componente donde se necesite (ejemplo: archivo LoaderComponent.tsx)

import { type Colors } from '@interfaces/common/color-palette.interface';

export let primaryColors: Colors = {};
export let secondaryColors: Colors = {};
export let successColors: Colors = {};
export let infoColors: Colors = {};
export let warningColors: Colors = {};
export let dangerColors: Colors = {};

// Función para cambiar los colores que hacen referencia a este archivo
export const changeHookColors = (
  colors: {
    primary: Colors,
    secondary: Colors,
    success: Colors,
    info: Colors,
    warning: Colors,
    danger: Colors
  }
): void => {
  primaryColors = colors.primary;
  secondaryColors = colors.secondary;
  successColors = colors.success;
  infoColors = colors.info;
  warningColors = colors.warning;
  dangerColors = colors.danger;
}
