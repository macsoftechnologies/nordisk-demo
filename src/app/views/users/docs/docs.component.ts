import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {

  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;
  files  = [];  
  constructor() { }

  ngOnInit(): void {
  }

  callUploadService(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);  
    file.inProgress = true;  
    // this.uploadService.upload(formData).pipe(  
    //   map(event => {  
    //     switch (event.type) {  
    //       case HttpEventType.UploadProgress:  
    //         file.progress = Math.round(event.loaded * 100 / event.total);  
    //         break;  
    //       case HttpEventType.Response:  
    //         return event;  
    //     }  
    //   }).subscribe((event: any) => {  
    //     if (typeof (event) === 'object') {  
    //       console.log(event.body);  
    //     }  
    //   });  
  }


  private upload() {  
    this.fileInput.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.callUploadService(file);  
    });  
}


  onClick() {  
    const fileInput = this.fileInput.nativeElement;
    fileInput .onchange = () => {  
        for (let index = 0; index < fileInput .files.length; index++)  
        {  
             const file = fileInput .files[index];  
             this.files.push({ data: file, inProgress: false, progress: 0});  
        } 
        console.log(this.files); 
          this.upload();  
    };  
    fileInput.click();  
}
}
