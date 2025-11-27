// src/models/Employee.js
// Employee model: Represents a user/employee who can own tasks.
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: ["Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    password: {
      type: String,
      // Password required only for local users (no provider)
      required: function() { return !this.provider; },
      minlength: 6
    },
    provider: {
      type: String,
      enum: ['google'],
      default: null
    },
    providerId: {
      type: String,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

// Hide password when converting to JSON
EmployeeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Compare password helper
EmployeeSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Pre-save hook to hash password if modified
EmployeeSchema.pre('save', async function (next) {
  // Skip hashing if provider user without password or password unchanged
  if (this.provider && !this.password) return next();
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
