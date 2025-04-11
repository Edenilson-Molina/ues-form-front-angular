import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { FileUploadModule, type FileSelectEvent } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { FluidModule } from 'primeng/fluid';

import { ButtonComponent } from '@components/button/button.component';
import { InputErrorsComponent } from '@components/inputs/input-errors/input-errors.component';

import { FileType, fileTypeMap } from '@interfaces/common/file-input.interface';
import { PrimeNG } from 'primeng/config';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputComponent implements ControlValueAccessor, OnInit {
  value: File | File[] | null = null;
  filesList: File[] = []; // Almacena el archivo seleccionado
  singleFile: File | null = null; // Almacena un solo archivo seleccionado
  totalPercentage: number = 0; // Porcentaje de carga del archivo
  messages: string[] = [];
  filePreviews = new Map<File, string>(); // Almacena las URL de los archivos
  onChange: (files: File | File[] | null) => void = () => {};
  onTouched: () => void = () => {};

  config = inject(PrimeNG); // Configuración de PrimeNG

  // Input properties
  @Input() id: string = '';
  @Input() label: string = '';
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
  @Input() invalid?: boolean;
  @Input() iconFileSize: string = 'file_open';
  @Input() iconFileNumber: string = 'files';
  @Input() iconFileUpload: string = 'cloud_upload';
  @Input() iconAddFile: string = 'attachment';
  @Input() title: string = 'Carga de archivos';
  @Input() emptyMessage: string = 'Seleccione o arrastre un archivo';
  @Input() errorMessageClass: string = '';

  @Input() formControl!: FormControl;

  @ViewChild('fileUploadRef', { static: true }) fileUploadRef!: any;
  @ViewChild('fileInput', { static: true }) fileInput!: HTMLInputElement;

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
    // Inicializa el valor del componente con el valor del FormControl
    if (this.formControl) {
      this.formControl.valueChanges.subscribe((value: File | File[] | null) => {
        this.writeValue(value);
      });
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
    if (this.disabled) {
      this.fileUploadRef?.clear();
      return;
    }

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

      // Validación de tipo de archivo
      if (!this.allowedFileTypes.includes(file.type as FileType)) {
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
    console.log(this.fileUploadRef);
    this.onChange(this.filesList); // Actualiza el valor del archivo

    // Agregar mensajes
    if (newMessages.length > 0) {
      this.messages = [...this.messages, ...newMessages];
    }
  };

  // Función para abrir el selector de archivos manualmente
  openFileChooser = () => {
    if (this.fileUploadRef?.value) {
      this.fileUploadRef.choose();
    }
  };

  formatSize = (size: number): string => {
    // (1024 base, sistema binario)
    // (1000 base, sistema decimal)
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
    this.totalPercentage = (this.filesList.length / this.fileLimit) * 100; // Actualiza el porcentaje de carga
    this.onChange(this.filesList); // Actualiza el valor del archivo
    removeCb(); // Llama al callback de eliminación
  };

  // Permite al usuario eliminar manualmente los errores
  deletedError = (indexError: number): void => {
    this.messages.splice(indexError, 1);

    // Si el usuario elimina manualmente todos los errores, cancela el temporizador
    // if (this.messages.length === 0 && errorTimeout) {
    //   clearTimeout(errorTimeout);
    //   errorTimeout = null;
    // }
  };

  // Computed que retorna una función lookup rápida O(1)
  getIcon(type: string): string {
    return fileTypeMap.get(type) || 'error'; // Si no encuentra, devuelve 'error'
  };


  openInputFileChooser = () => {
    console.log('openInputFileChooser', this.fileInput);
    if (this.fileInput?.value) {
      this.fileInput.click();
    }
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
        this.messages = [...this.messages, ...newMessages];
      } else {
        this.singleFile = file; // Asignar el archivo seleccionado
        this.onChange(file); // Actualiza el valor del archivo
      }
    }
  };

  removeSingleFile = () => {
    if (this.singleFile) {
      // Revoca la URL solo si el archivo es una imagen
      if (this.singleFile.type.startsWith('image/')) {
        this.revokeFilePreview(this.singleFile);
      }
      this.singleFile = null;
    }
    this.resetFileInput();
  };

  resetFileInput = () => {
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  };

  revokeFilePreview = (file: File) => {
    const url = this.filePreviews.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      this.filePreviews.delete(file);
    }
  };

  getFilePreview = (file: File | File[]): string => {
    if (!file || Array.isArray(file)) return '';
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
}
