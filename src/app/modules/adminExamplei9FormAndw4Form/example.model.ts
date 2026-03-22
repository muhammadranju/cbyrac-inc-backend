import mongoose, { Schema } from 'mongoose';
import { IExampleI9form, IExampleW4Form } from './example.interface';

const PdfFormSchema: Schema = new Schema(
  {
    image: {
      type: [String],
    },
  },
  { timestamps: true }
);
export const ExampleW4FormModel = mongoose.model<IExampleW4Form>(
  'examplew4formpdf',
  PdfFormSchema
);

export const ExampleI9FormModel = mongoose.model<IExampleI9form>(
  'examplei9formpdf',
  PdfFormSchema
);
