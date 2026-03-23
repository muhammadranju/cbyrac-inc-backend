import { Types } from 'mongoose';

export type EmploymentType = 'Intern' | 'Temp Employee';
export type OvertimePreference = 'Yes' | 'No';
export type GraduationStatus = 'Graduated' | 'Not Graduated';
export type BankAccountType = 'Checking' | 'Savings';

export interface IContactInfo {
  name: string;
  relationship: string;
  phone: string;
}

export interface IEducationInfo {
  schoolName?: string;
  major?: string;
  graduationStatus?: GraduationStatus;
  yearsCompleted?: number;
  honorsReceived?: string;
}

export interface IBankAccount {
  bankName: string;
  state?: string;
  transitNo: string; // Routing number
  accountNo: string;
  depositAmount?: number;
  depositPercentage: number;
}

export enum ICitizenship {
  Citizen = 'citizen',
  Resident = 'resident',
  WorkAuthorization = 'workauth',
}

// export enum IW4Status {
//   Single = 'single',
//   Married = 'married',
//   MarriedHigher = 'marriedSeparate',
// }

// export enum I9Status {
//   Citizen = 'US Citizen',
//   NonCitizen = 'Noncitizen National',
//   Permanent = 'Lawful Permanent Resident',
//   NonCitizen_Other = 'Other Noncitizen',
// }

// Sub-interfaces for better organization

export interface IGeneralInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string; // Store as string for safety and formatting (e.g., "123-45-6789")
  dateOfBirth: string; // ISO string (YYYY-MM-DD)
  applicationDate: string; // ISO string (YYYY-MM-DD)
  email: string;
  telephoneNumber: string;
  address: string;

  // ─── Emergency Contact ───
  emergencyContact?: IContactInfo;

  // ─── Employment Preferences ───
  desiredEmploymentType?: EmploymentType;
  desiredSalary?: number;
  hourlyRate?: number;
  appliedPosition?: string;
  department?: string;
  overtime?: OvertimePreference;
  startDate?: string;

  // ─── Previous Employment History ───
  previouslyApplied?: boolean;
  previousApplicationDate?: string;
  previouslyEmployed?: boolean;
  previousSeparationReason?: string;

  // ─── Education ───
  education?: IEducationInfo;

  // ─── Other Information ───
  specialSkills?: string;
}

// ─── Direct Deposit Info ───
export interface IDirectDepositInfo {
  name: string;
  ssn: string;
  checkingAccount: IBankAccount & { accountType: BankAccountType };
  savingsAccount?: IBankAccount & { accountType: BankAccountType };
  signatureDate?: string;
}

// Base info common to all I9 forms
// export interface IBaseI9Info {
//   lastName: string;
//   firstName: string;
//   middleName: string;
//   otherNames: string;
//   address: string;
//   dateOfBirth: string;
//   ssn: string;
//   email: string;
//   phone: string;
//   signatureDate?: string;
// }
// Citizen or NonCitizen: no extra required fields
// export interface ICitizenInfo extends IBaseI9Info {
//   status: I9Status.Citizen | I9Status.NonCitizen;
// }

// Permanent: requires only uscisNumber
// export interface IPermanentInfo extends IBaseI9Info {
//   status: I9Status.Permanent;
//   uscisNumber: string;
// }

// NonCitizen_Other: requires uscisNumber, admissionNumber, and foreignPassportNumber
// export interface INonCitizenOtherInfo extends IBaseI9Info {
//   status: I9Status.NonCitizen_Other;
//   uscisNumber: string;
//   admissionNumber: string;
//   foreignPassportNumber: string;
// }

// Union type
// export type I9Info = ICitizenInfo | IPermanentInfo | INonCitizenOtherInfo;

// export interface IW4Info {
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   ssn: string;
//   address: string;
//   maritalStatus?: IW4Status; // maritalStaus..
//   acceptedTerms?: boolean; // required
//   childrenNo: number; // if your total income will be 200000.
//   amount: number;
//   childrenDepencyNo: number;
//   eachDepencyAmount: number;
//   TotalDependencyAmount: number;
//   withHoldAmount: number;
//   deductedAmount: string;
//   extraWithHoldingAmount: number;
//   signatureDate?: string;
// }

// Main interface for all employee onboarding data
export interface IInternFormData {
  userId: Types.ObjectId;
  generalInfo: IGeneralInfo;
  bankForm: IDirectDepositInfo;
  i9Form: string;
  w4Form: string;
  citizenShipForm: string;
  signature: string;
  photoId?: string | undefined;
  accountFile: string;
  residentCard?: string | undefined;
  socialSecurityCard?: string | undefined;
  workAuthorizationDocument?: string | undefined;
}
