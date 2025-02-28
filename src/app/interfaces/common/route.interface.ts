export interface Route {
  name: string;
  path: string;
  icon: string;
  children?: Route[];
}

export interface CardMenu extends Route {
  description: string;
  color: string;
}
