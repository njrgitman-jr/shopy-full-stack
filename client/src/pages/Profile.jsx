import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";

// 🌍 i18n
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Profile = () => {
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const user = useSelector((state) => state.user);
  console.log("profiole user detals", user);

  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);

  //getting all user detail from the state
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //to preserve data on refresh
  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  //#2 7:24:00
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //#2 7:36:00
    try {
      setLoading(true);
      const response = await Axios({
        //spread/get from summaryApi then pass the data from the state to update
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      //#2 7:43:00
      //destructure or extract values from arrays or properties from objects and assign them
      //response as in updateUserDetails method in in user.controller.js (see return response.json({...
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        //#2 7:42:00  when the update is done i want to update the entire app
        //now for use details to reflect in setUserDetails in redux  also
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4" dir={isRTL ? "rtl" : "ltr"}>
      {/**profile upload and display image */}
      <div className="w-20 h-20 bg-slate-200 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img
            alt={user.name}
            src={user.avatar}
            className="w-full h-full"
          />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>

      <button
        onClick={() => setProfileAvatarEdit(true)}
        className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3"
      >
        {t("edit")}
      </button>

      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
      )}

      {/**name, mobile , email, change password */}
      <form
        className="my-4 grid gap-4"
        onSubmit={handleSubmit}
      >
        <div className="grid">
          <label>{t("name")}</label>
          <input
            type="text"
            placeholder={t("enterName")}
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={userData.name}
            name="name"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="email">{t("email")}</label>
          <input
            type="email"
            id="email"
            placeholder={t("enterEmail")}
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={userData.email}
            name="email"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="mobile">{t("mobile")}</label>
          <input
            type="text"
            id="mobile"
            placeholder={t("enterMobile")}
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={userData.mobile}
            name="mobile"
            onChange={handleOnChange}
            required
          />
        </div>

        <button className="border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded">
          {loading ? t("loading") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default Profile;




// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaRegUserCircle } from "react-icons/fa";
// import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import AxiosToastError from "../utils/AxiosToastError";
// import toast from "react-hot-toast";
// import { setUserDetails } from "../store/userSlice";
// import fetchUserDetails from "../utils/fetchUserDetails";

// const Profile = () => {
//   const user = useSelector((state) => state.user);
//   console.log("profiole user detals", user);

//   const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);

//   //getting all user detail from the state
//   const [userData, setUserData] = useState({
//     name: user.name,
//     email: user.email,
//     mobile: user.mobile,
//   });
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   //to preserve data on refresh
//   useEffect(() => {
//     setUserData({
//       name: user.name,
//       email: user.email,
//       mobile: user.mobile,
//     });
//   }, [user]);

//   //#2 7:24:00
//   const handleOnChange = (e) => {
//     const { name, value } = e.target;

//     setUserData((preve) => {
//       return {
//         ...preve,
//         [name]: value,
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     //#2 7:36:00
//     try {
//       setLoading(true);
//       const response = await Axios({
//         //spread/get from summaryApi then pass the data from the state to update
//         ...SummaryApi.updateUserDetails,
//         data: userData,
//       });

//       //#2 7:43:00
//       //destructure or extract values from arrays or properties from objects and assign them
//       //response as in updateUserDetails method in in user.controller.js (see return response.json({...
//       const { data: responseData } = response;

//       if (responseData.success) {
//         toast.success(responseData.message);
//         //#2 7:42:00  when the update is done i want to update the entire app
//         //now for use details to reflect in setUserDetails in redux  also
//         const userData = await fetchUserDetails();
//         dispatch(setUserDetails(userData.data));
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="p-4">
//       {/**profile upload and display image */}
//       <div className="w-20 h-20 bg-slate-200 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
//         {user.avatar ? (
//           <img
//             alt={user.name}
//             src={user.avatar}
//             className="w-full h-full"
//           />
//         ) : (
//           <FaRegUserCircle size={65} />
//         )}
//       </div>
//       <button
//         onClick={() => setProfileAvatarEdit(true)}
//         className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3"
//       >
//         Edit
//       </button>

//       {openProfileAvatarEdit && (
//         <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
//       )}

//       {/**name, mobile , email, change password */}
//       <form
//         className="my-4 grid gap-4"
//         onSubmit={handleSubmit}
//       >
//         <div className="grid">
//           <label>Name</label>
//           <input
//             type="text"
//             placeholder="Enter your name"
//             className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
//             value={userData.name}
//             name="name"
//             onChange={handleOnChange}
//             required
//           />
//         </div>
//         <div className="grid">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             placeholder="Enter your email"
//             className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
//             value={userData.email}
//             name="email"
//             onChange={handleOnChange}
//             required
//           />
//         </div>
//         <div className="grid">
//           <label htmlFor="mobile">Mobile</label>
//           <input
//             type="text"
//             id="mobile"
//             placeholder="Enter your mobile"
//             className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
//             value={userData.mobile}
//             name="mobile"
//             onChange={handleOnChange}
//             required
//           />
//         </div>

//         <button className="border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded">
//           {loading ? "Loading..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Profile;
