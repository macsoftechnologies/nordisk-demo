import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';  

@Component({
  selector: 'app-list-popup',
  templateUrl: './list-popup.component.html',
  styleUrls: ['./list-popup.component.css']
})
export class ListPopupComponent implements OnInit {

  name:string="abc";

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ListPopupComponent>,) { }
  Data = [  
    { Id: 101, Name: 'Nitin', Salary: 1234 },  
    { Id: 102, Name: 'Sonu', Salary: 1234 },  
    { Id: 103, Name: 'Mohit', Salary: 1234 },  
    { Id: 104, Name: 'Rahul', Salary: 1234 },  
    { Id: 105, Name: 'Kunal', Salary: 1234 }  
  ];  
  
  @ViewChild('content') content: ElementRef; 
  Requestdata:any;
  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item)
  {
    console.log(item)
    this.Requestdata=item;
  }

  
  public SavePDF(): void {  
    let content=this.content.nativeElement;  
    let doc = new jsPDF();  
    let _elementHandlers =  
    {  
      '#editor':function(element,renderer){  
        return true;  
      }  
    };  
    doc.fromHTML(content.innerHTML,15,15,{  
  
      'width':190,  
      'elementHandlers':_elementHandlers  
    });  
  
    doc.save('test.pdf');  
  }
  //  makePdf() { 
     
  //   // let doc = new jsPDF();
  //   // doc.addHTML(this.content.nativeElement, function() {
  //   //   debugger
  //   //    doc.save("test.pdf");
  //   // });
  //   const filename  = 'ThisIsYourPDFFilename.pdf';

	// 	html2canvas(document.querySelector('#content'),{scale: 1}).then(canvas => {
	// 		let pdf = new jsPDF('p', 'mm', 'a4');
	// 		pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
	// 		pdf.save(filename);
	// 	});
  // }
  
  // public captureScreen()  
  // {  
  //   var data = document.getElementById('contentToConvert');  
  //   html2canvas(data).then(canvas => {  
  //     // Few necessary setting options  
  //     var imgWidth = 208;   
  //     var pageHeight = 295;    
  //     var imgHeight = canvas.height * imgWidth / canvas.width;  
  //     var heightLeft = imgHeight;  
  
  //     const contentDataURL = canvas.toDataURL('image/png')  
  //     let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
  //     var position = 0;  
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.save('MYPdf.pdf'); // Generated PDF   
  //   });  
  // }  

  generatePdf() {
    const filename  = 'WORK_PERMIT.pdf';
		html2canvas(document.querySelector('#content'), {scale: 4}).then(canvas => {
			let pdf = new jsPDF('p', 'mm', 'a4');
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 200);
			pdf.save(filename);
		});
  }
}
