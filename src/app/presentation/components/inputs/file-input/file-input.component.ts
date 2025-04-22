import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { toast } from 'ngx-sonner';

import { PrimeNG } from 'primeng/config';
import { FileUploadModule, type FileSelectEvent } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { FluidModule } from 'primeng/fluid';

import { ButtonComponent } from '@components/button/button.component';
import { InputErrorsComponent } from '@components/inputs/input-errors/input-errors.component';

import { FileType, fileTypeMap } from '@interfaces/common/file-input.interface';

@Component({
  template: '<span class="material-symbols-outlined !text-[18px]">{{ icon }}</span>',
})
class IconComponent {
  @Input() icon: string = '';
}

@Component({
  selector: 'c-file-input',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    ImageModule,
    ProgressBarModule,
    FluidModule,
    ButtonComponent,
    InputErrorsComponent,
  ],
  templateUrl: './file-input.component.html',
  styles: `
    :host ::ng-deep .p-message {
      display: none;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'containerClass',
    '[style]': 'containerStyle',
  },
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0, transform: 'translateY(-5px)' })),
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(5px)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class FileInputComponent implements ControlValueAccessor, OnInit {
  value: File | File[] | null = null;
  filesList: File[] = []; // Almacena el archivo seleccionado
  singleFile: File | null = null; // Almacena un solo archivo seleccionado
  messageIdCounter = 0; // Contador para los mensajes temporales
  errorTimeout: ReturnType<typeof setTimeout> | null = null; // Tiempo de espera para eliminar el error
  totalPercentage: number = 0; // Porcentaje de carga del archivo
  messages: { id: number; text: string }[] = [];
  filePreviews = new Map<File, string>(); // Almacena las URL de los archivos
  onChange: (files: File | File[] | null) => void = () => {};
  onTouched: () => void = () => {};

  config = inject(PrimeNG); // Configuración de PrimeNG
  cdr = inject(ChangeDetectorRef); // Referencia al ChangeDetectorRef

  // Input properties
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() labelClass: string = '';
  @Input() containerClass: string = '';
  @Input() containerStyle?: Record<string, string>;
  @Input() inputClass?: string;
  @Input() inputStyle?: Record<string, string>;
  @Input() multiple: boolean = false; // Allow multiple file selection
  @Input() showGallery: boolean = false; // Show gallery of selected files
  @Input() fileLimit: number = 5; // Number of files allowed
  @Input() maxFileSize: number = 5 * 1024 * 1024; // Limit size for each file, by default its 5 MB
  @Input() allowedFileTypes: FileType[] = [
    FileType.MP3,
    FileType.WAV,
    FileType.GIF,
    FileType.JPG,
    FileType.PNG,
    FileType.SVG,
    FileType.MP4,
    FileType.PDF,
  ];
  @Input() imagePreview: boolean = false;
  @Input() disabled: boolean = false;
  @Input() iconFileSize: string = 'file_open';
  @Input() iconFileNumber: string = 'files';
  @Input() iconFileUpload: string = 'upload';
  @Input() iconAddFile: string = 'attachment';
  @Input() title: string = 'Carga de archivos';
  @Input() emptyMessage: string = '';
  @Input() errorMessageClass: string = '';

  @Input() formControl!: FormControl;

  required = input(false, {
    transform: (files: boolean | string) =>
      typeof files === 'string' ? files === '' : files,
  });

  get hasErrors() {
    return (
      this.formControl?.invalid &&
      (this.formControl?.dirty || this.formControl?.touched)
    );
  }

  ngOnInit(): void {
    if (!this.emptyMessage) {
      this.emptyMessage =
        this.multiple
          ? `Seleccione o arrastre un máximo de ${this.fileLimit} archivos con un peso máximo de ${this.formatSize(this.maxFileSize)}`
          : `Seleccione un archivo de su dispositivo con un peso máximo de ${this.formatSize(this.maxFileSize)}`;
    }
  }

  public writeValue(files: File | File[] | null): void {
    if(this.isArray(files)){
      this.filesList = files as File[]; // Almacena el archivo seleccionado
    } else {
      this.filesList = []; // Almacena el archivo seleccionado
      this.singleFile = files as File; // Almacena un solo archivo seleccionado
    }
    this.value = files;
  }

  public registerOnChange(fn: (files: File | File[] | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onInputBlur(): void {
    this.onTouched();
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  onSelectedFiles = (event: FileSelectEvent): void => {
    const newFiles: File[] = [];
    const newMessages: string[] = [];
    let limitReached = false; // Flag para evitar mensajes repetidos

    for (const file of event.files) {
      if (this.filesList.length + newFiles.length >= this.fileLimit) {
        if (!limitReached) {
          newMessages.push(
            `El maximo de archivos permitidos es ${this.fileLimit}`
          );
          limitReached = true; // Evita agregar el mensaje múltiples veces
        }
        break; // Detiene el bucle cuando se alcanza el límite
      }

      const validType = this.allowedFileTypes.some(type => {
        if (type.includes('/*')) {
          // Aceptar tipo general: ej. "image/*"
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType + '/');
        } else {
          // Validación exacta
          return this.allowedFileTypes.includes(file.type as FileType);
        }
      });
      if (!validType) {
        newMessages.push(
          `El archivo ${file.name} no es un tipo de archivo permitido.`
        );
        continue; // Salta este archivo, pero sigue con los demás
      }

      if (this.maxFileSize && file.size > this.maxFileSize) {
        newMessages.push(`El archivo ${file.name} excede el tamaño permitido`);
        continue; // Salta este archivo, pero sigue con los demás
      }

      if (
        this.filesList.some(
          (existingFile: File) => existingFile.name === file.name
        ) ||
        newFiles.some((existingFile: File) => existingFile.name === file.name)
      ) {
        newMessages.push(`El archivo ${file.name} ya ha sido seleccionado`);
        continue;
      }

      newFiles.push(file);
    }

    // Agregar archivos
    this.filesList = [...this.filesList, ...newFiles];
    this.totalPercentage = (this.filesList.length / this.fileLimit) * 100; // Actualiza el porcentaje de carga
    this.onChange(this.filesList); // Actualiza el valor del archivo

    // Agregar mensajes
    if (newMessages.length > 0) {
      for (const message of newMessages) {
        this.addTimedMessage(message);
      }
    }
  };

  formatSize = (size: number): string => {
    const k = 1024;
    const dm = 2;
    const sizes = this.config.translation.fileSizeTypes;
    if (size === 0) {
        return `0 ${sizes![0]}`;
    }

    const i = Math.floor(Math.log(size) / Math.log(k));
    const formattedSize = size / Math.pow(k, i);

    return `${formattedSize.toFixed(dm)} ${sizes![i]}`;
  };

  onRemoveTemplatingFile = (index: number, removeCb: () => {}) => {
    const fileToRemove = this.filesList[index];
    // Solo revocar si era una imagen
    if (fileToRemove.type.startsWith('image/')) {
      this.revokeFilePreview(fileToRemove);
    }
    this.filesList.splice(index, 1);
    toast.info('Archivo removido', {
      description: `El archivo ${fileToRemove.name} ha sido removido`,
      duration: 4000,
      icon: IconComponent,
      componentProps: {
        icon: 'file_copy_off',
      },
      action: {
        label: 'Deshacer',
        onClick: () => {
          this.filesList.splice(index, 0, fileToRemove); // Reagrega el archivo a la lista
          this.totalPercentage = (this.filesList.length / this.fileLimit) * 100; // Actualiza el porcentaje de carga
          this.onChange(this.filesList); // Actualiza el valor del archivo
          toast.success('Archivo restaurado', {
            description: `El archivo ${fileToRemove.name} ha sido restaurado`,
            duration: 3000,
            icon: IconComponent,
            componentProps: {
              icon: 'file_export',
            },
          });
          this.cdr.markForCheck(); // Marca para verificación
        }
      },
    });
    this.totalPercentage = (this.filesList.length / this.fileLimit) * 100; // Actualiza el porcentaje de carga
    this.onChange(this.filesList); // Actualiza el valor del archivo
    removeCb(); // Llama al callback de eliminación propio de PrimeNG
  };

  // Permite al usuario eliminar manualmente los errores
  deletedErrorById = (id: number): void => {
    const index = this.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
  };

  // Computed que retorna una función lookup rápida O(1)
  getIcon(type: string): string {
    return fileTypeMap.get(type) || 'error'; // Si no encuentra, devuelve 'error'
  };

  handleFileSelection = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file: any = input.files?.[0];
    const newMessages: string[] = [];
    if (file) {
      if (!this.allowedFileTypes.includes(file.type)) {
        newMessages.push(
          `El archivo ${file.name} no es un tipo de archivo permitido.`
        );
      } else if (this.maxFileSize && file.size > this.maxFileSize) {
        newMessages.push(`El archivo ${file.name} (${this.formatSize(file)}) excede el tamaño permitido`);
      } else if (this.singleFile) {
        if (file.name === this.singleFile.name) {
          newMessages.push(`El archivo ${file.name} ya ha sido seleccionado`);
        }
      }

      // Agregar mensajes
      if (newMessages.length > 0) {
        for (const message of newMessages) {
          this.addTimedMessage(message);
        }
      } else {
        this.singleFile = file; // Asignar el archivo seleccionado
        this.onChange(file); // Actualiza el valor del archivo
      }
    }
  };

  removeSingleFile = (fileInput: HTMLInputElement) => {
    if (this.singleFile) {
      const temp = this.singleFile; // Almacena el archivo temporalmente
      toast.info('Archivo removido', {
        description: `El archivo ${this.singleFile.name} ha sido removido`,
        duration: 3000,
        icon: IconComponent,
        componentProps: {
          icon: 'file_copy_off',
        },
        action: {
          label: 'Deshacer',
          onClick: () => {
            this.singleFile = fileInput.files![0]; // Reasigna el archivo
            this.onChange(this.singleFile); // Actualiza el valor del archivo
            toast.success('Archivo restaurado', {
              description: `El archivo ${temp.name} ha sido restaurado`,
              duration: 3000,
              icon: IconComponent,
              componentProps: {
                icon: 'file_export',
              },
            });
            this.cdr.markForCheck(); // Marca para verificación
          }
        },
      });

      // Revoca la URL solo si el archivo es una imagen
      if (this.singleFile.type.startsWith('image/')) {
        this.revokeFilePreview(this.singleFile);
      }
      this.singleFile = null;
      fileInput.value = ''; // Limpia el input
    }
    this.onChange(this.singleFile); // Actualiza el valor del archivo
  };


  revokeFilePreview = (file: File) => {
    const url = this.filePreviews.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      this.filePreviews.delete(file);
    }
  };

  getFilePreview = (file: File): string => {
    // Solo generar una URL si es un archivo de imagen
    if (!file.type.startsWith('image/')) {
      return ''; // Evitar URL.createObjectURL para archivos no compatibles con <img>
    }

    if (this.filePreviews.has(file)) {
      return this.filePreviews.get(file) as string;
    }

    const url = URL.createObjectURL(file);
    this.filePreviews.set(file, url);
    return url;
  };

  addTimedMessage(message: string): void {
    const id = this.messageIdCounter++;
    const msg = { id, text: message };

    this.messages.push(msg);

    setTimeout(() => {
      const index = this.messages.findIndex((m) => m.id === id);
      if (index !== -1) {
        this.messages.splice(index, 1);
        this.cdr.markForCheck();
        this.cdr.detectChanges(); // Asegúrate de que el cambio se detecte
        if (this.errorTimeout) {
          clearTimeout(this.errorTimeout); // Limpia el timeout anterior
        }
      }
    }, 5000); // 5 segundos
  }

  showAlert() {
    if(this.disabled)
    toast.warning('Advertencia', {
      description: 'El archivo se encuentra deshabilitado',
      duration: 3000,
      icon: IconComponent,
      componentProps: {
        icon: 'error',
      },
    });
  }
}
