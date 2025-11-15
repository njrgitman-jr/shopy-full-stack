//#3 1:03:00
//fucntion to upload image from anywhere

import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await Axios({
      ...SummaryApi.uploadImage,
      data: formData, //pass data
    });

    return response;
  } catch (error) {
    return error;
  }
};

export default uploadImage;
