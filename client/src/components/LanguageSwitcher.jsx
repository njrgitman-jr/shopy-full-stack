// client/src/components/LanguageSwitcher.jsx
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const user = useSelector((state) => state.user);

  const toggleLang = async () => {
    const newLang = i18n.language === "en" ? "ar" : "en";

    // 1️⃣ Change language instantly (UI)
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);

    // 2️⃣ Sync to backend ONLY if logged in
    if (!user?._id) return;
    try {
      await Axios({
        ...SummaryApi.updateLanguage,
        data: { language: newLang },
      });
    } catch (error) {
      console.error("Failed to sync language to backend", error);
    }
  };

  return (
    <button
      onClick={toggleLang}
      className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
    >
      {i18n.language === "en" ? "AR" : "EN"}
    </button>
  );
};

export default LanguageSwitcher;
