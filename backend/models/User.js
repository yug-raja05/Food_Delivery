const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
    defaultAddress: {
      address: { type: String, default: "" },
      landmark: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

// Method to hash password using Node.js crypto (PBKDF2)
userSchema.statics.hashPassword = function (password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
};

// Method to verify password
userSchema.methods.verifyPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.passwordHash === hash;
};

// Generate a secure auth token
userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id.toString(),
    email: this.email,
    role: this.role,
    name: this.name,
    time: Date.now(),
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const secret = process.env.JWT_SECRET || "zion_food_corner_secret_key_2026";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("base64url");
  return `${payloadBase64}.${signature}`;
};

// Verify auth token
userSchema.statics.verifyAuthToken = function (token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payloadBase64, signature] = token.split(".");
  const secret = process.env.JWT_SECRET || "zion_food_corner_secret_key_2026";
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("base64url");
  if (signature !== expectedSig) return null;
  try {
    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf8");
    return JSON.parse(payloadJson);
  } catch (e) {
    return null;
  }
};

module.exports = mongoose.model("User", userSchema);
