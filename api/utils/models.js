import mongoose from './db.js';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin:  { type: Boolean, required: true },
});

// use bcrypt to hash passwords before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('User', UserSchema);

// Define a schema and model for the date and time data
const dateTimeSchema = new mongoose.Schema({
  date: String,
  startTime: String,
  endTime: String,
});
const DateTime = mongoose.model('DateTime', dateTimeSchema);

export {
  UserModel,
  DateTime,
};
