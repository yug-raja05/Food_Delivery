const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login first.",
      });
    }

    const decoded = User.verifyAuthToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }

    const user = await User.findById(decoded.id).select("-passwordHash -salt");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
