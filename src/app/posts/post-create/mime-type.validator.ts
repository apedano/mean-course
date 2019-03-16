import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  if(typeof(control.value) === 'string') {
    return of(null); // is valid
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener('loadend', () => {
      // we are interest in the part of the array for having the mime type of the file
      // same as fileReader.result as ArrayBuffer
      const arr = new Uint8Array(<ArrayBuffer>fileReader.result).subarray(0, 4);
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        // string of HEX values
        header += arr[i].toString(16);
      }
      switch (header) {
        case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
      }
      if (isValid) {
        observer.next(null); // emit to the observer a null value to indicate a valid file
      } else {
        observer.next({invalidMimeType: true}); // custom key name with value true for indicating an invalid mime type
      }
      observer.complete(); // we inform the observer that the observable sequence is done
    }); // create a load at the end event listener for the filereader
    fileReader.readAsArrayBuffer(file); // access file content and metadata as MIME type...
  });
  return frObs;
};
