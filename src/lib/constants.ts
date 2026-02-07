export const APP_NAME = "TPK Parent Portal";

// OTP settings
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 5;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_COOLDOWN_SECONDS = 60;

// JWT settings
export const JWT_EXPIRY_HOURS = 24;

// Session cookie name
export const SESSION_COOKIE = "tpkp_session";

// Relationship options (for dropdowns)
export const RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Guardian",
  "Step-Father",
  "Step-Mother",
  "Other",
];

// State options (Australian states)
export const STATE_OPTIONS = [
  "VIC",
  "NSW",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT",
];

// Gender options
export const GENDER_OPTIONS = ["Male", "Female", "Other"];

// Yes/No options
export const YES_NO_OPTIONS = ["Yes", "No"];

// Allow Photo options (matches SharePoint choice values — uppercase)
export const ALLOW_PHOTO_OPTIONS = ["YES", "NO"];

// Photo Sharing options (matches SharePoint choice values)
export const PHOTO_SHARING_OPTIONS = ["Accept", "Do Not Accept"];

// Student status options
export const STUDENT_STATUS_OPTIONS = ["Active", "Inactive", "Graduated", "Withdrawn"];

// Enrollment status options
export const ENROLLMENT_STATUS_OPTIONS = ["Enrolled", "Pending", "Waitlisted", "Cancelled"];

// Residency status options (matches SharePoint choice values)
export const RESIDENCY_STATUS_OPTIONS = [
  "Australian Permanent Residence or Citizen",
  "Australian Permanent Resident or Citizen",
  "International Full Fee Paying Student",
];
