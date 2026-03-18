export type ICreateAccount = {
  name: string;
  email: string;
  otp: number;
};

export type IResetPassword = {
  email: string;
  otp: number;
};

export type ISendPdf = {
  email: string;
  link: string;
  data: string;
};
