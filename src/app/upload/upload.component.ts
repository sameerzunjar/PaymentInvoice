import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';
  @Output() callParent = new EventEmitter();
  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name + ' - ';
      });
      let imgBase64Path = '';
      // HTML5 FileReader API
      let reader = new FileReader();
      
       reader.onload = (e: any) => {
         let image = new Image();
         image.src = e.target.result;
         image.onload = (rs) => {
           imgBase64Path = e.target.result;
           console.log('base 64: '+ imgBase64Path);
           this.callParent.emit(imgBase64Path);
         };
      };
      //console.log('base 64: '+ reader.result);
      reader.readAsDataURL(imgFile.target.files[0]);
      
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
    
  }
}