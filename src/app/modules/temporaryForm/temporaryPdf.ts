interface EmployeeData {
  createdAt?: string;
  logoUrl?: string;
  signatureUrl?: string;
  newPayrollDeposit?: boolean;
  changeDepositInfo?: boolean;
  revokeAuthorization?: boolean;
  generalInfo?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    ssn?: string;
    dateOfBirth?: string;
    telephoneNumber?: string;
    email?: string;
    address?: string;
    emergencyContact?: {
      name?: string;
      relationship?: string;
      phone?: string;
    };
    appliedPosition?: string;
    department?: string;
    desiredSalary?: string | number;
    hourlyRate?: string | number;
    overtime?: string;
    startDate?: string;
    previouslyApplied?: boolean;
    previousApplicationDate?: string;
    previouslyEmployed?: boolean;
    previousSeparationReason?: string;
    education?: {
      level?: string;
      name?: string;
      major?: string;
      graduationStatus?: string;
      yearsCompleted?: string | number;
      honorsReceived?: string;
    }[];
  };
  bankForm?: {
    name?: string;
    ssn?: string;
    checkingAccount?: {
      bankName?: string;
      state?: string;
      depositPercentage?: number;
      transitNo?: string;
      accountNo?: string;
    };
    savingsAccount?: {
      bankName?: string;
      state?: string;
      depositPercentage?: number;
      transitNo?: string;
      accountNo?: string;
    };
  };
  i9Form: string;
  w4Form: string;
  signature?: string;
  accountFile?: string;
}

const formatDate = (isoDate: any): string => {
  if (!isoDate) return new Date().toLocaleDateString('en-GB');
  try {
    const date = new Date(isoDate);
    return isNaN(date.getTime())
      ? new Date().toLocaleDateString('en-GB')
      : date.toLocaleDateString('en-GB');
  } catch {
    return new Date().toLocaleDateString('en-GB');
  }
};

const sanitize = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

import dotenv from 'dotenv';
dotenv.config();

export const generateHTMLTemplateForTemporary = (
  employeeData: EmployeeData
): string => {
  if (!employeeData) {
    throw new Error('Employee data is required');
  }

  const formattedDate = formatDate(employeeData.createdAt);
  const logoUrl =
    employeeData.logoUrl || 'http://10.10.7.102:8000/cbyrac-logo.png';

  const get = (path: string, defaultVal: any = ''): string => {
    try {
      const value = path
        .split('.')
        .reduce((obj: any, key) => obj?.[key], employeeData);
      return value !== undefined && value !== null
        ? sanitize(String(value))
        : String(defaultVal);
    } catch {
      return String(defaultVal);
    }
  };

  // Generate URLs
  const accountFileUrl = employeeData.accountFile
    ? `${process.env.IMAGR_URL_IMAGE || 'http://10.10.7.102:8000'}/image${
        employeeData.accountFile
      }`
    : '';
  const signature = employeeData.signature
    ? `${process.env.IMAGR_URL_IMAGE || 'http://10.10.7.102:8000'}${
        employeeData.signature
      }`
    : '';

  const i9Form = employeeData.i9Form
    ? `${process.env.IMAGR_URL_IMAGE || 'http://10.10.7.102:8000'}${
        employeeData.i9Form
      }`
    : '';
  const w4Form = employeeData.w4Form
    ? `${process.env.IMAGR_URL_IMAGE || 'http://10.10.7.102:8000'}${
        employeeData.w4Form
      }`
    : '';

  // Get education array or create empty array
  const educationData = employeeData.generalInfo?.education || [];
  // Ensure we have at least 4 rows (fill with empty objects if needed)
  const educationRows = [...educationData];
  while (educationRows.length < 4) {
    educationRows.push({});
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application Form</title>
    <style>
      /* Reset and Base Styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      }

      body {
        background-color: white;
        color: #000;
        line-height: 1.4;
        font-size: 12px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      /* PDF Page Setup - US Letter Size */
      @page {
        size: letter;
        margin: 0.3in 0.3in;
      }

      @media print {
        body {
          padding: 0;
          margin: 0;
        }
        
        .pdf-page {
          margin: 0;
          padding: 0.5in 0.75in;
          width: 8.5in;
          height: 11in;
          position: relative;
          box-sizing: border-box;
        }
        
        /* Force page breaks */
        .page-break {
          page-break-after: always;
          break-after: page;
        }
        
        .avoid-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        /* Ensure no blank pages */
        .no-break {
          page-break-after: avoid;
        }
        
        /* Hide non-print elements */
        .no-print {
          display: none !important;
        }
        
        /* Ensure links are visible and clickable in PDF */
        a {
          color: #0000EE !important;
          text-decoration: underline !important;
        }
        
        .bank-btn {
          color: #0000EE !important;
          background-color: transparent !important;
          border: 1px solid #0000EE !important;
          text-decoration: none !important;
        }
        
        /* Ensure checkboxes are visible */
        input[type="checkbox"] {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        /* Make links clickable in PDF */
        a[href] {
          text-decoration: underline !important;
          color: #0000EE !important;
        }
      }

      /* Screen Styles */
      .pdf-page {
        width: 8.5in;
        min-height: 11in;
        padding: 0.5in 0.75in;
        margin: 0 auto 20px auto;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        position: relative;
        box-sizing: border-box;
      }

      .flex {
        display: flex;
      }

      .justify-between {
        justify-content: space-between;
      }

      .items-center {
        align-items: center;
      }

      .items-start {
        align-items: flex-start;
      }

      .gap-1 {
        gap: 0.25rem;
      }
      .gap-2 {
        gap: 0.5rem;
      }
      .gap-3 {
        gap: 0.75rem;
      }
      .gap-4 {
        gap: 1rem;
      }

      .font-bold {
        font-weight: bold;
      }
      .font-medium {
        font-weight: 500;
      }
      .font-semibold {
        font-weight: 600;
      }
      .italic {
        font-style: italic;
      }

      .text-xs {
        font-size: 10px;
      }
      .text-sm {
        font-size: 11px;
      }
      .text-base {
        font-size: 12px;
      }
      .text-lg {
        font-size: 13px;
      }
      .text-xl {
        font-size: 14px;
      }

      .text-center {
        text-align: center;
      }
      .text-right {
        text-align: right;
      }
      
      .mb-1 {
        margin-bottom: 0.25rem;
      }
      .mb-2 {
        margin-bottom: 0.5rem;
      }
      .mb-3 {
        margin-bottom: 0.75rem;
      }
      .mb-4 {
        margin-bottom: 1rem;
      }
      .mb-5 {
        margin-bottom: 1.25rem;
      }
      .mb-6 {
        margin-bottom: 1.5rem;
      }
      .mt-0 {
        margin-top: 0;
      }
      .mt-1 {
        margin-top: 0.25rem;
      }
      .mt-2 {
        margin-top: 0.5rem;
      }
      .mt-3 {
        margin-top: 0.75rem;
      }
      .mt-4 {
        margin-top: 1rem;
      }
      .mt-6 {
        margin-top: 1.5rem;
      }
      .mt-8 {
        margin-top: 5rem;
      }
      .ml-2 {
        margin-left: 0.5rem;
      }
      .ml-4 {
        margin-left: 1rem;
      }
      .ml-16 {
        margin-left: 4rem;
      }

      .p-1 {
        padding: 0.25rem;
      }
      .p-2 {
        padding: 0.5rem;
      }
      .p-3 {
        padding: 0.75rem;
      }
      .p-4 {
        padding: 1rem;
      }

      .border {
        border: 1px solid black;
      }
      .border-b {
        border-bottom: 1px solid black;
      }
      .border-t {
        border-top: 1px solid black;
      }
      .border-r {
        border-right: 1px solid black;
      }

      .min-w-120 {
        min-width: 120px;
      }
      .min-w-150 {
        min-width: 150px;
      }
      .min-w-180 {
        min-width: 180px;
      }
      .min-w-200 {
        min-width: 200px;
      }

      .min-w-0 {
        min-width: 0;
      }

      .object-contain {
        object-fit: contain;
      }

      .bg-black {
        background-color: black;
      }
      .text-white {
        color: white;
      }

      .grid {
        display: grid;
      }
      .grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }
      .grid-cols-3 {
        grid-template-columns: repeat(3, 1fr);
      }

      .space-y-2 > * + * {
        margin-top: 0.5rem;
      }
      .space-y-3 > * + * {
        margin-top: 0.75rem;
      }
      .space-y-4 > * + * {
        margin-top: 1rem;
      }

      table {
        border-collapse: collapse;
        width: 100%;
        font-size: 11px;
      }

      th,
      td {
        border: 1px solid black;
        padding: 0.25rem;
        text-align: left;
        font-weight: 500;
        vertical-align: top;
      }

      th {
        background-color: #f0f0f0;
        font-size: 10px;
        font-weight: bold;
      }
      
      /* Education table specific styles */
      .education-table td {
        height: 60px; /* Fixed height for each row */
      }
      
      .education-table th:nth-child(1) {
        width: 25%;
      }
      .education-table th:nth-child(2) {
        width: 20%;
      }
      .education-table th:nth-child(3) {
        width: 15%;
      }
      .education-table th:nth-child(4) {
        width: 15%;
      }
      .education-table th:nth-child(5) {
        width: 25%;
      }
      
      /* Logo positioning */
      .logo-container {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
      
      /* Bank Form Styles */
      .bank-flex { display: flex; }
      .bank-items-center { align-items: center; }
      .bank-justify-between { justify-content: space-between; }
      .bank-justify-end { justify-content: flex-end; }
      .bank-justify-center { justify-content: center; }
      .bank-gap-1 { gap: 0.25rem; }
      .bank-gap-2 { gap: 0.5rem; }
      .bank-gap-3 { gap: 0.75rem; }
      .bank-gap-4 { gap: 1rem; }
      .bank-flex-1 { flex: 1; }

      /* Text */
      .bank-text-right { text-align: right; }
      .bank-text-center { text-align: center; }
      .bank-text-sm { font-size: 11px; }
      .bank-text-base { font-size: 12px; }
      .bank-text-lg { font-size: 13px; }
      .bank-text-xl { font-size: 14px; }
      .bank-font-medium { font-weight: 500; }
      .bank-font-bold { font-weight: 700; }
      .bank-leading-relaxed { line-height: 1.5; }
      .bank-leading-tight { line-height: 1.25; }

      /* Spacing */
      .bank-mb-0 { margin-bottom: 0; }
      .bank-mb-1 { margin-bottom: 0.25rem; }
      .bank-mb-2 { margin-bottom: 0.5rem; }
      .bank-mb-3 { margin-bottom: 0.75rem; }
      .bank-mb-4 { margin-bottom: 1rem; }
      .bank-mb-5 { margin-bottom: 1.25rem; }
      .bank-mb-6 { margin-bottom: 1.5rem; }
      .bank-mt-0 { margin-top: 0; }
      .bank-mt-1 { margin-top: 0.25rem; }
      .bank-mt-2 { margin-top: 0.5rem; }
      .bank-mt-3 { margin-top: 0.75rem; }
      .bank-mt-4 { margin-top: 1rem; }
      .bank-ml-2 { margin-left: 0.5rem; }
      .bank-ml-4 { margin-left: 1rem; }
      .bank-p-0 { padding: 0; }
      .bank-p-1 { padding: 0.25rem; }
      .bank-p-2 { padding: 0.5rem; }
      .bank-p-3 { padding: 0.75rem; }
      .bank-p-4 { padding: 1rem; }

      /* Widths & Heights */
      .bank-w-20 { width: 5rem; }
      .bank-w-24 { width: 6rem; }
      .bank-w-32 { width: 8rem; }
      .bank-w-40 { width: 10rem; }
      .bank-w-48 { width: 12rem; }
      .bank-min-w-60 { min-width: 60px; }
      .bank-min-w-120 { min-width: 120px; }
      .bank-min-w-150 { min-width: 150px; }
      .bank-min-w-180 { min-width: 180px; }
      .bank-min-w-200 { min-width: 200px; }
      .bank-h-4 { height: 1rem; }
      .bank-h-6 { height: 1.5rem; }
      .bank-h-8 { height: 2rem; }

      /* Borders */
      .bank-border-b { border-bottom: 1px solid black; }
      .bank-border-b-2 { border-bottom: 2px solid black; }
      .bank-border { border: 1px solid #ccc; }

      /* Background & Colors */
      .bank-bg-gray-50 { background-color: #f9fafb; }
      .bank-bg-gray-100 { background-color: #f3f4f6; }

      /* Rounded */
      .bank-rounded { border-radius: 0.25rem; }

      /* Buttons */
      .bank-btn { 
        padding: 0.375rem 0.75rem; 
        border-radius: 0.25rem; 
        color: white; 
        background-color: #2563eb; 
        margin-top: 0.5rem; 
        text-decoration: none; 
        display: inline-block; 
        font-size: 11px;
        border: none;
        cursor: pointer;
      }
      .bank-btn:hover { 
        background-color: #1d4ed8; 
      }

      /* Utility */
      .bank-inline-block { display: inline-block; }
      .bank-whitespace-nowrap { white-space: nowrap; }
      .bank-mx-auto { margin-left: auto; margin-right: auto; }

      /* Emergency Contact Styling */
      .emergency-contact {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.125rem;
      }

      .emergency-contact-labels {
        font-size: 10px;
        font-style: italic;
        margin-left: 11.5rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.5rem;
      }

      .emergency-contact-field {
        border-bottom: 1px solid black;
        flex: 1;
        min-width: 0;
      }

      .emergency-contact-values {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 0.5rem;
      }

      /* Checkbox styling */
      input[type="checkbox"] {
        width: 0.9rem;
        height: 0.9rem;
        vertical-align: middle;
        margin: 0 0.25rem;
      }

      /* Keep important content together */
      .keep-together {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Line separator */
      .line-separator {
        border-top: 1px solid #666;
        margin: 1rem 0;
      }

      /* Divider */
      .divider {
        height: 1px;
        background-color: #000;
        margin: 1rem 0;
      }

      /* Section separator */
      .section-separator {
        border-top: 2px solid #000;
        margin: 1.5rem 0;
      }
      
      /* Bank page top alignment */
      .bank-page-top {
        margin-top: 0;
        padding-top: 0;
      }
      
      /* PDF Link Styling */
      .pdf-link {
        color: #0000EE;
        text-decoration: underline;
        cursor: pointer;
        font-size: 12px;
      }
      
      .pdf-link:hover {
        color: #0000CC;
      }
      
      /* Account file link styling */
      .account-file-link {
        display: inline-block;
        padding: 6px 12px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        color: #0000EE;
        text-decoration: underline;
        font-size: 11px;
        margin-top: 8px;
      }
      
      .account-file-link:hover {
        background-color: #e0e0e0;
      }

      /* Reset & Basic */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background-color: #f5f5f5;
  padding: 20px;
  color: #000;
  line-height: 1.4;
}

/* Container */
.i9Form-container {
  max-width: 8.5in;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Page break */
.i9Form-page-break {
  page-break-after: always;
}

/* Padding utilities */
.i9Form-p-8 { padding: 2rem; }
.i9Form-print-p-12 { padding: 3rem; }
.i9Form-pb-2 { padding-bottom: 0.5rem; }
.i9Form-p-2 { padding: 0.5rem; }
.i9Form-p-1 { padding: 0.25rem; }

/* Margin utilities */
.i9Form-mb-2 { margin-bottom: 0.5rem; }
.i9Form-mb-3 { margin-bottom: 0.75rem; }
.i9Form-mb-4 { margin-bottom: 1rem; }
.i9Form-mb-5 { margin-bottom: 1.25rem; }

/* Flex utilities */
.i9Form-flex { display: flex; }
.i9Form-flex-1 { flex: 1 1 0%; }
.i9Form-justify-between { justify-content: space-between; }
.i9Form-justify-center { justify-content: center; }
.i9Form-items-start { align-items: flex-start; }
.i9Form-items-center { align-items: center; }
.i9Form-flex-col { flex-direction: column; }

/* Borders */
.i9Form-border { border-width: 1px; border-style: solid; }
.i9Form-border-b { border-bottom-width: 1px; border-bottom-style: solid; }
.i9Form-border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; }
.i9Form-border-black { border-color: black; }

/* Text */
.i9Form-text-center { text-align: center; }
.i9Form-text-right { text-align: right; }
.i9Form-text-sm { font-size: 12px; }
.i9Form-text-xs { font-size: 12px; }
.i9Form-text-lg { font-size: 18px; }
.i9Form-font-bold { font-weight: bold; }
.i9Form-font-semibold { font-weight: 600; }

/* Backgrounds */
.i9Form-bg-gray-100 { background-color: #f3f4f6; }
.i9Form-bg-gray-300 { background-color: #d1d5db; }

/* Logo styling */
.i9Form-logo-container {
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.i9Form-logo {
  width: 4rem;
  height: 4rem;
  border: 4px solid black;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}
.i9Form-logo-text {
  font-weight: bold;
  font-size: 14px;
  line-height: 1.1;
}
.i9Form-logo-subtext {
  font-size: 6px;
  line-height: 1;
  text-align: center;
}

/* Text decoration */
.i9Form-underline { text-decoration: underline; }
/* Reset */
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
//   font-family: Arial, sans-serif;
// }

/* Container */
.w4-container {
  max-width: 900px;
  margin: 20px 40px;
  border: 2px solid black;
}

/* Header Flex */
.w4-header {
  display: flex;
  border-bottom: 2px solid black;
}

/* Left Section */
.w4-left {
  width: 160px; /* ~w-40 */
  border-right: 2px solid black;
  padding: 12px;
  text-align: left;
}

.w4-left .w4-title {
  font-size: 3rem; /* 5xl */
  font-weight: 500;
  line-height: 1;
}

.w4-left .w4-subtitle,
.w4-left .w4-department,
.w4-left .w4-agency {
  font-size: 0.875rem; /* sm */
  line-height: 1.2;
  margin-top: 4px;
}

/* Center Section */
.w4-center {
  flex: 1;
  padding: 16px;
  text-align: center;
}

.w4-center .w4-main-title {
  font-size: 1.5rem; /* 2xl */
  font-weight: bold;
  margin-bottom: 8px;
}

.w4-center .w4-instructions,
.w4-center .w4-note {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  margin-top: 4px;
}

/* Right Section */
.w4-right {
  width: 160px;
  border-left: 2px solid black;
  padding: 12px;
  text-align: right;
}

.w4-right .w4-omb {
  font-size: 0.875rem;
}

.w4-right .w4-year {
  font-size: 3rem; /* 5xl */
  font-weight: 500;
  margin: 4px 0;
  text-align: center;
}

/* Print styles */
@media print {
  body { background-color: white; padding: 0; }
  .i9Form-container { box-shadow: none; max-width: 100%; }
}

    </style>
  </head>
  <body>
    <!-- Page 1: Application Form -->
    <div class="pdf-page page-break avoid-break">
      <!-- Header with logo on the right -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-xl font-bold">CBYRAC, INC</h1>
          <p class="text-sm mt-1">633 NE 167TH STREET, SUITE 709</p>
          <p class="text-sm font-medium">NORTH MIAMI BEACH, FL. 33162</p>
          <p class="text-sm font-medium">PH:786-403-5043</p>
          <p class="text-sm font-medium">E-MAIL: cbyracinc@gmail.com</p>
        </div>
        <div class="logo-container">
          <img
            class="object-contain"
            src="${logoUrl}"
            alt="CBYRAC Logo"
            style="width: 1.5in; height: 1.5in"
            onerror="this.style.display='none'"
          />
        </div>
      </div>

      <h2 class="bg-black text-white text-center text-lg font-bold mb-3 p-1">
        APPLICATION FOR EMPLOYMENT
      </h2>
      <p class="font-bold text-center mb-3 text-sm">
        Please Answer All Questions. Resumes Are Not A Substitute For A
        Completed Application.
      </p>

      <div class="flex mb-3 justify-end font-medium">
        <span>Date: </span>
        <span class="border-b border-black min-w-120 text-right ml-2">
          ${formattedDate}
        </span>
      </div>

      <p class="text-sm mb-2 leading-relaxed font-medium">
        We are an equal opportunity employer. Applicants are considered for
        positions without regard to veteran status, uniformed servicemember
        status, race color, religion, sex, national origin, age, physical or
        mental disability, genetic information or any other category protected
        by applicable federal, state, or local laws.
      </p>

      <p class="text-sm mb-4 leading-relaxed font-semibold">
        THIS COMPANY IS AN AT-WILL EMPLOYER AS ALLOWED BY APPLICABLE STATE LAW.
        THIS MEANS THAT REGARDLESS OF ANY PROVISION IN THIS APPLICATION, IF
        HIRED, THE COMPANY OR I MAY TERMINATE THE EMPLOYMENT RELATIONSHIP AT ANY
        TIME, FOR ANY REASON, WITH OR WITHOUT CAUSE OR NOTICE.
      </p>

      <!-- Personal Information -->
      <div class="space-y-2 mb-4">
        <!-- Grid 3 columns -->
        <div class="grid grid-cols-3 gap-3 mt-3">
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium">Last Name:</span>
            <span class="border-b border-black flex-1 min-w-150">
              &nbsp;${get(`generalInfo.lastName`)}&nbsp;
            </span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium">First Name:</span>
            <span class="border-b border-black flex-1 min-w-150">
              &nbsp;${get(`generalInfo.firstName`)}&nbsp;
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Middle Name:</span>
            <span class="border-b border-black flex-1 min-w-120">
              &nbsp;${get(`generalInfo.middleName`)}&nbsp;
            </span>
          </div>
        </div>

        <!-- Grid 2 columns -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium whitespace-nowrap">
              Social Security Number:
            </span>
            <span class="border-b border-black flex-1">
              &nbsp;${get(`generalInfo.ssn`)}&nbsp;
            </span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium whitespace-nowrap">DOB:</span>
            <span class="border-b border-black flex-1">
              &nbsp;${get(`generalInfo.dateOfBirth`)}&nbsp;
            </span>
          </div>
        </div>

        <!-- Telephone & Email -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium whitespace-nowrap">
              Telephone Number:
            </span>
            <span class="border-b border-black flex-1">
              &nbsp;${get(`generalInfo.telephoneNumber`)}&nbsp;
            </span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium whitespace-nowrap">
              Email Address:
            </span>
            <span class="border-b border-black flex-1">
              &nbsp;${get(`generalInfo.email`)}&nbsp;
            </span>
          </div>
        </div>

        <!-- Address -->
        <div class="mb-2">
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium whitespace-nowrap">Address:</span>
            <span class="border-b border-black flex-1">
              &nbsp;${get(`generalInfo.address`)}&nbsp;
            </span>
          </div>
          <p class="text-xs italic ml-16">Street/Apartment/City/State/Zip</p>
        </div>

        <!-- Emergency Contact -->
        <div class="mb-3">
          <div class="emergency-contact">
            <span class="font-medium whitespace-nowrap">
              Emergency Contact Person:
            </span>
            <div class="emergency-contact-field">
              <div class="emergency-contact-values">
                <span>&nbsp;${get(
                  `generalInfo.emergencyContact.name`
                )}&nbsp;</span>
                <span>&nbsp;${get(
                  `generalInfo.emergencyContact.relationship`
                )}&nbsp;</span>
                <span>&nbsp;${get(
                  `generalInfo.emergencyContact.phone`
                )}&nbsp;</span>
              </div>
            </div>
          </div>
          <div class="emergency-contact-labels">
            <span>Name</span>
            <span>Relation</span>
            <span>Telephone</span>
          </div>
        </div>
      </div>

      <!-- Employment Type - Updated to separate lines -->
      <div class="space-y-2 mb-4">
        <div class="mb-2">
          <span class="font-medium whitespace-nowrap">
            Type of employment desired? ${
              get('generalInfo.appliedPosition') === 'Intern'
                ? 'Intern [✅]'
                : 'Temporary [✅]'
            }
          </span>
        </div>
        <div class="flex items-center gap-1 mb-2">
          <span class="font-medium whitespace-nowrap">Desired Salary/Hourly Rate:</span>
          <span class="border-b border-black flex-1 text-sm">
            Desire Salary: &nbsp;${get(
              `generalInfo.desiredSalary`
            )}&nbsp;/Hourly Rate: &nbsp;${get(`generalInfo.hourlyRate`)}&nbsp;
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-2">
          <div class="flex items-center gap-1">
            <span class="font-medium whitespace-nowrap">
              Position Applied For:
            </span>
            <span class="border-b border-black flex-1">
              &nbsp;${get(`generalInfo.appliedPosition`)}&nbsp;
            </span>
          </div>
          <div class="flex items-center gap-1">
            <span class="font-medium whitespace-nowrap">Dept.:</span>
            <span class="border-b border-black flex-1">
              &nbsp;${get(`generalInfo.department`)}&nbsp;
            </span>
          </div>
        </div>
        
        <!-- Updated Overtime Section -->
        <div class="mb-2">
          <span class="font-medium whitespace-nowrap">
            Are you willing to work overtime? ${
              get('generalInfo.overtime') === 'No' ? `No [❌]` : 'Yes [✅]'
            }
          </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="font-medium whitespace-nowrap">Date on which you can start work if hired:</span>
          <span class="border-b border-black flex-1">
            &nbsp;${get(`generalInfo.startDate`)}&nbsp;
          </span>
        </div>
      </div>

      <!-- Previous Employment Questions -->
      <div class="space-y-1 mb-4">
        <div>
          <span class="font-medium">
            Have you previously applied for employment with this company? ${
              get('generalInfo.previouslyApplied') ? 'Yes [✅]' : `No [❌]`
            }
          </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="font-medium whitespace-nowrap">
            If yes, when and where did you apply?
          </span>
          <span class="border-b border-black flex-1">
            ${get(`generalInfo.previousApplicationDate`)}
          </span>
        </div>
        <div>
          <span class="font-medium">
            Have you ever been employed by this Company?${
              get('generalInfo.previouslyEmployed') ? 'Yes [✅]' : `No [❌]`
            }
          </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="font-medium whitespace-nowrap">
            If yes, provide dates of employment, location and reason for
            separation from employment.
          </span>
          <span class="border-b border-black flex-1">
            &nbsp;${get(`generalInfo.previousSeparationReason`)}&nbsp;
          </span>
        </div>
      </div>

      <!-- Education Section -->
      <h3 class="text-sm font-bold mb-1">Education</h3>
      <table class="border mb-3 keep-together education-table">
        <thead>
          <tr>
            <th>School Name<br />(Address, City, State)</th>
            <th>Course of Study or Major</th>
            <th>Level</th>
            <th>Graduate? Y or N</th>
            <th># of Years Completed</th>
            <th>Honors Received</th>
          </tr>
        </thead>
        <tbody>
          ${educationRows
            .slice(0, 4)
            .map(
              (edu, index) => `
            <tr>
              <td>&nbsp;${edu.name || ''}&nbsp;</td>
              <td>&nbsp;${edu.major || ''}&nbsp;</td>
              <td>&nbsp;${edu.level || ''}&nbsp;</td>
              <td>&nbsp;${edu.graduationStatus || ''}&nbsp;</td>
              <td>&nbsp;${edu.yearsCompleted || ''}&nbsp;</td>
              <td>&nbsp;${edu.honorsReceived || ''}&nbsp;</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Work Experience -->
      <h3 class="font-bold mb-1">WORK EXPERIENCE</h3>
      <p class="text-sm font-semibold leading-relaxed">
        Please list the names of your present and/or previous employers in chronological order with present or most recent employer listed first. Provide information for at least the most recent ten (10) year period. Attach additional sheets if needed. If self-employed, supply firm name and business references. You may include any verifiable work performed on a volunteer basis, internships, or military service. Your failure to completely respond to each inquiry may disqualify you for consideration from employment.
      </p>
    </div>

    <!-- Page 2: Bank Form - Checking Account -->
    <div class="pdf-page page-break avoid-break bank-page-top">
      <h2 class="bank-text-xl bank-font-medium bank-text-center bank-mt-0">
        EMPLOYEE DIRECT DEPOSIT AUTHORIZATION AGREEMENT
      </h2>
      <div class="bank-border-b-2 bank-w-40 bank-flex bank-mx-auto bank-mb-2"></div>

      <h3 class="bank-text-lg bank-text-center bank-mb-4">(ACH CREDIT & DEBITS)</h3>

      <div class="bank-flex bank-items-center bank-gap-6 bank-mb-4">
        <span class="bank-text-sm bank-font-medium bank-whitespace-nowrap">New Payroll Deposit:</span>
        <input type="checkbox" class="bank-h-4 bank-w-8" ${
          employeeData.newPayrollDeposit ? 'checked' : ''
        } disabled>
        <span class="bank-text-sm bank-font-medium bank-whitespace-nowrap">Change Deposit Information:</span>
        <input type="checkbox" class="bank-h-4 bank-w-8" ${
          employeeData.changeDepositInfo ? 'checked' : ''
        } disabled>
        <span class="bank-text-sm bank-font-medium bank-whitespace-nowrap">Revoke Authorization:</span>
        <input type="checkbox" class="bank-h-4 bank-w-8" ${
          employeeData.revokeAuthorization ? 'checked' : ''
        } disabled>
      </div>

      <div class="bank-mb-4">
        <div class="bank-flex bank-items-center bank-gap-1 bank-justify-end">
          <span class="bank-text-sm bank-font-medium bank-whitespace-nowrap">Date:</span>
          <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-32 bank-ml-1">
            ${formattedDate}
          </span>
        </div>
      </div>

      <div class="bank-mb-3">
        <div class="bank-flex bank-items-center bank-gap-1">
          <span class="bank-text-base bank-whitespace-nowrap">Name:</span>
          <span class="bank-font-medium bank-border-b bank-inline-block bank-w-32 bank-ml-1">
            ${get('bankForm.name')}
          </span>
          <span class="bank-text-base bank-whitespace-nowrap bank-ml-2">SSN:</span>
          <span class="bank-font-medium bank-border-b bank-inline-block bank-w-32 bank-ml-1">
            ${get('bankForm.ssn')}
          </span>
        </div>
      </div>

      <p class="bank-text-sm bank-mb-4 bank-font-medium bank-leading-relaxed">
        I authorize my employer or a payroll processor on my employer's behalf to deposit any amounts owned to me by initiating credit entries to my account at the financial institution (BANK) indicated below. Further, I authorize Bank to accept and credit entries indicated by Cbyrac, Inc. to my ☐ Checking ☐ Saving account (select one). I acknowledge the deposit of any amount is an advance of funds on behalf of my employer and the responsibility of my employer. I also authorize my employer, if any, to debit my account in the event of a credit which should not have been made for an amount not to exceed the original amount of the erroneous credit.
      </p>

      <p class="bank-text-base bank-font-bold bank-text-center">
        Complete Sections 1 or 2 as applicable
      </p>
      <div class="bank-border-b-2 bank-w-16 bank-flex bank-mx-auto bank-mb-4"></div>

      <h3 class="bank-text-lg bank-text-center">
        <span class="bank-font-medium">SECTION 1 CHECKING ACCOUNT;</span> Attach a Voided Check
      </h3>
      <div class="bank-border-b-2 bank-w-16 bank-flex bank-mx-auto bank-mb-5"></div>

      <!-- Section 1 -->
      <div class="bank-p-2 bank-mb-3 keep-together">
        <div class="bank-mb-3">
          <div class="bank-flex bank-items-center bank-gap-1">
            <span class="bank-text-base bank-whitespace-nowrap">Bank Name:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-40 bank-ml-1">
              ${get('bankForm.checkingAccount.bankName')}
            </span>
            <span class="bank-text-base bank-whitespace-nowrap bank-ml-2">State:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-16 bank-ml-1">
              ${get('bankForm.checkingAccount.state')}
            </span>
          </div>
        </div>
        <div class="bank-mb-3">
          <div class="bank-flex bank-items-center bank-gap-1 bank-justify-center">
            <span class="bank-whitespace-nowrap">I wish to deposit:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-20 bank-ml-1">
              ${get('bankForm.checkingAccount.depositPercentage')}%
            </span>
            <span class="bank-whitespace-nowrap bank-ml-2">or:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-20 bank-ml-1">
              ${get('bankForm.checkingAccount.depositPercentage')}% Net Pay
            </span>
          </div>
        </div>
        <div class="bank-mb-4">
          <div class="bank-flex bank-items-center bank-gap-1">
            <span class="bank-text-base bank-whitespace-nowrap">Transit/ABA No.:</span>
            <span class="bank-text-base bank-border-b bank-inline-block bank-w-24 bank-ml-1">
              ${get('bankForm.checkingAccount.transitNo')}
            </span>
            <span class="bank-text-base bank-whitespace-nowrap bank-ml-2">Account No.:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-32 bank-ml-1">
              ${get('bankForm.checkingAccount.accountNo')}
            </span>
          </div>
        </div>

        <div class="bank-border bank-p-4 bank-text-center bank-bg-gray-50">
          <p class="bank-font-bold bank-mb-1">ATTACH VOIDED CHECK HERE</p>
          <p class="bank-text-xs">The numbers on the bottom of your voided check are used</p>
          <p class="bank-text-xs">To make the electronic funds transfer directly to your account.</p>
          <div class="bank-mt-2">
            ${
              accountFileUrl
                ? `<a href="${accountFileUrl}" class="account-file-link" target="_blank">
                    📄 View Account File
                   </a>`
                : '<p class="bank-text-xs italic">No account file attached</p>'
            }
          </div>
        </div>
      </div>

      <!-- Signature Section for Page 2 -->
      <div class="bank-flex bank-items-center bank-justify-between bank-gap-4 mt-8">
        <div class="bank-flex bank-items-center bank-gap-1 bank-flex-1">
          <span class="bank-text-sm bank-whitespace-nowrap">EMPLOYEE SIGNATURE:</span>
          <span class="bank-border-b bank-flex-1 bank-min-w-60 bank-h-6 bank-flex bank-items-center bank-justify-center">
            ${
              employeeData.signature
                ? `<img src="${signature}" alt="Employee Signature" class="bank-h-8 bank-w-24" onerror="this.style.display='none'" />`
                : ''
            }
          </span>
        </div>

        <div class="bank-flex bank-items-center bank-gap-1 bank-whitespace-nowrap">
          <span class="bank-text-sm">DATE:</span>
          <span class="bank-border-b bank-w-32 bank-inline-block">
            ${formattedDate}
          </span>
        </div>
      </div>
    </div>

    <!-- Page 3: Bank Form - Savings Account -->
    <div class="pdf-page page-break avoid-break bank-page-top">
      <h2 class="bank-text-xl bank-font-medium bank-text-center bank-mt-0">
        EMPLOYEE DIRECT DEPOSIT AUTHORIZATION AGREEMENT
      </h2>
      <div class="bank-border-b-2 bank-w-40 bank-flex bank-mx-auto bank-mb-2"></div>

      <h3 class="bank-text-lg bank-text-center bank-mb-4">(ACH CREDIT & DEBITS) - CONTINUED</h3>

      <!-- Section 2 - Savings Account on new page -->
      <div class="bank-p-2">
        <h3 class="bank-text-lg bank-text-center">
          <span class="bank-font-medium">SECTION 2 SAVINGS ACCOUNT;</span> Call Your Bank To Obtain the Following Information:
        </h3>
        <div class="bank-border-b-2 bank-w-16 bank-flex bank-mx-auto bank-mb-4"></div>

        <div class="bank-mb-3">
          <div class="bank-flex bank-items-center bank-gap-1">
            <span class="bank-text-base bank-whitespace-nowrap">Bank Name:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-40 bank-ml-1">
              ${get('bankForm.savingsAccount.bankName')}
            </span>
            <span class="bank-text-base bank-whitespace-nowrap bank-ml-2">State:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-16 bank-ml-1">
              ${get('bankForm.savingsAccount.state')}
            </span>
          </div>
        </div>

        <div class="bank-mb-3 bank-text-center">
          <div class="bank-flex bank-items-center bank-justify-center bank-gap-1">
            <span class="bank-whitespace-nowrap">I wish to deposit:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-20 bank-ml-1">
              ${get('bankForm.savingsAccount.depositPercentage')}%
            </span>
            <span class="bank-whitespace-nowrap bank-ml-2">or:</span>
            <span class="bank-text-sm bank-font-medium bank-border-b bank-inline-block bank-w-20 bank-ml-1">
              ${get('bankForm.savingsAccount.depositPercentage')}% Net Pay
            </span>
          </div>
        </div>

        <div class="bank-mb-4">
          <div class="bank-flex bank-items-center bank-gap-1 bank-font-medium">
            <span class="bank-text-sm">SAVINGS BANK/ROUTING OR TRANSIT NUMBER:</span>
            <span class="bank-border-b bank-flex-1 bank-min-w-120">
              ${get('bankForm.savingsAccount.transitNo')}
            </span>
            <span class="bank-text-xs bank-ml-1">(This Must Be 9 Digits)</span>
          </div>
        </div>

        <div class="bank-mb-6">
          <div class="bank-flex bank-items-center bank-gap-1">
            <span class="bank-text-sm">EMPLOYEE SAVINGS ACCOUNT NUMBER:</span>
            <span class="bank-border-b bank-flex-1 bank-min-w-120">
              ${get('bankForm.savingsAccount.accountNo')}
            </span>
          </div>
        </div>

        <!-- Additional Information Section with Google Link -->
        <!-- Signature Section for Page 3 -->
        <div class="bank-flex bank-items-center bank-justify-between bank-gap-4 mt-8">
          <div class="bank-flex bank-items-center bank-gap-1 bank-flex-1">
            <span class="bank-text-sm bank-whitespace-nowrap">EMPLOYEE SIGNATURE:</span>
            <span class="bank-border-b bank-flex-1 bank-min-w-60 bank-h-6 bank-flex bank-items-center bank-justify-center">
              ${
                employeeData.signature
                  ? `<img src="${signature}" alt="Employee Signature" class="bank-h-8 bank-w-24" onerror="this.style.display='none'" />`
                  : ''
              }
            </span>
          </div>

          <div class="bank-flex bank-items-center bank-gap-1 bank-whitespace-nowrap">
            <span class="bank-text-sm">DATE:</span>
            <span class="bank-border-b bank-w-32 bank-inline-block">
              ${formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>


     <div class="i9Form-p-8 i9Form-print-p-12 i9Form-page-break">
    <!-- Improved Header -->
    <div class="i9Form-flex i9Form-justify-between i9Form-items-start i9Form-mb-4 i9Form-border-b-2 i9Form-border-black i9Form-pb-2">
      <div class="i9Form-logo-container">
        <div class="i9Form-logo">
          <div class="i9Form-text-center">
            <div class="i9Form-logo-text">DHS</div>
            <div class="i9Form-logo-subtext">
              DEPT OF<br />HOMELAND<br />SECURITY
            </div>
          </div>
        </div>
      </div>
      <div class="i9Form-flex-1 i9Form-text-center">
        <h1 class="i9Form-text-lg i9Form-font-bold">
          Employment Eligibility Verification
        </h1>
        <p class="i9Form-text-xs i9Form-font-semibold">
          Department of Homeland Security
        </p>
        <p class="i9Form-text-xs">
          U.S. Citizenship and Immigration Services
        </p>
      </div>
      <div class="i9Form-text-right i9Form-text-xs">
        <p class="i9Form-font-bold">USCIS</p>
        <p class="i9Form-font-bold">Form I-9</p>
        <p>OMB No.1615-0047</p>
        <p>Expires 10/31/2027</p>
      </div>
    </div>

    <!-- START HERE Notice -->
    <div class="i9Form-bg-gray-100 i9Form-border i9Form-border-black i9Form-p-2 i9Form-mb-3 i9Form-text-sm">
      <p>
        <span class="i9Form-font-bold">START HERE:</span> Employers must
        ensure the form instructions are available to employees when
        completing this form. Employers are liable for failing to comply
        with the requirements for completing this form. See below and the
        <span class="i9Form-font-bold i9Form-underline">Instructions</span>.
      </p>
    </div>

    <!-- Anti-Discrimination Notice -->
    <div class="i9Form-bg-gray-100 i9Form-border i9Form-border-black i9Form-p-2 i9Form-mb-3 i9Form-text-sm">
      <p>
        <span class="i9Form-font-bold">ANTI-DISCRIMINATION NOTICE:</span>
        All employers and others who complete or use this form must present
        Form I-9. Employers cannot ask employees for documentation to verify
        information in Section 1, or specify which acceptable documentation
        employees must present for Section 2 or Supplement B, Reverification
        and Rehire. Treating employees differently based on their
        citizenship, immigration status, or national origin may be illegal.
      </p>
    </div>

    <!-- Section 1 Header -->
    <div class="i9Form-bg-gray-300 i9Form-text-black i9Form-p-1 i9Form-mb-4 i9Form-text-xs i9Form-font-bold">
      Section 1. Employee Information and Attestation: Employees must
      complete and sign Section 1 of Form I-9 no later than the first day of
      employment, but not before accepting a job offer.
    </div>
            <div class="bank-border bank-p-4 bank-text-center bank-bg-gray-50">
          <p class="bank-font-bold bank-mb-1">ATTACH VOIDED CHECK HERE</p>
          <p class="bank-text-xs">The numbers on the bottom of your voided check are used</p>
          <p class="bank-text-xs">To make the electronic funds transfer directly to your account.</p>
          <div class="bank-mt-2">
            ${
              i9Form
                ? `<a href="${i9Form}" class="account-file-link" target="_blank">
                    📄 View i9Form
                   </a>`
                : '<p class="bank-text-xs italic">No account file attached</p>'
            }
          </div>
        </div>
      </div>
  </div>

  <!--W4Form Section-->
      <div class="w4-container">
        <div class="w4-header">
          <!-- Left Section -->
          <div class="w4-left">
            <div class="w4-title">W-4</div>
            <div class="w4-subtitle">Form</div>
            <div class="w4-department">Department of the Treasury</div>
            <div class="w4-agency">Internal Revenue Service</div>
          </div>

          <!-- Center Section -->
          <div class="w4-center">
            <div class="w4-main-title">Employee's Withholding Certificate</div>
            <div class="w4-instructions">
              <span class="font-semibold">Complete Form W-4</span> so that your employer can withhold the correct federal income tax from your pay.
            </div>
            <div class="w4-note">Give Form W-4 to your employer.</div>
            <div class="w4-note">Your withholding is subject to review by the IRS.</div>
          </div>

          <!-- Right Section -->
          <div class="w4-right">
            <div class="w4-omb">OMB No. 1545-0074</div>
            <div class="w4-year">2025</div>
          </div>
        </div>
          <div class="mt-3"></div>
        <div class="bank-border bank-p-4 bank-text-center bank-bg-gray-50">
          <p class="bank-font-bold bank-mb-1">ATTACH VOIDED CHECK HERE</p>
          <p class="bank-text-xs">The numbers on the bottom of your voided check are used</p>
          <p class="bank-text-xs">To make the electronic funds transfer directly to your account.</p>
          <div class="bank-mt-2">
            ${
              w4Form
                ? `<a href="${w4Form}" class="account-file-link" target="_blank">
                    📄 View w4Form
                   </a>`
                : '<p class="bank-text-xs italic">No account file attached</p>'
            }
          </div>
        </div>
      </div>

      </div>
  </body>
</html>`;
};
