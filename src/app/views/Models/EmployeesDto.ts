export class EmployeesDto
{
    roleId:string;
    departId:string;
    subContId:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    username:string;
    password:string;
    access:string;
}

export class UpdateEmployeesDto
{
    id:string;
    roleId:string;
    departId:string;
    subContId:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    username:string;
    password:string;
    access:string;
}

export class DeleteEmployeeDto
{
    id:string;
}

export class EmployeeSubDto
{
    roleId:string;
    subContId:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    access:string;
    username:string;
    password:string;
}

export class EmployeeDeptDto
{
    roleId:string;
    departId:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    access:string;
    username:string;
    password:string;
}


export class UpdateEmployeeSubDto
{
    id:string;
    roleId:string;
    subContId:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    access:string;
    username:string;
    password:string;
}

export class UpdateEmployeeDeptDto
{
    id:string;
    roleId:string;
    departId:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    access:string;
    username:string;
    password:string;
}