export type PersonnelRole = "General Manager"|"Deputy Manager"|"Treasurer"|"Secretary"|"Administrator"|"Captain"|"Coach"|"Assistant Coach"|"Other";

export type Mandate = "Volunteer"|"Salaried";

export interface Personnel { 
    personnel_id:number; 
    first_name:string; 
    last_name:string; 
    date_of_birth:string; 
    ssn:string; 
    medicare_number:string|null; 
    phone_number:string|null; 
    address:string|null; 
    city:string|null; 
    province:string|null; 
    postal_code:string|null; 
    email:string|null; 
    role:PersonnelRole; 
    mandate:Mandate; 
}

export interface PersonnelInput { first_name:string; last_name:string; date_of_birth:string; ssn:string; medicare_number?:string; phone_number?:string; address?:string; city?:string; province?:string; postal_code?:string; email?:string; role:PersonnelRole; mandate:Mandate; }

export interface PersonnelAssignment { 
    assignment_id:number; 
    personnel_id:number; 
    location_id:number; 
    start_date:string; 
    end_date:string|null; 
}
