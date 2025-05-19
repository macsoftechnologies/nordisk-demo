
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
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
import { RequestDto, EditRequestDto, FilesRequestDto } from "app/views/Models/RequestDto";
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
import { RequestBuildingModelComponent } from "app/views/Models/request-building-model/request-building-model.component";
import * as moment from 'moment';
import { environment } from "environments/environment";

@Component({
  selector: "app-new-request",
  templateUrl: "./new-request.component.html",
  styleUrls: ["./new-request.component.css"],
})
export class NewRequestComponent implements OnInit {


  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  //pdfSrc ="https://macsof.com/safesite/1complete_plan.pdf";
  hasError: any = false;
  BaseUrl: string = environment.API_URL;
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
  isOtherConditionyes: boolean = false;
  isnightshiftyes: boolean = false;
  isnewhotworkyes: boolean = false;
  iselectricalyes: boolean = false;
  ishazardousyes: boolean = false;
  istestingyes: boolean = false;
  isHeightsyes: boolean = false;
  isConfinedsyes: boolean = false;
  isAtexAreayes: boolean = false;
  isFacilitiesLotoyes: boolean = false;
  isExcavationWorksyes: boolean = false;
  isCraneLiftingyes: boolean = false;
  isLOTOPROCEDUREyes: boolean = false;
  RequestForm: FormGroup;
  FilesRequestForm: FormGroup;
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
  hotWorkHeight: number = 100;
  otherConditionHeight: number = 100;
  electricalHeight: number = 100;
  hazardousHeight: number = 100;
  testingHeight: number = 100;
  HeightsHeight: number = 100;
  ConfinedsHeight: number = 100;
  AtexAreaHeight: number = 100;
  FacilitiesLotoHeight: number = 100;
  ExcavationWorksHeight: number = 100;
  CraneLiftingHeight: number = 100;
  @ViewChild("badgeInput") badgeInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;
  @ViewChild("roomInput") roomInput: ElementRef<HTMLInputElement>;
  @ViewChild("roomauto") roomatAutocomplete: MatAutocomplete;
  @ViewChild('csvInput') csvInput!: ElementRef<HTMLInputElement>;
  @ViewChild('csvInput1') csvInput1!: ElementRef<HTMLInputElement>;
  siteslist: any[] = [];
  buildings: any[] = [];
  floors: any[] = [];

  SubContractors: any[] = [];
  TypeofActivites: any[] = [];
  planSelectedBlocks: any[] = [];

  blocks: any[] = [];

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
      id: 1,
      HOTWORKval: "Yes",
    },
    {
      id: 0,
      HOTWORKval: "No",
    },
  ];
  NEWHOTWORKs: any[] = [
    {
      id: 1,
      NEWHOTWORKval: "Yes",
    },
    {
      id: 0,
      NEWHOTWORKval: "No",
    },
  ];
  ELECTRICAL: any[] = [
    {
      id: 1,
      ELECTRICALval: "Yes",
    },
    {
      id: 0,
      ELECTRICALval: "No",
    },
  ];

  HAZARDOUS: any[] = [
    {
      id: 1,
      HAZARDOUSval: "Yes",
    },
    {
      id: 0,
      HAZARDOUSval: "No",
    },
  ];

  TESTINGs: any[] = [
    {
      id: 1,
      TESTINGsval: "Yes",
    },
    {
      id: 0,
      TESTINGsval: "No",
    },
  ];

  WORKHEIGHT: any[] = [
    {
      id: 1,
      WORKHEIGHTval: "Yes",
    },
    {
      id: 0,
      WORKHEIGHTval: "No",
    },
  ];

  CONFINEDSPACEs: any[] = [
    {
      id: 1,
      CONFINEDSPACEval: "Yes",
    },
    {
      id: 0,
      CONFINEDSPACEval: "No",
    },
  ];

  ATEXAREA: any[] = [
    {
      id: 1,
      ATEXAREAval: "Yes",
    },
    {
      id: 0,
      ATEXAREAval: "No",
    },
  ];

  FACILITIESLOTO: any[] = [
    {
      id: 1,
      FACILITIESLOTOval: "Yes",
    },
    {
      id: 0,
      FACILITIESLOTOval: "No",
    },
  ];

  ExcavationWorks: any[] = [
    {
      id: 1,
      ExcavationWorksval: "Yes",
    },
    {
      id: 0,
      ExcavationWorksval: "No",
    },
  ];

  CraneLifting: any[] = [
    {
      id: 1,
      CraneLiftingval: "Yes",
    },
    {
      id: 0,
      CraneLiftingval: "No",
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
      Statusid: "Approved",
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
  OperatorStatus: any[] = [
    {
      Statusid: "Hold",
      Statusname: "Hold",
    },
    {
      Statusid: "Approved",
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
    night_shift: null,
    new_date: "",
    new_end_time: null,
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
    building_name: null,
    tasks_in_progress_in_the_area: null,
    account_during_the_work: null,
    lighting_sufficiently: null,
    spesific_risks_based_on_task: null,
    work_environment_safety_ensured: null,
    course_of_action_in_emergencies: null,
    name_of_the_fire_watcher: null,
    phone_number_of_fire_watcher: null,
    fire_watch_establish: null,
    combustible_material: null,
    safety_measures: null,
    extinguishers_and_fire_blanket: null,
    welding_activitiy: null,
    air_extraction_be_established: null,
    heat_treatment: null,
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
    electrician_certification: null,
    electricity_have_isulation: null,
    working_hazardious_substen: null,
    relevant_mal: null,
    msds: null,
    equipment_taken_account: null,
    ventilation: null,
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
    height_equipments: null,
    vertical_life: null,
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
    electricity_have_insulation: null,
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
    rams_number: null,
    people_electrician_certification: null,
    denmark_time: null,
    // denmark_date: null,
    //  segragated_demarkated : null,
    system_drained: null,
    excavation_shoring: null,
    createdTime: null,
  };

  
    filesRequestData: FilesRequestDto = {
    userId: null,
    rams_file: null,
    id: null,
  }

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
    rams_file: [],
    description_of_activity: null,
    specific_gloves: null,
    eye_protection: null,
    fall_protection: null,
    hearing_protection: null,
    respiratory_protection: null,
    other_ppe: null,
    other_conditions_input: null,
    people_electrician_certification: null,
    electricity_have_insulation: null,

    ConM_initials: null,
    ConM_initials1: null,
    cancel_reason: null,
    reject_reason: null,
    name_of_the_fire_watcher1: null,
    phone_number_of_fire_watcher1: null,
    denmark_time: null,
    // denmark_date: null,
    // segragated_demarkated : null,
    system_drained: null,
    excavation_shoring: null,
    rams_number: null,
    night_shift: null,
    new_date: "",
    new_end_time: null,
  };

  userdata: any = {};
  planType: string = "";
  FloorMain: any;
  FloorOrdinates: any = [];
  CurrenttimeNow: string;
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
    private teamservices: TeamService,
    private cdr: ChangeDetectorRef
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.spinner = true;
  }

  // Map Co-Ordinates
  LK1 = [
    'B 1.1',
    'B 1.2',
    'B 1.T',
    'B 1.CM',
    'B1.1B',
    'B1.2C',
    'B1.3C',
    'B1.1E',
    'B1.2E'
  ];

  L00 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B 1.4E',
    'B 1.4N',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.4A',
    'B1.4B',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.4D',
    'B1.2D',
    'B1.1D'

  ];

  L01 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B 1.4E',
    'B 1.4N',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.4A',
    'B1.4B',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.4D',
    'B1.2D',
    'B1.1D'
  ];

  L02 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B 1.4 Roof',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.2D',
    'B1.1D'
  ];

  L03 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.2D',
    'B1.1D'
  ];

  L04 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.2D',
    'B1.1D'
  ];

  L05 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.2D',
    'B1.1D'
  ];

  L06 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.2D',
    'B1.1D'
  ];

  L07 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.2D',
    'B1.1D'
  ];

  L08 = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B1.1B',
    'B1.1E',
    'B1.2C',
    'B1.3C',
    'B1.2E',
    'B1.3A',
    'B1.3B',
    'B1.1A',
    'B1.1C',
    'B1.2A',
    'B1.2B',
    'B1.2D',
    'B1.1D'
  ];

  LTA = [
    'B 1.1',
    'B 1.2',
    'B 1.3',
    'B1.2E'
  ];

  // B2 DRWAING CO-ORDINATES

  B2L00 = [
    'B2.1',
    'B2.2',
    'B2.4',
    'B2.5 I',
    'B2.5 II',
    'B2.6',
    'B2.T',
    'B2.2-A',
    'B2.1-A',
    'B2.4-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E',
    // 'B2.1-B',
    // 'B2.2-B',
    // 'B2.4-B',
    // 'B2.1-E'
  ];

  B2L01 = [
    'B2.1',
    'B2.2',
    'B2.4',
    'B2.5 I',
    'B2.5 II',
    'B2.6',
    'B2.1 Roof',
    'B2.2-A',
    'B2.1-A',
    'B2.4-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E',
    // 'B2.1-B',
    // 'B2.2-B',
    // 'B2.4-B',
    // 'B2.1-E'
  ];

  B2L02 = [
    'B2.1',
    'B2.2',
    'B2.4 Roof',
    'B2.5 I',
    'B2.5 II',
    'B2.5 Roof',

    'B2.2-A',
    'B2.1-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E',
    // 'B2.1-B',
    // 'B2.2-B',
    // 'B2.1-E'
  ];

  B2L03 = [
    'B2.1',
    'B2.2',
    'B2.5 I',
    'B2.5 II',

    'B2.2-A',
    'B2.1-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E'
  ];

  B2L04 = [
    'B2.1',
    'B2.2',
    'B2.5 I',
    'B2.5 II',

    'B2.2-A',
    'B2.1-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E'
  ];

  B2L05 = [
    'B2.1',
    'B2.2',
    'B2.5 I',
    'B2.5 II',

    'B2.2-A',
    'B2.1-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E'
  ];

  B2L06 = [
    'B2.1',
    'B2.2',
    'B2.5 I',
    'B2.5 II',

    'B2.2-A',
    'B2.1-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E'
  ];

  B2L07 = [
    'B2.1 Roof',
    'B2.2',
    'B2.5 I',
    'B2.5 II',

    'B2.2-A',
    'B2.1-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E'
  ];

  B2L08 = [
    'B2.1',
    'B2.2',
    'B2.5 Roof',

    'B2.2-A',
    'B2.2-C',
    'B2.1-C',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E',

  ];

  B2LK1 = [
    'B2.1',
    'B2.5 I',
    'B2.5 II',
    'B2.T',

    'B2.1-A',
    'B2.2-C',
    'B2.1-D',
    'B2.1-C',
    'B2.5-B',
    'B2.5-C',
    'B2.5-A',
    'B2.5-D',
    'B2.5-E'
  ]

  // B6 DRWAING CO-ORDINATES

  B6L00A = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.6',
    'B6.T',
    'B6.1A',
    'B6.1Waste',
    'B6.2C',
    'B6.3C'
  ];

  B6L00B = [
    'B6.3',
    'B6.4',
    'B6.5',
    'B6.6',
    'B6.3A',
    'B6.4A',
    'B6.5A',
    'B6.5Waste',
    'B6.6A'
  ];

  B6L01A = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.6',
    'B6.1A',
    'B6.1C',
    'B6.1D',
    'B6.1Waste',
    'B6.2C',
    'B6.3C'
  ];

  B6L01B = [
    'B6.3',
    'B6.4',
    'B6.5',
    'B6.6',
    'B6.3A',
    'B6.4A',
    'B6.5A',
    'B6.5Waste',
    'B6.6A',
  ];

  B6L02A = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.6',
    'B6.1A',
    'B6.1D',
    'B6.1C',
    'B6.1Waste',
    'B6.2C',
    'B6.3C',
  ];

  B6L02B = [
    'B6.3',
    'B6.4',
    'B6.5',
    'B6.6',
    'B6.3A',
    'B6.4A',
    'B6.5A',
    'B6.5Waste',
    'B6.6A'
  ];

  B6L03A = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.6',
    'B6.1A',
    'B6.1D',
    'B6.1C',
    'B6.1Waste',
    'B6.2C',
    'B6.3C',
  ];

  B6L03B = [
    'B6.3',
    'B6.4',
    'B6.5',
    'B6.6',
    'B6.3A',
  ];

  B6L04 = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.1A',
    'B6.1D',
    'B6.1C',
    'B6.1Waste',
    'B6.2C',
    'B6.3C',
    'B6.3A'

  ];

  B6L05 = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.1A',
    'B6.1D',
    'B6.1C',
    'B6.1Waste',
    'B6.2C',
    'B6.3C',
    'B6.3A'
  ];

  B6L06 = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.1A',
    'B6.1D',
    'B6.1C',
    'B6.1Waste',
    'B6.2C',
    'B6.3C',
    'B6.3A'
  ];

  B6L07 = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.1A',
    'B6.1D',
    'B6.1C',
    'B6.2C',
    'B6.3C',
    'B6.3A'
  ];

  B6L08 = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.1A',
    'B6.1D',
    'B6.1C',
    'B6.1Waste',
    'B6.2C',
    'B6.3C',
    'B6.3A'
  ];

  B6L09 = [
    'B6.1Roof',
    'B6.2Roof',
    'B6.3Roof',
  ];

  B6LK1A = [
    'B6.1',
    'B6.2',
    'B6.3',
    'B6.6'
  ];

  B6LK1B = [
    'B6.3',
    'B6.5',
    'B6.6',
  ];

  // B8 DRWAING CO-ORDINATES

  B8L00 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.4',
    'B8.T',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.3A',
    'B8.3C'

  ];

  B8L01 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.4',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.3A',
    'B8.3C'

  ];
  B8L02 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.4',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.2C',
    'B8.3A',
    'B8.3C'

  ];

  B8L03 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.2C',
    'B8.3A',
    'B8.3C'
  ];

  B8L04 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.2C',
    'B8.3A',
    'B8.3C'

  ];
  B8L05 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.2C',
    'B8.3A',
    'B8.3C'


  ];

  B8L06 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.2C',
    'B8.3A',
    'B8.3C'

  ];

  B8L07 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',
    'B8.2C',
    'B8.3A',
    'B8.3C'
  ];

  B8L08 = [
    'B8.1',
    'B8.2',
    'B8.3',
    'B8.3A',
    'B8.3C',
    'B8.2C',
    'B8.1A',
    'B8.1B',
    'B8.1E',
    'B8.1Waste',

  ];

  B8L09 = [
    'B8.1',
    'B8.2',
    'B8.3',

  ];

  B8LK1 = [
    'B8.1',
    'B8.2',
    'B8.T',


  ];

  JGzones = [
    'Zone-1',
    'Zone-2',
    'Zone-3',
    'Zone-4',

  ]

  JFGroundFloorZones = [
    'ZONE A',
    'ZONE B',

  ]

  ngOnInit(): void {

    // console.log(this.L000)
      this.FilesRequestForm =  this.fb.group({
      rams_file: [""],
    })

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
      night_shift: [""],
      newWorkDate: [""],
      new_end_time: [""],
      Site: ["", Validators.required],
      Building: ["", Validators.required],
      FloorName: ["", Validators.required],
      //  RoomNo: ['', Validators.required],
      RoomType: [""],
      Status: [""],
      Tools: ["", Validators.required],
      peopleinvalidcount: ["", Validators.required],
      Note: [""],
      CmtValue: [""],
      Machinery: ["", Validators.required],
      CertifiedPerson: [""],
      LOTONumber: [""],
      SubContractor: ["", Validators.required],
      BADGENUMBER: [""],
      //Edit form
      AssignStartTime: [""],
      AssignEndTime: [""],
      Safetyprecaustion: [""],
      SpecialInstruction: [""],
      TypeActivity: ["", Validators.required],
      Team: [""],
      //Fedding: this.feedingControl,
      //TechRoom: this.TechRoomControl,
      //Trackname: this.TrackControl,
      // Walkwayname: this.WalkwayControl,
      // Trackblockedname: this.TrackblockedControl,
      //Motorbogie: this.MotorbogieControl,
      //Vehicle: this.VehicleControl,
      //Vehiclestesting: this.VehiclestestingControl,
      //WakingTeam: this.WakingTeamControl,
      // CMTdata: ["", Validators.required],
      Poweroff: [""],
      //Applicant: this.ApplicantControl,
      HOTWORK: ["", Validators.required],
      RAMSNumber: ["", Validators.required],
      fireWatcher: [""],
      fireWatcherNumber: [""],
      floatLabel1: ['', Validators.required],
      // floatLabel2: ['', Validators.required],
      floatLabel3: ['', Validators.required],
      floatLabel4: ['', Validators.required],
      floatLabel5: ['', Validators.required],
      floatLabel6: ['', Validators.required],
      floatLabel7: ['', Validators.required],
      floatLabel8: ['', Validators.required],
      floatLabel9: ['', Validators.required],
      floatLabel10: ['', Validators.required],
      NEWHOTWORK: ['', Validators.required],
      NEWHOTWORK1: ['', Validators.required],
      NEWHOTWORK2: ['', Validators.required],
      LOTOPROCEDURE: [""],
      // new formControl added
      newSubContractor: ["", Validators.required],
      RAMSFileAttach: this.fb.array([]),
      floatLabel11: ['', Validators.required],
      floatLabel12: ['', Validators.required],
      floatLabel13: ['', Validators.required],
      floatLabel14: ['', Validators.required],
      floatLabel15: ['', Validators.required],
      floatLabel16: ['', Validators.required],
      // electrial system form controls
      electricalSystem: ['', Validators.required],
      floatLabel17: ['', Validators.required],
      floatLabel18: ['', Validators.required],
      floatLabel19: ['', Validators.required],
      floatLabel20: ['', Validators.required],
      floatLabel21: ['', Validators.required],
      floatLabel22: ['', Validators.required],
      floatLabel23: ['', Validators.required],

      // HAZARDOUS start
      HAZARDOUS: ['', Validators.required],
      floatLabel24: ['', Validators.required],
      floatLabel25: ['', Validators.required],
      floatLabel26: ['', Validators.required],
      floatLabel27: ['', Validators.required],
      floatLabel28: ['', Validators.required],
      floatLabel29: ['', Validators.required],
      floatLabel30: ['', Validators.required],
      floatLabel31: ['', Validators.required],


      //  <!-- testing start -->

      TESTINGs: ['', Validators.required],
      floatLabel32: ['', Validators.required],
      floatLabel33: ['', Validators.required],
      floatLabel34: ['', Validators.required],
      floatLabel35: ['', Validators.required],
      floatLabel36: ['', Validators.required],
      floatLabel37: ['', Validators.required],
      floatLabel38: ['', Validators.required],

      // <!-- height start -->
      WORKHEIGHT: ['', Validators.required],
      segragated_demarkated: ['', Validators.required],
      floatLabel39: ['', Validators.required],
      floatLabel40: ['', Validators.required],
      floatLabel41: ['', Validators.required],
      floatLabel42: ['', Validators.required],
      floatLabel43: ['', Validators.required],
      floatLabel44: ['', Validators.required],
      floatLabel45: ['', Validators.required],
      floatLabel46: ['', Validators.required],
      floatLabel47: ['', Validators.required],
      floatLabel48: ['', Validators.required],
      floatLabel49: ['', Validators.required],
      floatLabel50: ['', Validators.required],
      // CONFINED SPACE
      CONFINEDSPACE: ['', Validators.required],
      floatLabel51: ['', Validators.required],
      floatLabel52: ['', Validators.required],
      floatLabel53: ['', Validators.required],
      floatLabel54: ['', Validators.required],
      floatLabel55: ['', Validators.required],
      floatLabel56: ['', Validators.required],
      floatLabel57: ['', Validators.required],
      floatLabel58: ['', Validators.required],

      // <!-- ATEXAREA START -->
      ATEXAREA: ['', Validators.required],
      floatLabel59: ['', Validators.required],
      floatLabel60: ['', Validators.required],
      floatLabel61: ['', Validators.required],
      floatLabel62: ['', Validators.required],
      floatLabel63: ['', Validators.required],

      // <!-- FACILITIES LOTO start -->
      FACILITIESLOTO: ['', Validators.required],
      floatLabel64: ['', Validators.required],
      floatLabel65: ['', Validators.required],
      system_drained: ['', Validators.required],
      floatLabel67: ['', Validators.required],
      floatLabel68: ['', Validators.required],
      floatLabel69: ['', Validators.required],
      floatLabel70: ['', Validators.required],
      // <!-- FACILITIES LOTO end -->

      // <!-- Excavation Works Start -->
      ExcavationWorks: ['', Validators.required],
      floatLabel71: ['', Validators.required],
      floatLabel72: ['', Validators.required],
      excavation_shoring: ['', Validators.required],
      floatLabel74: ['', Validators.required],
      floatLabel75: ['', Validators.required],
      floatLabel76: ['', Validators.required],
      floatLabel77: ['', Validators.required],
      floatLabel78: ['', Validators.required],
      floatLabel79: ['', Validators.required],

      // <!-- Crane Lifting start -->
      CraneLifting: ['', Validators.required],
      floatLabel80: ['', Validators.required],
      floatLabel81: ['', Validators.required],
      floatLabel82: ['', Validators.required],
      floatLabel83: ['', Validators.required],
      floatLabel84: ['', Validators.required],
      floatLabel85: ['', Validators.required],
      floatLabel86: ['', Validators.required],
      floatLabel87: ['', Validators.required],

      VisableClothing: [''],
      SafetyShoes: [''],
      Helmet: [''],
      // mandatoryCheck: ["", Validators.required],
      descriptActivity: ["", Validators.required],
      other_conditions_input: ["", Validators.required],
      specific_gloves: ["",],
      eye_protection: ["", Validators.required],
      fall_protection: ["", Validators.required],
      hearing_protection: ["", Validators.required],
      respiratory_protection: ["", Validators.required],
      other_ppe: ["", Validators.required],


      //AccesstoOtherRoom:this.AccesstoroomControl,
      //Keysneeded:this.KeysneedControl,

      Room: [null, Validators.required],
      SubContractorname: [""],
      rams_file: this.fb.control([])
      //Departconfs:this.departconfControl,
      //RequiredDocument:this.RequiredDocumentControl
    }, { validators: this.endTimeValidator }


  );

    this.myForm = this.fb.group({});

    this.userdata = this.jwtauth.getUser();
    this.Requestdata.userId = this.userdata["id"];

    forkJoin(
      this.requestsserivies.GetAllSites(),
      this.subcntrservice.GetAllSubContractors(),
      this.typeactservice.GetAllActivites(),
      this.safetyservice.GetSafetyprecautions()
    ).subscribe((res) => {
      console.log(res, "res11")
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
    console.log(this.data, "rowdata");
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
        this.subeditform = true;
        this.seditform = true;
      } else if (this.userdata["role"] == "Department") {
        this.editform = true;
        this.Assigneditform = true;
        this.Status = this.OperatorStatus;
        this.seditform = true;
        this.subeditform = true;
      }

      this.isnewrequestcreated = true;

      this.NewRequestData = this.data["payload"];
      this.EditFormDataBinding(this.data["payload"]);
    }
    this.name = "site";
  }
  
    
  triggerFileInput(): void {
    if (this.editform) {
      this.csvInput1?.nativeElement.click();
    } else {
      this.csvInput?.nativeElement.click();
    }
  }

  endTimeValidator(control: AbstractControl) {
    const startTime = control.get('StartTime')?.value;
    const endTime = control.get('EndTime')?.value;

    if (startTime && endTime) {
      const start = parseInt(startTime.replace(':', ''), 10);
      const end = parseInt(endTime.replace(':', ''), 10);

      if (end <= start) {
        control.get('EndTime')?.setErrors({ invalidEndTime: true });
      } else {
        control.get('EndTime')?.setErrors(null);
      }
    }
    return null;
  }

  onEndTimeChange() {
    this.RequestForm.get('EndTime')?.updateValueAndValidity();
  }

  toggleNightShift(isChecked: boolean) {
    this.isnightshiftyes = isChecked;
    this.RequestForm.get('night_shift').setValue(isChecked ? 1 : 0);
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
          "M3 South"
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

    console.log(event, "Data")
    this.selectedbuilding = event;
    this.Requestdata.Building_Id = event;
    this.updaterequestdata.Building_Id = event;
    console.log("Update", this.updaterequestdata.Building_Id)
    this.buildings.forEach((x) => {
      if (x["build_id"] == event) {
        this.RequestForm.controls["Building"].setValue(x["building_name"]);
      }
    });
    // console.log("Buildings", this.buildings)
    if (event == '9') {
      console.log("B1")
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
      ];
    }
    else if (event == '10') {
      console.log("B2")
      this.floors = [
        "L00",
        "L01",
        "L02",
        "L03",
        "L04",
        "L05",
        "L06",
        "L07",
        "L08",
        "LK1"
      ];
    }
    else if (event == '11') {
      console.log("B6")
      this.floors = [
        "L00A",
        "L00B",
        "L01A",
        "L01B",
        "L02A",
        "L02B",
        "L03A",
        "L03B",
        "L04",
        "L05",
        "L06",
        "L07",
        "L08",
        "L09",
        "LK1A",
        "LK1B"
      ];
    }
    else if (event == '12') {
      console.log("B8")
      this.floors = [
        "L00",
        "L01",
        "L02",
        "L03",
        "L04",
        "L05",
        "L06",
        "L07",
        "L08",
        "L09",
        "LK1"
      ];
    }
    else if (event == '13') {
      console.log("JG")
      this.floors = [
        // "JG",
        "JF - Ground Floor",
        "JF - 1st Floor",
        "JF- 2nd Floor",
        "JF - Roof Plan",
      ];
    }
    else if (event == '14') {
      // console.log("JG")
      this.floors = [
        "External Areas",

      ];
    }
    else if (event == '15') {
      // console.log("JG")
      this.floors = [
        "MR - Ground Floor",
        "MR - 1st Floor",
        "MR - 2nd Floor",
        "MR - Roof Plan",

      ];
    }
    else if (event == '16') {
        this.floors = [
        "JG - Ground Floor",
        "JG - 1st Floor",
        "JG - 2nd Floor",
        "JG - 3rd Floor",
        "JG - 4th Floor",
        "JG - Roof Plan",
      ];
    }
    this.planType = null;
    this.pdfSrc = null;
    this.spinner = true;
    this.requestsserivies.GetAllFloorsbyid(event).subscribe((res) => {
      this.spinner = false;
      console.log(res, "Floors")

    });
    this.nobuildingmselect = false;
    this.name = "Floor";
  }
  Getselectedflooritem(event) {
    this.selectFloorBlocks = [];
    console.log(this.selectFloorBlocks, 'clear floors')
    console.log(event);
    if (this.selectedbuilding == '9') {
      console.log("B1 Drawing")
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
    }
    else if (this.selectedbuilding == '10') {
      console.log("B2 Drwaing")
      switch (event) {
        case "LK1":
          this.planType = "LK1";
          this.pdfSrc = "assets/images/plans/B2_LK1.pdf";
          break;
        case "L00":
          this.planType = "L00";
          this.pdfSrc = "assets/images/plans/B2_L00.pdf";
          break;
        case "L01":
          this.planType = "L01";
          this.pdfSrc = "assets/images/plans/B2_L01.pdf";
          break;
        case "L02":
          this.planType = "L02";
          this.pdfSrc = "assets/images/plans/B2_L02.pdf";
          break;
        case "L03":
          this.planType = "L03";
          this.pdfSrc = "assets/images/plans/B2_L03.pdf";
          break;
        case "L04":
          this.planType = "L04";
          this.pdfSrc = "assets/images/plans/B2_L04.pdf";
        case "L05":
          this.planType = "L05";
          this.pdfSrc = "assets/images/plans/B2_L05.pdf";
          break;
        case "L06":
          this.planType = "L06";
          this.pdfSrc = "assets/images/plans/B2_L06.pdf";
          break;
        case "L07":
          this.planType = "L07";
          this.pdfSrc = "assets/images/plans/B2_L07.pdf";
          break;
        case "L08":
          this.planType = "L08";
          this.pdfSrc = "assets/images/plans/B2_L08.pdf";
          break;

        default:
          break;
      }
    }

    else if (this.selectedbuilding == '11') {
      console.log("B6 Drwaing")
      switch (event) {
        case "L00A":
          this.planType = "L00A";
          this.pdfSrc = "assets/images/plans/B6_L00A.pdf";
          break;
        case "L00B":
          this.planType = "L00B";
          this.pdfSrc = "assets/images/plans/B6_L00B.pdf";
          break;
        case "L01A":
          this.planType = "L01A";
          this.pdfSrc = "assets/images/plans/B6_L01A.pdf";
          break;
        case "L01B":
          this.planType = "L01B";
          this.pdfSrc = "assets/images/plans/B6_L01B.pdf";
          break;
        case "L02A":
          this.planType = "L02A";
          this.pdfSrc = "assets/images/plans/B6_L02A.pdf";
          break;
        case "L02B":
          this.planType = "L02B";
          this.pdfSrc = "assets/images/plans/B6_L02B.pdf";
          break;
        case "L03A":
          this.planType = "L03A";
          this.pdfSrc = "assets/images/plans/B6_L03A.pdf";
          break;
        case "L03B":
          this.planType = "L03B";
          this.pdfSrc = "assets/images/plans/B6_L03B.pdf";
          break;
        case "L04":
          this.planType = "L04";
          this.pdfSrc = "assets/images/plans/B6_L04.pdf";
          break;
        case "L05":
          this.planType = "L05";
          this.pdfSrc = "assets/images/plans/B6_L05.pdf";
          break;
        case "L06":
          this.planType = "L06";
          this.pdfSrc = "assets/images/plans/B6_L06.pdf";
          break;
        case "L07":
          this.planType = "L07";
          this.pdfSrc = "assets/images/plans/B6_L07.pdf";
          break;
        case "L08":
          this.planType = "L08";
          this.pdfSrc = "assets/images/plans/B6_L08.pdf";
          break;
        case "L09":
          this.planType = "L09";
          this.pdfSrc = "assets/images/plans/B6_L09.pdf";
          break;
        case "LK1A":
          this.planType = "LK1A";
          this.pdfSrc = "assets/images/plans/B6_LK1A.pdf";
          break;
        case "LK1B":
          this.planType = "LK1B";
          this.pdfSrc = "assets/images/plans/B6_LK1B.pdf";
          break;

        default:
          break;
      }
    }

    else if (this.selectedbuilding == '12') {
      console.log("B8 Drwaing")
      switch (event) {
        case "L00":
          this.planType = "L00";
          this.pdfSrc = "assets/images/plans/B8_L00.pdf";
          break;
        case "L01":
          this.planType = "L01";
          this.pdfSrc = "assets/images/plans/B8_L01.pdf";
          break;
        case "L02":
          this.planType = "L02";
          this.pdfSrc = "assets/images/plans/B8_L02.pdf";
          break;
        case "L03":
          this.planType = "L03";
          this.pdfSrc = "assets/images/plans/B8_L03.pdf";
          break;
        case "L04":
          this.planType = "L04";
          this.pdfSrc = "assets/images/plans/B8_L04.pdf";
          break;
        case "L05":
          this.planType = "L05";
          this.pdfSrc = "assets/images/plans/B8_L05.pdf";
          break;
        case "L06":
          this.planType = "L06";
          this.pdfSrc = "assets/images/plans/B8_L06.pdf";
          break;
        case "L07":
          this.planType = "L07";
          this.pdfSrc = "assets/images/plans/B8_L07.pdf";
          break;
        case "L08":
          this.planType = "L08";
          this.pdfSrc = "assets/images/plans/B8_L08.pdf";
          break;
        case "L09":
          this.planType = "L09";
          this.pdfSrc = "assets/images/plans/B8_L09.pdf";
          break;

        case "LK1":
          this.planType = "LK1";
          this.pdfSrc = "assets/images/plans/B8_LK1.pdf";
          break;


        default:
          break;
      }
    }

    else if (this.selectedbuilding == '13') {
      // console.log("JG Drawings")
      switch (event) {
        case "JG":
          this.planType = "JG";
          this.pdfSrc = "assets/images/plans/JF.pdf";
          break;
        case "JF - Ground Floor":
          this.planType = "JF - Ground Floor";
          this.pdfSrc = "assets/images/plans/JF/JF-GroundFloor.pdf";
          this.blocks = [
            { name: "ZONE A", pdfSrc: "assets/images/plans/JF/JF-GroundFloor/JF-GroundFloor-ZoneA.pdf", className: 'jf-ground-zoneA', planType: 'JF - Ground Floor' },
            { name: "ZONE B", pdfSrc: "assets/images/plans/JF/JF-GroundFloor/JF-GroundFloor-ZoneB.pdf", className: 'jf-ground-zoneB', planType: 'JF - Ground Floor' },
            { name: "ZONE C", pdfSrc: "assets/images/plans/JF/JF-GroundFloor/JF-GroundFloor-ZoneC.pdf", className: 'jf-ground-zoneC', planType: 'JF - Ground Floor' },
            { name: "ZONE D", pdfSrc: "assets/images/plans/JF/JF-GroundFloor/JF-GroundFloor-ZoneD.pdf", className: 'jf-ground-zoneD', planType: 'JF - Ground Floor' },
            { name: "ZONE E", pdfSrc: "assets/images/plans/JF/JF-GroundFloor/JF-GroundFloor-ZoneE.pdf", className: 'jf-ground-zoneE', planType: 'JF - Ground Floor' },
            { name: "ZONE F1", pdfSrc: "assets/images/plans/JF/JF-GroundFloor/JF-GroundFloor-ZoneF1.pdf", className: 'jf-ground-zoneF1', planType: 'JF - Ground Floor' },
            { name: "ZONE F2", pdfSrc: "assets/images/plans/JF/JF-GroundFloor/JF-GroundFloor-ZoneF2.pdf", className: 'jf-ground-zoneF2', planType: 'JF - Ground Floor' }
          ]

          break;
        case "JF - 1st Floor":
          this.planType = "JF - 1st Floor";
          this.pdfSrc = "assets/images/plans/JF/JF-1stFloor.pdf";
          this.blocks = [
            { name: "ZONE A", pdfSrc: "assets/images/plans/JF/JF-FirstFloor/JF-FirstFloor-ZoneA.pdf", className: 'jf-first-zoneA', planType: "JF - 1st Floor" },
            { name: "ZONE B", pdfSrc: "assets/images/plans/JF/JF-FirstFloor/JF-FirstFloor-ZoneB.pdf", className: 'jf-first-zoneB', planType: "JF - 1st Floor" },
            { name: "ZONE C", pdfSrc: "assets/images/plans/JF/JF-FirstFloor/JF-FirstFloor-ZoneC.pdf", className: 'jf-first-zoneC', planType: "JF - 1st Floor" },
            { name: "ZONE D", pdfSrc: "assets/images/plans/JF/JF-FirstFloor/JF-FirstFloor-ZoneD.pdf", className: 'jf-first-zoneD', planType: "JF - 1st Floor" },
            { name: "ZONE E", pdfSrc: "assets/images/plans/JF/JF-FirstFloor/JF-FirstFloor-ZoneE.pdf", className: 'jf-first-zoneE', planType: "JF - 1st Floor" },
            { name: "ZONE F1", pdfSrc: "assets/images/plans/JF/JF-FirstFloor/JF-FirstFloor-ZoneF1.pdf", className: 'jf-first-zoneF1', planType: "JF - 1st Floor" },
            { name: "ZONE F2", pdfSrc: "assets/images/plans/JF/JF-FirstFloor/JF-FirstFloor-ZoneF2.pdf", className: 'jf-first-zoneF2', planType: "JF - 1st Floor" }
          ]
          break;
        case "JF- 2nd Floor":
          this.planType = "JF- 2nd Floor";
          this.pdfSrc = "assets/images/plans/JF/JF-2ndFloor.pdf";
          this.blocks = [
            { name: "ZONE A", pdfSrc: "assets/images/plans/JF/JF-SecondFloor/JF-SecondFloor-ZoneA.pdf", className: 'jf-second-zoneA', planType: "JF- 2nd Floor" },
            { name: "ZONE B", pdfSrc: "assets/images/plans/JF/JF-SecondFloor/JF-SecondFloor-ZoneB.pdf", className: 'jf-second-zoneB', planType: "JF- 2nd Floor" },
            { name: "ZONE C", pdfSrc: "assets/images/plans/JF/JF-SecondFloor/JF-SecondFloor-ZoneC.pdf", className: 'jf-second-zoneC', planType: "JF- 2nd Floor" },
            { name: "ZONE D", pdfSrc: "assets/images/plans/JF/JF-SecondFloor/JF-SecondFloor-ZoneD.pdf", className: 'jf-second-zoneD', planType: "JF- 2nd Floor" },
            { name: "ZONE E", pdfSrc: "assets/images/plans/JF/JF-SecondFloor/JF-SecondFloor-ZoneE.pdf", className: 'jf-second-zoneE', planType: "JF- 2nd Floor" },
            { name: "ZONE F1", pdfSrc: "assets/images/plans/JF/JF-SecondFloor/JF-SecondFloor-ZoneF1.pdf", className: 'jf-second-zoneF1', planType: "JF- 2nd Floor" },
            { name: "ZONE F2", pdfSrc: "assets/images/plans/JF/JF-SecondFloor/JF-SecondFloor-ZoneF2.pdf", className: 'jf-second-zoneF2', planType: "JF- 2nd Floor" }
          ]
          break;
        case "JF - Roof Plan":
          this.planType = "JF - Roof Plan";
          this.pdfSrc = "assets/images/plans/JF/JF-RoofPlan.pdf";
          this.blocks = [
            { name: "ZONE A", pdfSrc: "assets/images/plans/JF/JF-RoofFloor/JF-Roof-ZoneA.pdf", className: 'jf-Roof-zoneA', planType: "JF - Roof Plan" },
            { name: "ZONE B", pdfSrc: "assets/images/plans/JF/JF-RoofFloor/JF-Roof-ZoneB.pdf", className: 'jf-Roof-zoneB', planType: "JF - Roof Plan" },
            { name: "ZONE C", pdfSrc: "assets/images/plans/JF/JF-RoofFloor/JF-Roof-ZoneC.pdf", className: 'jf-Roof-zoneC', planType: "JF - Roof Plan" },
            { name: "ZONE D", pdfSrc: "assets/images/plans/JF/JF-RoofFloor/JF-Roof-ZoneD.pdf", className: 'jf-Roof-zoneD', planType: "JF - Roof Plan" },
            { name: "ZONE E", pdfSrc: "assets/images/plans/JF/JF-RoofFloor/JF-Roof-ZoneE.pdf", className: 'jf-Roof-zoneE', planType: "JF - Roof Plan" },
            { name: "ZONE F1", pdfSrc: "assets/images/plans/JF/JF-RoofFloor/JF-Roof-ZoneF1.pdf", className: 'jf-Roof-zoneF1', planType: "JF - Roof Plan" },
            { name: "ZONE F2", pdfSrc: "assets/images/plans/JF/JF-RoofFloor/JF-Roof-ZoneF2.pdf", className: 'jf-Roof-zoneF2', planType: "JF - Roof Plan" }
          ]
          break;

        default:
          break;
      }
    }

    else if (this.selectedbuilding == '14') {
      console.log("JG Drawings")
      switch (event) {
        case "External Areas":
          this.spinner = true;
          this.planType = "External Areas";
          this.pdfSrc = "assets/images/plans/externalAreas/ExternalAreas.pdf";
          this.blocks = [
            { name: "CM", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/CM.pdf", className: 'external-areas-cm', planType: 'External Areas' },
            { name: "JE", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/JE.pdf", className: 'external-areas-je', planType: 'External Areas' },
            { name: "JF", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/JF.pdf", className: 'external-areas-jf', planType: 'External Areas' },
            { name: "JG", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/JG.pdf", className: 'external-areas-jg', planType: 'External Areas' },
            { name: "MR", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/MR.pdf", className: 'external-areas-mr', planType: 'External Areas' },
            { name: "JH-JX-JS", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/JH-JX-JS.pdf", className: 'external-areas-jh-jx-js', planType: 'External Areas' },
            { name: "JJ", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/JJ.pdf", className: 'external-areas-jj', planType: 'External Areas' },
            { name: "MP", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/MP.pdf", className: 'external-areas-mp', planType: 'External Areas' },
            { name: "NH3-KF-MF", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/NH3-KF-MF.pdf", className: 'external-areas-nh3-kf-mf', planType: 'External Areas' },
            { name: "Roads", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/Roads.pdf", className: 'external-areas-roads', planType: 'External Areas' },
            { name: "Welfare", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/Welfare.pdf", className: 'external-areas-welfare', planType: 'External Areas' },
            { name: "JK-JM", pdfSrc: "assets/images/plans/externalAreas/externalAreas_blocks/JK-JM.pdf", className: 'external-areas-JK-JM', planType: 'External Areas' }
          ]
          break;
        default:
          break;
      }
    }

    else if (this.selectedbuilding == '15') {
      // console.log("JG Drawings")
      switch (event) {
        case "MR - Ground Floor":
          this.planType = "MR - Ground Floor";
          this.pdfSrc = "assets/images/plans/MR/MR-GroundFloor.pdf";
          this.blocks = [
            { name: "Zone 0.1_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.1_N.pdf", className: 'mr-ground-Zone0_1_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.1_S", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.1_S.pdf", className: 'mr-ground-Zone0_1_S', planType: 'MR - Ground Floor' },
            { name: "Zone 0.2_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.2_N.pdf", className: 'mr-ground-Zone0_2_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.2_S", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.2_S.pdf", className: 'mr-ground-Zone0_2_S', planType: 'MR - Ground Floor' },
            { name: "Zone 0.3_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.3_N.pdf", className: 'mr-ground-Zone0_3_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.3_S", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.3_S.pdf", className: 'mr-ground-Zone0_3_S', planType: 'MR - Ground Floor' },
            { name: "Zone 0.4_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.4_N.pdf", className: 'mr-ground-Zone0_4_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.4_S", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.4_S.pdf", className: 'mr-ground-Zone0_4_S', planType: 'MR - Ground Floor' },
            { name: "Zone 0.5_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.5_N.pdf", className: 'mr-ground-Zone0_5_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.5_S", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.5_S.pdf", className: 'mr-ground-Zone0_5_S', planType: 'MR - Ground Floor' },
            { name: "Zone 0.6_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.6_N.pdf", className: 'mr-ground-Zone0_6_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.6_S", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.6_S.pdf", className: 'mr-ground-Zone0_6_S', planType: 'MR - Ground Floor' },
            { name: "Zone 0.7_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.7_N.pdf", className: 'mr-ground-Zone0_7_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.P1_N", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.P1_N.pdf", className: 'mr-ground-Zone0_P1_N', planType: 'MR - Ground Floor' },
            { name: "Zone 0.P2_S", pdfSrc: "assets/images/plans/MR/MR-GroundFloor/MR-GroundFloor-Zone0.P2_S.pdf", className: 'mr-ground-Zone0_P2_S', planType: 'MR - Ground Floor' },
          ]
          break;
        case "MR - 1st Floor":
          this.planType = "MR - 1st Floor";
          this.pdfSrc = "assets/images/plans/MR/MR-FirstFloor.pdf";
          this.blocks = [
            { name: "Zone 1.1_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.1_N.pdf", className: 'mr-first-Zone1_1_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.1_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.1_S.pdf", className: 'mr-first-Zone1_1_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.2_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.2_N.pdf", className: 'mr-first-Zone1_2_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.2_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.2_S.pdf", className: 'mr-first-Zone1_2_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.3_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.3_N.pdf", className: 'mr-first-Zone1_3_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.3_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.3_S.pdf", className: 'mr-first-Zone1_3_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.4_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.4_N.pdf", className: 'mr-first-Zone1_4_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.4_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.4_S.pdf", className: 'mr-first-Zone1_4_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.5_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.5_N.pdf", className: 'mr-first-Zone1_5_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.5_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.5_S.pdf", className: 'mr-first-Zone1_5_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.6_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.6_N.pdf", className: 'mr-first-Zone1_6_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.6_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.6_S.pdf", className: 'mr-first-Zone1_6_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.7_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.7_N.pdf", className: 'mr-first-Zone1_7_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.7_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.7_S.pdf", className: 'mr-first-Zone1_7_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.8_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.8_N.pdf", className: 'mr-first-Zone1_8_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.8_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.8_S.pdf", className: 'mr-first-Zone1_8_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.9_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.9_N.pdf", className: 'mr-first-Zone1_9_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.9_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.9_S.pdf", className: 'mr-first-Zone1_9_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.10_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.10_N.pdf", className: 'mr-first-Zone1_10_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.10_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.10_S.pdf", className: 'mr-first-Zone1_10_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.11_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.11_S.pdf", className: 'mr-first-Zone1_11_S', planType: "MR - 1st Floor" },
            { name: "Zone 1.P1_N", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.P1_N.pdf", className: 'mr-first-Zone1_P1_N', planType: "MR - 1st Floor" },
            { name: "Zone 1.P2_S", pdfSrc: "assets/images/plans/MR/MR-FirstFloor/MR-FirstFloor-Zone1.P2_S.pdf", className: 'mr-first-Zone1_P2_S', planType: "MR - 1st Floor" },
          ]
          break;
        case "MR - 2nd Floor":
          this.planType = "MR - 2nd Floor";
          this.pdfSrc = "assets/images/plans/MR/MR-SecondFloor.pdf";
          this.blocks = [
            { name: "Zone 2.1_N", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.1_N.pdf", className: 'mr-second-Zone2_1_N', planType: "MR - 2nd Floor" },
            { name: "Zone 2.1_S", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.1_S.pdf", className: 'mr-second-Zone2_1_S', planType: "MR - 2nd Floor" },
            { name: "Zone 2.2_N", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.2_N.pdf", className: 'mr-second-Zone2_2_N', planType: "MR - 2nd Floor" },
            { name: "Zone 2.2_S", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.2_S.pdf", className: 'mr-second-Zone2_2_S', planType: "MR - 2nd Floor" },
            { name: "Zone 2.3_N", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.3_N.pdf", className: 'mr-second-Zone2_3_N', planType: "MR - 2nd Floor" },
            { name: "Zone 2.3_S", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.3_S.pdf", className: 'mr-second-Zone2_3_S', planType: "MR - 2nd Floor" },
            { name: "Zone 2.4_N", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.4_N.pdf", className: 'mr-second-Zone2_4_N', planType: "MR - 2nd Floor" },
            { name: "Zone 2.4_S", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.4_S.pdf", className: 'mr-second-Zone2_4_S', planType: "MR - 2nd Floor" },
            { name: "Zone 2.5_N", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.5_N.pdf", className: 'mr-second-Zone2_5_N', planType: "MR - 2nd Floor" },
            { name: "Zone 2.6_N", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.6_N.pdf", className: 'mr-second-Zone2_6_N', planType: "MR - 2nd Floor" },
            { name: "Zone 2.P1_N", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.P1_N.pdf", className: 'mr-second-Zone2_P1_N', planType: "MR - 2nd Floor" },
            { name: "Zone 2.P2_S", pdfSrc: "assets/images/plans/MR/MR-SecondFloor/MR-SecondFloor-Zone2.P2_S.pdf", className: 'mr-second-Zone2_P2_S', planType: "MR - 2nd Floor" },

          ]
          break;
        case "MR - Roof Plan":
          this.planType = "MR - Roof Plan";
          this.pdfSrc = "assets/images/plans/MR/MR-RoofPlan.pdf";
          this.blocks = [
            { name: "Zone R1", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR1.pdf", className: 'mr-Roof-ZoneR1', planType: "MR - Roof Plan" },
            { name: "Zone R2", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR2.pdf", className: 'mr-Roof-ZoneR2', planType: "MR - Roof Plan" },
            { name: "Zone R3", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR3.pdf", className: 'mr-Roof-ZoneR3', planType: "MR - Roof Plan" },
            { name: "Zone R4", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR4.pdf", className: 'mr-Roof-ZoneR4', planType: "MR - Roof Plan" },
            { name: "Zone R5", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR5.pdf", className: 'mr-Roof-ZoneR5', planType: "MR - Roof Plan" },
            { name: "Zone R6", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR6.pdf", className: 'mr-Roof-ZoneR6', planType: "MR - Roof Plan" },
            { name: "Zone R7", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR7.pdf", className: 'mr-Roof-ZoneR7', planType: "MR - Roof Plan" },
            { name: "Zone R8", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR8.pdf", className: 'mr-Roof-ZoneR8', planType: "MR - Roof Plan" },
            { name: "Zone R9", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR9.pdf", className: 'mr-Roof-ZoneR9', planType: "MR - Roof Plan" },
            { name: "Zone R10", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR10.pdf", className: 'mr-Roof-ZoneR10', planType: "MR - Roof Plan" },
            { name: "Zone R11", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR11.pdf", className: 'mr-Roof-ZoneR11', planType: "MR - Roof Plan" },
            { name: "Zone R12", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR12.pdf", className: 'mr-Roof-ZoneR12', planType: "MR - Roof Plan" },
            { name: "Zone R13", pdfSrc: "assets/images/plans/MR/MR-RoofPlan/MR-RoofPlan-ZoneR13.pdf", className: 'mr-Roof-ZoneR13', planType: "MR - Roof Plan" },
          ]
          break;

        default:
          break;
      }
    }

    else if (this.selectedbuilding == '16') {
      // console.log("JG Drawings")
      switch (event) {
        case "JG - Ground Floor":
          this.planType = "JG - Ground Floor";
          this.pdfSrc = "assets/images/plans/JG/JG-GroundFloor.pdf";
          this.blocks = [
            { name: "Zone S.0XX", pdfSrc: "assets/images/plans/JG/JG-GroundFloor/JG-GroundFloor-ZoneS.0XX.pdf", className: 'jg-ground-ZoneS_0_X_X', planType: 'JG - Ground Floor' },
            { name: "Zone S.1XX", pdfSrc: "assets/images/plans/JG/JG-GroundFloor/JG-GroundFloor-ZoneS.1XX.pdf", className: 'jg-ground-ZoneS_1_X_X', planType: 'JG - Ground Floor' },
            { name: "Zone S.2XX", pdfSrc: "assets/images/plans/JG/JG-GroundFloor/JG-GroundFloor-ZoneS.2XX.pdf", className: 'jg-ground-ZoneS_2_X_X', planType: 'JG - Ground Floor' },
            { name: "Zone S.3XX", pdfSrc: "assets/images/plans/JG/JG-GroundFloor/JG-GroundFloor-ZoneS.3XX.pdf", className: 'jg-ground-ZoneS_3_X_X', planType: 'JG - Ground Floor' },
          ]
          break;
        case "JG - 1st Floor":
          this.planType = "JG - 1st Floor";
          this.pdfSrc = "assets/images/plans/JG/JG-FirstFloor.pdf";
          this.blocks = [
            { name: "Zone 1.0XX", pdfSrc: "assets/images/plans/JG/JG-FirstFloor/JG-FirstFloorZone1.0XX.pdf", className: 'jg-first-Zone1_0_X_X', planType: 'JG - 1st Floor' },
            { name: "Zone 1.1XX", pdfSrc: "assets/images/plans/JG/JG-FirstFloor/JG-FirstFloorZone1.1XX.pdf", className: 'jg-first-Zone1_1_X_X', planType: 'JG - 1st Floor' },
            { name: "Zone 1.2XX", pdfSrc: "assets/images/plans/JG/JG-FirstFloor/JG-FirstFloorZone1.2XX.pdf", className: 'jg-first-Zone1_2_X_X', planType: 'JG - 1st Floor' },
            { name: "Zone 1.3XX", pdfSrc: "assets/images/plans/JG/JG-FirstFloor/JG-FirstFloorZone1.3XX.pdf", className: 'jg-first-Zone1_3_X_X', planType: 'JG - 1st Floor' },
          ]
          break;
        case "JG - 2nd Floor":
            this.planType = "JG - 2nd Floor";
            this.pdfSrc = "assets/images/plans/JG/JG-SecondFloor.pdf";
            this.blocks = [
              { name: "Zone 2.0XX", pdfSrc: "assets/images/plans/JG/JG-SecondFloor/JG-SecondFloor-Zone2.0XX.pdf", className: 'jg-second-zone2_0_X_X', planType: 'JG - 2nd Floor' },
              { name: "Zone 2.1XX", pdfSrc: "assets/images/plans/JG/JG-SecondFloor/JG-SecondFloor-Zone2.1XX.pdf", className: 'jg-second-zone2_1_X_X', planType: 'JG - 2nd Floor' },
              { name: "Zone 2.2XX", pdfSrc: "assets/images/plans/JG/JG-SecondFloor/JG-SecondFloor-Zone2.2XX.pdf", className: 'jg-second-zone2_2_X_X', planType: 'JG - 2nd Floor' },
              { name: "Zone 2.3XX", pdfSrc: "assets/images/plans/JG/JG-SecondFloor/JG-SecondFloor-Zone2.3XX.pdf", className: 'jg-second-zone2_3_X_X', planType: 'JG - 2nd Floor' },
            ]
            break;
        case "JG - 3rd Floor":
              this.planType = "JG - 3rd Floor";
              this.pdfSrc = "assets/images/plans/JG/JG-TirdFloor.pdf";
              this.blocks = [
                { name: "Zone 3.0XX", pdfSrc: "assets/images/plans/JG/JG-TirdFloor/JG-ThirdFloor-Zone3.0XX.pdf", className: 'jg-third-Zone3_0_X_X', planType: 'JG - 3rd Floor' },
                { name: "Zone 3.3XX", pdfSrc: "assets/images/plans/JG/JG-TirdFloor/JG-ThirdFloor-Zone3.3XX.pdf", className: 'jg-third-Zone3_3_X_X', planType: 'JG - 3rd Floor' },
              ]
              break;
        case "JG - 4th Floor":
                this.planType = "JG - 4th Floor";
                this.pdfSrc = "assets/images/plans/JG/JG-FourthFloor.pdf";
                this.blocks = [
                  { name: "Zone 4.0XX", pdfSrc: "assets/images/plans/JG/JG-FourthFloor/JG-FourthFloor-Zone4.0XX.pdf", className: 'jg-fourth-Zone4_0_X_X', planType: 'JG - 4th Floor' },
                  { name: "Zone 4.1XX", pdfSrc: "assets/images/plans/JG/JG-FourthFloor/JG-FourthFloor-Zone4.1XX.pdf", className: 'jg-fourth-Zone4_1_X_X', planType: 'JG - 4th Floor' },
                  { name: "Zone 4.2XX", pdfSrc: "assets/images/plans/JG/JG-FourthFloor/JG-FourthFloor-Zone4.2XX.pdf", className: 'jg-fourth-Zone4_2_X_X', planType: 'JG - 4th Floor' },
                  { name: "Zone 4.3XX", pdfSrc: "assets/images/plans/JG/JG-FourthFloor/JG-FourthFloor-Zone4.3XX.pdf", className: 'jg-fourth-Zone4_3_X_X', planType: 'JG - 4th Floor' },
            ]
                break;   
        case "JG - Roof Plan":
                  this.planType = "JG - Roof Plan";
                  this.pdfSrc = "assets/images/plans/JG/JG-Roof.pdf";
                  this.blocks = [
                    { name: "Zone 5.0XX", pdfSrc: "assets/images/plans/JG/JG-Roof/JG-Roof-Zone5.0XX.pdf", className: 'jg-roof-Zone5_0_X_X', planType: 'JG - Roof Plan' },
                    { name: "Zone 5.1XX", pdfSrc: "assets/images/plans/JG/JG-Roof/JG-Roof-Zone5.1XX.pdf", className: 'jg-roof-Zone5_1_X_X', planType: 'JG - Roof Plan' },
                    { name: "Zone 5.2XX", pdfSrc: "assets/images/plans/JG/JG-Roof/JG-Roof-Zone5.2XX.pdf", className: 'jg-roof-Zone5_2_X_X', planType: 'JG - Roof Plan' },
                    { name: "Zone 5.3XX", pdfSrc: "assets/images/plans/JG/JG-Roof/JG-Roof-Zone5.3XX.pdf", className: 'jg-roof-Zone5_3_X_X', planType: 'JG - Roof Plan' },
          ]
                  break;     
        default:
          break;
      }
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
    this.FloorMain = event;
    console.log(this.FloorMain, "For Test")
    this.requestsserivies.GetAllRoomsbyid(event).subscribe((res) => {
      this.spinner = false;
      this.RoomsList = res["data"];
    });

    this.nobuildingmselect = false;
    this.name = "Room";
  }

  onFloorPlanNew(event, planValNew) {
    console.log(planValNew);
    console.log("Event", event)
    this.planSelectedBlocks.push(planValNew)

  }

  onFloorPlan() {
    let currentdate = this.datePipe.transform(this.Reqdate, "yyyy-MM-dd");
    this.RequestForm.controls["Requestdate"].setValue(currentdate);
    this.RequestForm.controls["Companyname"].setValue(
      "M3 South"
    );
    // let blocks = this.selectFloorBlocks.map(item =>  {
    //   item.selectedBlock.forEach(element => {
    //     element.value
    //   })
    // })
    // console.log(blocks, "blocks")
    let blocks = this.selectFloorBlocks.reduce((acc, item) => {
      const values = item.selectedBlock.filter(element => element.isSelected).map(element => element.value);;
      console.log(values, "values")
      return acc.concat(values);

    }, []);
    console.log(blocks, "blocks");

    if (this.selectedbuilding == '9') {
      switch (this.FloorMain) {
        case "LK1":
          this.FloorOrdinates = this.LK1;
          // console.log(this.FloorOrdinates, "tessssst");
          break;

        case "L00":
          this.FloorOrdinates = this.L00;
          break;

        case "L01":
          this.FloorOrdinates = this.L01;
          break;

        case "L02":
          this.FloorOrdinates = this.L02;
          break;

        case "L03":
          this.FloorOrdinates = this.L03;
          break;

        case "L04":
          this.FloorOrdinates = this.L04;
          break;

        case "L05":
          this.FloorOrdinates = this.L05;
          break;

        case "L06":
          this.FloorOrdinates = this.L06;
          break;

        case "L07":
          this.FloorOrdinates = this.L07;
          break;

        case "L08":
          this.FloorOrdinates = this.L08;
          break;

        case "LTA":
          this.FloorOrdinates = this.LTA;
          break;
      }
    }
    else if (this.selectedbuilding == '10') {
      switch (this.FloorMain) {
        case "LK1":
          this.FloorOrdinates = this.B2LK1;
          // Testing
          // console.log(this.FloorOrdinates, "tessssst");
          break;

        case "L00":
          this.FloorOrdinates = this.B2L00;
          break;

        case "L01":
          this.FloorOrdinates = this.B2L01;
          break;

        case "L02":
          this.FloorOrdinates = this.B2L02;
          break;

        case "L03":
          this.FloorOrdinates = this.B2L03;
          break;

        case "L04":
          this.FloorOrdinates = this.B2L04;
          break;

        case "L05":
          this.FloorOrdinates = this.B2L05;
          break;

        case "L06":
          this.FloorOrdinates = this.B2L06;
          break;

        case "L07":
          this.FloorOrdinates = this.B2L07;
          break;

        case "L08":
          this.FloorOrdinates = this.B2L08;
          break;
      }
    }
    else if (this.selectedbuilding == '11') {
      switch (this.FloorMain) {
        case "L00A":
          this.FloorOrdinates = this.B6L00A;
          // Testing
          // console.log(this.FloorOrdinates, "tessssst");
          break;

        case "L00B":
          this.FloorOrdinates = this.B6L00B;
          break;

        case "L01A":
          this.FloorOrdinates = this.B6L01A;
          break;

        case "L01B":
          this.FloorOrdinates = this.B6L01B;
          break;

        case "L02A":
          this.FloorOrdinates = this.B6L02A;
          break;

        case "L02B":
          this.FloorOrdinates = this.B6L02B;
          break;

        case "L03A":
          this.FloorOrdinates = this.B6L03A;
          break;

        case "L03B":
          this.FloorOrdinates = this.B6L03B;
          break;

        case "L04":
          this.FloorOrdinates = this.B6L04;
          break;

        case "L05":
          this.FloorOrdinates = this.B6L05;
          break;

        case "L06":
          this.FloorOrdinates = this.B6L06;
          break;

        case "L07":
          this.FloorOrdinates = this.B6L07;
          break;

        case "L08":
          this.FloorOrdinates = this.B6L08;
          break;

        case "L09":
          this.FloorOrdinates = this.B6L09;
          break;

        case "LK1A":
          this.FloorOrdinates = this.B6LK1A;
          break;

        case "LK1B":
          this.FloorOrdinates = this.B6LK1B;
          break;
      }
    }
    else if (this.selectedbuilding == '12') {
      switch (this.FloorMain) {
        case "L00":
          this.FloorOrdinates = this.B8L00;
          // Testing
          // console.log(this.FloorOrdinates, "tessssst");
          break;

        case "L01":
          this.FloorOrdinates = this.B8L01;
          break;

        case "L02":
          this.FloorOrdinates = this.B8L02;
          break;

        case "L03":
          this.FloorOrdinates = this.B8L03;
          break;

        case "L04":
          this.FloorOrdinates = this.B8L04;
          break;

        case "L05":
          this.FloorOrdinates = this.B8L05;
          break;

        case "L06":
          this.FloorOrdinates = this.B8L06;
          break;

        case "L07":
          this.FloorOrdinates = this.B8L07;
          break;

        case "L08":
          this.FloorOrdinates = this.B8L08;
          break;

        case "L09":
          this.FloorOrdinates = this.B8L09;
          break;
        case "LK1":
          this.FloorOrdinates = this.B8LK1;
          break;

      }
    }

    else {
      switch (this.FloorMain) {
        case "JG":
          this.FloorOrdinates = this.JGzones;
          // Testing
          // console.log(this.FloorOrdinates, "tessssst");
          break;

      }
    }
    // console.log("block", this.planSelectedBlocks)
    // this.RequestForm.controls["Room"].setValue(this.planSelectedBlocks);
    this.RequestForm.controls["Room"].setValue(blocks);
    this.isnewrequestcreated = this.selectedbuilding && this.selectedfloor && blocks?.length > 0 ? true : false;
    // console.log("form data", this.RequestForm.value);
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
      "Novo Nordisk Project Team"
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
      this.Teams = res["data"] || [];
      if (this.editform == true && this.Teams.length > 0) {
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
          console.log(emps)
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
    if (event == 1) {
      this.hotWorkHeight = 500;
      this.ishotworkyes = true;
    } else {
      this.hotWorkHeight = 100;
      this.ishotworkyes = false;
    }
  }

  GetselectedOtherCondition(event) {
    console.log("other", event.target.value)
    if (event == 1) {
      this.otherConditionHeight = 500;
      this.isOtherConditionyes = true;
    } else {
      this.otherConditionHeight = 100;
      this.isOtherConditionyes = false;
    }
  }
  GetselectedNEWHOTWORKitem(event) {
    if (event == 1) {
      this.isnewhotworkyes = true;
    } else {
      this.isnewhotworkyes = false;
    }
  }

  GetselectedElectricalitem(event) {
    if (event == 1) {
      this.electricalHeight = 500;
      this.iselectricalyes = true;
    } else {
      this.electricalHeight = 100;
      this.iselectricalyes = false;
    }
  }

  GetselectedHazardousitem(event) {
    if (event == 1) {
      this.hazardousHeight = 500;
      this.ishazardousyes = true;
    } else {
      this.hazardousHeight = 100;
      this.ishazardousyes = false;
    }
  }

  GetselectedTestingitem(event) {
    if (event == 1) {
      this.testingHeight = 500;
      this.istestingyes = true;
    } else {
      this.testingHeight = 100;
      this.istestingyes = false;
    }
  }

  GetselectedHeightsitem(event) {
    if (event == 1) {
      this.HeightsHeight = 500;
      this.isHeightsyes = true;
    } else {
      this.HeightsHeight = 100;
      this.isHeightsyes = false;
    }
  }

  GetselectedConfinedSpacesitem(event) {
    if (event == 1) {
      this.ConfinedsHeight = 500;
      this.isConfinedsyes = true;
    } else {
      this.ConfinedsHeight = 100;
      this.isConfinedsyes = false;
    }
  }

  GetselectedAtexAreaitem(event) {
    if (event == 1) {
      this.AtexAreaHeight = 500;
      this.isAtexAreayes = true;
    } else {
      this.AtexAreaHeight = 100;
      this.isAtexAreayes = false;
    }
  }


  GetselectedFacilitiesitem(event) {
    if (event == 1) {
      this.FacilitiesLotoHeight = 500;
      this.isFacilitiesLotoyes = true;
    } else {
      this.FacilitiesLotoHeight = 100;
      this.isFacilitiesLotoyes = false;
    }
  }

  GetselectedExcavationWorksitem(event) {
    if (event == 1) {
      this.ExcavationWorksHeight = 500;
      this.isExcavationWorksyes = true;
    } else {
      this.ExcavationWorksHeight = 100;
      this.isExcavationWorksyes = false;
    }
  }

  GetselectedCraneLiftingitem(event) {
    if (event == 1) {
      this.CraneLiftingHeight = 500;
      this.isCraneLiftingyes = true;
    } else {
      this.CraneLiftingHeight = 100;
      this.isCraneLiftingyes = false;
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
    if(this.RequestForm.get('SubContractor').valid) {
      this.Requestdata.Request_status = "Draft";
    this.CreateRequest();
    } else {
      this.openSnackBar("please select contractor ");
    }
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

    var today = moment.tz("Europe/Copenhagen");
    this.CurrenttimeNow = today.format('HH:mm:ss');
    console.log("Time now", this.CurrenttimeNow)

    const [currentDenmarkDate, currentDenmarkTime] = [
      ...config.Denmarktz.split(" "),
    ];

    console.log(currentDenmarkDate)
    console.log(currentDenmarkTime)

    this.Requestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime];
    // this.Requestdata.denmark_date = currentDenmarkDate;


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
    // let workdate = this.datePipe.transform(
    //   this.RequestForm.controls["Startdate"].value,
    //   "yyyy-MM-dd"
    // );

    // this.Requestdata.Working_Date = workdate;
    let startDateValue = this.RequestForm.controls["Startdate"].value;
    // Check if the start date exists and is valid
    let workdate = startDateValue != '0000-00-00' ? this.datePipe.transform(startDateValue, "yyyy-MM-dd")
      : null;
      let newDate = this.RequestForm.controls["newWorkDate"].value;
      let newdate = newDate != '0000-00-00' ? this.datePipe.transform(newDate, "yyyy-MM-dd")
        : null;
      this.Requestdata.night_shift = this.RequestForm.controls["night_shift"].value;
      this.Requestdata.new_date = newdate;
      this.Requestdata.new_end_time = this.RequestForm.controls["new_end_time"].value;  
    this.Requestdata.Working_Date = workdate;
    this.Requestdata.Start_Time = this.RequestForm.controls["StartTime"].value;
    this.Requestdata.End_Time = this.RequestForm.controls["EndTime"].value;
    //this.Requestdata.Site_Id = this.RequestForm.controls["Site"].value;
    this.Requestdata.building_name = this.RequestForm.controls["Building"].value;
    this.Requestdata.Room_Type = this.RequestForm.controls["FloorName"].value;
    this.Requestdata.Room_Nos = this.RequestForm.controls["Room"].value.toString();
    // roomoarr.toString();

    // this.Requestdata.Room_Type = this.RequestForm.controls["RoomType"].value;
    // this.Requestdata.Crane_Requested =
    //   this.RequestForm.controls["CMTdata"].value;
    this.Requestdata.Crane_Number = this.RequestForm.controls["CmtValue"].value;
    this.Requestdata.Tools = this.RequestForm.controls["Tools"].value;
    this.Requestdata.Machinery = this.RequestForm.controls["Machinery"].value;
    this.Requestdata.Hot_work = this.RequestForm.controls["HOTWORK"].value;

    this.Requestdata.rams_number = this.RequestForm.controls["RAMSNumber"].value;

    this.Requestdata.name_of_the_fire_watcher = this.RequestForm.controls["fireWatcher"].value;
    this.Requestdata.phone_number_of_fire_watcher = this.RequestForm.controls["fireWatcherNumber"].value;

    this.Requestdata.tasks_in_progress_in_the_area = this.RequestForm.controls["floatLabel1"].value;
    // this.Requestdata.account_during_the_work = this.RequestForm.controls["floatLabel2"].value;
    this.Requestdata.lighting_sufficiently = this.RequestForm.controls["floatLabel3"].value;
    this.Requestdata.spesific_risks_based_on_task = this.RequestForm.controls["floatLabel4"].value;
    this.Requestdata.work_environment_safety_ensured = this.RequestForm.controls["floatLabel5"].value;
    this.Requestdata.course_of_action_in_emergencies = this.RequestForm.controls["floatLabel6"].value;

    this.Requestdata.fire_watch_establish = this.RequestForm.controls["floatLabel7"].value;
    this.Requestdata.combustible_material = this.RequestForm.controls["floatLabel8"].value;
    this.Requestdata.safety_measures = this.RequestForm.controls["floatLabel9"].value;
    this.Requestdata.extinguishers_and_fire_blanket = this.RequestForm.controls["floatLabel10"].value;

    this.Requestdata.welding_activitiy = this.RequestForm.controls["NEWHOTWORK"].value;
    this.Requestdata.heat_treatment = this.RequestForm.controls["NEWHOTWORK1"].value;
    this.Requestdata.air_extraction_be_established = this.RequestForm.controls["NEWHOTWORK2"].value;

    // new fields added
    // this.Requestdata.new_sub_contractor = this.RequestForm.controls["NEWHOTWORK2"].value;
    this.Requestdata.affecting_other_contractors = this.RequestForm.controls["floatLabel11"].value;
    this.Requestdata.other_conditions = this.RequestForm.controls["floatLabel12"].value;
    this.Requestdata.lighting_begin_work = this.RequestForm.controls["floatLabel13"].value;
    this.Requestdata.specific_risks = this.RequestForm.controls["floatLabel14"].value;
    this.Requestdata.environment_ensured = this.RequestForm.controls["floatLabel15"].value;
    this.Requestdata.course_of_action = this.RequestForm.controls["floatLabel16"].value;

    // electrical system
    this.Requestdata.working_on_electrical_system = this.RequestForm.controls["electricalSystem"].value;
    this.Requestdata.responsible_for_the_informed = this.RequestForm.controls["floatLabel17"].value;
    this.Requestdata.de_energized = this.RequestForm.controls["floatLabel18"].value;
    this.Requestdata.if_no_loto = this.RequestForm.controls["floatLabel19"].value;
    this.Requestdata.do_risk_assessment = this.RequestForm.controls["floatLabel20"].value;
    this.Requestdata.if_yes_loto = this.RequestForm.controls["floatLabel21"].value;
    this.Requestdata.electricity_have_isulation = this.RequestForm.controls["floatLabel22"].value;
    this.Requestdata.electrician_certification = this.RequestForm.controls["floatLabel23"].value;

    // working_hazardious

    this.Requestdata.working_hazardious_substen = this.RequestForm.controls["HAZARDOUS"].value;
    this.Requestdata.relevant_mal = this.RequestForm.controls["floatLabel24"].value;
    this.Requestdata.msds = this.RequestForm.controls["floatLabel25"].value;
    this.Requestdata.equipment_taken_account = this.RequestForm.controls["floatLabel26"].value;
    this.Requestdata.ventilation = this.RequestForm.controls["floatLabel27"].value;
    this.Requestdata.hazardaus_substances = this.RequestForm.controls["floatLabel28"].value;
    this.Requestdata.storage_and_disposal = this.RequestForm.controls["floatLabel29"].value;
    this.Requestdata.reachable_case = this.RequestForm.controls["floatLabel30"].value;
    this.Requestdata.checical_risk_assessment = this.RequestForm.controls["floatLabel31"].value;

    //  <!-- testing start -->

    this.Requestdata.pressure_tesing_of_equipment = this.RequestForm.controls["TESTINGs"].value;
    this.Requestdata.transfer_of_palnt = this.RequestForm.controls["floatLabel32"].value;
    this.Requestdata.area_drained = this.RequestForm.controls["floatLabel33"].value;
    this.Requestdata.area_depressurised = this.RequestForm.controls["floatLabel34"].value;
    this.Requestdata.area_flused = this.RequestForm.controls["floatLabel35"].value;
    this.Requestdata.tank_area_container = this.RequestForm.controls["floatLabel36"].value;
    this.Requestdata.system_free_for_dust = this.RequestForm.controls["floatLabel37"].value;
    this.Requestdata.loto_plan_submitted = this.RequestForm.controls["floatLabel38"].value;

    // <!-- height start -->

    this.Requestdata.working_at_height = this.RequestForm.controls["WORKHEIGHT"].value;
    this.Requestdata.segragated_demarkated = this.RequestForm.controls["segragated_demarkated"].value;
    this.Requestdata.lanyard_attachments = this.RequestForm.controls["floatLabel39"].value;
    this.Requestdata.rescue_plan = this.RequestForm.controls["floatLabel40"].value;
    this.Requestdata.avoid_hazards = this.RequestForm.controls["floatLabel41"].value;
    this.Requestdata.height_training = this.RequestForm.controls["floatLabel42"].value;
    this.Requestdata.supervision = this.RequestForm.controls["floatLabel43"].value;
    this.Requestdata.shock_absorbing = this.RequestForm.controls["floatLabel44"].value;
    this.Requestdata.height_equipments = this.RequestForm.controls["floatLabel45"].value;
    this.Requestdata.vertical_life = this.RequestForm.controls["floatLabel46"].value;
    this.Requestdata.secured_falling = this.RequestForm.controls["floatLabel47"].value;
    this.Requestdata.dropped_objects = this.RequestForm.controls["floatLabel48"].value;
    this.Requestdata.safe_acces = this.RequestForm.controls["floatLabel49"].value;
    this.Requestdata.weather_acceptable = this.RequestForm.controls["floatLabel50"].value;

    // working_confined_spaces

    this.Requestdata.working_confined_spaces = this.RequestForm.controls["CONFINEDSPACE"].value;
    this.Requestdata.vapours_gases = this.RequestForm.controls["floatLabel51"].value;
    this.Requestdata.lel_measurement = this.RequestForm.controls["floatLabel52"].value;
    this.Requestdata.all_equipment = this.RequestForm.controls["floatLabel53"].value;
    this.Requestdata.exit_conditions = this.RequestForm.controls["floatLabel54"].value;
    this.Requestdata.communication_emergency = this.RequestForm.controls["floatLabel55"].value;
    this.Requestdata.rescue_equipments = this.RequestForm.controls["floatLabel56"].value;
    this.Requestdata.space_ventilation = this.RequestForm.controls["floatLabel57"].value;
    this.Requestdata.oxygen_meter = this.RequestForm.controls["floatLabel58"].value;

    // work_in_atex_area

    this.Requestdata.work_in_atex_area = this.RequestForm.controls["ATEXAREA"].value;
    this.Requestdata.ex_area_downgraded = this.RequestForm.controls["floatLabel59"].value;
    this.Requestdata.atmospheric_tester = this.RequestForm.controls["floatLabel60"].value;
    this.Requestdata.flammable_materials = this.RequestForm.controls["floatLabel61"].value;
    this.Requestdata.potential_explosive = this.RequestForm.controls["floatLabel62"].value;
    this.Requestdata.oxygen_meter_confined_spaces = this.RequestForm.controls["floatLabel63"].value;

    // <!-- FACILITIES LOTO start -->

    this.Requestdata.securing_facilities = this.RequestForm.controls["FACILITIESLOTO"].value;
    this.Requestdata.loto_facilities = this.RequestForm.controls["floatLabel64"].value;
    this.Requestdata.system_depressurised = this.RequestForm.controls["floatLabel65"].value;
    this.Requestdata.system_drained = this.RequestForm.controls["system_drained"].value;
    this.Requestdata.passive_pause_other = this.RequestForm.controls["floatLabel67"].value;
    this.Requestdata.electricity_have_insulation = this.RequestForm.controls["floatLabel68"].value;
    this.Requestdata.covered_or_secured = this.RequestForm.controls["floatLabel69"].value;
    this.Requestdata.people_electrician_certification = this.RequestForm.controls["floatLabel70"].value;
    // this.Requestdata.people_electrician_certification = this.RequestForm.controls["floatLabel71"].value;

    // excavation_works

    this.Requestdata.excavation_works = this.RequestForm.controls["ExcavationWorks"].value;
    this.Requestdata.excavation_segregated = this.RequestForm.controls["floatLabel71"].value;
    this.Requestdata.nn_standards = this.RequestForm.controls["floatLabel72"].value;
    this.Requestdata.excavation_shoring = this.RequestForm.controls["excavation_shoring"].value;
    this.Requestdata.danish_regulation = this.RequestForm.controls["floatLabel74"].value;
    this.Requestdata.safe_access_and_egress = this.RequestForm.controls["floatLabel75"].value;
    this.Requestdata.correctly_sloped = this.RequestForm.controls["floatLabel76"].value;
    this.Requestdata.inspection_dates = this.RequestForm.controls["floatLabel77"].value;
    this.Requestdata.marked_drawings = this.RequestForm.controls["floatLabel78"].value;
    this.Requestdata.underground_areas_cleared = this.RequestForm.controls["floatLabel79"].value;
    // this.Requestdata.underground_areas_cleared = this.RequestForm.controls["floatLabel79"].value;

    // using_cranes_or_lifting

    this.Requestdata.using_cranes_or_lifting = this.RequestForm.controls["CraneLifting"].value;
    this.Requestdata.appointed_person = this.RequestForm.controls["floatLabel80"].value;
    this.Requestdata.vendor_supplier = this.RequestForm.controls["floatLabel81"].value;
    this.Requestdata.lift_plan = this.RequestForm.controls["floatLabel82"].value;
    this.Requestdata.supplied_and_inspected = this.RequestForm.controls["floatLabel83"].value;
    this.Requestdata.legal_required_certificates = this.RequestForm.controls["floatLabel84"].value;
    this.Requestdata.prapared_lifting = this.RequestForm.controls["floatLabel85"].value;
    this.Requestdata.lifting_task_fenced = this.RequestForm.controls["floatLabel86"].value;
    this.Requestdata.overhead_risks = this.RequestForm.controls["floatLabel87"].value;


    this.Requestdata.visible_clothing = this.RequestForm.controls["VisableClothing"].value;
    this.Requestdata.safety_shoes = this.RequestForm.controls["SafetyShoes"].value;
    this.Requestdata.helmet = this.RequestForm.controls["Helmet"].value;

    this.Requestdata.new_sub_contractor = this.RequestForm.controls["newSubContractor"].value;

    this.Requestdata.description_of_activity = this.RequestForm.controls["descriptActivity"].value;
    this.Requestdata.specific_gloves = this.RequestForm.controls["specific_gloves"].value;
    this.Requestdata.eye_protection = this.RequestForm.controls["eye_protection"].value;
    this.Requestdata.fall_protection = this.RequestForm.controls["fall_protection"].value;
    this.Requestdata.hearing_protection = this.RequestForm.controls["hearing_protection"].value;
    this.Requestdata.respiratory_protection = this.RequestForm.controls["respiratory_protection"].value;
    this.Requestdata.other_ppe = this.RequestForm.controls["other_ppe"].value;
    this.Requestdata.other_conditions_input = this.RequestForm.controls["other_conditions_input"].value;

    // this.Requestdata.Certified_Person =
    //   this.RequestForm.controls["CertifiedPerson"].value;
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
    console.log("Requestdata", this.Requestdata)

    this.Requestdata.rams_file = this.RequestForm.controls["rams_file"].value;

    let formData = new FormData();

    for (const [key, value] of Object.entries(this.Requestdata)) {
      if (key !== 'rams_file' && value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }
    
    // Then: Append each file under same 'rams_file[]' field
    if (this.Requestdata.rams_file && this.Requestdata.rams_file.length > 0) {
      (this.Requestdata.rams_file as File[]).forEach((file: File) => {
        formData.append('rams_file[]', file);  // same field name again and again
      });
    }

    console.log(this.RequestForm.controls["rams_file"].value)
    console.log(this.Requestdata.rams_file)

    // for (const [key, value] of Object.entries(this.Requestdata)) {
    //   if (key != 'rams_file') {
    //     formData.append(key, value as string); // Ensure values are strings if needed
    //   }
    // }

    // console.log(this.RequestForm.controls["rams_file"].value)
    // console.log(this.Requestdata.rams_file)
    // formData.append("rams_file", this.Requestdata.rams_file)

    this.requestsserivies.CreateNewRequest(formData).subscribe(
      (res) => {
        this.spinner = false;
        this.openSnackBar("Request Created Successfully");
        this.route.navigateByUrl("/user/list-request");
      },
      (error) => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }

  UpdateRequest() {
    (Object as any).keys(this.RequestForm.controls).forEach((control) => {
      this.RequestForm.get(`${control}`).updateValueAndValidity();
      this.RequestForm.get(`${control}`).markAsTouched();
    });
    console.log("updatefunction Activted...")
    // console.log(this.NewRequestData, 'editttt')
    // console.log("res checking")
    if (this.RequestForm.valid) {
      var badarray = [];
      this.spinner = true;

      this.safetyprecdata.forEach((x) => {
        badarray.push(x["id"]);
      });

      var today = moment.tz("Europe/Copenhagen");
      this.CurrenttimeNow = today.format('HH:mm:ss');
      console.log("Time now", this.CurrenttimeNow)

      const [currentDenmarkDate, currentDenmarkTime] = [
        ...config.Denmarktz.split(" "),
      ];

      console.log(currentDenmarkDate)
      console.log(currentDenmarkTime)

      this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime];
      // this.updaterequestdata.denmark_date = currentDenmarkDate;

      this.updaterequestdata.createdTime = [currentDenmarkDate, currentDenmarkTime];
      console.log(this.updaterequestdata.createdTime, "time")

      this.updaterequestdata.Assign_Start_Time =
        this.RequestForm.controls["AssignStartTime"].value;
      this.updaterequestdata.Assign_End_Time =
        this.RequestForm.controls["AssignEndTime"].value;
      this.updaterequestdata.Special_Instructions =
        this.RequestForm.controls["SpecialInstruction"].value;
      // this.updaterequestdata.Safety_Precautions = this.safetyprecdata.map(obj => obj.id).join(",");//this.RequestForm.controls["Safetyprecaustion"].value;
      // this.updaterequestdata.Safety_Precautions =  badarray.toString();
      if (this.NewRequestData.Request_status == "Draft") {
        this.updaterequestdata.Request_status = "Hold";
      } else {
        this.updaterequestdata.Request_status =
          this.RequestForm.controls["Status"].value;
      }

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
      // this.updaterequestdata.Building_Id =
      //   this.RequestForm.controls["Building"].value;
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
      // let workdate = this.datePipe.transform(
      //   this.RequestForm.controls["Startdate"].value,
      //   "yyyy-MM-dd"
      // );

      let startDateValue = this.RequestForm.controls["Startdate"].value;
            
      let newDateValue = this.RequestForm.controls["newWorkDate"].value;
      // Check if the start date exists and is valid
      let workdate = startDateValue != '0000-00-00' ? this.datePipe.transform(startDateValue, "yyyy-MM-dd")
        : null;
          let newworkdate = newDateValue != '0000-00-00' || newDateValue != "" ? this.datePipe.transform(newDateValue, "yyyy-MM-dd")
        : null;
        this.updaterequestdata.night_shift =
        this.RequestForm.controls["night_shift"].value;
        // this.updaterequestdata.new_date = newworkdate;
        // if(this.isValidDateFormat(this.RequestForm.controls["newWorkDate"].value)) {    
        //   let newDateValue = this.RequestForm.controls["newWorkDate"].value;
        //     let newworkdate = newDateValue != '0000-00-00' ? this.datePipe.transform(newDateValue, "yyyy-MM-dd")
        //   : null;
        //     this.updaterequestdata.new_date = newworkdate;
        //   } else {
        //     this.updaterequestdata.new_date = "";
        //   }
                 this.updaterequestdata.new_date = newworkdate;

          console.log(".....newdateedit", this.updaterequestdata.new_date);
        this.updaterequestdata.new_end_time =
        this.RequestForm.controls["new_end_time"].value;
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
      // this.updaterequestdata.Crane_Requested =
      //   this.RequestForm.controls["CMTdata"].value;
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
      this.updaterequestdata.rams_number = this.RequestForm.controls["RAMSNumber"].value;

      // new fields add

      this.updaterequestdata.name_of_the_fire_watcher = this.RequestForm.controls["fireWatcher"].value;
      this.updaterequestdata.phone_number_of_fire_watcher = this.RequestForm.controls["fireWatcherNumber"].value;

      this.updaterequestdata.tasks_in_progress_in_the_area = this.RequestForm.controls["floatLabel1"].value;
      // this.updaterequestdata.account_during_the_work = this.RequestForm.controls["floatLabel2"].value;
      this.updaterequestdata.lighting_sufficiently = this.RequestForm.controls["floatLabel3"].value;
      this.updaterequestdata.spesific_risks_based_on_task = this.RequestForm.controls["floatLabel4"].value;
      this.updaterequestdata.work_environment_safety_ensured = this.RequestForm.controls["floatLabel5"].value;
      this.updaterequestdata.course_of_action_in_emergencies = this.RequestForm.controls["floatLabel6"].value;

      this.updaterequestdata.fire_watch_establish = this.RequestForm.controls["floatLabel7"].value;
      this.updaterequestdata.combustible_material = this.RequestForm.controls["floatLabel8"].value;
      this.updaterequestdata.safety_measures = this.RequestForm.controls["floatLabel9"].value;
      this.updaterequestdata.extinguishers_and_fire_blanket = this.RequestForm.controls["floatLabel10"].value;

      this.updaterequestdata.welding_activitiy = this.RequestForm.controls["NEWHOTWORK"].value;
      this.updaterequestdata.heat_treatment = this.RequestForm.controls["NEWHOTWORK1"].value;
      this.updaterequestdata.air_extraction_be_established = this.RequestForm.controls["NEWHOTWORK2"].value;

      // new fields added
      this.updaterequestdata.new_sub_contractor = this.RequestForm.controls["newSubContractor"].value;

      this.updaterequestdata.affecting_other_contractors = this.RequestForm.controls["floatLabel11"].value;
      this.updaterequestdata.other_conditions = this.RequestForm.controls["floatLabel12"].value;
      this.updaterequestdata.lighting_begin_work = this.RequestForm.controls["floatLabel13"].value;
      this.updaterequestdata.specific_risks = this.RequestForm.controls["floatLabel14"].value;
      this.updaterequestdata.environment_ensured = this.RequestForm.controls["floatLabel15"].value;
      this.updaterequestdata.course_of_action = this.RequestForm.controls["floatLabel16"].value;

      // electrical system
      this.updaterequestdata.working_on_electrical_system = this.RequestForm.controls["electricalSystem"].value;
      this.updaterequestdata.responsible_for_the_informed = this.RequestForm.controls["floatLabel17"].value;
      this.updaterequestdata.de_energized = this.RequestForm.controls["floatLabel18"].value;
      this.updaterequestdata.if_no_loto = this.RequestForm.controls["floatLabel19"].value;
      this.updaterequestdata.do_risk_assessment = this.RequestForm.controls["floatLabel20"].value;
      this.updaterequestdata.if_yes_loto = this.RequestForm.controls["floatLabel21"].value;
      this.updaterequestdata.electricity_have_isulation = this.RequestForm.controls["floatLabel22"].value;
      this.updaterequestdata.electrician_certification = this.RequestForm.controls["floatLabel23"].value;

      // working_hazardious

      this.updaterequestdata.working_hazardious_substen = this.RequestForm.controls["HAZARDOUS"].value;
      this.updaterequestdata.relevant_mal = this.RequestForm.controls["floatLabel24"].value;
      this.updaterequestdata.msds = this.RequestForm.controls["floatLabel25"].value;
      this.updaterequestdata.equipment_taken_account = this.RequestForm.controls["floatLabel26"].value;
      this.updaterequestdata.ventilation = this.RequestForm.controls["floatLabel27"].value;
      this.updaterequestdata.hazardaus_substances = this.RequestForm.controls["floatLabel28"].value;
      this.updaterequestdata.storage_and_disposal = this.RequestForm.controls["floatLabel29"].value;
      this.updaterequestdata.reachable_case = this.RequestForm.controls["floatLabel30"].value;
      this.updaterequestdata.checical_risk_assessment = this.RequestForm.controls["floatLabel31"].value;

      //  <!-- testing start -->

      this.updaterequestdata.pressure_tesing_of_equipment = this.RequestForm.controls["TESTINGs"].value;
      this.updaterequestdata.transfer_of_palnt = this.RequestForm.controls["floatLabel32"].value;
      this.updaterequestdata.area_drained = this.RequestForm.controls["floatLabel33"].value;
      this.updaterequestdata.area_depressurised = this.RequestForm.controls["floatLabel34"].value;
      this.updaterequestdata.area_flused = this.RequestForm.controls["floatLabel35"].value;
      this.updaterequestdata.tank_area_container = this.RequestForm.controls["floatLabel36"].value;
      this.updaterequestdata.system_free_for_dust = this.RequestForm.controls["floatLabel37"].value;
      this.updaterequestdata.loto_plan_submitted = this.RequestForm.controls["floatLabel38"].value;

      // <!-- height start -->

      this.updaterequestdata.working_at_height = this.RequestForm.controls["WORKHEIGHT"].value;
      this.updaterequestdata.segragated_demarkated = this.RequestForm.controls["segragated_demarkated"].value;
      this.updaterequestdata.lanyard_attachments = this.RequestForm.controls["floatLabel39"].value;
      this.updaterequestdata.rescue_plan = this.RequestForm.controls["floatLabel40"].value;
      this.updaterequestdata.avoid_hazards = this.RequestForm.controls["floatLabel41"].value;
      this.updaterequestdata.height_training = this.RequestForm.controls["floatLabel42"].value;
      this.updaterequestdata.supervision = this.RequestForm.controls["floatLabel43"].value;
      this.updaterequestdata.shock_absorbing = this.RequestForm.controls["floatLabel44"].value;
      this.updaterequestdata.height_equipments = this.RequestForm.controls["floatLabel45"].value;
      this.updaterequestdata.vertical_life = this.RequestForm.controls["floatLabel46"].value;
      this.updaterequestdata.secured_falling = this.RequestForm.controls["floatLabel47"].value;
      this.updaterequestdata.dropped_objects = this.RequestForm.controls["floatLabel48"].value;
      this.updaterequestdata.safe_acces = this.RequestForm.controls["floatLabel49"].value;
      this.updaterequestdata.weather_acceptable = this.RequestForm.controls["floatLabel50"].value;

      // working_confined_spaces

      this.updaterequestdata.working_confined_spaces = this.RequestForm.controls["CONFINEDSPACE"].value;
      this.updaterequestdata.vapours_gases = this.RequestForm.controls["floatLabel51"].value;
      this.updaterequestdata.lel_measurement = this.RequestForm.controls["floatLabel52"].value;
      this.updaterequestdata.all_equipment = this.RequestForm.controls["floatLabel53"].value;
      this.updaterequestdata.exit_conditions = this.RequestForm.controls["floatLabel54"].value;
      this.updaterequestdata.communication_emergency = this.RequestForm.controls["floatLabel55"].value;
      this.updaterequestdata.rescue_equipments = this.RequestForm.controls["floatLabel56"].value;
      this.updaterequestdata.space_ventilation = this.RequestForm.controls["floatLabel57"].value;
      this.updaterequestdata.oxygen_meter = this.RequestForm.controls["floatLabel58"].value;

      // work_in_atex_area

      this.updaterequestdata.work_in_atex_area = this.RequestForm.controls["ATEXAREA"].value;
      this.updaterequestdata.ex_area_downgraded = this.RequestForm.controls["floatLabel59"].value;
      this.updaterequestdata.atmospheric_tester = this.RequestForm.controls["floatLabel60"].value;
      this.updaterequestdata.flammable_materials = this.RequestForm.controls["floatLabel61"].value;
      this.updaterequestdata.potential_explosive = this.RequestForm.controls["floatLabel62"].value;
      this.updaterequestdata.oxygen_meter_confined_spaces = this.RequestForm.controls["floatLabel63"].value;

      // <!-- FACILITIES LOTO start -->

      this.updaterequestdata.securing_facilities = this.RequestForm.controls["FACILITIESLOTO"].value;
      this.updaterequestdata.loto_facilities = this.RequestForm.controls["floatLabel64"].value;
      this.updaterequestdata.system_depressurised = this.RequestForm.controls["floatLabel65"].value;
      this.updaterequestdata.system_drained = this.RequestForm.controls["system_drained"].value;
      this.updaterequestdata.passive_pause_other = this.RequestForm.controls["floatLabel67"].value;
      this.updaterequestdata.electricity_have_isulation = this.RequestForm.controls["floatLabel68"].value;
      this.updaterequestdata.covered_or_secured = this.RequestForm.controls["floatLabel69"].value;
      this.updaterequestdata.people_electrician_certification = this.RequestForm.controls["floatLabel70"].value;

      // excavation_works

      this.updaterequestdata.excavation_works = this.RequestForm.controls["ExcavationWorks"].value;
      this.updaterequestdata.excavation_segregated = this.RequestForm.controls["floatLabel71"].value;
      this.updaterequestdata.nn_standards = this.RequestForm.controls["floatLabel72"].value;
      this.updaterequestdata.excavation_shoring = this.RequestForm.controls["excavation_shoring"].value;
      this.updaterequestdata.danish_regulation = this.RequestForm.controls["floatLabel74"].value;
      this.updaterequestdata.safe_access_and_egress = this.RequestForm.controls["floatLabel75"].value;
      this.updaterequestdata.correctly_sloped = this.RequestForm.controls["floatLabel76"].value;
      this.updaterequestdata.inspection_dates = this.RequestForm.controls["floatLabel77"].value;
      this.updaterequestdata.marked_drawings = this.RequestForm.controls["floatLabel78"].value;
      this.updaterequestdata.underground_areas_cleared = this.RequestForm.controls["floatLabel79"].value;

      // using_cranes_or_lifting

      this.updaterequestdata.using_cranes_or_lifting = this.RequestForm.controls["CraneLifting"].value;
      this.updaterequestdata.appointed_person = this.RequestForm.controls["floatLabel80"].value;
      this.updaterequestdata.vendor_supplier = this.RequestForm.controls["floatLabel81"].value;
      this.updaterequestdata.lift_plan = this.RequestForm.controls["floatLabel82"].value;
      this.updaterequestdata.supplied_and_inspected = this.RequestForm.controls["floatLabel83"].value;
      this.updaterequestdata.legal_required_certificates = this.RequestForm.controls["floatLabel84"].value;
      this.updaterequestdata.prapared_lifting = this.RequestForm.controls["floatLabel85"].value;
      this.updaterequestdata.lifting_task_fenced = this.RequestForm.controls["floatLabel86"].value;
      this.updaterequestdata.overhead_risks = this.RequestForm.controls["floatLabel87"].value;


      this.updaterequestdata.visible_clothing = this.RequestForm.controls["VisableClothing"].value;
      this.updaterequestdata.safety_shoes = this.RequestForm.controls["SafetyShoes"].value;
      this.updaterequestdata.helmet = this.RequestForm.controls["Helmet"].value;

      this.updaterequestdata.description_of_activity = this.RequestForm.controls["descriptActivity"].value;
      this.updaterequestdata.specific_gloves = this.RequestForm.controls["specific_gloves"].value;
      this.updaterequestdata.eye_protection = this.RequestForm.controls["eye_protection"].value;
      this.updaterequestdata.fall_protection = this.RequestForm.controls["fall_protection"].value;
      this.updaterequestdata.hearing_protection = this.RequestForm.controls["hearing_protection"].value;
      this.updaterequestdata.respiratory_protection = this.RequestForm.controls["respiratory_protection"].value;
      this.updaterequestdata.other_ppe = this.RequestForm.controls["other_ppe"].value;
      this.updaterequestdata.other_conditions_input = this.RequestForm.controls["other_conditions_input"].value;

      this.updaterequestdata.Power_Off_Required =
        this.RequestForm.controls["Poweroff"].value;
      this.updaterequestdata.Number_Of_Workers =
        this.RequestForm.controls["peopleinvalidcount"].value;
      this.updaterequestdata.Notes = this.RequestForm.controls["Note"].value;
      this.updaterequestdata.Safety_Precautions =
        this.RequestForm.controls["Safetyprecaustion"].value.toString();

      // this.updaterequestdata.rams_file = this.RequestForm.controls["rams_file"].value;

      let formData = new FormData();

      for (const [key, value] of Object.entries(this.updaterequestdata)) {
        formData.append(key, value as string); // Ensure values are strings if needed
      }

      // formData.append("rams_file", JSON.stringify(this.updaterequestdata.rams_file))


      this.requestsserivies.UpdateRequest(formData as unknown as EditRequestDto).subscribe(
        (res) => {
          this.spinner = false;
          this.openSnackBar("Request Updated Successfully");
          this.requestsserivies.SelectedRequestData = {};
          this.route.navigateByUrl("/user/list-request");
        },
        (error) => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        }
      );
    }  else {
      console.error("Form is invalid. Please check the validation errors.");

  Object.keys(this.RequestForm.controls).forEach((key) => {
    const control = this.RequestForm.get(key);
    if (control && control.invalid) {
      console.error(`Field '${key}' has errors:`, control.errors);
    }
  });
    }
  }

  
  isValidDateFormat(date: string | null | undefined): boolean {
    if (!date) return false; // Handle null, undefined, and empty string
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && date !== '0000-00-00';
  }

  UpdateRequestDraftToHold(data) {
    console.log("draft", data)
    var badarray = [];
    this.spinner = true;

    this.safetyprecdata.forEach((x) => {
      badarray.push(x["id"]);
    });

    const [currentDenmarkDate, currentDenmarkTime] = [
      ...config.Denmarktz.split(" "),
    ];

    console.log(currentDenmarkDate)
    console.log(currentDenmarkTime)

    // this.updaterequestdata.denmark_time = [currentDenmarkDate, currentDenmarkTime];

    this.updaterequestdata.createdTime = [currentDenmarkDate, currentDenmarkTime];
    console.log(this.updaterequestdata.createdTime, "time")

    this.updaterequestdata.Assign_Start_Time =
      this.RequestForm.controls["AssignStartTime"].value;
    this.updaterequestdata.Assign_End_Time =
      this.RequestForm.controls["AssignEndTime"].value;
    this.updaterequestdata.Special_Instructions =
      this.RequestForm.controls["SpecialInstruction"].value;
    // this.updaterequestdata.Safety_Precautions = this.safetyprecdata.map(obj => obj.id).join(",");//this.RequestForm.controls["Safetyprecaustion"].value;
    // this.updaterequestdata.Safety_Precautions =  badarray.toString();

    if (this.NewRequestData.Request_status == "Draft") {
      this.updaterequestdata.Request_status = "Hold";
    } else {
      this.updaterequestdata.Request_status =
        this.RequestForm.controls["Status"].value;
    }

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
    // this.updaterequestdata.Building_Id =
    //   this.RequestForm.controls["Building"].value;
    this.updaterequestdata.Building_Id = data["Building_Id"];
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
    let newworkdate = this.datePipe.transform(
      this.RequestForm.controls["newWorkDate"].value,
      "yyyy-MM-dd"
    );
    this.updaterequestdata.new_date = newworkdate;
    this.updaterequestdata.night_shift =
      this.RequestForm.controls["night_shift"].value;
      // if(this.isValidDateFormat(this.RequestForm.controls["newWorkDate"].value)) {
      //   let newworkdate = this.datePipe.transform(
      //     this.RequestForm.controls["newWorkDate"].value,
      //     "yyyy-MM-dd"
      //   );
      //   this.updaterequestdata.new_date = newworkdate;
      // } else {
      //   this.updaterequestdata.new_date = "";
      // }
      this.updaterequestdata.new_end_time =
      this.RequestForm.controls["new_end_time"].value;
    this.updaterequestdata.Working_Date = workdate;
    this.updaterequestdata.Start_Time =
      this.RequestForm.controls["StartTime"].value;
    this.updaterequestdata.End_Time =
      this.RequestForm.controls["EndTime"].value;
    // this.updaterequestdata.Room_Type =
    //   this.RequestForm.controls["RoomType"].value;
    // this.updaterequestdata.Crane_Requested =
    //   this.RequestForm.controls["CMTdata"].value;
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
      this.updaterequestdata.rams_number = this.RequestForm.controls["RAMSNumber"].value;

    // new fields add

    this.updaterequestdata.name_of_the_fire_watcher = this.RequestForm.controls["fireWatcher"].value;
    this.updaterequestdata.phone_number_of_fire_watcher = this.RequestForm.controls["fireWatcherNumber"].value;

    this.updaterequestdata.tasks_in_progress_in_the_area = this.RequestForm.controls["floatLabel1"].value;
    // this.updaterequestdata.account_during_the_work = this.RequestForm.controls["floatLabel2"].value;
    this.updaterequestdata.lighting_sufficiently = this.RequestForm.controls["floatLabel3"].value;
    this.updaterequestdata.spesific_risks_based_on_task = this.RequestForm.controls["floatLabel4"].value;
    this.updaterequestdata.work_environment_safety_ensured = this.RequestForm.controls["floatLabel5"].value;
    this.updaterequestdata.course_of_action_in_emergencies = this.RequestForm.controls["floatLabel6"].value;

    this.updaterequestdata.fire_watch_establish = this.RequestForm.controls["floatLabel7"].value;
    this.updaterequestdata.combustible_material = this.RequestForm.controls["floatLabel8"].value;
    this.updaterequestdata.safety_measures = this.RequestForm.controls["floatLabel9"].value;
    this.updaterequestdata.extinguishers_and_fire_blanket = this.RequestForm.controls["floatLabel10"].value;

    this.updaterequestdata.welding_activitiy = this.RequestForm.controls["NEWHOTWORK"].value;
    this.updaterequestdata.heat_treatment = this.RequestForm.controls["NEWHOTWORK1"].value;
    this.updaterequestdata.air_extraction_be_established = this.RequestForm.controls["NEWHOTWORK2"].value;

    // new fields added
    this.updaterequestdata.new_sub_contractor = this.RequestForm.controls["newSubContractor"].value;

    this.updaterequestdata.affecting_other_contractors = this.RequestForm.controls["floatLabel11"].value;
    this.updaterequestdata.other_conditions = this.RequestForm.controls["floatLabel12"].value;
    this.updaterequestdata.lighting_begin_work = this.RequestForm.controls["floatLabel13"].value;
    this.updaterequestdata.specific_risks = this.RequestForm.controls["floatLabel14"].value;
    this.updaterequestdata.environment_ensured = this.RequestForm.controls["floatLabel15"].value;
    this.updaterequestdata.course_of_action = this.RequestForm.controls["floatLabel16"].value;

    // electrical system
    this.updaterequestdata.working_on_electrical_system = this.RequestForm.controls["electricalSystem"].value;
    this.updaterequestdata.responsible_for_the_informed = this.RequestForm.controls["floatLabel17"].value;
    this.updaterequestdata.de_energized = this.RequestForm.controls["floatLabel18"].value;
    this.updaterequestdata.if_no_loto = this.RequestForm.controls["floatLabel19"].value;
    this.updaterequestdata.do_risk_assessment = this.RequestForm.controls["floatLabel20"].value;
    this.updaterequestdata.if_yes_loto = this.RequestForm.controls["floatLabel21"].value;
    this.updaterequestdata.electricity_have_isulation = this.RequestForm.controls["floatLabel22"].value;
    this.updaterequestdata.electrician_certification = this.RequestForm.controls["floatLabel23"].value;

    // working_hazardious

    this.updaterequestdata.working_hazardious_substen = this.RequestForm.controls["HAZARDOUS"].value;
    this.updaterequestdata.relevant_mal = this.RequestForm.controls["floatLabel24"].value;
    this.updaterequestdata.msds = this.RequestForm.controls["floatLabel25"].value;
    this.updaterequestdata.equipment_taken_account = this.RequestForm.controls["floatLabel26"].value;
    this.updaterequestdata.ventilation = this.RequestForm.controls["floatLabel27"].value;
    this.updaterequestdata.hazardaus_substances = this.RequestForm.controls["floatLabel28"].value;
    this.updaterequestdata.storage_and_disposal = this.RequestForm.controls["floatLabel29"].value;
    this.updaterequestdata.reachable_case = this.RequestForm.controls["floatLabel30"].value;
    this.updaterequestdata.checical_risk_assessment = this.RequestForm.controls["floatLabel31"].value;

    //  <!-- testing start -->

    this.updaterequestdata.pressure_tesing_of_equipment = this.RequestForm.controls["TESTINGs"].value;
    this.updaterequestdata.transfer_of_palnt = this.RequestForm.controls["floatLabel32"].value;
    this.updaterequestdata.area_drained = this.RequestForm.controls["floatLabel33"].value;
    this.updaterequestdata.area_depressurised = this.RequestForm.controls["floatLabel34"].value;
    this.updaterequestdata.area_flused = this.RequestForm.controls["floatLabel35"].value;
    this.updaterequestdata.tank_area_container = this.RequestForm.controls["floatLabel36"].value;
    this.updaterequestdata.system_free_for_dust = this.RequestForm.controls["floatLabel37"].value;
    this.updaterequestdata.loto_plan_submitted = this.RequestForm.controls["floatLabel38"].value;

    // <!-- height start -->

    this.updaterequestdata.working_at_height = this.RequestForm.controls["WORKHEIGHT"].value;
    this.updaterequestdata.segragated_demarkated = this.RequestForm.controls["segragated_demarkated"].value;
    this.updaterequestdata.lanyard_attachments = this.RequestForm.controls["floatLabel39"].value;
    this.updaterequestdata.rescue_plan = this.RequestForm.controls["floatLabel40"].value;
    this.updaterequestdata.avoid_hazards = this.RequestForm.controls["floatLabel41"].value;
    this.updaterequestdata.height_training = this.RequestForm.controls["floatLabel42"].value;
    this.updaterequestdata.supervision = this.RequestForm.controls["floatLabel43"].value;
    this.updaterequestdata.shock_absorbing = this.RequestForm.controls["floatLabel44"].value;
    this.updaterequestdata.height_equipments = this.RequestForm.controls["floatLabel45"].value;
    this.updaterequestdata.vertical_life = this.RequestForm.controls["floatLabel46"].value;
    this.updaterequestdata.secured_falling = this.RequestForm.controls["floatLabel47"].value;
    this.updaterequestdata.dropped_objects = this.RequestForm.controls["floatLabel48"].value;
    this.updaterequestdata.safe_acces = this.RequestForm.controls["floatLabel49"].value;
    this.updaterequestdata.weather_acceptable = this.RequestForm.controls["floatLabel50"].value;

    // working_confined_spaces

    this.updaterequestdata.working_confined_spaces = this.RequestForm.controls["CONFINEDSPACE"].value;
    this.updaterequestdata.vapours_gases = this.RequestForm.controls["floatLabel51"].value;
    this.updaterequestdata.lel_measurement = this.RequestForm.controls["floatLabel52"].value;
    this.updaterequestdata.all_equipment = this.RequestForm.controls["floatLabel53"].value;
    this.updaterequestdata.exit_conditions = this.RequestForm.controls["floatLabel54"].value;
    this.updaterequestdata.communication_emergency = this.RequestForm.controls["floatLabel55"].value;
    this.updaterequestdata.rescue_equipments = this.RequestForm.controls["floatLabel56"].value;
    this.updaterequestdata.space_ventilation = this.RequestForm.controls["floatLabel57"].value;
    this.updaterequestdata.oxygen_meter = this.RequestForm.controls["floatLabel58"].value;

    // work_in_atex_area

    this.updaterequestdata.work_in_atex_area = this.RequestForm.controls["ATEXAREA"].value;
    this.updaterequestdata.ex_area_downgraded = this.RequestForm.controls["floatLabel59"].value;
    this.updaterequestdata.atmospheric_tester = this.RequestForm.controls["floatLabel60"].value;
    this.updaterequestdata.flammable_materials = this.RequestForm.controls["floatLabel61"].value;
    this.updaterequestdata.potential_explosive = this.RequestForm.controls["floatLabel62"].value;
    this.updaterequestdata.oxygen_meter_confined_spaces = this.RequestForm.controls["floatLabel63"].value;

    // <!-- FACILITIES LOTO start -->

    this.updaterequestdata.securing_facilities = this.RequestForm.controls["FACILITIESLOTO"].value;
    this.updaterequestdata.loto_facilities = this.RequestForm.controls["floatLabel64"].value;
    this.updaterequestdata.system_depressurised = this.RequestForm.controls["floatLabel65"].value;
    this.updaterequestdata.system_drained = this.RequestForm.controls["system_drained"].value;
    this.updaterequestdata.passive_pause_other = this.RequestForm.controls["floatLabel67"].value;
    this.updaterequestdata.electricity_have_isulation = this.RequestForm.controls["floatLabel68"].value;
    this.updaterequestdata.covered_or_secured = this.RequestForm.controls["floatLabel69"].value;
    this.updaterequestdata.people_electrician_certification = this.RequestForm.controls["floatLabel70"].value;

    // excavation_works

    this.updaterequestdata.excavation_works = this.RequestForm.controls["ExcavationWorks"].value;
    this.updaterequestdata.excavation_segregated = this.RequestForm.controls["floatLabel71"].value;
    this.updaterequestdata.nn_standards = this.RequestForm.controls["floatLabel72"].value;
    this.updaterequestdata.excavation_shoring = this.RequestForm.controls["excavation_shoring"].value;
    this.updaterequestdata.danish_regulation = this.RequestForm.controls["floatLabel74"].value;
    this.updaterequestdata.safe_access_and_egress = this.RequestForm.controls["floatLabel75"].value;
    this.updaterequestdata.correctly_sloped = this.RequestForm.controls["floatLabel76"].value;
    this.updaterequestdata.inspection_dates = this.RequestForm.controls["floatLabel77"].value;
    this.updaterequestdata.marked_drawings = this.RequestForm.controls["floatLabel78"].value;
    this.updaterequestdata.underground_areas_cleared = this.RequestForm.controls["floatLabel79"].value;

    // using_cranes_or_lifting

    this.updaterequestdata.using_cranes_or_lifting = this.RequestForm.controls["CraneLifting"].value;
    this.updaterequestdata.appointed_person = this.RequestForm.controls["floatLabel80"].value;
    this.updaterequestdata.vendor_supplier = this.RequestForm.controls["floatLabel81"].value;
    this.updaterequestdata.lift_plan = this.RequestForm.controls["floatLabel82"].value;
    this.updaterequestdata.supplied_and_inspected = this.RequestForm.controls["floatLabel83"].value;
    this.updaterequestdata.legal_required_certificates = this.RequestForm.controls["floatLabel84"].value;
    this.updaterequestdata.prapared_lifting = this.RequestForm.controls["floatLabel85"].value;
    this.updaterequestdata.lifting_task_fenced = this.RequestForm.controls["floatLabel86"].value;
    this.updaterequestdata.overhead_risks = this.RequestForm.controls["floatLabel87"].value;


    this.updaterequestdata.visible_clothing = this.RequestForm.controls["VisableClothing"].value;
    this.updaterequestdata.safety_shoes = this.RequestForm.controls["SafetyShoes"].value;
    this.updaterequestdata.helmet = this.RequestForm.controls["Helmet"].value;

    this.updaterequestdata.description_of_activity = this.RequestForm.controls["descriptActivity"].value;
    this.updaterequestdata.specific_gloves = this.RequestForm.controls["specific_gloves"].value;
    this.updaterequestdata.eye_protection = this.RequestForm.controls["eye_protection"].value;
    this.updaterequestdata.fall_protection = this.RequestForm.controls["fall_protection"].value;
    this.updaterequestdata.hearing_protection = this.RequestForm.controls["hearing_protection"].value;
    this.updaterequestdata.respiratory_protection = this.RequestForm.controls["respiratory_protection"].value;
    this.updaterequestdata.other_ppe = this.RequestForm.controls["other_ppe"].value;
    this.updaterequestdata.other_conditions_input = this.RequestForm.controls["other_conditions_input"].value;

    this.updaterequestdata.Power_Off_Required =
      this.RequestForm.controls["Poweroff"].value;
    this.updaterequestdata.Number_Of_Workers =
      this.RequestForm.controls["peopleinvalidcount"].value;
    this.updaterequestdata.Notes = this.RequestForm.controls["Note"].value;
    this.updaterequestdata.Safety_Precautions =
      this.RequestForm.controls["Safetyprecaustion"].value.toString();

    // this.updaterequestdata.rams_file = this.RequestForm.controls["rams_file"].value;

    let formData = new FormData();

    for (const [key, value] of Object.entries(this.updaterequestdata)) {
      formData.append(key, value as string); // Ensure values are strings if needed
    }

    // formData.append("rams_file", JSON.stringify(this.updaterequestdata.rams_file))


    this.requestsserivies.UpdateRequest(formData as unknown as EditRequestDto).subscribe(
      (res) => {
        this.spinner = false;
        this.openSnackBar("Request Updated Successfully");
        this.requestsserivies.SelectedRequestData = {};
        this.route.navigateByUrl("/user/list-request");
        window.location.reload();
      },
      (error) => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
  }


  openPopUp() {
    (Object as any).keys(this.RequestForm.controls).forEach((control) => {
      this.RequestForm.get(`${control}`).updateValueAndValidity();
      this.RequestForm.get(`${control}`).markAsTouched();
    });
    console.log(this.RequestForm)
    // this.RequestForm.get("newSubContractor").markAsTouched();
    // console.log(this.RequestForm.get("newSubContractor").valid, this.RequestForm.get("newSubContractor").value)
    // if (this.RequestForm.get("newSubContractor").valid) {
    if (this.RequestForm.valid) {
      let title =
        "Can you confirm the RAMS for this work is approved by ConM/HSE?";

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
  }

  openPopUpForDrafToHold() {

    let title =
      "Can you confirm the RAMS for this work is approved by ConM/HSE?";

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
      this.route.navigateByUrl("/user/list-request");
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
    console.log(data, "editdata");
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

    this.selectedbuilding = data["Building_Id"]
    // this.onFloorPlan(data.Room_Type);
    // this.selectedbuildimg = data["Building_Id"]

    if (this.selectedbuilding == '9') {
      switch (data.Room_Type) {
        case "LK1":
          this.FloorOrdinates = this.LK1;
          // console.log(this.FloorOrdinates, "tessssst");
          break;

        case "L00":
          this.FloorOrdinates = this.L00;
          break;

        case "L01":
          this.FloorOrdinates = this.L01;
          break;

        case "L02":
          this.FloorOrdinates = this.L02;
          break;

        case "L03":
          this.FloorOrdinates = this.L03;
          break;

        case "L04":
          this.FloorOrdinates = this.L04;
          break;

        case "L05":
          this.FloorOrdinates = this.L05;
          break;

        case "L06":
          this.FloorOrdinates = this.L06;
          break;

        case "L07":
          this.FloorOrdinates = this.L07;
          break;

        case "L08":
          this.FloorOrdinates = this.L08;
          break;

        case "LTA":
          this.FloorOrdinates = this.LTA;

          break;
      }
    }
    else {
      switch (data.Room_Type) {
        case "LK1":
          this.FloorOrdinates = this.B2LK1;
          // Testing
          // console.log(this.FloorOrdinates, "tessssst");
          break;

        case "L00":
          this.FloorOrdinates = this.B2L00;
          break;

        case "L01":
          this.FloorOrdinates = this.B2L01;
          break;

        case "L02":
          this.FloorOrdinates = this.B2L02;
          break;

        case "L03":
          this.FloorOrdinates = this.B2L03;
          break;

        case "L04":
          this.FloorOrdinates = this.B2L04;
          break;

        case "L05":
          this.FloorOrdinates = this.B2L05;
          break;

        case "L06":
          this.FloorOrdinates = this.B2L06;
          break;

        case "L07":
          this.FloorOrdinates = this.B2L07;
          break;

        case "L08":
          this.FloorOrdinates = this.B2L08;
          break;
      }
    }

    console.log(this.FloorOrdinates, "statinndd", data.Room_Type)
    const roomData = data.Room_Nos.split(",");
    this.RequestForm.controls["Room"].setValue(roomData);
    console.log(roomData, "DEMO")

    this.RequestForm.controls["Safetyprecaustion"].setValue(
      data["Safety_Precautions"].split(",")
    );

    this.Getselectedsubcntrsteams(data["Sub_Contractor_Id"]);

    this.updaterequestdata.id = data["id"];
    this.updaterequestdata.Building_Id = data["Building_Id"];
    console.log("EDIT FORM", this.updaterequestdata.Building_Id)
    this.updaterequestdata.PermitNo = data["PermitNo"];
    this.updaterequestdata.Request_Date = data["Request_Date"];
    this.RequestForm.controls["Companyname"].setValue(data["Company_Name"]);
    this.RequestForm.controls["Requestdate"].setValue(data["Request_Date"]);
    this.RequestForm.controls["SubContractor"].setValue(
      data["Sub_Contractor_Id"] || ''
    );
    this.RequestForm.controls["Status"].setValue(data["Request_status"]);

    this.RequestForm.controls["Foreman"].setValue(data["Foreman"]);
    this.RequestForm.controls["ForemanPhone"].setValue(
      data["Foreman_Phone_Number"]
    );
    this.RequestForm.controls["Site"].setValue(data["Site_Id"]);
    this.RequestForm.controls["Activity"].setValue(data["Activity"]);
    this.RequestForm.controls["TypeActivity"].setValue(data["Type_Of_Activity_Id"] ? Number(data["Type_Of_Activity_Id"]) : '');
    this.RequestForm.controls["Building"].setValue(data["building_name"]);
    // this.RequestForm.controls["CMTdata"].setValue(data["Crane_Requested"]);
    this.RequestForm.controls["CmtValue"].setValue(data["Crane_Number"]);
    this.RequestForm.controls["CertifiedPerson"].setValue(
      data["Certified_Person"]
    );
    this.RequestForm.controls["EndTime"].setValue(data["End_Time"]);
    this.RequestForm.controls["FloorName"].setValue(data["Room_Type"]);

    if (data["Room_Type"]) {
      let selectFloorBlocks = this.requestsserivies.generateBulidFloorData().find(item => item.planType == data["Room_Type"]);
      console.log(selectFloorBlocks);
      let zoneSubList = [];
      let roomNos = data['Room_Nos'].split(',');
      selectFloorBlocks.zoneList.map((item, i) => {
        // item['floorName']= item['floorName'];
        if (item['zoneSubList'].length > 0 && data['Room_Nos']) {
          if (roomNos.length > 0) {
            roomNos.forEach(element => {
              let index = item['zoneSubList'].findIndex(ele => ele['value'] == element);
              if (index > -1) {
                zoneSubList.push(i)
              }
            });
          }
        }
      })
      // remove duplicates in zoneSubList array
      zoneSubList = zoneSubList.filter((item, index) => zoneSubList.indexOf(item) === index);
      console.log(this.selectFloorBlocks);
      console.log(zoneSubList);
      if (zoneSubList.length > 0) {
        zoneSubList.forEach(item => {
          this.selectFloorBlocks.push({ floorName: selectFloorBlocks['zoneList'][item]['floorName'], selectedBlock: selectFloorBlocks['zoneList'][item]['zoneSubList'] });
        });
      }
      console.log(this.selectFloorBlocks);
    }

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
   
    if(data["Start_Time"] !== "00:00:00"){
      var starttimestr = data["Start_Time"].split(":");

      this.RequestForm.controls["StartTime"].setValue(
        starttimestr[0] + ":" + starttimestr[1]
      );
    }else{
      this.RequestForm.controls["StartTime"].setValue(null);
    }

    if(data["End_Time"] !== "00:00:00"){
      var endtimestr = data["End_Time"].split(":");
      this.RequestForm.controls["EndTime"].setValue(
        endtimestr[0] + ":" + endtimestr[1]
      );
    }else{
      this.RequestForm.controls["EndTime"].setValue(null);
    }

    this.RequestForm.controls["Startdate"].setValue(data["Working_Date"]);
    this.RequestForm.controls["night_shift"].setValue(data["night_shift"]);
    this.RequestForm.controls["newWorkDate"].setValue(data["new_date"]);
    this.RequestForm.controls["new_end_time"].setValue(data["new_end_time"]);
    this.RequestForm.controls["Tools"].setValue(data["Tools"]);
    this.RequestForm.controls["peopleinvalidcount"].setValue(
      data["Number_Of_Workers"]
    );
    this.RequestForm.controls["newSubContractor"].setValue(data["new_sub_contractor"]);
    // console.log(typeof data["affecting_other_contractors"]);
    this.RequestForm.controls["floatLabel11"].setValue(data["affecting_other_contractors"]);
    this.RequestForm.controls["floatLabel12"].setValue(data["other_conditions"]);
    this.RequestForm.controls["other_conditions_input"].setValue(data["other_conditions_input"]);
    this.setAndRemoveValidators(data["other_conditions_input"],'Are there other conditions that')
    this.RequestForm.controls["floatLabel13"].setValue(data["lighting_begin_work"]);
    this.RequestForm.controls["floatLabel14"].setValue(data["specific_risks"]);
    this.RequestForm.controls["floatLabel15"].setValue(data["environment_ensured"]);
    this.RequestForm.controls["floatLabel16"].setValue(data["course_of_action"]);

    // this.RequestForm.controls["floatLabel11"].setValue(1);
    // this.RequestForm.patchValue({ floatLabel11: 1 });
    this.RequestForm.controls["descriptActivity"].setValue(data["description_of_activity"]);
    this.RequestForm.controls["RAMSNumber"].setValue(data["rams_number"]);
    // this.images = { name: data["rams_file"] };
    this.images = data.files.map(file => ({
      name: file.rams_file, 
      ...file              
    })); 
    console.log(this.images['name'], 'img')
    this.RequestForm.controls["other_ppe"].setValue(data["other_ppe"]);
    // GetselectedHOTWORKitem()

    // hotworks points
    this.RequestForm.controls["floatLabel1"].setValue(data["tasks_in_progress_in_the_area"]);
    this.RequestForm.controls["floatLabel3"].setValue(data["lighting_sufficiently"]);
    this.RequestForm.controls["floatLabel4"].setValue(data["spesific_risks_based_on_task"]);
    this.RequestForm.controls["floatLabel5"].setValue(data["work_environment_safety_ensured"]);
    this.RequestForm.controls["floatLabel6"].setValue(data["course_of_action_in_emergencies"]);
    this.RequestForm.controls["floatLabel7"].setValue(data["fire_watch_establish"]);
    this.RequestForm.controls["floatLabel8"].setValue(data["combustible_material"]);
    this.RequestForm.controls["floatLabel9"].setValue(data["safety_measures"]);
    this.RequestForm.controls["floatLabel10"].setValue(data["extinguishers_and_fire_blanket"]);

    this.RequestForm.controls["NEWHOTWORK"].setValue(data["welding_activitiy"]);

    if (data["welding_activitiy"] == 1) {
      this.isnewhotworkyes = true;
    } else {
      this.isnewhotworkyes = false;
    }
    this.RequestForm.controls["NEWHOTWORK1"].setValue(data["heat_treatment"]);
    this.RequestForm.controls["NEWHOTWORK2"].setValue(data["air_extraction_be_established"]);

    // electrical system
    this.RequestForm.controls["electricalSystem"].setValue(data["working_on_electrical_system"]);
    if (data["working_on_electrical_system"] == 1) {
      this.iselectricalyes = true;
    } else {
      this.iselectricalyes = false;
    }
    this.RequestForm.controls["floatLabel17"].setValue(data["responsible_for_the_informed"]);
    this.RequestForm.controls["floatLabel18"].setValue(data["de_energized"]);
    this.RequestForm.controls["floatLabel19"].setValue(data["if_no_loto"]);
    this.RequestForm.controls["floatLabel20"].setValue(data["do_risk_assessment"]);
    this.RequestForm.controls["floatLabel21"].setValue(data["if_yes_loto"]);
    this.RequestForm.controls["floatLabel22"].setValue(data["electricity_have_isulation"]);
    this.RequestForm.controls["floatLabel23"].setValue(data["electrician_certification"]);

    // working_hazardious
    this.RequestForm.controls["HAZARDOUS"].setValue(data["working_hazardious_substen"]);
    if (data["working_hazardious_substen"] == 1) {
      this.ishazardousyes = true;
    } else {
      this.ishazardousyes = false;
    }
    this.RequestForm.controls["floatLabel24"].setValue(data["relevant_mal"]);
    this.RequestForm.controls["floatLabel25"].setValue(data["msds"]);
    this.RequestForm.controls["floatLabel26"].setValue(data["equipment_taken_account"]);
    this.RequestForm.controls["floatLabel27"].setValue(data["ventilation"]);
    this.RequestForm.controls["floatLabel28"].setValue(data["hazardaus_substances"]);
    this.RequestForm.controls["floatLabel29"].setValue(data["storage_and_disposal"]);
    this.RequestForm.controls["floatLabel30"].setValue(data["reachable_case"]);
    this.RequestForm.controls["floatLabel31"].setValue(data["checical_risk_assessment"]);

    //  <!-- testing start -->
    this.RequestForm.controls["TESTINGs"].setValue(data["pressure_tesing_of_equipment"]);
    if (data["pressure_tesing_of_equipment"] == 1) {
      this.istestingyes = true;
    } else {
      this.istestingyes = false;
    }
    this.RequestForm.controls["floatLabel32"].setValue(data["transfer_of_palnt"]);
    this.RequestForm.controls["floatLabel33"].setValue(data["area_drained"]);
    this.RequestForm.controls["floatLabel34"].setValue(data["area_depressurised"]);
    this.RequestForm.controls["floatLabel35"].setValue(data["area_flused"]);
    this.RequestForm.controls["floatLabel36"].setValue(data["tank_area_container"]);
    this.RequestForm.controls["floatLabel37"].setValue(data["system_free_for_dust"]);
    this.RequestForm.controls["floatLabel38"].setValue(data["loto_plan_submitted"]);

    // <!-- height start -->
    this.RequestForm.controls["WORKHEIGHT"].setValue(data["working_at_height"]);
    if (data["working_at_height"] == 1) {
      this.isHeightsyes = true;
    } else {
      this.isHeightsyes = false;
    }
    this.RequestForm.controls["segragated_demarkated"].setValue(data["segragated_demarkated"]);
    this.RequestForm.controls["floatLabel39"].setValue(data["lanyard_attachments"]);
    this.RequestForm.controls["floatLabel40"].setValue(data["rescue_plan"]);
    this.RequestForm.controls["floatLabel41"].setValue(data["avoid_hazards"]);
    this.RequestForm.controls["floatLabel42"].setValue(data["height_training"]);
    this.RequestForm.controls["floatLabel43"].setValue(data["supervision"]);
    this.RequestForm.controls["floatLabel44"].setValue(data["shock_absorbing"]);
    this.RequestForm.controls["floatLabel45"].setValue(data["height_equipments"]);
    this.RequestForm.controls["floatLabel46"].setValue(data["vertical_life"]);
    this.RequestForm.controls["floatLabel47"].setValue(data["secured_falling"]);
    this.RequestForm.controls["floatLabel48"].setValue(data["dropped_objects"]);
    this.RequestForm.controls["floatLabel49"].setValue(data["safe_acces"]);
    this.RequestForm.controls["floatLabel50"].setValue(data["weather_acceptable"]);

    // working_confined_spaces
    this.RequestForm.controls["CONFINEDSPACE"].setValue(data["working_confined_spaces"]);
    if (data["working_confined_spaces"] == 1) {
      this.isConfinedsyes = true;
    } else {
      this.isConfinedsyes = false;
    }
    this.RequestForm.controls["floatLabel51"].setValue(data["vapours_gases"]);
    this.RequestForm.controls["floatLabel52"].setValue(data["lel_measurement"]);
    this.RequestForm.controls["floatLabel53"].setValue(data["all_equipment"]);
    this.RequestForm.controls["floatLabel54"].setValue(data["exit_conditions"]);
    this.RequestForm.controls["floatLabel55"].setValue(data["communication_emergency"]);
    this.RequestForm.controls["floatLabel56"].setValue(data["rescue_equipments"]);
    this.RequestForm.controls["floatLabel57"].setValue(data["space_ventilation"]);
    this.RequestForm.controls["floatLabel58"].setValue(data["oxygen_meter"]);

    // work_in_atex_area
    this.RequestForm.controls["ATEXAREA"].setValue(data["work_in_atex_area"]);
    if (data["work_in_atex_area"] == 1) {
      this.isAtexAreayes = true;
    } else {
      this.isAtexAreayes = false;
    }
    this.RequestForm.controls["floatLabel59"].setValue(data["ex_area_downgraded"]);
    this.RequestForm.controls["floatLabel60"].setValue(data["atmospheric_tester"]);
    this.RequestForm.controls["floatLabel61"].setValue(data["flammable_materials"]);
    this.RequestForm.controls["floatLabel62"].setValue(data["potential_explosive"]);
    this.RequestForm.controls["floatLabel63"].setValue(data["oxygen_meter_confined_spaces"]);

    // <!-- FACILITIES LOTO start -->
    this.RequestForm.controls["FACILITIESLOTO"].setValue(data["securing_facilities"]);
    if (data["securing_facilities"] == 1) {
      this.isFacilitiesLotoyes = true;
    } else {
      this.isFacilitiesLotoyes = false;
    }
    this.RequestForm.controls["floatLabel64"].setValue(data["loto_facilities"]);
    this.RequestForm.controls["floatLabel65"].setValue(data["system_depressurised"]);
    this.RequestForm.controls["system_drained"].setValue(data["system_drained"]);
    this.RequestForm.controls["floatLabel67"].setValue(data["passive_pause_other"]);
    this.RequestForm.controls["floatLabel68"].setValue(data["electricity_have_insulation"]);
    this.RequestForm.controls["floatLabel69"].setValue(data["covered_or_secured"]);
    this.RequestForm.controls["floatLabel70"].setValue(data["people_electrician_certification"]);

    // excavation_works

    this.RequestForm.controls["ExcavationWorks"].setValue(data["excavation_works"]);
    if (data["excavation_works"] == 1) {
      this.isExcavationWorksyes = true;
    } else {
      this.isExcavationWorksyes = false;
    }
    this.RequestForm.controls["floatLabel71"].setValue(data["excavation_segregated"]);
    this.RequestForm.controls["floatLabel72"].setValue(data["nn_standards"]);
    this.RequestForm.controls["excavation_shoring"].setValue(data["excavation_shoring"]);
    this.RequestForm.controls["floatLabel74"].setValue(data["danish_regulation"]);
    this.RequestForm.controls["floatLabel75"].setValue(data["safe_access_and_egress"]);
    this.RequestForm.controls["floatLabel76"].setValue(data["correctly_sloped"]);
    this.RequestForm.controls["floatLabel77"].setValue(data["inspection_dates"]);
    this.RequestForm.controls["floatLabel78"].setValue(data["marked_drawings"]);
    this.RequestForm.controls["floatLabel79"].setValue(data["underground_areas_cleared"]);

    // using_cranes_or_lifting
    this.RequestForm.controls["CraneLifting"].setValue(data["using_cranes_or_lifting"]);
    if (data["using_cranes_or_lifting"] == 1) {
      this.isCraneLiftingyes = true;
    } else {
      this.isCraneLiftingyes = false;
    }
    this.RequestForm.controls["floatLabel80"].setValue(data["appointed_person"]);
    this.RequestForm.controls["floatLabel81"].setValue(data["vendor_supplier"]);
    this.RequestForm.controls["floatLabel82"].setValue(data["lift_plan"]);
    this.RequestForm.controls["floatLabel83"].setValue(data["supplied_and_inspected"]);
    this.RequestForm.controls["floatLabel84"].setValue(data["legal_required_certificates"]);
    this.RequestForm.controls["floatLabel85"].setValue(data["prapared_lifting"]);
    this.RequestForm.controls["floatLabel86"].setValue(data["lifting_task_fenced"]);
    this.RequestForm.controls["floatLabel87"].setValue(data["overhead_risks"]);

    this.RequestForm.controls["specific_gloves"].setValue(data["specific_gloves"]);
    this.RequestForm.controls["eye_protection"].setValue(data["eye_protection"]);
    this.RequestForm.controls["fall_protection"].setValue(data["fall_protection"]);
    this.RequestForm.controls["hearing_protection"].setValue(data["hearing_protection"]);
    this.RequestForm.controls["respiratory_protection"].setValue(data["respiratory_protection"]);



    this.cdr.detectChanges(); // Force update

    if (data["Crane_Requested"] === "1") {
      this.iscmsyes = true;
      //this.RequestForm.controls['CmtValue'].setValue(data["CmtValue"]);
    } else {
      this.iscmsyes = false;
    }

        
    if(data["night_shift"] == 1) {
      this.isnightshiftyes = true;
    } else {
      this.isnightshiftyes = false;
    }

    if (data["Hot_work"] == 1) {
      console.log('sdfsdfds');
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

  eventCheck(event) { }

  Backto() {
    console.log("test");
    this.isnewrequestcreated = false;
  }

  setAndRemoveValidators(value, control) {
    // console.log(value, control)
    if (value == 1) {
      if (control == 'Hotwork') {
        this.RequestForm.get('floatLabel1').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel3').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel4').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel5').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel6').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel7').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel8').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel9').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel10').setValidators([Validators.required]);
      } else if (control == 'Is there be any welding activitiy?') {

        // this.RequestForm.get('floatLabel').setValidators([Validators.required]);
        this.RequestForm.get('NEWHOTWORK1').setValidators([Validators.required]);
        this.RequestForm.get('NEWHOTWORK2').setValidators([Validators.required]);
      } else if (control == 'Working on Electrical Systems') {
        this.RequestForm.get('floatLabel17').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel18').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel19').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel20').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel21').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel22').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel23').setValidators([Validators.required]);
      } else if (control == 'Working with Hazardous Substances/Chemicals') {
        // console.log("123")
        this.RequestForm.get('floatLabel24').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel25').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel26').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel27').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel28').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel29').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel30').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel31').setValidators([Validators.required]);
      } else if (control == 'Pressure testing of equipment') {
        this.RequestForm.get('floatLabel32').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel33').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel34').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel35').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel36').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel37').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel38').setValidators([Validators.required]);
      } else if (control == 'Working at Height') {
        this.RequestForm.get('segragated_demarkated').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel39').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel40').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel41').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel42').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel43').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel44').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel45').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel46').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel47').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel48').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel49').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel50').setValidators([Validators.required]);
      } else if (control == 'Working in Confined Spaces') {
        this.RequestForm.get('floatLabel51').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel52').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel53').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel54').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel55').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel56').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel57').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel58').setValidators([Validators.required]);

      } else if (control == 'Working in ATEX Area') {
        this.RequestForm.get('floatLabel59').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel60').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel61').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel62').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel63').setValidators([Validators.required]);
      } else if (control == 'Securing Facilities (LOTO)') {
        this.RequestForm.get('floatLabel64').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel65').setValidators([Validators.required]);
        this.RequestForm.get('system_drained').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel67').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel68').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel69').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel70').setValidators([Validators.required]);
      } else if (control == 'Excavation Works') {
        this.RequestForm.get('floatLabel71').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel72').setValidators([Validators.required]);
        this.RequestForm.get('excavation_shoring').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel74').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel75').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel76').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel77').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel78').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel79').setValidators([Validators.required]);
      } else if (control == 'Using Crane or Lifting') {
        this.RequestForm.get('floatLabel80').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel81').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel82').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel83').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel84').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel85').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel86').setValidators([Validators.required]);
        this.RequestForm.get('floatLabel87').setValidators([Validators.required]);
      } else if (control == 'Are there other conditions that') {
        // console.log("floatLabel12", control)
        this.RequestForm.get('other_conditions_input').setValidators([Validators.required]);
      }
      // control.setValidators([Validators.required]);
    }
    else {
      // control.clearValidators();
      if (control == 'Hotwork') {
        // this.RequestForm.get('fireWatcher').clearValidators();
        this.RequestForm.get('floatLabel1').clearValidators();
        this.RequestForm.get('floatLabel3').clearValidators();
        this.RequestForm.get('floatLabel4').clearValidators();
        this.RequestForm.get('floatLabel5').clearValidators();
        this.RequestForm.get('floatLabel6').clearValidators();
        this.RequestForm.get('floatLabel7').clearValidators();
        this.RequestForm.get('floatLabel8').clearValidators();
        this.RequestForm.get('floatLabel9').clearValidators();
        this.RequestForm.get('floatLabel10').clearValidators();
        this.RequestForm.get('NEWHOTWORK').clearValidators();
        this.RequestForm.get('NEWHOTWORK1').clearValidators();
        this.RequestForm.get('NEWHOTWORK2').clearValidators();
      } else if (control == 'Is there be any welding activitiy?') {

        // this.RequestForm.get('NEWHOTWORK').setValidators([Validators.required]);
        this.RequestForm.get('NEWHOTWORK1').clearValidators();
        this.RequestForm.get('NEWHOTWORK2').clearValidators();
      }
      else if (control == 'Working on Electrical Systems') {
        this.RequestForm.get('floatLabel17').clearValidators();
        this.RequestForm.get('floatLabel18').clearValidators();
        this.RequestForm.get('floatLabel19').clearValidators();
        this.RequestForm.get('floatLabel20').clearValidators();
        this.RequestForm.get('floatLabel21').clearValidators();
        this.RequestForm.get('floatLabel22').clearValidators();
        this.RequestForm.get('floatLabel23').clearValidators();
      } else if (control == 'Working with Hazardous Substances/Chemicals') {
        // console.log("456")
        this.RequestForm.get('floatLabel24').clearValidators();
        this.RequestForm.get('floatLabel25').clearValidators();
        this.RequestForm.get('floatLabel26').clearValidators();
        this.RequestForm.get('floatLabel27').clearValidators();
        this.RequestForm.get('floatLabel28').clearValidators();
        this.RequestForm.get('floatLabel29').clearValidators();
        this.RequestForm.get('floatLabel30').clearValidators();
        this.RequestForm.get('floatLabel31').clearValidators();
      } else if (control == 'Pressure testing of equipment') {
        this.RequestForm.get('floatLabel32').clearValidators();
        this.RequestForm.get('floatLabel33').clearValidators();
        this.RequestForm.get('floatLabel34').clearValidators();
        this.RequestForm.get('floatLabel35').clearValidators();
        this.RequestForm.get('floatLabel36').clearValidators();
        this.RequestForm.get('floatLabel37').clearValidators();
        this.RequestForm.get('floatLabel38').clearValidators();
      } else if (control == 'Working at Height') {
        this.RequestForm.get('segragated_demarkated').clearValidators();
        this.RequestForm.get('floatLabel39').clearValidators();
        this.RequestForm.get('floatLabel40').clearValidators();
        this.RequestForm.get('floatLabel41').clearValidators();
        this.RequestForm.get('floatLabel42').clearValidators();
        this.RequestForm.get('floatLabel43').clearValidators();
        this.RequestForm.get('floatLabel44').clearValidators();
        this.RequestForm.get('floatLabel45').clearValidators();
        this.RequestForm.get('floatLabel46').clearValidators();
        this.RequestForm.get('floatLabel47').clearValidators();
        this.RequestForm.get('floatLabel48').clearValidators();
        this.RequestForm.get('floatLabel49').clearValidators();
        this.RequestForm.get('floatLabel50').clearValidators();
      } else if (control == 'Working in Confined Spaces') {
        this.RequestForm.get('floatLabel51').clearValidators();
        this.RequestForm.get('floatLabel52').clearValidators();
        this.RequestForm.get('floatLabel53').clearValidators();
        this.RequestForm.get('floatLabel54').clearValidators();
        this.RequestForm.get('floatLabel55').clearValidators();
        this.RequestForm.get('floatLabel56').clearValidators();
        this.RequestForm.get('floatLabel57').clearValidators();
        this.RequestForm.get('floatLabel58').clearValidators();
      } else if (control == 'Working in ATEX Area') {
        this.RequestForm.get('floatLabel59').clearValidators();
        this.RequestForm.get('floatLabel60').clearValidators();
        this.RequestForm.get('floatLabel61').clearValidators();
        this.RequestForm.get('floatLabel62').clearValidators();
        this.RequestForm.get('floatLabel63').clearValidators();
      } else if (control == 'Securing Facilities (LOTO)') {
        this.RequestForm.get('floatLabel64').clearValidators();
        this.RequestForm.get('floatLabel65').clearValidators();
        this.RequestForm.get('system_drained').clearValidators();
        this.RequestForm.get('floatLabel67').clearValidators();
        this.RequestForm.get('floatLabel68').clearValidators();
        this.RequestForm.get('floatLabel69').clearValidators();
        this.RequestForm.get('floatLabel70').clearValidators();
      } else if (control == 'Excavation Works') {
        this.RequestForm.get('floatLabel71').clearValidators();
        this.RequestForm.get('floatLabel72').clearValidators();
        this.RequestForm.get('excavation_shoring').clearValidators();
        this.RequestForm.get('floatLabel74').clearValidators();
        this.RequestForm.get('floatLabel75').clearValidators();
        this.RequestForm.get('floatLabel76').clearValidators();
        this.RequestForm.get('floatLabel77').clearValidators();
        this.RequestForm.get('floatLabel78').clearValidators();
        this.RequestForm.get('floatLabel79').clearValidators();
      } else if (control == 'Using Crane or Lifting') {
        this.RequestForm.get('floatLabel80').clearValidators();
        this.RequestForm.get('floatLabel81').clearValidators();
        this.RequestForm.get('floatLabel82').clearValidators();
        this.RequestForm.get('floatLabel83').clearValidators();
        this.RequestForm.get('floatLabel84').clearValidators();
        this.RequestForm.get('floatLabel85').clearValidators();
        this.RequestForm.get('floatLabel86').clearValidators();
        this.RequestForm.get('floatLabel87').clearValidators();
      } else if (control == 'Are there other conditions that') {
        // console.log("floatLabel12", control)
        this.RequestForm.get('other_conditions_input').clearValidators();;
      }
    }
    this.RequestForm.updateValueAndValidity();
  }

  // blocks : {};

  openDialog(floor, i) {
    // console.log(floor, i)
    const dialogRef = this.dialog.open(RequestBuildingModelComponent, {
      data: {
        floor: floor,
        selectFloorBlocks: this.selectFloorBlocks
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result, 'result');
      if (result) {
        let index = this.selectFloorBlocks.findIndex(item => (item.floorName == result.floorName) && (item.planType == result.planType))
        if (index != -1) {
          this.selectFloorBlocks.splice(index, 1, result);
        } else {
          this.selectFloorBlocks.push(result);
        }
      }
      // this.selectFloorBlocks.push(result)
      // console.log(this.selectFloorBlocks)
    });
  }

  selectFloorBlocks: Array<any> = [];
  // images: any;
  // isimguploaded: boolean = false;
  // base64Images: any[] = [];

  // csvInputChange(e) {
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     this.images = e.target.files[i];
  //     console.log(e.target.files[i]);
  //     var reader = new FileReader();

  //     reader.onload = this._handleReaderLoaded.bind(this);
  //     reader.readAsDataURL(e.target.files[i]);
  //     // this.isimguploaded = true;
  //     // const formData = new FormData();
  //     // formData.append('file', e.target.files[i]); // Append file
  //     this.RequestForm.controls["rams_file"].setValue(e.target.files[i]);
  //     // console.log(reader, "reader")
  //   }
  // }
  // _handleReaderLoaded(e) {
  //   let reader = e.target;
  //   // console.log(reader, "reader")
  //   // this.base64Images.push(reader.result);
  // }

   images: { name: string }[] = [];
  imagesAdd: { name: string }[] = [];;

csvInputChange(e: any): void {
  const files = e.target.files;
  this.images = []; // Clear previous selection

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.images.push(file);

      console.log(file);

      const reader = new FileReader();
      reader.onload = (event) => this._handleReaderLoaded(event, file);
      reader.readAsDataURL(file);
    }

    // Optional: store the whole file array in form control
    // this.RequestForm.controls["rams_file"].setValue(this.images);

    // Or just the first one (if your form only supports one)
    this.RequestForm.controls["rams_file"].setValue(this.images);
  }
}

csvInputChange1(e: any): void {
  const files = e.target.files;
  this.imagesAdd = []; // Clear previous selection

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.imagesAdd.push(file);

      console.log(file);

      const reader = new FileReader();
      reader.onload = (event) => this._handleReaderLoaded(event, file);
      reader.readAsDataURL(file);
    }
    this.FilesRequestForm.controls["rams_file"].setValue(this.imagesAdd)
    this.addRamsFile();
  }
}

// Update _handleReaderLoaded to accept file context
_handleReaderLoaded(event: any, file: File): void {
  const result = event.target.result;
  // Do what you need with the file + result
  console.log('Loaded:', file.name, result);
}

addRamsFile() {
  this.filesRequestData.rams_file = this.FilesRequestForm.controls["rams_file"].value;
  this.filesRequestData.userId = this.updaterequestdata.userId;
  this.filesRequestData.id = this.updaterequestdata.id;

  let formData = new FormData();
    // First: Append all normal fields except rams_file
    for (const [key, value] of Object.entries(this.filesRequestData)) {
      if (key !== 'rams_file' && value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }
    
    // Then: Append each file under same 'rams_file[]' field
    if (this.filesRequestData.rams_file && this.filesRequestData.rams_file.length > 0) {
      (this.filesRequestData.rams_file as File[]).forEach((file: File) => {
        formData.append('rams_file[]', file);  // same field name again and again
      });
    } 
    
    this.requestsserivies.addRamsFiles(formData).subscribe(
      (res) => {
        this.spinner = false;
        this.openSnackBar("File Added Successfully");
        this.images = res.files.map(file => ({
          name: file.rams_file, 
          ...file              
        })); 
      },
      (error) => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    );
}

deleteRamsFile(data) {
  let deleteRamsData = {
    rams_file_id : data.rams_file_id
  }
  this.requestsserivies.deleteRamsFile(deleteRamsData).subscribe(
    (res) => {
      this.spinner = false;
      this.openSnackBar("File Deleted Successfully");
      this.images = this.images.filter((file: any) => file.rams_file_id !== data.rams_file_id);
    },
    (error) => {
      this.openSnackBar("Something went wrong. Plz try again later...");
    }
  );
}


}



