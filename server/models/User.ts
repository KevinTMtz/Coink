import mongoose, { Document, Schema } from 'mongoose';

interface UserType extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<UserType>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model<UserType>('User', userSchema);

export default User;
