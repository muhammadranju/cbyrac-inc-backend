import mongoose, { Schema, Document } from 'mongoose';
import { ITemporaryFormData } from './temporary.interface';
export interface ITemporaryFormDocument extends ITemporaryFormData, Document {}
// ─── Enums ───
const EmploymentType = ['Intern', 'Temporary'];
const OvertimePreference = ['Yes', 'No'];
const GraduationStatus = ['Graduated', 'Not Graduate'];
const TypeStatus = ['Yes', 'No'];
const ICitizenship = ['citizen', 'resident', 'workauth'];
// const IW4Status = ['single', 'married', 'marriedSeparate'];
// const I9Status = [
//   'US Citizen',
//   'Noncitizen National',
//   'Lawful Permanent Resident',
//   'Other Noncitizen',
// ];

// ─── Sub-schemas ───
const ContactInfoSchema = new Schema(
  {
    name: String,
    relationship: String,
    phone: String,
  },
  { _id: false }
);

const EducationInfoSchema = new Schema(
  {
    level: String,
    name: String,
    major: String,
    graduationStatus: { type: String, enum: GraduationStatus },
    yearsCompleted: Number,
    honorsReceived: String,
  },
  { _id: false }
);

const BankAccountSchema = new Schema(
  {
    bankName: String,
    state: String,
    transitNo: Number,
    accountNo: Number,
    depositType: { type: String, enum: ['full', 'partial'] },
    depositPercentage: Number,
    accountType: { type: String, enum: ['Checking', 'Savings'] },
  },
  { _id: false }
);

// ─── General Info ───
const GeneralInfoSchema = new Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    ssn: String,
    dateOfBirth: String,
    applicationDate: String,
    email: String,
    telephoneNumber: String,
    address: String,
    emergencyContact: ContactInfoSchema,
    desiredEmploymentType: { type: String, enum: EmploymentType },
    desiredSalary: String,
    hourlyRate: String,
    appliedPosition: String,
    department: String,
    overtime: { type: String, enum: OvertimePreference },
    startDate: String,
    previouslyApplied: Boolean,
    previousApplicationDate: String,
    previouslyEmployed: Boolean,
    previousSeparationReason: String,
    education: [EducationInfoSchema],
    specialSkills: String,
  },
  { _id: false }
);

// ─── Direct Deposit ───
const DirectDepositInfoSchema = new Schema(
  {
    name: String,
    ssn: String,
    checkingAccount: BankAccountSchema,
    savingsAccount: BankAccountSchema,
    signatureDate: String,
  },
  { _id: false }
);

// ─── I9 Form ───
// const BaseI9InfoSchema = new Schema(
//   {
//     lastName: String,
//     firstName: String,
//     middleName: String,
//     otherNames: String,
//     address: String,
//     dateOfBirth: String,
//     ssn: String,
//     email: String,
//     phone: String,
//     signatureDate: String,
//   },
//   { _id: false }
// );

// const I9InfoSchema = new Schema(
//   {
//     ...BaseI9InfoSchema.obj,
//     status: { type: String, enum: I9Status },
//     uscisNumber: String,
//     admissionNumber: String,
//     foreignPassportNumber: String,
//   },
//   { _id: false }
// );

// ─── W4 Form ───
// const W4InfoSchema = new Schema(
//   {
//     firstName: String,
//     middleName: String,
//     lastName: String,
//     ssn: String,
//     address: String,
//     maritalStatus: { type: String, enum: IW4Status },
//     acceptedTerms: Boolean,
//     childrenNo: Number,
//     amount: Number,
//     childrenDepencyNo: Number,
//     eachDepencyAmount: Number,
//     TotalDependencyAmount: Number,
//     withHoldAmount: Number,
//     deductedAmount: String,
//     extraWithHoldingAmount: Number,
//     signatureDate: String,
//   },
//   { _id: false }
// );

// ─── Citizenship Docs ───

// ─── Employee Info ───
const TerminationInfoSchema = new Schema(
  {
    terminationStatus: { type: String, enum: TypeStatus },
    terminationCount: Number,
  },
  { _id: false }
);

const ManualAgreementTerminationSchema = new Schema(
  {
    terminatedByManualAgreement: { type: String, enum: TypeStatus },
    terminationCount: Number,
  },
  { _id: false }
);

const ResignationInsteadOfTerminationSchema = new Schema(
  {
    resignedInsteadOfTerminated: { type: String, enum: TypeStatus },
    resignationCount: Number,
  },
  { _id: false }
);

const TerminationDetailsOfEmployeeSchema = new Schema(
  {
    name: String,
    position: String,
    company: String,
    telephone: String,
    occupation: String,
    bestTimeToCall: String,
    workRelation: String,
    NoOfYearKnown: String,
  },
  { _id: false }
);

const EmployeeSchema = new Schema(
  {
    name: String,
    address: String,
    telephone: String,
    dateEmployeeFrom: Date,
    dateEmployeeTo: Date,
    jobTitle: String,
    duties: String,
    supervisorName: String,
    MayWeContact: Boolean,
    wagesStart: String,
    final: String,
    reasonForLeaving: String,
    terminationReason: String,
    disciplinaryAction: String,
    noticePeriod: String,
  },
  { _id: false }
);

const EmployeeInfoSchema = new Schema(
  {
    employee1: EmployeeSchema,
    employee2: EmployeeSchema,
    terminationInfo: TerminationInfoSchema,
    manualAgreementTermination: ManualAgreementTerminationSchema,
    resignationInsteadOfTermination: ResignationInsteadOfTerminationSchema,
    explanation: String,
    terminationDetailsOfEmployee: [TerminationDetailsOfEmployeeSchema],
  },
  { _id: false }
);

// ─── Driving Licence Info ───
const ValidDriverLicenseSchema = new Schema(
  {
    hasDriverLicense: { type: String, enum: TypeStatus },
    licenseNo: Number,
    state: String,
    expirationDate: Date,
    reason: String,
  },
  { _id: false }
);

const LicenseSuspensionInfoSchema = new Schema(
  {
    licenseSuspendedOrRevoked: { type: String, enum: TypeStatus },
    reason: String,
  },
  { _id: false }
);

const PersonalAutoInsuranceSchema = new Schema(
  {
    hasPersonalAutoInsurance: { type: String, enum: TypeStatus },
    reason: String,
  },
  { _id: false }
);

const PersonalAutoInsuranceHistorySchema = new Schema(
  {
    insuranceDeniedOrTerminated: { type: String, enum: TypeStatus },
    reason: String,
  },
  { _id: false }
);

const MovingTrafficViolationSchema = new Schema(
  {
    offense: String,
    date: Date,
    location: String,
    comment: String,
  },
  { _id: false }
);

const DrivingLicenceInfoSchema = new Schema(
  {
    validDriverLicense: ValidDriverLicenseSchema,
    licenseSuspensionInfo: LicenseSuspensionInfoSchema,
    personalAutoInsurance: PersonalAutoInsuranceSchema,
    personalAutoInsuranceHistory: PersonalAutoInsuranceHistorySchema,
    movingTrafficViolation: [MovingTrafficViolationSchema],
  },
  { _id: false }
);

// ─── Applicant Clarifications ───
const ApplicantCartificationSchema = new Schema(
  {
    check: Boolean,
    signatureDate: Date,
  },
  { _id: false }
);

const ApplicationCarificationSchema = new Schema(
  {
    check: Boolean,
    signatureDate: Date,
  },
  { _id: false }
);

const AccidentProcedureSchema = new Schema(
  {
    check: Boolean,
    signatureDate: Date,
  },
  { _id: false }
);

const SubmittalPolicyInfoSchema = new Schema(
  {
    check: Boolean,
    name: String,
  },
  { _id: false }
);

const SubmittalPolicySchema = new Schema(
  {
    submittalPolicyDirectUnderstand: SubmittalPolicyInfoSchema,
    submittalPolicyExplainUnderstand: SubmittalPolicyInfoSchema,
    check: Boolean,
  },
  { _id: false }
);

// ─── Main Schema ───
const TemporaryFormSchema = new Schema<ITemporaryFormDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    generalInfo: GeneralInfoSchema,
    employeeInfo: EmployeeInfoSchema,
    drivingLicenceInfo: DrivingLicenceInfoSchema,
    applicantCartification: ApplicantCartificationSchema,
    applicationCarification: ApplicationCarificationSchema,
    accidentProcedure: AccidentProcedureSchema,
    submittalPolicy: SubmittalPolicySchema,
    bankForm: DirectDepositInfoSchema,
    i9Form: String,
    w4Form: String,
    citizenShipForm: String,
    signature: String,
    photoId: String,
    accountFile: String,
    residentCard: String,
    socialSecurityCard: String,
    workAuthorizationDocument: String,
  },
  { timestamps: true }
);

// ─── Model ───
export const TemporaryFormModel = mongoose.model<ITemporaryFormDocument>(
  'TemporaryForm',
  TemporaryFormSchema
);
