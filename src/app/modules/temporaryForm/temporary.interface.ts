import { Types } from 'mongoose';

export type EmploymentType = 'Intern' | 'Temporary';
export type OvertimePreference = 'Yes' | 'No';
export type GraduationStatus = 'Graduated' | 'Not Graduate';
export type BankAccountType = 'Checking' | 'Savings';
export type DepositType = 'full' | 'partial';

export interface IContactInfo {
  name: string;
  relationship: string;
  phone: string;
}

export interface IEducationInfo {
  level: string;
  name?: string;
  major?: string;
  graduationStatus?: GraduationStatus;
  yearsCompleted?: number;
  honorsReceived?: string;
}

export interface IBankAccount {
  bankName: string;
  state?: string;
  transitNo: number; // Routing number
  accountNo: number;
  depositType?: DepositType;
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
  desiredSalary?: string;
  hourlyRate?: string;
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
  education?: IEducationInfo[];

  // ─── Other Information ───
  specialSkills: string;
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
//   acceptedTerms?: boolean;
//   childrenNo: number; // if your total income will be 200000.
//   amount?: number;
//   childrenDepencyNo: number;
//   eachDepencyAmount?: number;
//   TotalDependencyAmount: number;
//   withHoldAmount: number;
//   deductedAmount: string;
//   extraWithHoldingAmount: number;
//   signatureDate?: string;
// }

// employee section..
export interface ITerminationInfo {
  terminationStatus: 'Yes' | 'No';
  terminationCount?: number;
}

export interface IManualAgreementTermination {
  terminatedByManualAgreement: 'Yes' | 'No';
  terminationCount?: number;
}
export interface IResignationInsteadOfTermination {
  resignedInsteadOfTerminated: 'Yes' | 'No';
  resignationCount?: number;
}
export interface ITerminationDetailsOfEmployee {
  name: string;
  position: string;
  company: string;
  telephone: string;
  occupation: string;
  bestTimeToCall: string;
  workRelation: string;
  NoOfYearKnown: string;
}
export interface IEmployee {
  name: string;
  address: string;
  telephone: string;
  dateEmployeeFrom: Date;
  dateEmployeeTo: Date;
  jobTitle: string;
  duties: string;
  supervisorName: string;
  MayWeContact: boolean;
  wagesStart: string;
  final: string;
  reasonForLeaving: string;
  terminationReason: string;
  disciplinaryAction: string;
  noticePeriod: string;
}
export interface IEmployeeInfo {
  employee1: IEmployee;
  employee2: IEmployee;
  terminationInfo: ITerminationInfo;
  manualAgreementTermination: IManualAgreementTermination;
  resignationInsteadOfTermination: IResignationInsteadOfTermination;
  explanation?: string;
  terminationDetailsOfEmployee: ITerminationDetailsOfEmployee[];
}

export interface IValidDriverLicense {
  hasDriverLicense: 'Yes' | 'No';
  licenseNo: number;
  state: string;
  expirationDate: Date;
  reason?: string;
}
export interface ILicenseSuspensionInfo {
  licenseSuspendedOrRevoked: 'Yes' | 'No';
  reason?: string;
}
export interface IPersonalAutoInsurance {
  hasPersonalAutoInsurance: 'Yes' | 'No';
  reason?: string;
}
export interface IPersonalAutoInsuranceHistory {
  insuranceDeniedOrTerminated: 'Yes' | 'No';
  reason?: string;
}
export interface IMovingTrafficViolation {
  offense: string;
  date: Date;
  location: string;
  comment: string;
}
export interface IDrivingLicenceInfo {
  validDriverLicense: IValidDriverLicense;
  licenseSuspensionInfo: ILicenseSuspensionInfo;
  personalAutoInsurance: IPersonalAutoInsurance;
  personalAutoInsuranceHistory: IPersonalAutoInsuranceHistory;
  movingTrafficViolation: IMovingTrafficViolation[];
}
export interface IApplicantCartification {
  check: boolean;
  signatureDate: Date;
}
export interface IApplicantionCarification {
  check: boolean;

  signatureDate?: Date;
}
export interface IAccidentProcedure {
  check: boolean;
  signatureDate: Date;
}
export interface ISubmittalPolicyInfo {
  check: boolean;
  name: string;
}
export interface ISubmittalpolicy {
  submittalPolicyDirectUnderstand: ISubmittalPolicyInfo;
  submittalPolicyExplainUnderstand: ISubmittalPolicyInfo;
  check: boolean;
}
// Main interface for all employee onboarding data
export interface ITemporaryFormData {
  userId: Types.ObjectId;
  generalInfo: IGeneralInfo;
  employeeInfo: IEmployeeInfo;
  drivingLicenceInfo: IDrivingLicenceInfo;
  applicantCartification: IApplicantCartification;
  applicationCarification: IApplicantionCarification;
  accidentProcedure: IAccidentProcedure;
  submittalPolicy: ISubmittalpolicy;
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
