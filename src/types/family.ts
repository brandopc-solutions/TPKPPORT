export interface Family {
  id: string;
  title: string;

  // Parent 1
  p1FirstName: string;
  p1MiddleName: string;
  p1LastName: string;
  p1Mobile: string;
  p1Email: string;
  p1Relationship: string;
  p1Street: string;
  p1Suburb: string;
  p1State: string;
  p1PostCode: string;
  p1Country: string;
  p1FullName: string;

  // Parent 2
  p2FirstName: string;
  p2MiddleName: string;
  p2LastName: string;
  p2Mobile: string;
  p2Email: string;
  p2Relationship: string;
  p2FullName: string;

  // Emergency Contact
  emergencyFirstName: string;
  emergencyMiddleName: string;
  emergencyLastName: string;
  emergencyMobile: string;
  emergencyRelation: string;

  // Consent & Status
  photoSharing: string;
  parentDeclaration: string;
  termsAndConditions: string;
  status: string;
  allowPhoto: string;
  numberOfChildren: string;

  // Accounting
  myobUid: string;
  myobRowVersion: string;

  // Dates
  completionDate: string;
  created: string;
  modified: string;
}

export interface FamilyFormData {
  // Parent 1 editable fields
  p1FirstName: string;
  p1MiddleName: string;
  p1LastName: string;
  p1Mobile: string;
  p1Email: string;
  p1Relationship: string;
  p1Street: string;
  p1Suburb: string;
  p1State: string;
  p1PostCode: string;
  p1Country: string;

  // Parent 2 editable fields
  p2FirstName: string;
  p2MiddleName: string;
  p2LastName: string;
  p2Mobile: string;
  p2Email: string;
  p2Relationship: string;

  // Emergency Contact
  emergencyFirstName: string;
  emergencyMiddleName: string;
  emergencyLastName: string;
  emergencyMobile: string;
  emergencyRelation: string;

  // Consent
  photoSharing: string;
  parentDeclaration: string;
  termsAndConditions: string;
  allowPhoto: string;
}
