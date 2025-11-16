// Import the User model from the models directory
// This model is used to interact with the "users" collection in your database
import UserModel from "../models/user.model.js";

// Export the 'admin' middleware function
export const admin = async (request, response, next) => {
  try {
    // Extract the userId from the request object
    // This assumes that some authentication middleware (like JWT verification)
    // has already run before this middleware and attached `userId` to `request` userid comming from the auth.js middleware
    const userId = request.userId;

    // Find the user in the database using their ID
    // `findById()` returns the user document if it exists, or null if it doesn't
    const user = await UserModel.findById(userId);

    // Check if the user exists and has the role 'ADMIN'
    // If the user's role is NOT 'ADMIN', deny access
    if (user.role !== "ADMIN") {
      return response.status(400).json({
        message: "Permission denial", // A simple message indicating access is denied
        error: true, // Boolean flag indicating there was an error
        success: false, // Boolean flag indicating the request failed
      });
    }

    // If the user is an admin, call `next()` to move on to the next middleware or route handler
    next();
  } catch (error) {
    // If any error occurs (e.g., invalid ID, DB error, etc.),
    // return a generic error response to the client
    return response.status(500).json({
      message: "Permission denial", // Generic error message (you could make it more descriptive)
      error: true, // Indicates an error occurred
      success: false, // Indicates the request was unsuccessful
    });
  }
};
