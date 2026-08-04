export type RelationshipType="Father"|"Mother"|"Grandfather"|"Grandmother"|"Tutor"|"Partner"|"Friend"|"Other";

export interface FamilyMember { 
    family_member_id:number; 
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
}

export type FamilyMemberInput=Omit<FamilyMember,"family_member_id">;

export interface ClubMember {
    membership_number:number; 
    location_id:number; 
    first_name:string; 
    last_name:string; 
    date_of_birth:string; 
    registration_date:string; 
    height_cm:number|null; 
    weight_kg:number|null; 
    ssn:string|null; 
    medicare_number:string|null; 
    phone_number:string|null; 
    email:string|null; 
    address:string|null; 
    city:string|null; 
    province:string|null; 
    postal_code:string|null; 
}

export type ClubMemberInput=Omit<ClubMember,"membership_number">;

export interface FamilyRelation { 
    relation_id:number; 
    membership_number:number; 
    family_member_id:number; 
    relationship_type:RelationshipType; 
    start_date:string; 
    end_date:string|null; 
    is_primary:boolean; 
}
