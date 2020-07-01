
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
}

export class DeleteRequestDto
{
    id:string;
}

export class UpdateRequestStatusListDto
{
    Request_status : string;
    id :string;
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
    Image:FormData;
    id:string;
}

export class RequestsbyId
{
    userId:string;
}