//#3 3:27:00

import SubCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryController = async (request, response) => {
  try {
    const { name, image, category } = request.body; //after accepting entries in client

    if (!name && !image && !category[0]) {
      return response.status(400).json({
        message: "Provide name, image, category",
        error: true,
        success: false,
      });
    }

    const payload = {
      name,
      image,
      category,
    };

    const createSubCategory = new SubCategoryModel(payload);
    const save = await createSubCategory.save();

    //acknowging client side
    return response.json({
      message: "Sub Category Created",
      data: save,
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

//#3 4:43:00
export const getSubCategoryController = async (request, response) => {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 }) //latest row to be in the sort
      .populate("category");

    return response.json({
      message: "Sub Category data",
      data: data,
      error: false,
      success: true,
    });

    //error handling
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//#3 5:36:55
export const updateSubCategoryController = async (request, response) => {
  try {
    const { _id, name, image, category } = request.body;

    const checkSub = await SubCategoryModel.findById(_id);

    if (!checkSub) {
      return response.status(400).json({
        message: "Check your _id",
        error: true,
        success: false,
      });
    }

    const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    });

    //for the acknowledgment purpose i send message
    return response.status(200).json({
      message: "Updated Successfully",
      data: updateSubCategory,
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

export const deleteSubCategoryController = async (request, response) => {
  try {
    const { _id } = request.body;
    console.log("Id", _id);
    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id);

    return response.json({
      message: "Delete successfully",
      data: deleteSub,
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
