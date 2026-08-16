export type RelationshipType =
  | 'Father'
  | 'Mother'
  | 'Grandfather'
  | 'Grandmother'
  | 'Tutor'
  | 'Partner'
  | 'Friend'
  | 'Other';
export type FamilyMemberType = 'Primary' | 'Secondary';

export interface FamilyMember {
  family_member_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  ssn: string;
  medicare_number: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  email: string | null;
}

export interface FamilyMemberInput {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  ssn: string;
  medicare_number?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  email?: string;
}

export interface ClubMember {
  membership_number: number;
  location_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  registration_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  ssn: string | null;
  medicare_number: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
}

export interface ClubMemberInput {
  location_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  registration_date: string;
  height_cm?: number;
  weight_kg?: number;
  ssn?: string;
  medicare_number?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
}

export interface FamilyRelation {
  relation_id: number;
  membership_number: number;
  family_member_id: number;
  first_name: string;
  last_name: string;
  relationship_type: RelationshipType;
  family_member_type: FamilyMemberType;
  start_date: string;
  end_date: string | null;
}

export interface FamilyRelationInput {
  membership_number: number;
  family_member_id: number;
  relationship_type: RelationshipType;
  family_member_type: FamilyMemberType;
  start_date: string;
  end_date?: string;
}

export interface FamilyMemberAssignment {
  assignment_id: number;
  family_member_id: number;
  location_id: number;
  location_name: string;
  start_date: string;
  end_date: string | null;
}

export interface FamilyMemberAssignmentInput {
  family_member_id: number;
  location_id: number;
  start_date: string;
  end_date: string | null;
}
