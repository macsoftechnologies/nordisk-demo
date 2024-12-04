
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  EditRequestDto,
  UpdateClose_Status,
} from "app/views/Models/RequestDto";
import { RequestService } from "app/shared/services/request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { config } from "config";
import * as moment from 'moment';

@Component({
  selector: "app-status-change-dialog",
  templateUrl: "./status-change-dialog.component.html",
  styleUrls: ["./status-change-dialog.component.css"],
})
export class StatusChangeDialogComponent implements OnInit {
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
    createdTime: null,
    name_of_the_fire_watcher: null,
    phone_number_of_fire_watcher: null,
    tasks_in_progress_in_the_area: null,
    account_during_the_work: null,
    lighting_sufficiently: null,
    spesific_risks_based_on_task: null,
    work_environment_safety_ensured: null,
    course_of_action_in_emergencies: null,
    fire_watch_establish: null,
    combustible_material: null,
    extinguishers_and_fire_blanket: null,
    safety_measures: null,
    welding_activitiy: null,
    heat_treatment: null,
    air_extraction_be_established: null,
    new_sub_contractor: null,
    affecting_other_contractors: null,
    other_conditions: null,
    lighting_begin_work: null,
    specific_risks: null,
    environment_ensured: null,
    course_of_action: null,
    working_on_electrical_system: null,
    responsible_for_the_informed: null,
    de_energized: null,
    if_no_loto: null,
    do_risk_assessment: null,
    if_yes_loto: null,
    electricity_have_isulation: null,
    electrician_certification: null,
    working_hazardious_substen: null,
    relevant_mal: null,
    msds: null,
    ventilation: null,
    equipment_taken_account: null,
    hazardaus_substances: null,
    storage_and_disposal: null,
    reachable_case: null,
    checical_risk_assessment: null,
    pressure_tesing_of_equipment: null,
    transfer_of_palnt: null,
    area_drained: null,
    area_depressurised: null,
    area_flused: null,
    tank_area_container: null,
    system_free_for_dust: null,
    loto_plan_submitted: null,
    working_at_height: null,
    segragated_demarkated: null,
    lanyard_attachments: null,
    rescue_plan: null,
    avoid_hazards: null,
    height_training: null,
    supervision: null,
    shock_absorbing: null,
    vertical_life: null,
    height_equipments: null,
    secured_falling: null,
    dropped_objects: null,
    safe_acces: null,
    weather_acceptable: null,
    working_confined_spaces: null,
    vapours_gases: null,
    lel_measurement: null,
    all_equipment: null,
    exit_conditions: null,
    communication_emergency: null,
    rescue_equipments: null,
    space_ventilation: null,
    oxygen_meter: null,
    work_in_atex_area: null,
    ex_area_downgraded: null,
    atmospheric_tester: null,
    flammable_materials: null,
    potential_explosive: null,
    oxygen_meter_confined_spaces: null,
    securing_facilities: null,
    loto_facilities: null,
    system_depressurised: null,
    passive_pause_other: null,
    covered_or_secured: null,
    excavation_works: null,
    excavation_segregated: null,
    nn_standards: null,
    danish_regulation: null,
    safe_access_and_egress: null,
    correctly_sloped: null,
    inspection_dates: null,
    marked_drawings: null,
    underground_areas_cleared: null,
    using_cranes_or_lifting: null,
    appointed_person: null,
    vendor_supplier: null,
    lift_plan: null,
    supplied_and_inspected: null,
    legal_required_certificates: null,
    prapared_lifting: null,
    lifting_task_fenced: null,
    overhead_risks: null,
    visible_clothing: null,
    safety_shoes: null,
    helmet: null,
    rams_file: null,
    description_of_activity: null,
    specific_gloves: null,
    eye_protection: null,
    fall_protection: null,
    hearing_protection: null,
    respiratory_protection: null,
    other_ppe: null,
    other_conditions_input: null,
    people_electrician_certification: null,
  };
  images: any[] = [];
  base64Images: any[] = [];

  Close_Request: UpdateClose_Status = {
    id: null,
    Image: [],
    Request_status: null,
    userId: null,
    createdTime: null,
  };
  userdata: any = {};

  type: string = "";
  croppedImage: string = "";
  isclose: boolean = false;
  isimguploaded: boolean = false;
  spinner: boolean = false;
  CurrenttimeNow: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requestdataservice: RequestService,
    private _snackBar: MatSnackBar,
    private authservice: JwtAuthService
  ) {
    this.userdata = this.authservice.getUser();
  }

  ngOnInit(): void {
    console.log("DATA", this.data)
    this.updaterequestdata.userId = this.userdata["id"];
    this.type = this.data["type"];
    this.updaterequestdata.teamId = this.data["payload"]["teamId"];
    this.updaterequestdata.Activity = this.data["payload"]["Activity"];
    this.updaterequestdata.Assign_Start_Time =
      this.data["payload"]["Assign_Start_Time"];
    this.updaterequestdata.Badge_Numbers =
      this.data["payload"]["Badge_Numbers"];
    this.updaterequestdata.Building_Id = this.data["payload"]["Building_Id"];
    this.updaterequestdata.Certified_Person =
      this.data["payload"]["Certified_Person"];
    this.updaterequestdata.Company_Name = this.data["payload"]["Company_Name"];

    this.updaterequestdata.Crane_Number = this.data["payload"]["Crane_Number"];
    this.updaterequestdata.Crane_Requested =
      this.data["payload"]["Crane_Requested"];
    this.updaterequestdata.End_Time = this.data["payload"]["End_Time"];
    this.updaterequestdata.Floor_Id = this.data["payload"]["Floor_Id"];
    this.updaterequestdata.Foreman = this.data["payload"]["Foreman"];
    this.updaterequestdata.Foreman_Phone_Number =
      this.data["payload"]["Foreman_Phone_Number"];

    this.updaterequestdata.Hot_work = this.data["payload"]["Hot_work"];
    this.updaterequestdata.LOTO_Number = this.data["payload"]["LOTO_Number"];
    this.updaterequestdata.LOTO_Procedure =
      this.data["payload"]["LOTO_Procedure"];
    this.updaterequestdata.Machinery = this.data["payload"]["Machinery"];
    this.updaterequestdata.Notes = this.data["payload"]["Notes"];
    this.updaterequestdata.Number_Of_Workers =
      this.data["payload"]["Number_Of_Workers"];

    this.updaterequestdata.PermitNo = this.data["payload"]["PermitNo"];
    this.updaterequestdata.Power_Off_Required =
      this.data["payload"]["Power_Off_Required"];
    this.updaterequestdata.Request_Date = this.data["payload"]["Request_Date"];
    this.updaterequestdata.Request_status =
      this.data["payload"]["Request_status"];
    this.updaterequestdata.Room_Nos = this.data["payload"]["Room_Nos"];
    this.updaterequestdata.Room_Type = this.data["payload"]["Room_Type"];

    this.updaterequestdata.Safety_Precautions =
      this.data["payload"]["Safety_Precautions"];
    this.updaterequestdata.Site_Id = this.data["payload"]["Site_Id"];
    this.updaterequestdata.Special_Instructions =
      this.data["payload"]["Special_Instructions"];
    this.updaterequestdata.Start_Time = this.data["payload"]["Start_Time"];
    this.updaterequestdata.Sub_Contractor_Id =
      this.data["payload"]["Sub_Contractor_Id"];
    this.updaterequestdata.Tools = this.data["payload"]["Tools"];

    this.updaterequestdata.Type_Of_Activity_Id =
      this.data["payload"]["Type_Of_Activity_Id"];
    this.updaterequestdata.Working_Date = this.data["payload"]["Working_Date"];
    this.updaterequestdata.id = this.data["payload"]["id"];
  }

  Changestatus(statusdata) {
    var today = moment.tz("Europe/Copenhagen"); 
    this.CurrenttimeNow = today.format('HH:mm:ss');
    console.log("Time now", this.CurrenttimeNow)
    // document.getElementById('watch1').innerHTML = today.format('DD/MM/YYYY');
    var t = setTimeout(this.startTime, 500);
    if (statusdata == "Closed") {
      this.isclose = true;
    } else {
      this.isclose = false;
      console.log(config.Denmarktz.split(" "));
      const [currentDenmarkDate, currentDenmarkTime] = [
        ...config.Denmarktz.split(" "),
      ];
      console.log(currentDenmarkTime);
      console.log(currentDenmarkDate);
      this.updaterequestdata.Request_status = statusdata;
      this.updaterequestdata.createdTime = this.CurrenttimeNow;
      console.log(this.updaterequestdata, "test data");

      let formData = new FormData();

      for (const [key, value] of Object.entries(this.updaterequestdata)) {
        formData.append(key, value); // Ensure values are strings if needed
      }

      this.requestdataservice.UpdateRequest(formData as unknown as EditRequestDto).subscribe(
        (x) => {
          if(x.status == 200){
            this.openSnackBar("Request Status Updated Successfully");
            console.log("TEST", this.data.pagedatainfo.Start, this.data.pagedatainfo.Page)
            // window.location.reload();
            // this.ngOnInit();
          }
        },
        (error) => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        }
      );
    }
  }

  startTime() {
    
  }


  Changestatusbysubcontractor(status) {

    var today = moment.tz("Europe/Copenhagen"); 
    this.CurrenttimeNow = today.format('HH:mm:ss');
    console.log("Time now", this.CurrenttimeNow)
    // document.getElementById('watch1').innerHTML = today.format('DD/MM/YYYY');
    var t = setTimeout(this.startTime, 500);

    console.log(config.Denmarktz.split(" "));
    const [currentDenmarkDate, currentDenmarkTime] = [
      ...config.Denmarktz.split(" "),
    ];
    console.log(currentDenmarkTime);
    console.log(currentDenmarkDate);
    const formData = new FormData();
    this.spinner = true;
    this.Close_Request.id = this.updaterequestdata.id;
    this.Close_Request.Request_status = status;
    this.Close_Request.createdTime = this.CurrenttimeNow;

    if (this.images.length > 0) {
      for (var i = 0; i < this.images.length; i++) {
        formData.append("Image[]", this.images[i]);
      }
    }

    // this.Close_Request.Image =  formData;
    //  const formData = new FormData();
    formData.append("id", this.Close_Request.id);
    formData.append("Request_status", this.Close_Request.Request_status);
    formData.append("userId", this.userdata["id"]);
    formData.append("createdTime", this.Close_Request.createdTime);

    this.requestdataservice.CloseRequest(formData).subscribe(
      (res) => {
        if (res.status == 200) {
          this.openSnackBar("Request Status Updated Successfully");
          this.spinner = false;
          // window.location.reload();
          // this.ngOnInit();
        }
      },
      (error) => {
        this.spinner = false;
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }

  Changestatusbysubcontractor1(status) {
    const formData = new FormData();
    this.spinner = true;
    this.Close_Request.id = this.updaterequestdata.id;
    this.Close_Request.Request_status = status;

    if (this.images.length > 0) {
      for (var i = 0; i < this.images.length; i++) {
        formData.append("Image[]", this.images[i]);
      }
    }

    formData.append("id", this.Close_Request.id);
    formData.append("Request_status", this.Close_Request.Request_status);
    formData.append("userId", this.userdata["id"]);

    this.requestdataservice.CloseRequest(formData).subscribe(
      (res) => {
        if (res.status == 200) {
          this.openSnackBar("Request Status Updated Successfully");
          this.spinner = false;
          this.images = null;
          // window.location.reload();
          // this.ngOnInit();
        }
      },
      (error) => {
        this.spinner = false;
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,
    });
  }

  csvInputChange(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.images.push(e.target.files[i]);
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(e.target.files[i]);
      this.isimguploaded = true;
    }
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.base64Images.push(reader.result);
  }
}
