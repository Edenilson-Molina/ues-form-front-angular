import { toast } from 'ngx-sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'description';

type ToastConfig = {
type: ToastType;
summary: string;
message: string;
description?: string;
};

export const sendNotification = (toastConfig: ToastConfig) => {
  switch (toastConfig.type) {
    case 'success':
      return toast.success(toastConfig.message);
    case 'error':
      return toast.error(toastConfig.message);
    case 'warning':
      return toast.warning(toastConfig.message);
    case 'info':
      return toast.info(toastConfig.message);
    case 'description':
      return toast.message(toastConfig.message, {
        description: toastConfig.description,
      });
    default:
      return toast.message(toastConfig.message);
  }
}
