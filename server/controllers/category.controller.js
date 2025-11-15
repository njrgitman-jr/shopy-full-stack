import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";

export const AddCategoryController = async (request, response) => {
  try {
    const { name, image } = request.body;

    if (!name || !image) {
      return response.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    const addCategory = new CategoryModel({
      name,
      image,
    });

    const saveCategory = await addCategory.save();

    if (!saveCategory) {
      return response.status(500).json({
        message: "Not Created",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Add Category",
      data: saveCategory,
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

export const getCategoryController = async (request, response) => {
  try {
    const data = await CategoryModel.find().sort({ createdAt: -1 }); //#3 02:54:00 createdAt: -1 latest category to be at the first position in list when fetching

    return response.json({
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.messsage || error,
      error: true,
      success: false,
    });
  }
};

//#3 02:01:00
export const updateCategoryController = async (request, response) => {
  try {
    const { _id, name, image } = request.body; //to update category we get the id from the request body which is avalable

    //find it with id then update any desired field
    const update = await CategoryModel.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
      }
    );
    //when update i send response
    return response.json({
      message: "Updated Category",
      success: true,
      error: false,
      data: update, //trud or valse whether data update of not
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error, //*error.message or if not avalable then show *error
      error: true,
      success: false,
    });
  }
};

//#3 02:27:00
export const deleteCategoryController = async (request, response) => {
  try {
    const { _id } = request.body; //directly get categoryid from the body

    //check if category used somere like subcategories then cannot delete
    const checkSubCategory = await SubCategoryModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    const checkProduct = await ProductModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    if (checkSubCategory > 0 || checkProduct > 0) {
      return response.status(400).json({
        message: "Category is already used can't delete",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await CategoryModel.deleteOne({ _id: _id });

    return response.json({
      message: "Delete category successfully",
      data: deleteCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
