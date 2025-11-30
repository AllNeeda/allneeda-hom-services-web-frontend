import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

const UpdateAccountInfo = ({ onBack }: { onBack: () => void }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleNext = () => {};
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Account Information Update
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
            value="email-change"
            id="email-change"
            className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
          />
          <Label
            htmlFor="email-change"
            className="text-gray-800 dark:text-gray-200 cursor-pointer"
          >
            Email change
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
          <RadioGroupItem
            value="personal-info-change"
            id="personal-info-change"
            className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
          />
          <Label
            htmlFor="personal-info-change"
            className="text-gray-800 dark:text-gray-200 cursor-pointer"
          >
            Personal information change
          </Label>
        </div>
        <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
          <RadioGroupItem
            value="account-ownership"
            id="account-ownership"
            className="h-5 w-5 mt-0.5 text-sky-600 dark:text-sky-400 border-gray-400 dark:border-gray-600"
          />
          <Label
            htmlFor="account-ownership"
            className="text-gray-800 dark:text-gray-200 cursor-pointer"
          >
            Account ownership
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
export default UpdateAccountInfo;
