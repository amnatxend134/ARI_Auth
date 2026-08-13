import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  toSafeObject(): Partial<IUser>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function (): Partial<IUser> {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

export default mongoose.model<IUser>('User', userSchema);