import { InternModel } from './intern.model';
import { IInternFormData } from './interface';
import { IFolderName } from '../../../shared/getFilePath';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';
import dotenv from 'dotenv';
dotenv.config();
// Create new Intern
const createIntern = async (
  data: IInternFormData,
  email: string | undefined,
  userId: string
) => {
  const intern = await InternModel.create(data);
  await SendPdfByMail(email, userId, 'Intern Employee pdf');
  return intern;
};

const getAllIntern = async (userId: string) => {
  const intern = await InternModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 });
  console.log(intern);
  return intern;
};

const getInternDataForPdf = async (userId: string) => {
  const intern = await InternModel.findOne({
    userId,
  }).sort({ createdAt: -1 });
  return intern;
};

// Get Intern by ID
const getInternById = async (id: string) => {
  const intern = await InternModel.findById(id);
  if (!intern) throw new Error('Intern not found');
  return intern;
};

// const updateIntern = async (
//   id: string,
//   bodyData: Partial<IInternFormData>,
//   uploadedFiles: Record<IFolderName, string>
// ) => {
//   const toPlainObject = (obj: any): any => {
//     if (obj === null || typeof obj !== 'object') return obj;
//     const plain: Record<string, any> = Array.isArray(obj) ? [] : {};
//     for (const key of Object.keys(obj)) {
//       plain[key] = toPlainObject(obj[key]);
//     }
//     return plain;
//   };

//   bodyData = toPlainObject(bodyData);

//   // ✅ If no forms exist, initialize them to empty objects
//   bodyData.citizenShipForm = bodyData.citizenShipForm || ({} as any);
//   bodyData.bankForm = bodyData.bankForm || ({} as any);
//   bodyData.i9Form = bodyData.i9Form || ({} as any);
//   bodyData.w4Form = bodyData.w4Form || ({} as any);
//   bodyData.generalInfo = bodyData.generalInfo || ({} as any);

//   const mapFilesToTarget = (
//     target: Record<string, any>,
//     mapping: Record<string, { image?: IFolderName; pdf?: IFolderName }>
//   ) => {
//     for (const key in mapping) {
//       const { image, pdf } = mapping[key];
//       const imagePath = image ? uploadedFiles[image] : undefined;
//       const pdfPath = pdf ? uploadedFiles[pdf] : undefined;
//       if (imagePath) target[key] = imagePath;
//       else if (pdfPath) target[key] = pdfPath;
//     }
//   };

//   // ✅ Always run file mapping (even if the form wasn’t sent)
//   if (bodyData.citizenShipForm) {
//     mapFilesToTarget(bodyData.citizenShipForm, {
//       photoID: { image: 'photoIdImage', pdf: 'photoIdPdf' },
//       socialSecurityCard: {
//         image: 'socialSecurityImage',
//         pdf: 'socialSecurityPdf',
//       },
//       residentCard: { image: 'residentCardImage', pdf: 'residentCardPdf' },
//       workAuthorizationDocument: {
//         image: 'workAuthorizationImage',
//         pdf: 'workAuthorizationPdf',
//       },
//     });
//   }

//   if (bodyData.bankForm) {
//     mapFilesToTarget(bodyData.bankForm, {
//       accountFile: { image: 'directDepositImage', pdf: 'directDepositPdf' },
//       signature: { image: 'employeeSignature2' },
//     });
//   }

//   if (bodyData.i9Form) {
//     mapFilesToTarget(bodyData.i9Form, {
//       signature: { image: 'employeeSignature3' },
//     });
//   }

//   if (bodyData.w4Form) {
//     mapFilesToTarget(bodyData.w4Form, {
//       signature: { image: 'employeeSignature4' },
//     });
//   }

//   if (bodyData.generalInfo) {
//     mapFilesToTarget(bodyData.generalInfo, {
//       signature: { image: 'employeeSignature1' },
//     });
//   }

//   // ✅ Flatten and update
//   const flattened = flattenObject(bodyData);
//   const updatedIntern = await InternModel.findByIdAndUpdate(
//     id,
//     { $set: flattened },
//     { new: true, runValidators: true }
//   );

//   return updatedIntern;
// };

// Delete Intern by ID
const deleteIntern = async (id: string) => {
  const deleted = await InternModel.findByIdAndDelete(id);
  if (!deleted) throw new Error('Intern not found');
  return deleted;
};

export const SendPdfByMail = async (
  email: string | undefined,
  userId: string,
  data: string
) => {
  if (!email || !userId) {
    return 'Email UserId  is required';
  }
  const isExistUser = await User.isExistUserByEmail(email);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "admin doesn't exist!");
  }
  let pdfLink;
  if (data == 'Intern Employee pdf') {
    pdfLink = `${process.env.IMAGR_URL}/api/v1/internForm/pdf/${userId}`;
  } else {
    pdfLink = `${process.env.IMAGR_URL}/api/v1/temporaryForm/pdf/${userId}`;
  }

  const value = {
    link: pdfLink,
    email: isExistUser.email,
    data,
  };
  const pdfSend = emailTemplate.sendPdfTemplate(value);
  emailHelper.sendEmail(pdfSend);
};

export const InternService = {
  createIntern,
  getInternById,
  getAllIntern,
  getInternDataForPdf,
  // updateIntern,
  deleteIntern,
  SendPdfByMail,
};
