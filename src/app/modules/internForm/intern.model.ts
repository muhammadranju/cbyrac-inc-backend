import mongoose, { Schema, Document } from 'mongoose';
import { IInternFormData } from './interface';

// ─── Subschemas ───
const ContactInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const EducationInfoSchema = new Schema(
  {
    schoolName: String,
    major: String,
    graduationStatus: { type: String, enum: ['Graduated', 'Not Graduated'] },
    yearsCompleted: Number,
    honorsReceived: String,
  },
  { _id: false }
);

const BankAccountSchema = new Schema(
  {
    bankName: { type: String, required: true },
    state: String,
    transitNo: { type: String, required: true },
    accountNo: { type: String, required: true },
    depositAmount: Number,
    depositPercentage: { type: Number, required: true },
    accountType: {
      type: String,
      enum: ['Checking', 'Savings'],
      required: true,
    },
  },
  { _id: false }
);

const DirectDepositSchema = new Schema(
  {
    name: { type: String, required: true },
    ssn: { type: String, required: true },
    checkingAccount: BankAccountSchema,
    savingsAccount: BankAccountSchema,
    accountFile: String,
    signature: String,
    signatureDate: String,
  },
  { _id: false }
);

// const I9Schema = new Schema({}, { _id: false, strict: false }); // Mixed type safely

// const W4Schema = new Schema(
//   {
//     firstName: { type: String, required: true },
//     middleName: String,
//     lastName: { type: String, required: true },
//     ssn: { type: String, required: true },
//     address: { type: String, required: true },
//     maritalStatus: { type: String, enum: Object.values(IW4Status) },
//     acceptedTerms: Boolean,
//     childrenNo: Number,
//     amount: Number,
//     childrenDepencyNo: Number,
//     eachDepencyAmount: Number,
//     TotalDependencyAmount: Number,
//     withHoldAmount: Number,
//     deductedAmount: String,
//     extraWithHoldingAmount: Number,
//     signature: String,
//     signatureDate: String,
//   },
//   { _id: false }
// );

const DocumentInfoSchema = new Schema({}, { _id: false, strict: false });

const GeneralInfoSchema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    ssn: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    applicationDate: { type: String, required: true },
    email: { type: String, required: true },
    telephoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    emergencyContact: ContactInfoSchema,
    desiredEmploymentType: { type: String, enum: ['Intern', 'Temp Employee'] },
    desiredSalary: Number,
    hourlyRate: Number,
    appliedPosition: String,
    department: String,
    overtime: { type: String, enum: ['Yes', 'No'] },
    startDate: String,
    previouslyApplied: Boolean,
    previousApplicationDate: String,
    previouslyEmployed: Boolean,
    previousSeparationReason: String,
    education: EducationInfoSchema,
    specialSkills: String,
    signature: String,
  },
  { _id: false }
);

// ─── Main Schema ───
const InternFormSchema = new Schema<IInternFormData & Document>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    generalInfo: { type: GeneralInfoSchema, required: true }, // safe now
    bankForm: { type: DirectDepositSchema, required: true },
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
export const InternModel = mongoose.model<IInternFormData & Document>(
  'InternFormData',
  InternFormSchema
);
