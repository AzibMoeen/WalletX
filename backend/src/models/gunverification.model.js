import mongoose from 'mongoose';

const gunVerificationSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    licenseNumber: {
      type: String,
      required: true
    },
    cnic: {
      type: String,
      required: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    gunImage: {
      type: String, 
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }, { timestamps: true });
  
export const GunVerification = mongoose.model('GunVerification', gunVerificationSchema);
