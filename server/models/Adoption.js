const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    petType: {
      type: String,
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other'],
      required: true,
    },
    breed: {
      type: String,
      default: 'Mixed',
    },
    age: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      default: '',
    },
    isAdopted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Adoption', adoptionSchema);
