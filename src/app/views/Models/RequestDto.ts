
export class RequestDto
{
    userId:string;
    Request_Date:string;
    Company_Name:string;
    Sub_Contractor_Id:string;
    Foreman:string;
    Foreman_Phone_Number:string;
    Activity:string;
    Type_Of_Activity_Id:string;
    Working_Date:string;
    Start_Time:string;
    End_Time:string;
    Site_Id:string;
    Building_Id:string;
    Floor_Id:string;
    Room_Nos:string;
    Room_Type:string;
    Crane_Requested:string;
    Crane_Number:string;
    Tools:string;
    Machinery:string;
    Hot_work:string;
    Certified_Person:string;
    LOTO_Procedure:string;
    LOTO_Number:string;
    Power_Off_Required:string;
    Number_Of_Workers:string;
    Badge_Numbers:string;
    Notes:string; 
    Request_status:string;
    PermitNo:string;
    teamId:string;
    building_name: string;
  tasks_in_progress_in_the_area: string;
  account_during_the_work: any;
  lighting_sufficiently: any;
  spesific_risks_based_on_task: any;
  work_environment_safety_ensured: any;
  course_of_action_in_emergencies: any;
  name_of_the_fire_watcher: any;
  phone_number_of_fire_watcher: any;
  fire_watch_establish: any;
  combustible_material: any;
  safety_measures: any;
  extinguishers_and_fire_blanket: any;
  welding_activitiy: any;
  air_extraction_be_established: any;
  heat_treatment: any;
}


export class EditRequestDto
{
    userId:string;
    Request_Date:string;
    Company_Name:string;
    Sub_Contractor_Id:string;
    Foreman:string;
    Foreman_Phone_Number:string;
    Activity:string;
    Type_Of_Activity_Id:string;
    Working_Date:string;
    Start_Time:string;
    End_Time:string;
    Site_Id:string;
    Building_Id:string;
    Floor_Id:string;
    Room_Nos:string;
    Room_Type:string;
    Crane_Requested:string;
    Crane_Number:string;
    Tools:string;
    Machinery:string;
    Hot_work:string;
    Certified_Person:string;
    LOTO_Procedure:string;
    LOTO_Number:string;
    Power_Off_Required:string;
    Number_Of_Workers:string;
    Badge_Numbers:string;
    Notes:string; 
    Request_status:string;
    PermitNo:string;
    id:string;
    Assign_Start_Time:string;
    Assign_End_Time:string;
    Safety_Precautions:string;
    Special_Instructions:string;
    teamId:string;
    createdTime: string;
}

export class DeleteRequestDto
{
    id:string;
}

export class UpdateRequestStatusListDto
{
    Request_status : string;
    id :string;
    userId:string;
}

export class CopyRequestDto
{
    userId:string;
    Request_Date:string;
    Company_Name:string;
    PermitNo:string;
    Sub_Contractor_Id:string;
    Foreman:string;
    Foreman_Phone_Number:string;
    Activity:string;
    Type_Of_Activity_Id:string;
    Working_Date:string;
    Start_Time:string;
    End_Time:string;
    Site_Id:string;
    Building_Id:string;
    Floor_Id:string;
    Room_Nos:string;
    Room_Type:string;
    Crane_Requested:string;
    Crane_Number:string;
    Tools:string;
    Machinery:string;
    Hot_work:string;
    Certified_Person:string;
    LOTO_Procedure:string;
    LOTO_Number:string;
    Power_Off_Required:string;
    Number_Of_Workers:string;
    Badge_Numbers:string;
    Notes:string; 
    Request_status:string;
    Assign_Start_Time:string;
    Assign_End_Time:string;
    Safety_Precautions:string;
    Special_Instructions:string;
    Assign_End_Date:string;
    Assign_Start_Date:string;
    teamId:string;
    count:number;
}

export class UpdateClose_Status
{
    Request_status:string;
    Image:any[];
    id:string;
    userId:string;
    createdTime : string
    //files:string  []  =  [];
}

export class RequestsbyId
{
    userId:string;
}

export class RequestBySubcontractorId
{
    SubContractorId:string;
} 