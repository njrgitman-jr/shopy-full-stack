import toast from "react-hot-toast";

//error passed from catch handler
const AxiosToastError = (error) => {
  toast.error(error?.response?.data?.message);
};

export default AxiosToastError;
