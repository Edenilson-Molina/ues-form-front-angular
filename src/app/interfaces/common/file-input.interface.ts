export interface ExtendedFile extends File {
  objectURL?: string;
}

export enum FileType {
  RAR = 'application/x-compressed',
  ZIP = 'application/x-zip-compressed',
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  POWERPOINT = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TEXT = 'text/plain',
  WORD = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  GIF = 'image/gif',
  JPG = 'image/jpeg',
  PNG = 'image/png',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',
  MP4 = 'video/mp4',
  PDF = 'application/pdf',
  IMAGE = 'image/*',
}

// Definir el Mapa una vez para evitar recalcular
export const fileTypeMap = new Map<string, string>([
  // Archivos de audio
  [FileType.MP3, 'music_video'],
  [FileType.WAV, 'audio_file'],
  // Archivos office
  [FileType.EXCEL, 'table_view'],
  [FileType.POWERPOINT, 'slideshow'],
  [FileType.WORD, 'docs'],
  // Archivos de texto
  [FileType.TEXT, 'sticky_note'],
  [FileType.PDF, 'picture_as_pdf'],
  // Archivos de imagen
  [FileType.GIF, 'gif_box'],
  [FileType.JPG, 'image'],
  [FileType.PNG, 'file_png'],
  [FileType.SVG, 'image'],
  // Archivos de video
  [FileType.MP4, 'video_file'],
  // Archivos comprimidos
  [FileType.ZIP, 'folder_zip'],
  [FileType.RAR, 'data_table'],
]);
