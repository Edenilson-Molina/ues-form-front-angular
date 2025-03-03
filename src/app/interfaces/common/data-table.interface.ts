export interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  style?: Record<string, string>;
  class?: string;
  headerStyle?: Record<string, string>;
  headerClass?: string;
  align?: string;
}
