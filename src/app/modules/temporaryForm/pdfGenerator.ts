import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { ITemporaryFormData } from './temporary.interface';
import { TemporaryFormModel } from './temporary.model'; // Your model

type RefType = {
  offense: string;
  date: Date;
  location: string;
  comment: string;
};

/**
 * Generate CBYRAC Application PDF using PDFKit
 */
export const generateCbyracPdf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      // Fetch form data from database
      const formData: ITemporaryFormData | null =
        await TemporaryFormModel.findOne({
          userId,
        });

      if (!formData) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'No form data found for this user',
        });
      }

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="CBYRAC_Application_${userId}.pdf"`
      );
      doc.pipe(res);

      // Helper Functions
      const formatDate = (date?: string | Date): string => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(
          d.getDate()
        ).padStart(2, '0')}/${d.getFullYear()}`;
      };

      const formatSSN = (ssn?: string): string => {
        if (!ssn) return '';
        return ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
      };

      const formatPhone = (phone?: string): string => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(
            3,
            6
          )}-${cleaned.slice(6)}`;
        }
        return phone;
      };

      const addWatermark = (doc: typeof PDFDocument, text = 'CBYRAC, INC') => {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        doc.save();
        doc.translate(pageWidth / 2, pageHeight / 2);
        doc.rotate(-45, { origin: [0, 0] });

        doc
          .font('Helvetica-Bold')
          .fontSize(80)
          .fillColor('#000000')
          .fillOpacity(0.03)
          .text(text, -doc.widthOfString(text) / 2, -30, {
            align: 'center',
            width: doc.widthOfString(text),
          });

        doc.restore();
      };

      const drawCheckbox = (
        doc: typeof PDFDocument,
        x: number,
        y: number,
        checked: boolean
      ) => {
        doc.rect(x, y, 12, 12).strokeColor('#000000').lineWidth(1).stroke();
        if (checked) {
          doc
            .font('Helvetica-Bold')
            .fontSize(14)
            .fillColor('#000000')
            .fillOpacity(1)
            .text('X', x + 2, y - 1);
        }
      };

      const addField = (
        label: string,
        value: string | number,
        x: number,
        y: number,
        width = 200
      ) => {
        doc
          .fontSize(9)
          .fillColor('#555555')
          .fillOpacity(1)
          .font('Helvetica')
          .text(label, x, y);

        doc
          .fontSize(10)
          .fillColor('#000000')
          .font('Helvetica-Bold')
          .text(String(value), x, y + 12, { width });

        doc
          .moveTo(x, y + 25)
          .lineTo(x + width, y + 25)
          .strokeColor('#cccccc')
          .lineWidth(0.5)
          .stroke();

        return y + 35;
      };

      const addSectionHeader = (title: string, y: number) => {
        doc.rect(50, y, 495, 25).fillColor('#2c3e50').fill();

        doc
          .fillColor('#ffffff')
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(title, 60, y + 7);

        return y + 35;
      };

      // Add watermark
      addWatermark(doc);

      // ============ PAGE 1: APPLICATION HEADER ============
      doc
        .fillColor('#2c3e50')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('CBYRAC, INC', 0, 40, { align: 'center', width: doc.page.width });

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('633 NE 167TH STREET, SUITE 709', { align: 'center' });
      doc.text('NORTH MIAMI BEACH, FL. 33162', { align: 'center' });
      doc.text('PH: 786-403-5043 | E-MAIL: cbyracinc@gmail.com', {
        align: 'center',
      });

      doc.moveDown(0.5);
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#34495e')
        .text('APPLICATION FOR EMPLOYMENT', { align: 'center' });

      doc
        .moveTo(50, 140)
        .lineTo(545, 140)
        .strokeColor('#bdc3c7')
        .lineWidth(2)
        .stroke();

      let currentY = 160;

      // Application Date
      doc
        .fontSize(10)
        .fillColor('#000000')
        .font('Helvetica')
        .text(
          `Application Date: ${formatDate(
            formData.generalInfo.applicationDate
          )}`,
          400,
          currentY
        );

      currentY += 30;

      // ============ PERSONAL INFORMATION ============
      currentY = addSectionHeader('PERSONAL INFORMATION', currentY);

      currentY = addField(
        'Last Name',
        formData.generalInfo.lastName,
        50,
        currentY,
        150
      );
      currentY = addField(
        'First Name',
        formData.generalInfo.firstName,
        220,
        currentY - 35,
        150
      );
      currentY = addField(
        'Middle Name',
        formData.generalInfo.middleName || '',
        390,
        currentY - 35,
        150
      );

      currentY = addField(
        'Social Security Number',
        formatSSN(formData.generalInfo.ssn),
        50,
        currentY,
        200
      );
      currentY = addField(
        'Date of Birth',
        formatDate(formData.generalInfo.dateOfBirth),
        270,
        currentY - 35,
        200
      );

      currentY = addField(
        'Telephone Number',
        formatPhone(formData.generalInfo.telephoneNumber),
        50,
        currentY,
        200
      );
      currentY = addField(
        'Email Address',
        formData.generalInfo.email,
        270,
        currentY - 35,
        270
      );

      currentY = addField(
        'Address',
        formData.generalInfo.address,
        50,
        currentY,
        495
      );

      // Emergency Contact
      if (formData.generalInfo.emergencyContact) {
        currentY += 10;
        doc
          .fontSize(11)
          .fillColor('#2c3e50')
          .font('Helvetica-Bold')
          .text('Emergency Contact', 50, currentY);
        currentY += 20;

        currentY = addField(
          'Name',
          formData.generalInfo.emergencyContact.name,
          50,
          currentY,
          180
        );
        currentY = addField(
          'Relationship',
          formData.generalInfo.emergencyContact.relationship,
          250,
          currentY - 35,
          140
        );
        currentY = addField(
          'Phone',
          formatPhone(formData.generalInfo.emergencyContact.phone),
          410,
          currentY - 35,
          135
        );
      }

      // ============ EMPLOYMENT PREFERENCES ============
      currentY += 10;
      currentY = addSectionHeader('EMPLOYMENT PREFERENCES', currentY);

      doc
        .fontSize(10)
        .fillColor('#000000')
        .font('Helvetica')
        .text('Type of Employment Desired:', 50, currentY);
      drawCheckbox(
        doc,
        250,
        currentY - 2,
        formData.generalInfo.desiredEmploymentType === 'Intern'
      );
      doc.text('Intern', 270, currentY);
      drawCheckbox(
        doc,
        330,
        currentY - 2,
        formData.generalInfo.desiredEmploymentType === 'Temporary'
      );
      doc.text('Temporary', 350, currentY);
      currentY += 25;

      const salaryText = formData.generalInfo.hourlyRate
        ? `$${formData.generalInfo.hourlyRate}/hr`
        : formData.generalInfo.desiredSalary
        ? `$${formData.generalInfo.desiredSalary}`
        : 'Not Specified';

      currentY = addField(
        'Desired Salary/Hourly Rate',
        salaryText,
        50,
        currentY,
        200
      );
      currentY = addField(
        'Position Applied For',
        formData.generalInfo.appliedPosition || '',
        270,
        currentY - 35,
        200
      );

      currentY = addField(
        'Department',
        formData.generalInfo.department || '',
        50,
        currentY,
        200
      );
      currentY = addField(
        'Start Date',
        formatDate(formData.generalInfo.startDate),
        270,
        currentY - 35,
        200
      );

      doc
        .fontSize(10)
        .fillColor('#000000')
        .font('Helvetica')
        .text('Willing to work overtime?', 50, currentY);
      drawCheckbox(
        doc,
        200,
        currentY - 2,
        formData.generalInfo.overtime === 'Yes'
      );
      doc.text('Yes', 220, currentY);
      drawCheckbox(
        doc,
        270,
        currentY - 2,
        formData.generalInfo.overtime === 'No'
      );
      doc.text('No', 290, currentY);
      currentY += 30;

      // ============ EDUCATION ============
      if (formData.generalInfo.education) {
        currentY = addSectionHeader('EDUCATION', currentY);
        const edu = formData.generalInfo.education;

        currentY = addField(
          'School Name',
          edu.schoolName || '',
          50,
          currentY,
          250
        );
        currentY = addField(
          'Major/Course of Study',
          edu.major || '',
          320,
          currentY - 35,
          220
        );

        currentY = addField(
          'Years Completed',
          String(edu.yearsCompleted || ''),
          50,
          currentY,
          150
        );
        currentY = addField(
          'Graduation Status',
          edu.graduationStatus || '',
          220,
          currentY - 35,
          150
        );
        currentY = addField(
          'Honors Received',
          edu.honorsReceived ? 'Yes' : 'No',
          390,
          currentY - 35,
          150
        );
      }

      // // ============ PAGE 2: WORK EXPERIENCE ============
      // doc.addPage();
      // addWatermark(doc);
      // currentY = 50;

      // currentY = addSectionHeader('WORK EXPERIENCE', currentY);

      // // Employer 1
      // if (formData.employeeInfo.employee1) {
      //   const emp = formData.employeeInfo.employee1;

      //   doc
      //     .fontSize(12)
      //     .fillColor('#34495e')
      //     .font('Helvetica-Bold')
      //     .text('Employer #1', 50, currentY);
      //   currentY += 25;

      //   currentY = addField('Employer Name', emp.name, 50, currentY, 250);
      //   currentY = addField('Address', emp.address, 320, currentY - 35, 220);

      //   currentY = addField('Telephone', emp.telephone, 50, currentY, 150);
      //   currentY = addField(
      //     'Dates From',
      //     formatDate(emp.dateEmployeeFrom),
      //     220,
      //     currentY - 35,
      //     150
      //   );
      //   currentY = addField(
      //     'Dates To',
      //     formatDate(emp.dateEmployeeTo),
      //     390,
      //     currentY - 35,
      //     150
      //   );

      //   currentY = addField('Job Title', emp.jobTitle, 50, currentY, 200);
      //   currentY = addField('Duties', emp.duties, 270, currentY - 35, 270);

      //   currentY = addField(
      //     'Supervisor Name',
      //     emp.supervisorName,
      //     50,
      //     currentY,
      //     200
      //   );

      //   doc
      //     .fontSize(9)
      //     .fillColor('#000000')
      //     .font('Helvetica')
      //     .text('May we contact?', 270, currentY + 5);
      //   drawCheckbox(doc, 370, currentY + 3, emp.MayWeContact === true);
      //   doc.text('Yes', 390, currentY + 5);
      //   drawCheckbox(doc, 430, currentY + 3, emp.MayWeContact === false);
      //   doc.text('No', 450, currentY + 5);
      //   currentY += 30;

      //   currentY = addField('Starting Wage', emp.wagesStart, 50, currentY, 150);
      //   currentY = addField('Final Wage', emp.final, 220, currentY - 35, 150);
      //   currentY = addField(
      //     'Reason for Leaving',
      //     emp.reasonForLeaving,
      //     390,
      //     currentY - 35,
      //     150
      //   );

      //   currentY = addField(
      //     'What employer will say',
      //     emp.terminationReason,
      //     50,
      //     currentY,
      //     495
      //   );
      //   currentY = addField(
      //     'Disciplinary Action',
      //     emp.disciplinaryAction,
      //     50,
      //     currentY,
      //     495
      //   );
      //   currentY = addField(
      //     'Notice Given',
      //     emp.noticePeriod,
      //     50,
      //     currentY,
      //     495
      //   );

      //   currentY += 20;
      // }

      // // Employer 2
      // if (formData.employeeInfo.employee2) {
      //   const emp = formData.employeeInfo.employee2;

      //   doc
      //     .fontSize(12)
      //     .fillColor('#34495e')
      //     .font('Helvetica-Bold')
      //     .text('Employer #2', 50, currentY);
      //   currentY += 25;

      //   currentY = addField('Employer Name', emp.name, 50, currentY, 250);
      //   currentY = addField('Address', emp.address, 320, currentY - 35, 220);

      //   currentY = addField('Telephone', emp.telephone, 50, currentY, 150);
      //   currentY = addField(
      //     'Dates From',
      //     formatDate(emp.dateEmployeeFrom),
      //     220,
      //     currentY - 35,
      //     150
      //   );
      //   currentY = addField(
      //     'Dates To',
      //     formatDate(emp.dateEmployeeTo),
      //     390,
      //     currentY - 35,
      //     150
      //   );

      //   currentY = addField('Job Title', emp.jobTitle, 50, currentY, 200);
      //   currentY = addField(
      //     'Supervisor Name',
      //     emp.supervisorName,
      //     270,
      //     currentY - 35,
      //     270
      //   );

      //   currentY += 20;
      // }

      // // Termination Questions
      // currentY = addSectionHeader('TERMINATION HISTORY', currentY);

      // doc
      //   .fontSize(10)
      //   .fillColor('#000000')
      //   .font('Helvetica')
      //   .text('Ever been terminated or asked to resign?', 50, currentY);
      // drawCheckbox(
      //   doc,
      //   300,
      //   currentY - 2,
      //   formData.employeeInfo.terminationInfo.terminationStatus === 'Yes'
      // );
      // doc.text('Yes', 320, currentY);
      // drawCheckbox(
      //   doc,
      //   370,
      //   currentY - 2,
      //   formData.employeeInfo.terminationInfo.terminationStatus === 'No'
      // );
      // doc.text('No', 390, currentY);
      // currentY += 25;

      // doc.text('Terminated by mutual agreement?', 50, currentY);
      // drawCheckbox(
      //   doc,
      //   300,
      //   currentY - 2,
      //   formData.employeeInfo.manualAgreementTermination
      //     .terminatedByManualAgreement === 'Yes'
      // );
      // doc.text('Yes', 320, currentY);
      // drawCheckbox(
      //   doc,
      //   370,
      //   currentY - 2,
      //   formData.employeeInfo.manualAgreementTermination
      //     .terminatedByManualAgreement === 'No'
      // );
      // doc.text('No', 390, currentY);
      // currentY += 25;

      // doc.text(
      //   'Given choice to resign rather than be terminated?',
      //   50,
      //   currentY
      // );
      // drawCheckbox(
      //   doc,
      //   300,
      //   currentY - 2,
      //   formData.employeeInfo.resignationInsteadOfTermination
      //     .resignedInsteadOfTerminated === 'Yes'
      // );
      // doc.text('Yes', 320, currentY);
      // drawCheckbox(
      //   doc,
      //   370,
      //   currentY - 2,
      //   formData.employeeInfo.resignationInsteadOfTermination
      //     .resignedInsteadOfTerminated === 'No'
      // );
      // doc.text('No', 390, currentY);
      // currentY += 30;

      // if (formData.employeeInfo.explanation) {
      //   currentY = addField(
      //     'Explanation',
      //     formData.employeeInfo.explanation,
      //     50,
      //     currentY,
      //     495
      //   );
      // }

      // // ============ PAGE 3: REFERENCES & DRIVING ============
      // doc.addPage();
      // addWatermark(doc);
      // currentY = 50;

      // currentY = addSectionHeader('PROFESSIONAL REFERENCES', currentY);

      // if (formData.employeeInfo.terminationDetailsOfEmployee?.length > 0) {
      //   formData.employeeInfo.terminationDetailsOfEmployee.forEach(
      //     (ref, idx) => {
      //       doc
      //         .fontSize(11)
      //         .fillColor('#2c3e50')
      //         .font('Helvetica-Bold')
      //         .text(`Reference #${idx + 1}`, 50, currentY);
      //       currentY += 20;

      //       currentY = addField('Name', ref.name, 50, currentY, 180);
      //       currentY = addField(
      //         'Position',
      //         ref.position,
      //         250,
      //         currentY - 35,
      //         140
      //       );
      //       currentY = addField(
      //         'Company',
      //         ref.company,
      //         410,
      //         currentY - 35,
      //         135
      //       );

      //       currentY = addField('Telephone', ref.telephone, 50, currentY, 180);
      //       currentY = addField(
      //         'Work Relationship',
      //         ref.workRelation,
      //         250,
      //         currentY - 35,
      //         140
      //       );
      //       currentY = addField(
      //         'Years Known',
      //         ref.NoOfYearKnown,
      //         410,
      //         currentY - 35,
      //         135
      //       );

      //       currentY += 15;
      //     }
      //   );
      // }

      // // ============ DRIVING INFORMATION ============
      // currentY = addSectionHeader('DRIVING INFORMATION', currentY);

      // const dl = formData.drivingLicenceInfo.validDriverLicense;

      // doc
      //   .fontSize(10)
      //   .fillColor('#000000')
      //   .font('Helvetica')
      //   .text("Do you have a valid driver's license?", 50, currentY);
      // drawCheckbox(doc, 300, currentY - 2, dl.hasDriverLicense === 'Yes');
      // doc.text('Yes', 320, currentY);
      // drawCheckbox(doc, 370, currentY - 2, dl.hasDriverLicense === 'No');
      // doc.text('No', 390, currentY);
      // currentY += 25;

      // if (dl.hasDriverLicense === 'Yes') {
      //   currentY = addField(
      //     'License Number',
      //     String(dl.licenseNo),
      //     50,
      //     currentY,
      //     150
      //   );
      //   currentY = addField('State', dl.state, 220, currentY - 35, 150);
      //   currentY = addField(
      //     'Expiration Date',
      //     formatDate(dl.expirationDate),
      //     390,
      //     currentY - 35,
      //     150
      //   );
      // }

      // const ls = formData.drivingLicenceInfo.licenseSuspensionInfo;
      // doc.text('Has license been suspended or revoked?', 50, currentY);
      // drawCheckbox(
      //   doc,
      //   300,
      //   currentY - 2,
      //   ls.licenseSuspendedOrRevoked === 'Yes'
      // );
      // doc.text('Yes', 320, currentY);
      // drawCheckbox(
      //   doc,
      //   370,
      //   currentY - 2,
      //   ls.licenseSuspendedOrRevoked === 'No'
      // );
      // doc.text('No', 390, currentY);
      // currentY += 25;

      // const ins = formData.drivingLicenceInfo.personalAutoInsurance;
      // doc.text('Do you have personal automobile insurance?', 50, currentY);
      // drawCheckbox(
      //   doc,
      //   300,
      //   currentY - 2,
      //   ins.hasPersonalAutoInsurance === 'Yes'
      // );
      // doc.text('Yes', 320, currentY);
      // drawCheckbox(
      //   doc,
      //   370,
      //   currentY - 2,
      //   ins.hasPersonalAutoInsurance === 'No'
      // );
      // doc.text('No', 390, currentY);
      // currentY += 30;

      // // Moving Violations
      // if (formData.drivingLicenceInfo.movingTrafficViolation?.length > 0) {
      //   currentY = addSectionHeader('MOVING TRAFFIC VIOLATIONS', currentY);

      //   formData.drivingLicenceInfo.movingTrafficViolation.forEach(
      //     (violation: RefType, idx: number) => {
      //       currentY = addField(
      //         `Offense ${idx + 1}`,
      //         violation.offense,
      //         50,
      //         currentY,
      //         200
      //       );
      //       currentY = addField(
      //         'Date',
      //         formatDate(violation.date),
      //         270,
      //         currentY - 35,
      //         120
      //       );
      //       currentY = addField(
      //         'Location',
      //         violation.location,
      //         410,
      //         currentY - 35,
      //         135
      //       );
      //       currentY = addField(
      //         'Comments',
      //         violation.comment,
      //         50,
      //         currentY,
      //         495
      //       );
      //     }
      //   );
      // }

      // // ============ PAGE 4: BANK INFORMATION ============
      // doc.addPage();
      // addWatermark(doc);
      // currentY = 50;

      // currentY = addSectionHeader('DIRECT DEPOSIT AUTHORIZATION', currentY);

      // currentY = addField(
      //   'Full Name',
      //   formData.bankForm.name,
      //   50,
      //   currentY,
      //   300
      // );
      // currentY = addField(
      //   'SSN',
      //   formatSSN(formData.bankForm.ssn),
      //   370,
      //   currentY - 35,
      //   175
      // );

      // doc
      //   .fontSize(10)
      //   .fillColor('#000000')
      //   .font('Helvetica')
      //   .text('Account Type:', 50, currentY);
      // drawCheckbox(
      //   doc,
      //   150,
      //   currentY - 2,
      //   formData.bankForm.checkingAccount.accountType === 'Checking'
      // );
      // doc.text('Checking', 170, currentY);
      // drawCheckbox(
      //   doc,
      //   250,
      //   currentY - 2,
      //   formData.bankForm.checkingAccount.accountType === 'Savings'
      // );
      // doc.text('Savings', 270, currentY);
      // currentY += 30;

      // if (formData.bankForm.checkingAccount) {
      //   const acc = formData.bankForm.checkingAccount;

      //   doc
      //     .fontSize(12)
      //     .fillColor('#2c3e50')
      //     .font('Helvetica-Bold')
      //     .text('Checking Account Information', 50, currentY);
      //   currentY += 25;

      //   currentY = addField('Bank Name', acc.bankName, 50, currentY, 250);
      //   currentY = addField('State', acc.state || '', 320, currentY - 35, 220);

      //   const depositText = acc.depositAmount
      //     ? `$${acc.depositAmount.toFixed(2)}`
      //     : `${acc.depositPercentage}% Net Pay`;

      //   currentY = addField(
      //     'Deposit Amount/Percentage',
      //     depositText,
      //     50,
      //     currentY,
      //     495
      //   );
      //   currentY = addField(
      //     'Transit/ABA Number',
      //     acc.transitNo,
      //     50,
      //     currentY,
      //     200
      //   );
      //   currentY = addField(
      //     'Account Number',
      //     acc.accountNo,
      //     270,
      //     currentY - 35,
      //     270
      //   );
      // }

      // if (formData.bankForm.savingsAccount) {
      //   currentY += 20;
      //   const acc = formData.bankForm.savingsAccount;

      //   doc
      //     .fontSize(12)
      //     .fillColor('#2c3e50')
      //     .font('Helvetica-Bold')
      //     .text('Savings Account Information', 50, currentY);
      //   currentY += 25;

      //   currentY = addField('Bank Name', acc.bankName, 50, currentY, 250);
      //   currentY = addField('State', acc.state || '', 320, currentY - 35, 220);

      //   const depositText = acc.depositAmount
      //     ? `$${acc.depositAmount.toFixed(2)}`
      //     : `${acc.depositPercentage}% Net Pay`;

      //   currentY = addField(
      //     'Deposit Amount/Percentage',
      //     depositText,
      //     50,
      //     currentY,
      //     495
      //   );
      //   currentY = addField(
      //     'Transit/ABA Number',
      //     acc.transitNo,
      //     50,
      //     currentY,
      //     200
      //   );
      //   currentY = addField(
      //     'Account Number',
      //     acc.accountNo,
      //     270,
      //     currentY - 35,
      //     270
      //   );
      // }

      // currentY += 30;
      // doc
      //   .fontSize(9)
      //   .fillColor('#555555')
      //   .font('Helvetica-Oblique')
      //   .text('Employee Signature:', 50, currentY);
      // doc
      //   .moveTo(150, currentY + 10)
      //   .lineTo(350, currentY + 10)
      //   .strokeColor('#000000')
      //   .lineWidth(1)
      //   .stroke();

      // doc.text(
      //   `Date: ${formatDate(formData.bankForm.signatureDate)}`,
      //   370,
      //   currentY
      // );

      // // ============ FOOTER FOR ALL PAGES ============
      // const pages = doc.bufferedPageRange();
      // for (let i = 0; i < pages.count; i++) {
      //   doc.switchToPage(i);

      //   const footerY = 750;
      //   doc
      //     .moveTo(50, footerY)
      //     .lineTo(545, footerY)
      //     .strokeColor('#bdc3c7')
      //     .lineWidth(1)
      //     .stroke();

      //   doc
      //     .fillColor('#7f8c8d')
      //     .fontSize(9)
      //     .font('Helvetica')
      //     .fillOpacity(1)
      //     .text(
      //       'CBYRAC, INC - Confidential Employment Application',
      //       50,
      //       footerY + 10
      //     )
      //     .text(
      //       `Page ${i + 1} of ${
      //         pages.count
      //       } | Generated: ${new Date().toLocaleDateString()}`,
      //       50,
      //       footerY + 22
      //     );
      // }

      doc.end();
    } catch (err) {
      next(err);
    }
  }
);
