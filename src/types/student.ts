export interface Student {
  id: string;
  title: string;

  // Personal
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;

  // School
  mainstreamYearLevel: string;
  mainstreamSchoolName: string;
  otherSchoolPrevious: string;
  otherSchoolName: string;
  otherSchoolPast: string;
  campus: string;
  currentClass: string;
  rollNumber: string;
  assessmentType: string;

  // Residency
  residencyStatus: string;

  // Medical
  medicalCondition: string;
  medicalDescription: string;
  medication: string;
  medicationDescription: string;

  // Status
  status: string;
  enrollmentStatus: string;

  // Family link
  familyId: string;

  // Azure AD
  azureAdId: string;
  azureAdEmail: string;
  vsn: number | null;

  // Dates
  created: string;
  modified: string;
}

export interface StudentFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  mainstreamYearLevel: string;
  mainstreamSchoolName: string;
  otherSchoolPrevious: string;
  otherSchoolName: string;
  otherSchoolPast: string;
  campus: string;
  currentClass: string;
  residencyStatus: string;
  medicalCondition: string;
  medicalDescription: string;
  medication: string;
  medicationDescription: string;
}
