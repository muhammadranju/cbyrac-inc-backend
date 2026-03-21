import mongoose, { Schema } from 'mongoose';
import { II9form, IW4Form } from './interface';

const PdfFormSchema: Schema = new Schema(
  {
    image: {
      type: [String],
    },
    example: {
      type: String,
    },
  },
  { timestamps: true }
);
export const W4FormModel = mongoose.model<IW4Form>('w4formpdf', PdfFormSchema);

export const I9FormModel = mongoose.model<II9form>('i9formpdf', PdfFormSchema);
