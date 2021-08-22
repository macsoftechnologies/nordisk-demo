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
    companyName:string
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
    companyName:string
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
    companyName:string
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
    companyName:string
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
    companyName:string
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
    companyName:string
}


export class Employee
{
    roleId:string;
    typeId:string;
    type:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    access:string;
    username:string;
    password:string;
    companyName:string
}

export class UpdateEmployee
{
    id:string;
    roleId:string;
    typeId:string;
    type:string;
    badgeId:string;
    employeeName:string;
    designation:string;
    phonenumber:string;
    access:string;
    username:string;
    password:string;
    companyName:string
}