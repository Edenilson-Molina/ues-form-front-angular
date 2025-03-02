export interface Colors {
  [key: string]: string;
}

export interface ColorPalette {
  primary: Colors;
  secondary: Colors;
  success: Colors;
  info: Colors;
  warning: Colors;
  danger: Colors;
}

export interface ColorPaletteTab {
  icon: string;
  label: string;
  colorPallete: Record<number, string>;
}

export interface SelectedColorPalette {
  primary: Record<number, string>;
  secondary: Record<number, string>;
  success: Record<number, string>;
  info: Record<number, string>;
  warning: Record<number, string>;
  danger: Record<number, string>;
}
