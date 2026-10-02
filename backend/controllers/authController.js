const User = require("../models/User");

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, defaultAddress } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, phone, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please sign in.",
      });
    }

    const { salt, hash } = User.hashPassword(password);

    const formattedAddress = typeof defaultAddress === "string"
      ? { address: defaultAddress.trim(), landmark: "", pincode: "560027" }
      : (defaultAddress || { address: "", landmark: "", pincode: "560027" });

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      passwordHash: hash,
      salt,
      defaultAddress: formattedAddress,
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to Zion Food Corner.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          defaultAddress: user.defaultAddress?.address || user.defaultAddress || "",
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate customer & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = user.verifyPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          defaultAddress: user.defaultAddress?.address || user.defaultAddress || "",
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile or default delivery address
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, defaultAddress } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (defaultAddress) {
      user.defaultAddress = typeof defaultAddress === "string"
        ? { address: defaultAddress.trim(), landmark: "", pincode: "560027" }
        : defaultAddress;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          defaultAddress: user.defaultAddress?.address || user.defaultAddress || "",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
