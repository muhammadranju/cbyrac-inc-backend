// enums/admin.enum.ts
export enum CHECK_ONE {
  NEW_HIRED = 'newHire',
  REHIRED = 'rehire',
}

export enum JOB_STATUS {
  FULL_TIME = 'fullTime',
  PART_TIME = 'partTime',
}

export enum PAY_RATE {
  HOURLY = 'hourly',
  OT_EXEMPT = 'salaryExempt',
  OT_NON_EXEMPT = 'salaryNonExempt',
}

export interface IAdminForm {
  checkOne: CHECK_ONE;
  jobStatus: JOB_STATUS;
  jobDescription: string;
  wcCode: string;
  hireDate: Date;
  terminateDate?: Date;
  payRate: PAY_RATE;
  salaryAmount: number;
  regularRateSalary?: number;
  otRate?: number;
  workHoursPerPeriod?: number;
  receivedBy: string; // file image or pdf.
  receivedDate: Date;
}
