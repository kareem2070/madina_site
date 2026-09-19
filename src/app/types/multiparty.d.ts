declare module 'multiparty' {
    import { Readable } from 'stream';
  
    interface File {
      fieldName: string;
      originalFilename: string;
      path: string;
      headers: { [key: string]: string };
      size: number;
    }
  
    interface Part extends Readable {
      headers: { [key: string]: string };
      name: string;
      originalFilename?: string;
      path: string;
      size: number;
    }
  
    interface Fields {
      [key: string]: string[];
    }
  
    interface Files {
      [key: string]: File[];
    }
  
    interface FormOptions {
      encoding?: string;
      maxFieldsSize?: number;
      maxFields?: number;
      maxFilesSize?: number;
      uploadDir?: string;
      hash?: string | boolean;
      multiples?: boolean;
    }
  
    class Form {
      constructor(options?: FormOptions);
      onPart: (part: Part) => void;
      parse(
        req: import('http').IncomingMessage,
        callback?: (error: Error, fields: Fields, files: Files) => void
      ): void;
    }
  }
  