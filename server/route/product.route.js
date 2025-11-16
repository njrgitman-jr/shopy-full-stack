//create endpoints for controller methods

import { Router } from "express"; // Import Express Router to create modular route handlers
import auth from "../middleware/auth.js"; // Authentication middleware to protect routes
import {
  createProductController,
  deleteProductDetails,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductController,
  getProductDetails,
  searchProduct,
  updateProductDetails,
} from "../controllers/product.controller.js"; // Import product-related controllers
import { admin } from "../middleware/admin.js";

// import { admin } from '../middleware/Admin.js'
// You can uncomment this later to add Admin-only route protection

/**
 * Initialize the product router
 * All product-related endpoints will be mounted here
 */
const productRouter = Router();

/**
 * CREATE Product
 * POST /create
 * Protected route - user must be authenticated
 * (Optional) admin middleware can be added later
 */
productRouter.post("/create", auth, admin, createProductController);
// Example with admin check: productRouter.post("/create", auth, admin, createProductController)

/**
 * GET Products (paginated + optional search)
 * POST /get
 * Public route - no authentication required
 */
productRouter.post("/get", getProductController);

/**
 * GET Products by Category
 * POST /get-product-by-category
 * POST is used here because the category ID is passed in the request body
 */
productRouter.post("/get-product-by-category", getProductByCategory);

/**
 * GET Products by Category AND SubCategory
 * POST /get-pruduct-by-category-and-subcategory
 * Requires categoryId and subCategoryId in request body
 */
productRouter.post(
  "/get-pruduct-by-category-and-subcategory",
  getProductByCategoryAndSubCategory
);

/**
 * GET Product Details by productId
 * POST /get-product-details
 * Public route - can be used by anyone to view product info
 */
productRouter.post("/get-product-details", getProductDetails);

/**
 * UPDATE Product Details
 * PUT /update-product-details
 * Protected route - user must be authenticated
 * (Optional) admin middleware can be added later
 */
productRouter.put("/update-product-details", auth, admin, updateProductDetails);
// Example with admin check: productRouter.put("/update-product-details", auth, admin, updateProductDetails);

/**
 * DELETE Product
 * DELETE /delete-product
 * Protected route - user must be authenticated
 * (Optional) admin middleware can be added later
 */
productRouter.delete("/delete-product", auth, deleteProductDetails);
// Example with admin check: productRouter.delete("/delete-product", auth, admin, deleteProductDetails);

/**
 * SEARCH Products
 * POST /search-product
 * Public route - takes 'search' term in request body
 */
productRouter.post("/search-product", searchProduct); //use post coz insidethe body i will provide such parameters also not add auth orr admin coz it is anonymouse search/any user can search

/**
 * Export the router to be used in the main server file
 * Typically mounted like: app.use('/api/products', productRouter)
 */
export default productRouter;
