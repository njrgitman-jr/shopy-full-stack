import ProductModel from "../models/product.model.js";

/**
 * Controller to create a new product
 */
export const createProductController = async (request, response) => {
  try {
    // Destructuring required fields from request body
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = request.body;

    // Validate required fields
    // image[0], category[0], subCategory[0] are checked assuming these are arrays
    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return response.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    // Create a new Product instance using the model
    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    // Save the product to the database
    const saveProduct = await product.save();

    // Respond with success message and saved product data
    return response.json({
      message: "Product Created Successfully",
      data: saveProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle server errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Controller to get paginated product list with optional search
 */
export const getProductController = async (request, response) => {
  try {
    let { page, limit, search } = request.body;

    // Default page & limit if not provided
    if (!page) page = 1;
    if (!limit) limit = 10;

    // Build query for search
    const query = search
      ? { $text: { $search: search } } // Full-text search on indexed fields
      : {};

    const skip = (page - 1) * limit; // Pagination offset

    // Execute query and get total count concurrently
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"), // Populate references for category and subCategory
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Controller to get products by category (limit 15)
 */
export const getProductByCategory = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "provide category id",
        error: true,
        success: false,
      });
    }

    // Find products that have this category id
    const product = await ProductModel.find({
      category: { $in: id },
    }).limit(15); // Show only 15 products

    return response.json({
      message: "category product list",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Controller to get products by category and subCategory with pagination
 */
export const getProductByCategoryAndSubCategory = async (request, response) => {
  try {
    let { categoryId, subCategoryId, page, limit } = request.body;

    // Validate required fields
    if (!categoryId || !subCategoryId) {
      return response.status(400).json({
        message: "Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    // Default page & limit if not provided
    if (!page) page = 1;
    if (!limit) limit = 10;

    //#3 02:22:00
    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product list",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Controller to get single product details by productId extracted from params
 */
export const getProductDetails = async (request, response) => {
  try {
    const { productId } = request.body;

    const product = await ProductModel.findOne({ _id: productId });

    return response.json({
      message: "product details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Controller to update product details
 */
export const updateProductDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "provide product _id",
        error: true,
        success: false,
      });
    }

    const updateProduct = await ProductModel.updateOne(
      { _id },
      { $set: request.body }, // Update fields in request body
      { runValidators: true } // Enforce schema validations
    );

    return response.json({
      message: "updated successfully",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Controller to delete a product
 */
export const deleteProductDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "provide _id",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({ _id });

    return response.json({
      message: "Delete successfully",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * Controller to search products with pagination
 */
export const searchProduct = async (request, response) => {
  try {
    let { search, page, limit } = request.body;

    // Default page & limit if not provided
    if (!page) page = 1;
    if (!limit) limit = 10;

    const query = search
      ? { $text: { $search: search } } // Full-text search
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 }) //show latest create product on the top
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error, //if message not avaialable then directly show defa
      error: true,
      success: false,
    });
  }
};
