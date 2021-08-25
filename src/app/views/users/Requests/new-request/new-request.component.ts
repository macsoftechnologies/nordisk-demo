import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { UserService } from "app/shared/services/user.service";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { RequestSaveOptionsDialogComponent } from "../request-save-options-dialog/request-save-options-dialog.component";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Observable, forkJoin } from "rxjs";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { startWith, map } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { RequestService } from "app/shared/services/request.service";
import { SubcontractorService } from "app/shared/services/subcontractor.service";
import { EmployeeService } from "app/shared/services/employee.service";
import { RequestDto, EditRequestDto } from "app/views/Models/RequestDto";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { Inputdata, PDFAnnotationData } from "app/views/Models/input";
import { ActivityService } from "app/shared/services/activity.service";
import { SafetyprecautionService } from "app/shared/services/safetyprecautionservice";
import { TemplateDefinitionBuilder } from "@angular/compiler/src/render3/view/template";
import { TeamService } from "app/shared/services/team.service";
import { TeamsBySubId } from "app/views/Models/TeamsDto";
import { number } from "ngx-custom-validators/src/app/number/validator";
import { config } from "config";

@Component({
  selector: "app-new-request",
  templateUrl: "./new-request.component.html",
  styleUrls: ["./new-request.component.css"],
})
export class NewRequestComponent implements OnInit {
  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  //pdfSrc ="https://macsof.com/safesite/1complete_plan.pdf";

  spinner = false;
  Assigneditform: boolean = false;
  pdfSrc: string = "";
  // pdfSrc = "../assets/images/complete-plan/1complete_plan_invisible.pdf";
  // pdfSrc = "../assets/images/plans/L05.pdf";
  readonly dpiRatio = 96 / 72;
  public myForm: FormGroup;
  public inputList: Inputdata[] = [];
  type: string = "button";
  btnsty: string = "btn-sty";
  value = "test";
  NewRequestData: any = {};
  selectedbuildimg: string = "";
  selectedholdbtnoption: string = "";
  Reqdate = new Date(config.Denmarktz);
  minDate: Date;
  maxDate: Date;
  name: string;
  dropdownname: string;
  selectedsite: number;
  selected_site_name: string = "";
  selectedbuilding: string;
  selectedfloor: string;
  selectedroom: string;
  nositemselect: boolean = true;
  nobuildingmselect: boolean = true;
  nofloorselected: boolean = true;
  isnewrequestcreated: boolean = false;
  iscmsyes: boolean = false;
  ishotworkyes: boolean = false;
  isLOTOPROCEDUREyes: boolean = false;
  RequestForm: FormGroup;
  beamimg: string = "";

  visible = true;
  selectable = true;
  rselectable = true;
  Safetypreselectable = true;
  removable = true;
  rmremovable = true;
  editform: boolean = false;
  seditform: boolean = false;
  subeditform: boolean = false;
  issubcontr: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredBadges: Observable<string[]>;
  filteredRooms: Observable<string[]>;
  filteredsafety: Observable<any[]>;
  data: any = {};
  Rooms: any[] = [];
  RoomsList: any[] = [];
  Badges: string[] = [];
  EditbadgeArray: string[] = [];
  EditSafetyArray: string[] = [];
  BADGENUMBERS: any[] = [];
  Teams: any[] = [];
  safetyprecdata: any[] = [];
  safetyList: any[] = [];

  @ViewChild("badgeInput") badgeInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;
  @ViewChild("roomInput") roomInput: ElementRef<HTMLInputElement>;
  @ViewChild("roomauto") roomatAutocomplete: MatAutocomplete;
  siteslist: any[] = [];
  buildings: any[] = [];
  floors: any[] = [];

  SubContractors: any[] = [];
  TypeofActivites: any[] = [];

  CMTs: any[] = [
    {
      id: "1",
      CMTval: "Yes",
    },
    {
      id: "0",
      CMTval: "No",
    },
  ];

  Poweroffs: any[] = [
    {
      Poweroffid: "1",
      Poweroffname: "Yes",
    },
    {
      Poweroffid: "0",
      Poweroffname: "No",
    },
  ];

  HOTWORKs: any[] = [
    {
      id: "1",
      HOTWORKval: "Yes",
    },
    {
      id: "0",
      HOTWORKval: "No",
    },
  ];
  LOTOPROCEDUREs: any[] = [
    {
      id: "1",
      LOTOPROCEDUREval: "Yes",
    },
    {
      id: "0",
      LOTOPROCEDUREval: "No",
    },
  ];
  Status: any[] = [
    {
      Statusid: "Hold",
      Statusname: "Hold",
    },
    {
      Statusid: "Draft",
      Statusname: "Draft",
    },
    {
      Statusid: "Approve",
      Statusname: "Approved",
    },
    {
      Statusid: "Reject",
      Statusname: "Rejected",
    },
    {
      Statusid: "Opened",
      Statusname: "Opened",
    },
    {
      Statusid: "Closed",
      Statusname: "Closed",
    },
  ];
  OperatorStatus: any[] = [
    {
      Statusid: "Hold",
      Statusname: "Hold",
    },
    {
      Statusid: "Approve",
      Statusname: "Approved",
    },
    {
      Statusid: "Rejected",
      Statusname: "Rejected",
    },
    {
      Statusid: "Opened",
      Statusname: "Opened",
    },
    {
      Statusid: "Closed",
      Statusname: "Closed",
    },
  ];
  subStatus: any[] = [
    {
      Statusid: "Hold",
      Statusname: "Hold",
    },
    {
      Statusid: "Draft",
      Statusname: "Draft",
    },
    {
      Statusid: "Opened",
      Statusname: "Opened",
    },
    {
      Statusid: "Closed",
      Statusname: "Closed",
    },
  ];
  TeamsSubDto: TeamsBySubId = {
    subcontId: null,
  };
  Requestdata: RequestDto = {
    userId: null,
    Request_Date: null,
    Company_Name: null,
    Sub_Contractor_Id: null,
    Foreman: null,
    Foreman_Phone_Number: null,
    Activity: null,
    Type_Of_Activity_Id: null,
    Working_Date: null,
    Start_Time: null,
    End_Time: null,
    Site_Id: null,
    Building_Id: null,
    Floor_Id: null,
    Room_Nos: null,
    Room_Type: null,
    Crane_Requested: null,
    Crane_Number: null,
    Tools: null,
    Machinery: null,
    Hot_work: null,
    Certified_Person: null,
    LOTO_Procedure: null,
    LOTO_Number: null,
    Power_Off_Required: null,
    Number_Of_Workers: null,
    Badge_Numbers: null,
    Notes: null,
    Request_status: null,
    PermitNo: "1234",
    teamId: null,
    building_name: null
    
  };

  updaterequestdata: EditRequestDto = {
    userId: null,
    Request_Date: null,
    Company_Name: null,
    Sub_Contractor_Id: null,
    Foreman: null,
    Foreman_Phone_Number: null,
    Activity: null,
    Type_Of_Activity_Id: null,
    Working_Date: null,
    Start_Time: null,
    End_Time: null,
    Site_Id: null,
    Building_Id: null,
    Floor_Id: null,
    Room_Nos: null,
    Room_Type: null,
    Crane_Requested: null,
    Crane_Number: null,
    Tools: null,
    Machinery: null,
    Hot_work: null,
    Certified_Person: null,
    LOTO_Procedure: null,
    LOTO_Number: null,
    Power_Off_Required: null,
    Number_Of_Workers: null,
    Badge_Numbers: null,
    Notes: null,
    Request_status: null,
    PermitNo: null,
    id: null,
    Assign_End_Time: null,
    Assign_Start_Time: null,
    Special_Instructions: null,
    Safety_Precautions: null,
    teamId: null,
  };

  userdata: any = {};
  planType: string = "";
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private datePipe: DatePipe,
    private userservices: UserService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private requestsserivies: RequestService,
    private subcntrservice: SubcontractorService,
    private empservice: EmployeeService,
    private _snackBar: MatSnackBar,
    private jwtauth: JwtAuthService,
    private typeactservice: ActivityService,
    private safetyservice: SafetyprecautionService,
    private teamservices: TeamService
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.spinner = true;
  }

  ngOnInit(): void {
    this.RequestForm = this.fb.group({
      Requestdate: ["", [Validators.required]],
      Companyname: ["", Validators.required],
      Permitnumber: [""],
      Foreman: ["", Validators.required],
      ForemanPhone: ["", Validators.required],
      Activity: ["", Validators.required],
      Startdate: ["", Validators.required],
      StartTime: ["", Validators.required],
      EndTime: ["", Validators.required],
      Site: ["", Validators.required],
      Building: ["", Validators.required],
      FloorName: ["", Validators.required],
      //  RoomNo: ['', Validators.required],
      RoomType: ["", Validators.required],
      Status: ["", Validators.required],
      Tools: ["", Validators.required],
      peopleinvalidcount: ["", Validators.required],
      Note: ["", Validators.required],
      CmtValue: ["", Validators.required],
      Machinery: ["", Validators.required],
      CertifiedPerson: ["", Validators.required],
      LOTONumber: ["", Validators.required],
      SubContractor: ["", Validators.required],
      BADGENUMBER: ["", Validators.required],
      //Edit form
      AssignStartTime: ["", Validators.required],
      AssignEndTime: ["", Validators.required],
      Safetyprecaustion: ["", Validators.required],
      SpecialInstruction: ["", Validators.required],
      TypeActivity: ["", Validators.required],
      Team: ["", Validators.required],
      //Fedding: this.feedingControl,
      //TechRoom: this.TechRoomControl,
      //Trackname: this.TrackControl,
      // Walkwayname: this.WalkwayControl,
      // Trackblockedname: this.TrackblockedControl,
      //Motorbogie: this.MotorbogieControl,
      //Vehicle: this.VehicleControl,
      //Vehiclestesting: this.VehiclestestingControl,
      //WakingTeam: this.WakingTeamControl,
      CMTdata: ["", Validators.required],
      Poweroff: ["", Validators.required],
      //Applicant: this.ApplicantControl,
      HOTWORK: ["", Validators.required],
      LOTOPROCEDURE: ["", Validators.required],
      //AccesstoOtherRoom:this.AccesstoroomControl,
      //Keysneeded:this.KeysneedControl,

      Room: ["", Validators.required],
      SubContractorname: ["", Validators.required],
      //Departconfs:this.departconfControl,
      //RequiredDocument:this.RequiredDocumentControl
    });

    this.myForm = this.fb.group({});

    this.userdata = this.jwtauth.getUser();
    this.Requestdata.userId = this.userdata["id"];

    forkJoin(
      this.requestsserivies.GetAllSites(),
      this.subcntrservice.GetAllSubContractors(),
      this.typeactservice.GetAllActivites(),
      this.safetyservice.GetSafetyprecautions()
    ).subscribe((res) => {
      this.spinner = false;
      this.selectedsite = res[0]["data"][1]["site_id"];
      this.selected_site_name = res[0]["data"][1]["site_name"];
      this.siteslist = res[0]["data"];
      this.Getselectedsiteitem(this.selectedsite);
      this.SubContractors = res[1]["data"];
      if (this.userdata["role"] == "Subcontractor") {
        this.issubcontr = true;
        this.RequestForm.controls["SubContractor"].setValue(
          this.userdata["typeId"]
        );
        this.SubContractors.forEach((x) => {
          if (x["id"] == this.userdata["typeId"]) {
            this.Getselectedsubcntrsteams(x["id"]);
            this.RequestForm.controls["SubContractorname"].setValue(
              x["subContractorName"]
            );
          }
        });
      } else if (this.userdata["role"] == "Admin") {
        this.issubcontr = false;
      } else if (this.userdata["role"] == "Department") {
        this.issubcontr = false;
      }
      this.TypeofActivites = res[2]["data"];
      this.safetyList = res[3]["data"];
      // this.Teams = res[4]["data"];

      let temp = [];
      this.safetyList.map((obj) => {
        // console.log(this.RequestForm.value.Safetyprecaustion.includes(obj.id))
        if (this.RequestForm.value.Safetyprecaustion.includes(obj.id))
          temp.push(obj);
        return obj;
      });
      this.safetyprecdata = temp;

      /*  this.filteredsafety = this.RequestForm.controls["Safetyprecaustion"].valueChanges.pipe(
           startWith(''),
           // map((fruit: string | null) => fruit ? this._safetyfilter(fruit) : this.safetyList.slice()));
           map(fruit => fruit.length>=1 ? this._safetyfilter(fruit) : [])); */

      this.filteredsafety = this.RequestForm.controls[
        "Safetyprecaustion"
      ].valueChanges.pipe(
        startWith(""),
        map((val) => (val.length >= 1 ? this.filter(val) : []))
      );
    });

    this.data = this.requestsserivies.SelectedRequestData;
    console.log(this.data);
    if (this.data["editform"] == true) {
      this.updaterequestdata.userId = this.userdata["id"];
      if (this.userdata["role"] == "Subcontractor") {
        this.editform = true;
        this.seditform = true;
        this.Assigneditform = false;
        this.Status = this.subStatus;
        this.subeditform = true;
        this.SubContractors.forEach((x) => {
          if (x["id"] == this.userdata["typeId"]) {
            this.RequestForm.controls["SubContractorname"].setValue(
              x["subContractorName"]
            );
            this.Getselectedsubcntrsteams(Number.parseInt(x["id"]));
          }
        });
      } else if (this.userdata["role"] == "Admin") {
        this.editform = true;
        this.Assigneditform = true;
        this.subeditform = false;
        this.seditform = true;
      } else if (this.userdata["role"] == "Department") {
        this.editform = true;
        this.Assigneditform = true;
        this.Status = this.OperatorStatus;
        this.seditform = true;
        this.subeditform = false;
      }

      this.isnewrequestcreated = true;

      this.NewRequestData = this.data["payload"];
      this.EditFormDataBinding(this.data["payload"]);
    }
    this.name = "site";
  }

  filter(val: string) {
    return this.safetyList.filter(
      (option) =>
        option.precaution.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }
  GetAllSubContractorsData() {
    this.spinner = true;
    this.subcntrservice.GetAllSubContractors().subscribe((res) => {
      this.spinner = false;
      this.SubContractors = res["data"];
    });
  }
  Getselectedsiteitem(event) {
    this.selectedsite = event;
    this.nositemselect = false;
    this.name = "Building";

    this.siteslist.forEach((x) => {
      if (x["site_id"] == event) {
        this.Requestdata.Site_Id = x["site_id"];
        this.updaterequestdata.Site_Id = x["site_id"];
        this.RequestForm.controls["Site"].setValue(
          "Koge Hospital Project Team (KHPT)"
        );
        // this.RequestForm.controls["Site"].setValue(x["site_name"]);
      }
    });
    this.spinner = true;
    this.requestsserivies
      .GetAllBuildingsbyid(this.selectedsite)
      .subscribe((res) => {
        this.spinner = false;
        this.buildings = res["data"];
      });
  }
  GetselectedBuildingitem(event) {
    this.selectedbuilding = event;
    this.Requestdata.Building_Id = event;
    this.buildings.forEach((x) => {
      if (x["build_id"] == event) {
        this.RequestForm.controls["Building"].setValue(x["building_name"]);
      }
    });
    this.spinner = true;
    this.requestsserivies.GetAllFloorsbyid(event).subscribe((res) => {
      this.spinner = false;
      this.floors = [
        "LK1",
        "L00",
        "L01",
        "L02",
        "L03",
        "L04",
        "L05",
        "L06",
        "L07",
        "L08",
        "LTA",
      ]; //res["data"];
    });
    this.nobuildingmselect = false;
    this.name = "Floor";
  }
  Getselectedflooritem(event) {
    console.log(event);
    switch (event) {
      case "LK1":
        this.planType = "LK1";
        this.pdfSrc = "assets/images/plans/LK1.pdf";
        break;
      case "L00":
        this.planType = "L00";
        this.pdfSrc = "assets/images/plans/L00.pdf";
        break;
      case "L01":
        this.planType = "L01";
        this.pdfSrc = "assets/images/plans/L01.pdf";
        break;
      case "L02":
        this.planType = "L02";
        this.pdfSrc = "assets/images/plans/L02.pdf";
        break;
      case "L03":
        this.planType = "L03";
        this.pdfSrc = "assets/images/plans/L03.pdf";
        break;
      case "L04":
        this.planType = "L04";
        this.pdfSrc = "assets/images/plans/L04.pdf";
      case "L05":
        this.planType = "L05";
        this.pdfSrc = "assets/images/plans/L05.pdf";
        break;
      case "L06":
        this.planType = "L06";
        this.pdfSrc = "assets/images/plans/L06.pdf";
        break;
      case "L07":
        this.planType = "L07";
        this.pdfSrc = "assets/images/plans/L07.pdf";
        break;
      case "L08":
        this.planType = "L08";
        this.pdfSrc = "assets/images/plans/L08.pdf";
        break;
      case "LTA":
        this.planType = "LTA";
        this.pdfSrc = "assets/images/plans/LTA.pdf";

      default:
        break;
    }

    // this.spinner = true;
    this.selectedfloor = event;
    this.Requestdata.Floor_Id = event;
    // this.nofloorselected = false;
    // this.floors.forEach((x) => {
    //   if (x == event) {
    //     this.RequestForm.controls["FloorName"].setValue(x["floor_status"]);
    //   }
    // });
    this.RequestForm.controls["FloorName"].setValue(event);
    this.requestsserivies.GetAllRoomsbyid(event).subscribe((res) => {
      this.spinner = false;
      this.RoomsList = res["data"];
    });

    this.nobuildingmselect = false;
    this.name = "Room";
  }

  onFloorPlan(planVal: string): void {
    console.log(planVal);
    let currentdate = this.datePipe.transform(this.Reqdate, "yyyy-MM-dd");
    this.RequestForm.controls["Requestdate"].setValue(currentdate);
    this.RequestForm.controls["Companyname"].setValue(
      "Koge Hospital Project Team (KHPT)"
    );
    this.RequestForm.controls["Room"].setValue(planVal);
    this.isnewrequestcreated = true;
    console.log(this.RequestForm.value);
  }
  Getselectedroomitem(event) {
    console.log(event);
    this.RoomsList.forEach((x) => {
      if (x["room_id"] == event) {
        this.Rooms.push(x);
      }
    });
    this.selectedroom = event.toString();
    let currentdate = this.datePipe.transform(this.Reqdate, "yyyy-MM-dd");
    this.RequestForm.controls["Requestdate"].setValue(currentdate);
    this.RequestForm.controls["Companyname"].setValue(
      "Koge Hospital Project Team (KHPT)"
    );
    //this.RequestForm.controls['Status'].setValue('Active');
    this.isnewrequestcreated = true;

    this.RequestForm.controls["Room"].setValue(this.selectedroom.split(","));
    // this.filteredRooms = this.RequestForm.controls["Room"].valueChanges.pipe(
    //   startWith(null),
    //   map((fruit: string | null) => fruit ? this._roomsfilter(fruit) : this.RoomsList.slice()));
    // this.GetAllSubContractorsData();
  }

  Getselectedsubcntrsteams(event) {
    this.TeamsSubDto.subcontId = event;
    this.teamservices.GetAllTeamsBySubId(this.TeamsSubDto).subscribe((res) => {
      this.Teams = res["data"];
      if (this.editform == true) {
        this.Teams.forEach((x) => {
          if (x["id"] == this.data["payload"]["teamId"]) {
            this.RequestForm.controls["Team"].setValue(x["id"]);
            this.GetEmployees(Number.parseInt(x["id"]));
          }
        });
      }
    });

    this.empservice
      .GetAllEmployeesBySubContrId(this.TeamsSubDto.subcontId)
      .subscribe((res) => {
        let emps = [];

        res["data"].forEach((x) => {
          emps.push(x);
        });
        this.BADGENUMBERS = emps;
      });
  }

  Getselectedcmtitem(event) {
    if (event === "1") {
      this.iscmsyes = true;
    } else {
      this.iscmsyes = false;
    }
  }
  GetselectedHOTWORKitem(event) {
    if (event === "1") {
      this.ishotworkyes = true;
    } else {
      this.ishotworkyes = false;
    }
  }
  GetselectedLOTOPROCEDUREitem(event) {
    if (event === "1") {
      this.isLOTOPROCEDUREyes = true;
    } else {
      this.isLOTOPROCEDUREyes = false;
    }
  }

  SaveasDraft(statusdata) {
    this.Requestdata.Request_status = "Draft";
    this.CreateRequest();
    //this.requestsserivies.CreateNewRequest()
  }

  CreateRequest() {
    this.spinner = true;
    // var badarray = [];
    var roomoarr = [];
    // this.Badges.forEach(x => {
    //   badarray.push(x["badgeId"]);
    // });
    this.Rooms.forEach((x) => {
      roomoarr.push(x["room_id"]);
    });

    this.Requestdata.Activity = this.RequestForm.controls["Activity"].value;

    // this.Requestdata.Badge_Numbers = this.RequestForm.controls["BADGENUMBER"].value;
    // this.Requestdata.Badge_Numbers = badarray.toString();

    this.Requestdata.Request_Date =
      this.RequestForm.controls["Requestdate"].value;
    this.Requestdata.Company_Name =
      this.RequestForm.controls["Companyname"].value;
    this.Requestdata.Sub_Contractor_Id =
      this.RequestForm.controls["SubContractor"].value;
    this.Requestdata.Foreman = this.RequestForm.controls["Foreman"].value;
    this.Requestdata.Foreman_Phone_Number =
      this.RequestForm.controls["ForemanPhone"].value;
    // this.Requestdata.Type_Of_Activity_Id=this.RequestForm.controls["TypeActivity"].value;
    this.Requestdata.Type_Of_Activity_Id =
      this.RequestForm.controls["TypeActivity"].value;
    let workdate = this.datePipe.transform(
      this.RequestForm.controls["Startdate"].value,
      "yyyy-MM-dd"
    );

    this.Requestdata.Working_Date = workdate;
    this.Requestdata.Start_Time = this.RequestForm.controls["StartTime"].value;
    this.Requestdata.End_Time = this.RequestForm.controls["EndTime"].value;
    //this.Requestdata.Site_Id = this.RequestForm.controls["Site"].value;
    this.Requestdata.building_name = this.RequestForm.controls["Building"].value;
    this.Requestdata.Room_Type = this.RequestForm.controls["FloorName"].value;
    this.Requestdata.Room_Nos = this.RequestForm.controls["Room"].value;
    // roomoarr.toString();
    
    // this.Requestdata.Room_Type = this.RequestForm.controls["RoomType"].value;
    this.Requestdata.Crane_Requested =
      this.RequestForm.controls["CMTdata"].value;
    this.Requestdata.Crane_Number = this.RequestForm.controls["CmtValue"].value;
    this.Requestdata.Tools = this.RequestForm.controls["Tools"].value;
    this.Requestdata.Machinery = this.RequestForm.controls["Machinery"].value;
    this.Requestdata.Hot_work = this.RequestForm.controls["HOTWORK"].value;
    this.Requestdata.Certified_Person =
      this.RequestForm.controls["CertifiedPerson"].value;
    this.Requestdata.LOTO_Procedure =
      this.RequestForm.controls["LOTOPROCEDURE"].value;
    this.Requestdata.LOTO_Number =
      this.RequestForm.controls["LOTONumber"].value;

    this.Requestdata.Power_Off_Required =
      this.RequestForm.controls["Poweroff"].value;
    this.Requestdata.Number_Of_Workers =
      this.RequestForm.controls["peopleinvalidcount"].value;
    this.Requestdata.Notes = this.RequestForm.controls["Note"].value;

    this.Requestdata.Badge_Numbers =
      this.RequestForm.controls["BADGENUMBER"].value.toString();

    this.requestsserivies.CreateNewRequest(this.Requestdata).subscribe(
      (res) => {
        this.spinner = false;
        this.openSnackBar("Request Created Successfully");
      },
      (error) => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }

  UpdateRequest() {
    var badarray = [];
    this.spinner = true;

    this.safetyprecdata.forEach((x) => {
      badarray.push(x["id"]);
    });

    this.updaterequestdata.Assign_Start_Time =
      this.RequestForm.controls["AssignStartTime"].value;
    this.updaterequestdata.Assign_End_Time =
      this.RequestForm.controls["AssignEndTime"].value;
    this.updaterequestdata.Special_Instructions =
      this.RequestForm.controls["SpecialInstruction"].value;
    // this.updaterequestdata.Safety_Precautions = this.safetyprecdata.map(obj => obj.id).join(",");//this.RequestForm.controls["Safetyprecaustion"].value;
    // this.updaterequestdata.Safety_Precautions =  badarray.toString();
    this.updaterequestdata.Request_status =
      this.RequestForm.controls["Status"].value;
    var badarray = [];
    var roomoarr = [];
    this.Badges.forEach((x) => {
      badarray.push(x["badgeId"]);
    });
    this.Rooms.forEach((x) => {
      roomoarr.push(x["room_id"]);
    });
    this.updaterequestdata.Room_Nos =
      this.RequestForm.controls["Room"].value.toString();

    this.updaterequestdata.Activity =
      this.RequestForm.controls["Activity"].value;
    // this.updaterequestdata.Badge_Numbers = this.RequestForm.controls["BADGENUMBER"].value;
    this.updaterequestdata.Badge_Numbers =
      this.RequestForm.controls["BADGENUMBER"].value.toString();
    // this.updaterequestdata.Site_Id = this.RequestForm.controls["Site"].value;
    this.updaterequestdata.Building_Id =
      this.RequestForm.controls["Building"].value;
    this.updaterequestdata.Room_Type =
      this.RequestForm.controls["FloorName"].value;
    // this.updaterequestdata.Request_Date = this.RequestForm.controls["Requestdate"].value;
    this.updaterequestdata.Company_Name =
      this.RequestForm.controls["Companyname"].value;
    this.updaterequestdata.Sub_Contractor_Id =
      this.RequestForm.controls["SubContractor"].value;
    this.updaterequestdata.teamId = this.RequestForm.controls["Team"].value;
    this.updaterequestdata.Foreman = this.RequestForm.controls["Foreman"].value;
    this.updaterequestdata.Foreman_Phone_Number =
      this.RequestForm.controls["ForemanPhone"].value;
    // this.Requestdata.Type_Of_Activity_Id=this.RequestForm.controls["TypeActivity"].value;
    this.updaterequestdata.Type_Of_Activity_Id =
      this.RequestForm.controls["TypeActivity"].value;
    let workdate = this.datePipe.transform(
      this.RequestForm.controls["Startdate"].value,
      "yyyy-MM-dd"
    );

    this.updaterequestdata.Working_Date = workdate;
    this.updaterequestdata.Start_Time =
      this.RequestForm.controls["StartTime"].value;
    this.updaterequestdata.End_Time =
      this.RequestForm.controls["EndTime"].value;
    //this.Requestdata.Site_Id = this.RequestForm.controls["Site"].value;
    // this.Requestdata.Building_Id = this.RequestForm.controls["Building"].value;
    // this.Requestdata.Floor_Id = this.RequestForm.controls["FloorName"].value;
    // this.updaterequestdata.Room_Nos = roomoarr.toString();
    // this.updaterequestdata.Room_Type =
    //   this.RequestForm.controls["RoomType"].value;
    this.updaterequestdata.Crane_Requested =
      this.RequestForm.controls["CMTdata"].value;
    this.updaterequestdata.Crane_Number =
      this.RequestForm.controls["CmtValue"].value;
    this.updaterequestdata.Tools = this.RequestForm.controls["Tools"].value;
    this.updaterequestdata.Machinery =
      this.RequestForm.controls["Machinery"].value;
    this.updaterequestdata.Hot_work =
      this.RequestForm.controls["HOTWORK"].value;
    this.updaterequestdata.Certified_Person =
      this.RequestForm.controls["CertifiedPerson"].value;
    this.updaterequestdata.LOTO_Procedure =
      this.RequestForm.controls["LOTOPROCEDURE"].value;
    this.updaterequestdata.LOTO_Number =
      this.RequestForm.controls["LOTONumber"].value;

    this.updaterequestdata.Power_Off_Required =
      this.RequestForm.controls["Poweroff"].value;
    this.updaterequestdata.Number_Of_Workers =
      this.RequestForm.controls["peopleinvalidcount"].value;
    this.updaterequestdata.Notes = this.RequestForm.controls["Note"].value;
    this.updaterequestdata.Safety_Precautions =
      this.RequestForm.controls["Safetyprecaustion"].value.toString();

    this.requestsserivies.UpdateRequest(this.updaterequestdata).subscribe(
      (res) => {
        this.spinner = false;
        this.openSnackBar("Request Updated Successfully");
        this.requestsserivies.SelectedRequestData = {};
      },
      (error) => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }

  UpdateRequestDraftToHold(data) {
    var badarray = [];
    this.spinner = true;

    this.safetyprecdata.forEach((x) => {
      badarray.push(x["id"]);
    });

    this.updaterequestdata.Assign_Start_Time =
      this.RequestForm.controls["AssignStartTime"].value;
    this.updaterequestdata.Assign_End_Time =
      this.RequestForm.controls["AssignEndTime"].value;
    this.updaterequestdata.Special_Instructions =
      this.RequestForm.controls["SpecialInstruction"].value;
    // this.updaterequestdata.Safety_Precautions = this.safetyprecdata.map(obj => obj.id).join(",");//this.RequestForm.controls["Safetyprecaustion"].value;
    // this.updaterequestdata.Safety_Precautions =  badarray.toString();
    this.updaterequestdata.Request_status = data;
    var badarray = [];
    var roomoarr = [];
    this.Badges.forEach((x) => {
      badarray.push(x["badgeId"]);
    });
    this.Rooms.forEach((x) => {
      roomoarr.push(x["room_id"]);
    });
    this.updaterequestdata.Room_Nos =
      this.RequestForm.controls["Room"].value.toString();

    this.updaterequestdata.Activity =
      this.RequestForm.controls["Activity"].value;
    // this.updaterequestdata.Badge_Numbers = this.RequestForm.controls["BADGENUMBER"].value;
    this.updaterequestdata.Badge_Numbers =
      this.RequestForm.controls["BADGENUMBER"].value.toString();
    // this.updaterequestdata.Site_Id = this.RequestForm.controls["Site"].value;
    this.updaterequestdata.Building_Id =
      this.RequestForm.controls["Building"].value;
    this.updaterequestdata.Room_Type =
      this.RequestForm.controls["FloorName"].value;
    // this.updaterequestdata.Request_Date = this.RequestForm.controls["Requestdate"].value;
    this.updaterequestdata.Company_Name =
      this.RequestForm.controls["Companyname"].value;
    this.updaterequestdata.Sub_Contractor_Id =
      this.RequestForm.controls["SubContractor"].value;
    this.updaterequestdata.teamId = this.RequestForm.controls["Team"].value;
    this.updaterequestdata.Foreman = this.RequestForm.controls["Foreman"].value;
    this.updaterequestdata.Foreman_Phone_Number =
      this.RequestForm.controls["ForemanPhone"].value;
    this.updaterequestdata.Type_Of_Activity_Id =
      this.RequestForm.controls["TypeActivity"].value;
    let workdate = this.datePipe.transform(
      this.RequestForm.controls["Startdate"].value,
      "yyyy-MM-dd"
    );

    this.updaterequestdata.Working_Date = workdate;
    this.updaterequestdata.Start_Time =
      this.RequestForm.controls["StartTime"].value;
    this.updaterequestdata.End_Time =
      this.RequestForm.controls["EndTime"].value;
    // this.updaterequestdata.Room_Type =
    //   this.RequestForm.controls["RoomType"].value;
    this.updaterequestdata.Crane_Requested =
      this.RequestForm.controls["CMTdata"].value;
    this.updaterequestdata.Crane_Number =
      this.RequestForm.controls["CmtValue"].value;
    this.updaterequestdata.Tools = this.RequestForm.controls["Tools"].value;
    this.updaterequestdata.Machinery =
      this.RequestForm.controls["Machinery"].value;
    this.updaterequestdata.Hot_work =
      this.RequestForm.controls["HOTWORK"].value;
    this.updaterequestdata.Certified_Person =
      this.RequestForm.controls["CertifiedPerson"].value;
    this.updaterequestdata.LOTO_Procedure =
      this.RequestForm.controls["LOTOPROCEDURE"].value;
    this.updaterequestdata.LOTO_Number =
      this.RequestForm.controls["LOTONumber"].value;

    this.updaterequestdata.Power_Off_Required =
      this.RequestForm.controls["Poweroff"].value;
    this.updaterequestdata.Number_Of_Workers =
      this.RequestForm.controls["peopleinvalidcount"].value;
    this.updaterequestdata.Notes = this.RequestForm.controls["Note"].value;
    this.updaterequestdata.Safety_Precautions =
      this.RequestForm.controls["Safetyprecaustion"].value.toString();

    this.requestsserivies.UpdateRequest(this.updaterequestdata).subscribe(
      (res) => {
        this.spinner = false;
        this.openSnackBar("Request Updated Successfully");
        this.requestsserivies.SelectedRequestData = {};
      },
      (error) => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }

  openPopUp() {
    let title =
      "Submitted Method Statement and Risk assessment for this activity";

    let dialogRef: MatDialogRef<any> = this.dialog.open(
      RequestSaveOptionsDialogComponent,
      {
        width: "500px",
        height: "200px",
        disableClose: false,
        data: { title: title, listitemsstatus: false },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      this.RequestForm.controls["Status"].setValue(result.data);

      this.Requestdata.Request_status = result.data;
      this.CreateRequest();
      //this.userservices.RequestLists.push(this.RequestForm.value);
    });
  }

  openPopUpForDrafToHold() {
    let title =
      "Submitted Method Statement and Risk assessment for this activity";

    let dialogRef: MatDialogRef<any> = this.dialog.open(
      RequestSaveOptionsDialogComponent,
      {
        width: "500px",
        height: "200px",
        disableClose: false,
        data: { title: title, listitemsstatus: false },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      this.RequestForm.controls["Status"].setValue(result.data);

      this.Requestdata.Request_status = result.data;
      this.UpdateRequestDraftToHold(result.data);
      //this.userservices.RequestLists.push(this.RequestForm.value);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value;

    return this.BADGENUMBERS.filter(
      (fruit) => fruit["badgeId"] === filterValue
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.Badges.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.RequestForm.controls["BADGENUMBER"].setValue(null);
  }

  remove(fruit: string): void {
    const index = this.Badges.indexOf(fruit);

    if (index >= 0) {
      this.Badges.splice(index, 1);
    }
  }

  // private _roomfilter(value: string): string[] {
  //   const filterValue = value;

  //   return this.BADGENUMBERS.filter(fruit => fruit["badgeno"] === filterValue);
  // }

  addroom(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.Rooms.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.RequestForm.controls["Room"].setValue(null);
  }

  removeroom(fruit: string): void {
    const index = this.Rooms.indexOf(fruit);

    if (index >= 0) {
      this.Rooms.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.BADGENUMBERS.forEach((x) => {
      if (x["badgeId"] == event.option.value) {
        this.Badges.push(x);
      }
    });
    this.roomInput.nativeElement.value = "";
    this.RequestForm.controls["BADGENUMBER"].setValue(null);
  }

  selectedroomno(event: MatAutocompleteSelectedEvent): void {
    this.RoomsList.forEach((x) => {
      if (x["room_id"] == event.option.value) {
        this.Rooms.push(x);
      }
    });
    //this.Rooms.push(event.option.viewValue);
    this.roomInput.nativeElement.value = "";
    this.RequestForm.controls["Room"].setValue(null);
  }
  private _roomsfilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.RoomsList.filter((room) => room === filterValue);
  }

  selectedsafety(event: MatAutocompleteSelectedEvent): void {
    this.safetyList.forEach((x) => {
      if (x["id"] == event.option.value) {
        this.safetyprecdata.push(x);
      }
    });
    //this.Rooms.push(event.option.viewValue);
    this.roomInput.nativeElement.value = "";
    this.RequestForm.controls["Room"].setValue(null);
  }
  private _safetyfilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.safetyList.filter((room) => room === filterValue);
  }

  addsafety(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.safetyprecdata.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    // this.RequestForm.controls["Safetyprecaustion"].setValue(null);
    this.RequestForm.controls["Safetyprecaustion"].setValue(
      this.safetyprecdata
    );
  }

  removesafety(fruit: string): void {
    const index = this.safetyprecdata.indexOf(fruit);

    if (index >= 0) {
      this.safetyprecdata.splice(index, 1);
    }
  }

  EditFormDataBinding(data) {
    this.RequestForm.controls["Team"].setValue(this.data["teamId"]);

    var roomarrstr = [];
    this.spinner = true;
    this.requestsserivies.GetAllRoomsbyid(data["Floor_Id"]).subscribe((res) => {
      this.spinner = false;
      if (res["message"] == "No Floors Found") {
        this.RoomsList = [];
      } else {
        this.RoomsList = res["data"];
      }
    });

    var badarrstr = [];
    var safetystr = [];
    this.EditSafetyArray.length = 0;
    this.EditSafetyArray = [];
    safetystr = data["Safety_Precautions"].split(",");
    this.RequestForm.controls["Room"].setValue(data["Room_Nos"].split(","));

    this.RequestForm.controls["Safetyprecaustion"].setValue(
      data["Safety_Precautions"].split(",")
    );

    this.Getselectedsubcntrsteams(data["Sub_Contractor_Id"]);

    this.updaterequestdata.id = data["id"];
    this.updaterequestdata.PermitNo = data["PermitNo"];
    this.updaterequestdata.Request_Date = data["Request_Date"];
    this.RequestForm.controls["Companyname"].setValue(data["Company_Name"]);
    this.RequestForm.controls["Requestdate"].setValue(data["Request_Date"]);
    this.RequestForm.controls["SubContractor"].setValue(
      data["Sub_Contractor_Id"]
    );
    this.RequestForm.controls["Status"].setValue(data["Request_status"]);

    this.RequestForm.controls["Foreman"].setValue(data["Foreman"]);
    this.RequestForm.controls["ForemanPhone"].setValue(
      data["Foreman_Phone_Number"]
    );
    this.RequestForm.controls["Site"].setValue(data["Site_Id"]);
    this.RequestForm.controls["Activity"].setValue(data["Activity"]);
    this.RequestForm.controls["TypeActivity"].setValue(
      data["Type_Of_Activity_Id"]
    );
    this.RequestForm.controls["Building"].setValue(data["building_name"]);
    this.RequestForm.controls["CMTdata"].setValue(data["Crane_Requested"]);
    this.RequestForm.controls["CmtValue"].setValue(data["Crane_Number"]);
    this.RequestForm.controls["CertifiedPerson"].setValue(
      data["Certified_Person"]
    );
    this.RequestForm.controls["EndTime"].setValue(data["End_Time"]);
    this.RequestForm.controls["FloorName"].setValue(data["Room_Type"]);
    this.RequestForm.controls["Foreman"].setValue(data["Foreman"]);
    this.RequestForm.controls["ForemanPhone"].setValue(
      data["Foreman_Phone_Number"]
    );
    this.RequestForm.controls["HOTWORK"].setValue(data["Hot_work"]);
    this.RequestForm.controls["LOTONumber"].setValue(data["LOTO_Number"]);
    this.RequestForm.controls["LOTOPROCEDURE"].setValue(data["LOTO_Procedure"]);
    this.RequestForm.controls["Machinery"].setValue(data["Machinery"]);

    var assstarttimestr = data["Assign_Start_Time"].split(":");
    this.RequestForm.controls["AssignStartTime"].setValue(
      assstarttimestr[0] + ":" + assstarttimestr[1]
    );

    //  this.RequestForm.controls['AssignStartTime'].setValue(data["Assign_Start_Time"]);
    var assendtimestr = data["Assign_End_Time"].split(":");
    this.RequestForm.controls["AssignEndTime"].setValue(
      assendtimestr[0] + ":" + assendtimestr[1]
    );

    // this.RequestForm.controls['Safetyprecaustion'].setValue(data["Safety_Precautions"]);
    //this.RequestForm.controls['Safetyprecaustion'].setValue(data["Safety_Precautions"]);
    // console.log(this.safetyList);
    // console.log(data["Safety_Precautions"].split(","));
    // console.log(this.safetyList.map(obj => {
    //   console.log(data["Safety_Precautions"].includes(obj.id))
    //   if (data["Safety_Precautions"].includes(obj.id))
    //     return obj;
    // }))

    this.RequestForm.controls["SpecialInstruction"].setValue(
      data["Special_Instructions"]
    );

    this.RequestForm.controls["Note"].setValue(data["Notes"]);
    // this.RequestForm.controls['Permitnumber'].setValue(data["Certified_Person"]);
    this.RequestForm.controls["Poweroff"].setValue(data["Power_Off_Required"]);
    //this.RequestForm.controls['Requestdate'].setValue(data["Certified_Person"]);
    // var roomarrstr = [];
    // roomarrstr = data["Room_Nos"].split(",");
    // this.RequestForm.controls['Room'].setValue(roomarrstr);
    this.RequestForm.controls["RoomType"].setValue(data["Room_Type"]);
    var starttimestr = data["Start_Time"].split(":");

    this.RequestForm.controls["StartTime"].setValue(
      starttimestr[0] + ":" + starttimestr[1]
    );
    var endtimestr = data["End_Time"].split(":");
    this.RequestForm.controls["EndTime"].setValue(
      endtimestr[0] + ":" + endtimestr[1]
    );
    this.RequestForm.controls["Startdate"].setValue(data["Working_Date"]);
    this.RequestForm.controls["Tools"].setValue(data["Tools"]);
    this.RequestForm.controls["peopleinvalidcount"].setValue(
      data["Number_Of_Workers"]
    );
    if (data["Crane_Requested"] === "1") {
      this.iscmsyes = true;
      //this.RequestForm.controls['CmtValue'].setValue(data["CmtValue"]);
    } else {
      this.iscmsyes = false;
    }

    if (data["Hot_work"] === "1") {
      this.ishotworkyes = true;
    } else {
      this.ishotworkyes = false;
    }

    if (data["LOTO_Procedure"] === "1") {
      this.isLOTOPROCEDUREyes = true;
    } else {
      this.isLOTOPROCEDUREyes = false;
    }
  }

  GetEmployees(event) {
    let emps = [];
    let selectedbadgs = [];
    this.teamservices
      .GetAllTeamsById(Number.parseInt(event))
      .subscribe((res) => {
        emps = res["employeeIds"].split(",");
        this.spinner = true;
        this.Requestdata.teamId = event;

        this.BADGENUMBERS.forEach((p) => {
          emps.forEach((y) => {
            if (y == p["id"]) {
              selectedbadgs.push(p["badgeId"]);
            }
          });
        });
        this.RequestForm.controls["BADGENUMBER"].setValue(selectedbadgs);
        if (this.editform == true && this.BADGENUMBERS.length > 0) {
          this.RequestForm.controls["BADGENUMBER"].setValue(
            this.data["payload"]["Badge_Numbers"].split(",")
          );
        }
        this.spinner = false;
      });

    // this.empservice.GetAllEmployeesBySubContrId(id).subscribe(res => {
    //   console.log(res);
    //   // this.spinner = false;
    // if (res["data"] != undefined) {
    //   this.BADGENUMBERS = res["data"];
    // }

    // if (this.editform == true && this.BADGENUMBERS.length > 0) {

    //   this.BADGENUMBERS.forEach(x => {
    //     this.EditbadgeArray.forEach(y => {
    //       if (x["badgeId"] == y) {
    //         this.Badges.push(x);
    //       }
    //     });
    //    });

    //   }
    //   this.filteredBadges = this.RequestForm.controls["BADGENUMBER"].valueChanges.pipe(
    //     startWith(null),
    //     map((fruit: string | null) => fruit ? this._filter(fruit) : this.BADGENUMBERS.slice()));
    // });
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,
    });
  }
  BacktoList() {
    this.route.navigateByUrl("/user/list-request");
  }

  // BacktoListt() {
  //   this.route.navigateByUrl("/user/new-request");
  // }

  public loadComplete(pdf: PDFDocumentProxy): void {
    for (let i = 1; i <= pdf.numPages; i++) {
      // track the current page
      let currentPage = null;
      pdf
        .getPage(i)
        .then((p) => {
          currentPage = p;
          // get the annotations of the current page
          return p.getAnnotations();
        })
        .then((ann) => {
          // ugly cast due to missing typescript definitions
          // please contribute to complete @types/pdfjs-dist
          const annotations = (<any>ann) as PDFAnnotationData[];

          annotations
            .filter((a) => a.subtype === "Widget") // get the form field annotation only
            .forEach((a) => {
              var pdfRect = [0, 0, 140, 150];

              // a.rect[0]=236;
              // a.rect[1]=700;
              // a.rect[2]=523;
              // a.rect[3]=721;
              // get the rectangle that represent the single field
              // and resize it according to the current DPI
              var scale = 1;
              var rotation = 1;

              // a.rect[0]=a.rect[0];
              // a.rect[1]=a.rect[1];
              // a.rect[2]=a.rect[2]-a.rect[0];
              // a.rect[3]=a.rect[3]-a.rect[1];
              // const fieldRect = currentPage.getViewport({ scale: scale, rotation: rotation })
              //     .convertToViewportRectangle(a.rect);
              // add the corresponding input
              this.addInput(a, a.rect);
            });
        });
    }
  }
  private createInput(annotation: PDFAnnotationData, rect: number[] = null) {
    let formControl = new FormControl(annotation.buttonValue || "");

    const input = new Inputdata();
    input.name = annotation.fieldName;

    if (annotation.subtype === "Link") {
      input.type = "button";
      input.value = annotation.buttonValue || "";
    }
    if (annotation.fieldType === "Btn") {
      input.type = "button";

      input.name = annotation.fieldName || "";
      input.value = annotation.fieldName || "";
    }

    // Calculate all the positions and si zes
    if (rect) {
      input.top = rect[1];
      input.left = rect[0];
      //input.height = (rect[3] - rect[1]);
      //input.width = (rect[2] - rect[0]);
      // input.top = rect[1];
      //input.left = rect[0];

      // input.height = rect[0] + rect[2];
      //input.width = rect[1] - rect[3];

      // input.top =  rect[0];
      // yMin = y
      // xMax = x + width
      // yMax = y + height
    }
    this.inputList.push(input);
    return formControl;
  }

  private addInput(annotation: PDFAnnotationData, rect: number[] = null): void {
    // add input to page

    // var topPos = annotation.rect[0]+ window.scrollY;
    // var leftPos = annotation.rect[1] + window.scrollX;
    //         rect[0]=topPos;
    //         rect[1]=leftPos;
    this.myForm.addControl(
      annotation.fieldName,
      this.createInput(annotation, rect)
    );

    //this.myForm.addControl('new', new FormControl(''));
  }

  public getInputPosition(input: Inputdata): any {
    if (input.value === "R1") {
      return {
        // top: `${input.top-130}px`,
        // left: `${input.left+142}px`,
        // height: `${input.height+42}px`,
        // width: `${input.width+53}px`,
        top: `208.4px`,
        left: `260.8px`,
        height: `200px`,
        width: `157px`,
      };
    } else if (input.value === "R2") {
      return {
        top: `13px`,
        left: `566.32px`,
        height: `200px`,
        width: `195px`,
      };
    } else if (input.value === "R3") {
      return {
        top: `-185.32px`,
        left: `870.84px`,
        height: `200px`,
        width: `200px`,
      };
    }
  }

  eventCheck(event) {}

  Backto() {
    console.log("test");
    this.isnewrequestcreated = false;
  }
}
