export class SearchRequestDto
{
    Site_Id:string;
    Building_Id:string;
    Sub_Contractor_Id:string;
    Working_Date:string;
    Request_status:string;
    PermitNo:string;
    Company_Name:string;
}

export class ListRequest
{
    Permit_Number:string;
    Activity:string;
    Sub_contractor:string;
    Working_Date:string;
    Time:string;
    Status:string;
    Operations:string; 
}