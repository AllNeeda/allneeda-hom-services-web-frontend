import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, ArrowLeft, InfoIcon } from "lucide-react";
import { useState } from "react";
import UpdateAccountInfo from "./company/UpdateAccountInfo";

// Main component
const AddCompanyLicence = () => {
  const [redirect, setRedirect] = useState("");

  const handleBack = () => {
    setRedirect("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {redirect === "" && <MainSelection setRedirect={setRedirect} />}

      {redirect === "background-check" && (
        <BackgroundCheckSection onBack={handleBack} />
      )}

      {redirect === "license" && <LicenseSection onBack={handleBack} />}

      {redirect === "account-info" && <UpdateAccountInfo onBack={handleBack} />}

      {redirect &&
        !["", "background-check", "license", "account-info"].includes(
          redirect
        ) && <PlaceholderSection redirect={redirect} onBack={handleBack} />}
    </div>
  );
};

// Main selection component
const MainSelection = ({
  setRedirect,
}: {
  /*eslint-disable no-unused-vars */
  setRedirect: (value: string) => void;
  /*elslint-enable no-unused-vars */
}) => {
  const [helpType, setHelpType] = useState("");

  const handleNext = () => {
    if (helpType) {
      setRedirect(helpType);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-gray-800 dark:text-white">
          Account Information and Licensing
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          To update your account, we&apos;ll need some information and
          documentation from you. Select the option that best describes what you
          need help with.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <div className="mb-4">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            I need help with:
          </p>
        </div>

        <RadioGroup
          value={helpType}
          onValueChange={setHelpType}
          className="space-y-4"
        >
          {/* Background Check Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
            <RadioGroupItem
              value="background-check"
              id="background-check"
              className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
            />
            <div className="flex-1">
              <Label
                htmlFor="background-check"
                className="text-base font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Background Check
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For SSN-Less Background Check
              </p>
            </div>
          </div>

          {/* Account Information Update Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
            <RadioGroupItem
              value="account-info"
              id="account-info"
              className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
            />
            <div className="flex-1">
              <Label
                htmlFor="account-info"
                className="text-base font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Account Information Update
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For email and account information/ownership changes
              </p>
            </div>
          </div>

          {/* License Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
            <RadioGroupItem
              value="license"
              id="license"
              className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
            />
            <div className="flex-1">
              <Label
                htmlFor="license"
                className="text-base font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                License
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For issues with license verification
              </p>
            </div>
          </div>

          {/* Business Name Change Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
            <RadioGroupItem
              value="business-name-change"
              id="business-name-change"
              className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
            />
            <div className="flex-1">
              <Label
                htmlFor="business-name-change"
                className="text-base font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Business Name Change
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For issues updating business information
              </p>
            </div>
          </div>

          {/* Account Removed Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
            <RadioGroupItem
              value="account-removed"
              id="account-removed"
              className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
            />
            <div className="flex-1">
              <Label
                htmlFor="account-removed"
                className="text-base font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Account that was removed because I&apos;m believed to be under
                18
              </Label>
            </div>
          </div>

          {/* Unauthorized Access Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
            <RadioGroupItem
              value="someone-accessing"
              id="someone-accessing"
              className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
            />
            <div className="flex-1">
              <Label
                htmlFor="someone-accessing"
                className="text-base font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                Someone is accessing my account that shouldn&apos;t be
              </Label>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-6 flex justify-start">
          <Button
            onClick={handleNext}
            type="button"
            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
            disabled={!helpType}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

// Background Check Component
const BackgroundCheckSection = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 pl-0"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        Background Check
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Upload a clear photo of your current government-issued photo ID. This
        keeps your account secure.
      </p>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <InfoIcon
            size={16}
            className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Make sure the entire ID is captured within the picture and avoid
            cutting the edges. Upload documents using these formats: JPEG, HEIC,
            PDF. Files will automatically be deleted in 30 days.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="upload-file"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white rounded-md cursor-pointer transition-colors"
        >
          <Paperclip className="w-4 h-4" />
          <span>Attach File</span>
        </label>
        <input type="file" name="license" id="upload-file" className="hidden" />
      </div>

      <div className="mb-6">
        <Label
          htmlFor="note"
          className="font-medium text-gray-800 dark:text-gray-200 mb-2 block"
        >
          Is there anything else we should know?
        </Label>
        <Textarea
          className="h-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
          name="note"
          id="note"
          placeholder="Please provide any additional information that might be helpful..."
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          type="button"
          variant="outline"
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Back
        </Button>
        <Button
          onClick={() => alert("Next button clicked")}
          type="button"
          className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

// License Component
const LicenseSection = ({ onBack }: { onBack: () => void }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [redirectToNext, setRedirectToNext] = useState(false);

  const handleNext = () => {
    if (selectedOption) {
      setRedirectToNext(true);
    }
  };

  if (redirectToNext) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => setRedirectToNext(false)}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 pl-0"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          License Verification
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Based on your selection: {selectedOption.replace(/-/g, " ")}
        </p>

        {/* Add your specific license verification form here */}

        <div className="flex gap-3">
          <Button
            onClick={() => setRedirectToNext(false)}
            type="button"
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Back
          </Button>
          <Button
            onClick={() => alert("License form submitted")}
            type="button"
            className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 pl-0"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          License Assistance
        </h1>
        <p className="font-medium text-sm text-gray-600 dark:text-gray-400 mt-2">
          Use this section if you need help with the following:
        </p>
      </div>

      <RadioGroup
        value={selectedOption}
        onValueChange={setSelectedOption}
        className="space-y-4 mb-6"
      >
        <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
          <RadioGroupItem
            value="license-not-verified"
            id="license-not-verified"
            className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
          />
          <Label
            htmlFor="license-not-verified"
            className="text-gray-800 dark:text-gray-200 cursor-pointer"
          >
            My license is not verified
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
          <RadioGroupItem
            value="authorized-license"
            id="authorized-license"
            className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
          />
          <Label
            htmlFor="authorized-license"
            className="text-gray-800 dark:text-gray-200 cursor-pointer"
          >
            Someone authorized me to use their license for my business
          </Label>
        </div>
      </RadioGroup>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          type="button"
          variant="outline"
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          type="button"
          className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
          disabled={!selectedOption}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Placeholder Component for other options
const PlaceholderSection = ({
  redirect,
  onBack,
}: {
  redirect: string;
  onBack: () => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 pl-0"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4 capitalize">
        {redirect.replace(/-/g, " ")}
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        This section is currently under development. Please check back later or
        contact support for immediate assistance.
      </p>

      <Button
        onClick={onBack}
        type="button"
        className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
      >
        Return to Options
      </Button>
    </div>
  );
};

export default AddCompanyLicence;
