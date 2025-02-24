export enum NotificationType {
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
  }
  
  export interface NotificationPayload {
    type: NotificationType; // Enum para restringir los tipos permitidos
    title: string;          // Título de la notificación
    description?: string;   // Descripción opcional de la notificación
  }