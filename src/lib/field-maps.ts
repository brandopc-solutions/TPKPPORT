/**
 * Maps between SharePoint internal field names and application field names.
 * SharePoint field names (left) → App field names (right)
 */

export const FAMILY_FIELD_MAP: Record<string, string> = {
  // Parent 1 (these use their display names as internal names)
  f_p1_fName: "p1FirstName",
  f_p1_mName: "p1MiddleName",
  f_p1_lName: "p1LastName",
  f_p1_mobile: "p1Mobile",
  f_p1_email: "p1Email",
  f_p1_relationship: "p1Relationship",
  f_p1_street: "p1Street",
  f_p1_suburb: "p1Suburb",
  f_p1_state: "p1State",
  f_p1_pcode: "p1PostCode",
  f_p1_country: "p1Country",
  f_p1_FullName: "p1FullName",

  // Parent 2 (these use field_* internal names in Graph API)
  field_12: "p2FirstName",
  field_13: "p2MiddleName",
  field_14: "p2LastName",
  field_15: "p2Mobile",
  field_16: "p2Email",
  field_17: "p2Relationship",
  f_p2_FullName: "p2FullName",

  // Emergency Contact (field_* internal names)
  field_24: "emergencyFirstName",
  field_25: "emergencyMiddleName",
  field_26: "emergencyLastName",
  field_27: "emergencyMobile",
  f_e_Relation: "emergencyRelation",

  // Consent & Status (field_* internal names)
  field_29: "photoSharing",
  field_30: "parentDeclaration",
  field_31: "termsAndConditions",
  field_32: "status",
  AllowPhoto: "allowPhoto",
  f_NoOfChildren: "numberOfChildren",

  // Accounting
  f_MYOB_UID: "myobUid",
  f_MYOB_RowVersion: "myobRowVersion",

  // Dates
  CompletionDate: "completionDate",
  Created: "created",
  Modified: "modified",
  Title: "title",
};

export const STUDENT_FIELD_MAP: Record<string, string> = {
  // Personal (s_fName, s_FullName use display names; others use field_*)
  s_fName: "firstName",
  field_2: "middleName",
  field_3: "lastName",
  s_FullName: "fullName",
  field_5: "dateOfBirth",
  field_6: "gender",

  // School (mix of field_* and display names)
  field_8: "mainstreamYearLevel",
  s_ms_schNames: "mainstreamSchoolName",
  field_9: "otherSchoolPrevious",
  field_10: "otherSchoolName",
  field_11: "otherSchoolPast",
  s_Campus: "campus",
  S_CurrentClass: "currentClass",
  s_RollNo: "rollNumber",
  s_AssessmentType: "assessmentType",

  // Residency
  field_12: "residencyStatus",

  // Medical
  field_13: "medicalCondition",
  field_14: "medicalDescription",
  field_15: "medication",
  field_16: "medicationDescription",

  // Status
  field_19: "status",
  field_21: "enrollmentStatus",

  // Family link
  s_f_IDLookupId: "familyId",

  // Azure AD
  s_AzureAD_ID: "azureAdId",
  s_AzureAd_EID: "azureAdEmail",
  s_VSN: "vsn",

  // Dates
  Created: "created",
  Modified: "modified",
  Title: "title",
};

/**
 * Invert a field map: app field names → SharePoint field names
 */
export function invertFieldMap(
  map: Record<string, string>
): Record<string, string> {
  const inverted: Record<string, string> = {};
  for (const [spField, appField] of Object.entries(map)) {
    inverted[appField] = spField;
  }
  return inverted;
}

/**
 * Map SharePoint fields object to app fields object
 */
export function mapFromSharePoint<T>(
  fields: Record<string, unknown>,
  fieldMap: Record<string, string>
): T {
  const result: Record<string, unknown> = {};
  for (const [spField, appField] of Object.entries(fieldMap)) {
    result[appField] = fields[spField] ?? "";
  }
  return result as T;
}

/**
 * Map app fields object to SharePoint fields object (for updates)
 */
export function mapToSharePoint(
  data: Record<string, unknown>,
  fieldMap: Record<string, string>
): Record<string, unknown> {
  const inverted = invertFieldMap(fieldMap);
  const result: Record<string, unknown> = {};
  for (const [appField, value] of Object.entries(data)) {
    const spField = inverted[appField];
    if (spField) {
      result[spField] = value;
    }
  }
  return result;
}
