import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
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
