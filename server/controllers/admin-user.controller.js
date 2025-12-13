// admin-user.controller.js
import UserModel from "../models/user.model.js"; // note the `.js` extension


export async function ADMIN_getAllUsers(req, res) {
  try {
    const users = await UserModel.find()
      .select("-password -refresh_token")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export async function ADMIN_changeUserRole(req, res) {
  try {
    const { userId, role } = req.body;

    const allowedRoles = ["ADMIN", "USER", "DELV"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await UserModel.findByIdAndUpdate(userId, { role });

    res.json({
      success: true,
      message: "User role updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



export async function ADMIN_changeUserStatus(req, res) {
  try {
    const { userId, status } = req.body;

    const allowedStatus = ["Active", "Inactive", "Suspended"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await UserModel.findByIdAndUpdate(userId, { status });

    res.json({
      success: true,
      message: "User status updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export async function ADMIN_getUserLoginHistory(req, res) {
  try {
    const user = await UserModel.findById(req.params.userId)
      .select("login_history email name");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
