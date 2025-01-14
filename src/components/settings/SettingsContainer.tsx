import CredentialsSettings from "./CredentialsSettings";
import GoogleSheetsSetup from "./GoogleSheetsSetup";
import IdentifierSettings from "./IdentifierSettings";

const SettingsContainer = () => {
  return (
    <div className=" mx-auto px-6 py-8 font-sans space-y-12">
      <div>
        <div className="flex flex-col">
          <div className="w-full">
            <CredentialsSettings />
          </div>

          <div className="w-full">
            <IdentifierSettings />
          </div>
        </div>
        <div className="w-full">
          <GoogleSheetsSetup />
        </div>
      </div>
    </div>
  );
};

export default SettingsContainer;
