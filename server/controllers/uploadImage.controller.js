// #3 00:57:00

import uploadImageClodinary from "../utils/uploadImageClodinary.js";

//use async co we upload from other contenets which take time
const uploadImageController = async (request, response) => {
  try {
    const file = request.file;

    const uploadImage = await uploadImageClodinary(file);
    
    console.log(uploadImage,"UploadImage from uploadImageClodinary logger");

    return response.json({
      message: "Upload done",
      data: uploadImage,
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

export default uploadImageController;
