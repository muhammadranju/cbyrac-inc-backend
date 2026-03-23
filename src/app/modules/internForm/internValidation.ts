// validation/onboardingValidation.ts
import { z } from 'zod';
import { 
  Citizenship, 
  W4Status, 
  I9Status, 
  BankAccountType
} from './interface';

// GeneralInfo Schema
const GeneralInfoSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  ssn: z.string().optional(),
  dateOfBirth: z.string().optional(),
  applicationDate: z.string().optional(),
  email: z.string().email().optional(),
  telephoneNumber: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  desiredEmploymentType: z.string().optional(),
  desiredSalary: z.number().optional(),
  hourlyRate: z.number().optional(),
  startDate: z.string().optional(),
  previouslyApplied: z.boolean().optional(),
  previousApplicationDate: z.string().optional(),
  previouslyEmployed: z.boolean().optional(),
  previousSeparationReason: z.string().optional(),
  education: z.object({
    schoolName: z.string().optional(),
    major: z.string().optional(),
    graduationStatus: z.string().optional(),
    yearsCompleted: z.number().optional(),
    honorsReceived: z.boolean().optional(),
  }).optional(),
  specialSkills: z.string().optional(),
  signature: z.array(z.any()).optional(),
});

// DirectDepositInfo Schema
const DirectDepositInfoSchema = z.object({
  bankName: z.string().optional(),
  accountType: z.nativeEnum(BankAccountType).optional(),
  depositAmount: z.number().optional(),
  depositPercentage: z.number().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  secondaryAccount: z.object({
    bankName: z.string().optional(),
    depositPercentage: z.number().optional(),
    routingNumber: z.string().optional(),
    accountNumber: z.string().optional(),
  }).optional(),
  authorizationForm: z.array(z.any()).optional(),
  signature: z.string().optional(),
  signatureDate: z.string().optional(),
});

// I9Info Schema
const I9InfoSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  otherNames: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.nativeEnum(I9Status).optional(),
  uscisNumber: z.string().optional(),
  admissionNumber: z.string().optional(),
  foreignPassportNumber: z.string().optional(),
  signature: z.array(z.any()).optional(),
  signatureDate: z.string().optional(),
});

// W4Info Schema
const W4InfoSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  ssn: z.string().optional(),
  address: z.string().optional(),
  filingStatus: z.nativeEnum(W4Status).optional(),
  acceptedTerms: z.boolean().optional(),
  childDependents: z.number().optional(),
  childTaxCreditAmount: z.number().optional(),
  otherDependents: z.number().optional(),
  otherDependentTaxCreditAmount: z.number().optional(),
  totalTaxCreditAmount: z.number().optional(),
  optionalDeductions: z.object({
    deduction1: z.number().optional(),
    deduction2: z.number().optional(),
    deduction3: z.number().optional(),
  }).optional(),
  signature: z.array(z.any()).optional(),
  signatureDate: z.string().optional(),
});

// DocumentInfo Schema
const DocumentInfoSchema = z.object({
  citizenshipStatus: z.nativeEnum(Citizenship).optional(),
  idDocuments: z.array(z.any()).optional(),
  sscCard: z.array(z.any()).optional(),
  residentCard: z.array(z.any()).optional(),
  workAuthDocument: z.array(z.any()).optional(),
});

// Main WizardData Schema
export const WizardDataSchema = z.object({
  generalInfo: GeneralInfoSchema.optional(),
  directDepositInfo: DirectDepositInfoSchema.optional(),
  i9Info: I9InfoSchema.optional(),
  w4Info: W4InfoSchema.optional(),
  documentInfo: DocumentInfoSchema.optional(),
});

export type WizardDataInput = z.infer<typeof WizardDataSchema>;