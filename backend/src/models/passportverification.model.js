import mongoose from 'mongoose';

const passportVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passwordCnic: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  passportImage: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
}, { timestamps: true });

export const PassVerification = mongoose.model('PassportVerification', passportVerificationSchema);