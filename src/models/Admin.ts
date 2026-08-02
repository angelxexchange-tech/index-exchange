import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  adminId: string;
  name: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "moderator";
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "moderator"],
      default: "superadmin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.Admin) {
  delete mongoose.models.Admin;
}

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
