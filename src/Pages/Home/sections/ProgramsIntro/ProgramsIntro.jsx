import { useTranslation } from "react-i18next";
import "./ProgramsIntro.css";

function ProgramsIntro() {
  const { t } = useTranslation();

  return (
    <>
      <div className="programs">
        <h1>{t("home.programsIntro.title")}</h1>
      </div>
    </>
  );
}

export default ProgramsIntro;
