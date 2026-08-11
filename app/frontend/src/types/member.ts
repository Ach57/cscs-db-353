export type RelationshipType="Father"|"Mother"|"Grandfather"|"Grandmother"|"Tutor"|"Partner"|"Friend"|"Other";
export type FamilyMemberType="Primary"|"Secondary";

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

export interface FamilyMemberInput { first_name:string; last_name:string; date_of_birth:string; ssn:string; medicare_number?:string; phone_number?:string; address?:string; city?:string; province?:string; postal_code?:string; email?:string; }

export interface ClubMember {
    membership_number:number;
    location_id:number;
    first_name:string;
    last_name:string;
    date_of_birth:string;
    gender:"Male"|"Female";
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
    // Transient, grid-only fields used to link a family member when
    // registering a minor -- never returned by GET /club-members, and
    // ignored on update (family links are managed on the Family Members
    // page). See ClubMemberInput.family_relation.
    family_member_id?:number|null;
    relationship_type?:RelationshipType|null;
    family_member_type?:FamilyMemberType|null;
}

export interface ClubMemberInput {
    location_id:number; first_name:string; last_name:string; date_of_birth:string; gender:"Male"|"Female"; registration_date:string; height_cm?:number; weight_kg?:number; ssn?:string; medicare_number?:string; phone_number?:string; email?:string; address?:string; city?:string; province?:string; postal_code?:string;
    // Required by the database when the member being created is a minor --
    // trg_club_member_before_insert rejects a minor's INSERT unless it goes
    // through sp_register_minor_club_member, which this field triggers.
    family_relation?:{ family_member_id:number; relationship_type:RelationshipType; family_member_type:FamilyMemberType; start_date:string };
}

export interface FamilyRelation { 
    relation_id:number; 
    membership_number:number; 
    family_member_id:number; 
    relationship_type:RelationshipType; 
    start_date:string; 
    end_date:string|null; 
    is_primary:boolean; 
}
