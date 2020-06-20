import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { PrintDownloadOptions } from 'app/views/Models/PrintDownloadOptionsDto';
import * as moment from 'moment';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { RequestService } from 'app/shared/services/request.service';
import { PlansDto } from 'app/views/Models/PlansDto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  ModalOptions: PrintDownloadOptions;

  PlanForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  datefield:  boolean = false;
  monthfield: boolean = false;
  yearfield: boolean = false;
  weekfield: boolean = false;

  PlanTypes: any[] = [
    {
      PlanId: 1,
      PlanName: 'Daily Plan'
    },
    {
      PlanId: 2,
      PlanName: 'Weekly Plan'
    },
    {
      PlanId: 3,
      PlanName: 'Monthly Plan'
    }
  ];

  SubContractors: any[] = [];
  Sites: any[] = [];
  Weeks: any[] = [];
  Buildings: any[] = [];
  Years: any[] = [];
  WeekNumbers: any[] = [];
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  Cols = [
    { field: 'Companyname', header: 'Company Name' },
    { field: 'SubContractor', header: 'Sub Contractor' },
    { field: 'Site', header: 'Site' },
    { field: 'Building', header: 'Building' }
  ];

  plansDtodata:PlansDto={
    Plans_Id:null,
    Building_Id:null,
    Site_Id:null,
    Sub_Contractor_Id:null,
    fromDate:null,
    toDate:null
  }
  Planslist: any[] = [];

  constructor(private fb: FormBuilder, private userservices: UserService, 
    private route: Router,
    private subcontrservice: SubcontractorService,
    private requstservice:RequestService,
    private datePipe: DatePipe) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    for (let i = 2000; i < 2030; i++) {
      this.Years.push(i);
    }
    this.subcontrservice.GetAllSubContractors().subscribe(res => {
      this.SubContractors = res["data"];
    });
    this.requstservice.GetAllSites().subscribe(res=>{
      this.Sites=res["data"];
    });
  }

  ngOnInit(): void {
    this.PlanForm = this.fb.group({
     
      Date: [''],
      Year: [''],
      Weekno: [''],
      Month: [''],
      Plantype:[''],
      subContractor: [''],
      Building: [''],
      Site:['']

    });
  }

 
  Getselectedyear(event) {
    let totalweeks = moment(event, "YYYY").isoWeeksInYear();
    for (let i = 1; i <= totalweeks; i++) {
      this.WeekNumbers.push(i);
    }
  }

  GetselectedPlantype(event) {
    if (event == 1) {
      this.datefield=false;
      this.monthfield = true;
      this.yearfield = true;
      this.weekfield = true;
    }
    else if (event == 2) {
      this.datefield=true;
      this.monthfield = true;
      this.yearfield = false;
      this.weekfield = false;
    }
    if (event == 3) {
      this.datefield=true;
      this.monthfield = false;
      this.yearfield = true;
      this.weekfield = true;
    }
  }
  GetBuilding(event)
  {
    this.requstservice.GetAllBuildingsbyid(event).subscribe(res => {
      this.Buildings = res["data"];
    });
  }
  Createplan() {

    this.plansDtodata.Site_Id=this.PlanForm.controls["Site"].value;
    this.plansDtodata.Building_Id=this.PlanForm.controls["Building"].value;
    this.plansDtodata.Sub_Contractor_Id=this.PlanForm.controls["subContractor"].value;
    this.plansDtodata.Plans_Id=this.PlanForm.controls["Plantype"].value;

    if(this.PlanForm.controls["Plantype"].value==1)
    {
       this.plansDtodata.fromDate=this.datePipe.transform(this.PlanForm.controls["Date"].value, 'yyyy-MM-dd');

       this.plansDtodata.toDate=this.datePipe.transform(this.PlanForm.controls["Date"].value, 'yyyy-MM-dd');
       console.log( this.plansDtodata)
       this.GetRequestData(this.plansDtodata);

    }
    else if(this.PlanForm.controls["Plantype"].value==2)
    {
      var mydate=moment().year(2020).week(2);
      //console.log(mydate.format('YYYY-MM-DD'));
      console.log(mydate.startOf('week').format('YYYY-MM-DD'));
      console.log(mydate.endOf('week').format('YYYY-MM-DD'));

       this.plansDtodata.fromDate=mydate.startOf('week').format('YYYY-MM-DD');
        this.plansDtodata.toDate=mydate.endOf('week').format('YYYY-MM-DD');
        this.GetRequestData(this.plansDtodata);

    }
    else if(this.PlanForm.controls["Plantype"].value==3)
    {
      var mymonthdate=moment().month(this.PlanForm.controls["Month"].value);
      this.plansDtodata.fromDate=mymonthdate.startOf("month").format('YYYY-MM-DD');
      this.plansDtodata.toDate=mymonthdate.endOf("month").format('YYYY-MM-DD');
      this.GetRequestData(this.plansDtodata);
    }
    }

    GetRequestData(searchreq)
    {
      this.requstservice.GetPlans(searchreq).subscribe(res=>
        {
          console.log(res);
        })
    }

    exportToExcel() {

      const rowsString: string[] = [];
      let headerString = '';
      let csv = '';
  
      this.ModalOptions = {
        key: '',
        fileName: '',
        dialogHeader: '',
        dialogMessage: '',
        enableDownloadExcel: true,
        enablePrint: true,
        dataSource: '',
        tableData: '',
        columns: this.Cols,
        reportHeaderColumns: '',
        reportFooterColumns: ''
  
      };
  
      this.ModalOptions.tableData = this.userservices.RequestLists;
  
      this.ModalOptions.fileName = "test" + "_" + moment(new Date()).format('YYYY/MM/DD').toString();
  
      for (const column of this.ModalOptions.columns) {
        let data = column.header;
        data = data === 'undefined' ? '' : data;
        data = data === null ? '' : data;
        data = data === 'null' ? '' : data;
        headerString += data + ',';
  
      }
      csv += headerString + '\n';
  
      for (let i = 0; i < this.ModalOptions.tableData.length; i++) {
        let rowString = '';
        let colNames = '';
        let objValues = {};
        let val = '';
  
        const tableRow = this.ModalOptions.tableData[i];
        for (const column of this.ModalOptions.columns) {
          if (column.field.includes('.')) {
            colNames = column.field.split('.');
            objValues = tableRow[colNames[0]];
            val = String(objValues[colNames[1]])
              .replace(/[\n\r]+/g, '')
              .replace(/\s{2,}/g, ' ')
              .replace(/,/g, '')
              .trim();
            val = val === 'true' ? '1' : val === 'false' ? '0' : val;
            val = val === null ? '' : val;
            val = val === 'null' ? '' : val;
            val = val === '0' ? '' : val;
            val = val === 'undefined' ? '' : val;
            rowString += val + ',';
          } else {
            val = String(tableRow[column.field])
              .replace(/[\n\r]+/g, '')
              .replace(/\s{2,}/g, ' ')
              .replace(/,/g, '')
              .trim();
            val = val === 'true' ? '1' : val === 'false' ? '0' : val;
            val = val === null ? '' : val;
            val = val === 'null' ? '' : val;
            val = val === '0' ? '' : val;
            val = val === 'undefined' ? '' : val;
            rowString += val + ',';
          }
        }
        rowsString.push(rowString);
      }
  
      for (const row of rowsString) {
        csv += row + '\n';
      }
  
      csv += this.ModalOptions.reportFooterColumns + '\n';
      const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute(
        'download',
        this.ModalOptions.fileName + this.ModalOptions.key + '.csv'
      );
      document.body.appendChild(link); // Required for FF
      link.click();
    }
}
