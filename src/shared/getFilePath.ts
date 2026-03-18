export type IFolderName =
  | 'image'
  | 'employeeSignature1'
  | 'employeeSignature2'
  | 'employeeSignature3'
  | 'employeeSignature4'
  | 'employeeSignature5'
  | 'employeeSignature6'
  | 'employeeSignature7'
  | 'employeeSignature8'
  | 'employeeSignature9'
  | 'employeeSignature10'
  | 'supervisorSignature'
  | 'timeSheetPdfOrImage'
  | 'directDepositImage'
  | 'photoIdImage'
  | 'socialSecurityImage'
  | 'residentCardImage'
  | 'workAuthorizationImage'
  | 'directDepositPdf'
  | 'photoIdPdf'
  | 'socialSecurityPdf'
  | 'residentCardPdf'
  | 'workAuthorizationPdf'
  | 'signature'
  | 'residentCard'
  | 'socialSecurityCard'
  | 'accountFile'
  | 'photoId'
  | 'i9Form'
  | 'w4Form'
  | 'example'
  | 'workAuthorizationDocument';

//single file
export const getSingleFile = (files: any, folderName: IFolderName) => {
  const fileField = files && files[folderName];
  if (fileField && Array.isArray(fileField) && fileField.length > 0) {
    return `/${fileField[0].filename}`;
    // return `/${folderName}/${fileField[0].filename}`;
  }

  return undefined;
};

// //multiple files
export const getMultipleFilesPaths = (files: any, folderName: IFolderName) => {
  const folderFiles = files && files[folderName];
  if (folderFiles) {
    if (Array.isArray(folderFiles)) {
      return folderFiles.map((file: any) => `/${folderName}/${file.filename}`);
    }
  }

  return undefined;
};

export const getAllUploadedFiles = (
  files: any
): Record<IFolderName, string | undefined> => {
  // List of all folder names
  const folderNames: IFolderName[] = [
    'employeeSignature1',
    'employeeSignature2',
    'employeeSignature3',
    'employeeSignature4',
    'employeeSignature5',
    'employeeSignature6',
    'employeeSignature7',
    'employeeSignature8',
    'employeeSignature9',
    'employeeSignature10',
    'supervisorSignature',
    'directDepositImage',
    'timeSheetPdfOrImage',
    'photoIdImage',
    'socialSecurityImage',
    'residentCardImage',
    'workAuthorizationImage',
    'directDepositPdf',
    'photoIdPdf',
    'socialSecurityPdf',
    'residentCardPdf',
    'workAuthorizationPdf',
  ];

  // Initialize result with all keys undefined
  const result: Record<IFolderName, string | undefined> = {} as Record<
    IFolderName,
    string | undefined
  >;
  folderNames.forEach(name => (result[name] = undefined));

  if (!files) return result;

  // Fill in uploaded files
  Object.keys(files).forEach(fieldName => {
    const fileArray = files[fieldName];
    if (fileArray && Array.isArray(fileArray) && fileArray.length > 0) {
      result[
        fieldName as IFolderName
      ] = `/${fieldName}/${fileArray[0].filename}`;
    }
  });

  return result;
};

// Define the structure of a file object
interface IFile {
  filename: string;
  [key: string]: any; // Allow additional properties (e.g., from multer)
}

// Define the type for the files object
interface IFiles {
  [key: string]: string | undefined;
}

// Single file path extraction
export const getSingleFilePath = (
  files: IFiles,
  folderName: IFolderName
): string | undefined => {
  const fileField = files && files[folderName];
  if (fileField && Array.isArray(fileField) && fileField.length > 0) {
    return `/${folderName}/${fileField[0].filename}`;
  }
  return undefined;
};

// Multiple file paths extraction
export const getMultipleFilesPath = (
  files: IFiles,
  folderName: IFolderName
): string[] | undefined => {
  const folderFiles = files && files[folderName];
  if (folderFiles && Array.isArray(folderFiles)) {
    return folderFiles.map((file: IFile) => `/${folderName}/${file.filename}`);
  }
  return undefined;
};

// Get all uploaded files
// export const getAllUploadedFiles = (
//   files: IFiles = {}
// ): Record<IFolderName, string | undefined> => {
//   const folderNames: IFolderName[] = [
//     'employeeSignature1',
//     'employeeSignature2',
//     'employeeSignature3',
//     'employeeSignature4',
//     'employeeSignature5',
//     'employeeSignature6',
//     'employeeSignature7',
//     'employeeSignature8',
//     'employeeSignature9',
//     'employeeSignature10',
//     'supervisorSignature',
//     'directDepositImage',
//     'timeSheetPdfOrImage',
//     'photoIdImage',
//     'socialSecurityImage',
//     'residentCardImage',
//     'workAuthorizationImage',
//     'directDepositPdf',
//     'photoIdPdf',
//     'socialSecurityPdf',
//     'residentCardPdf',
//     'workAuthorizationPdf',
//   ];

//   const result: Record<IFolderName, string | undefined> = {} as Record<
//     IFolderName,
//     string | undefined
//   >;
//   folderNames.forEach(name => (result[name] = undefined));

//   Object.keys(files).forEach(fieldName => {
//     const fileArray = files[fieldName];
//     if (fileArray && Array.isArray(fileArray) && fileArray.length > 0) {
//       result[
//         fieldName as IFolderName
//       ] = `/${fieldName}/${fileArray[0].filename}`;
//     }
//   });

//   return result;
// };
