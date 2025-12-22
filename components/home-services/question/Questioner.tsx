import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useServiceQuestions } from "@/hooks/useHomeServices";
import { generateLead } from "@/app/api/homepage/generateLead";
import { toast } from "sonner";

interface Question {
  _id: string;
  service_id: string;
  question_name: string;
  form_type: string;
  options: string[];
  required: boolean;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  questions: Question[];
}

interface UserInfo {
  email: string;
  username: string;
  phone: string;
  password: string;
  description: string;
  files: FileList | null;
}

interface QuestionerProps {
  serviceId: string;
  professionalId: string;
  professionalIds: string[];
  triggerText?: string;
  className?: string;
  trigger?: React.ReactNode;
  googleProDatails?: { name: string; phone?: string }[];
}

// Custom ProgressBar component
const CustomProgressBar = ({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) => {
  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}
    >
      <div
        className="bg-sky-600 dark:bg-sky-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

// Constants for send options - CHANGED TO STRINGS
const SEND_OPTIONS = {
  TOP5: "top5" as const,
  SELECTED: "selected" as const,
};

type SendOption = typeof SEND_OPTIONS.TOP5 | typeof SEND_OPTIONS.SELECTED;

const Questioner = ({
  serviceId,
  professionalId,
  professionalIds,
  triggerText = "Request Quotation",
  className,
  trigger,
  googleProDatails,
}: QuestionerProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [service, setService] = useState<Service | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    username: "username",
    phone: "",
    password: "oqujs4o988q45",
    description: "",
    files: null,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [sendOption, setSendOption] = useState<SendOption>(SEND_OPTIONS.TOP5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: serviceQuestions,
    isLoading,
    isError,
  } = useServiceQuestions(serviceId);

  useEffect(() => {
    if (serviceQuestions?.data && serviceQuestions.data.length > 0) {
      // Transform API data to Service format
      const transformedService: Service = {
        id: serviceId,
        name: "Service", // You might want to get the actual service name from another API
        questions: serviceQuestions.data
          .filter((q: Question) => q.active) // Only use active questions
          .sort((a: Question, b: Question) => a.order - b.order), // Sort by order
      };
      setService(transformedService);
    } else {
      // Fallback if no questions found
      setService({
        id: serviceId,
        name: "Service",
        questions: [
          {
            _id: "fallback",
            service_id: serviceId,
            question_name: "Tell us about your project",
            form_type: "radio",
            options: ["Small project", "Medium project", "Large project"],
            required: true,
            order: 1,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      });
    }

    // Reset states when dialog opens/closes or serviceId changes
    setCurrentStep(0);
    setResponses({});
    setUserInfo({
      email: "",
      username: "",
      phone: "",
      password: "",
      description: "",
      files: null,
    });
    setUploadedFileNames([]);
    setSendOption(SEND_OPTIONS.TOP5);
  }, [serviceId, isOpen, serviceQuestions]);

  const handleResponse = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (service) {
      // If we're on the last question, move to the user info step
      if (currentStep === service.questions.length - 1) {
        setCurrentStep(service.questions.length); // User info step
      }
      // If we're on the user info step, move to the review step
      else if (currentStep === service.questions.length) {
        setCurrentStep(service.questions.length + 1); // Review step
      }
      // If we're on the review step, move to the professional selection step
      else if (currentStep === service.questions.length + 1) {
        setCurrentStep(service.questions.length + 2); // Professional selection step
      }
      // Otherwise, move to the next question
      else if (currentStep < service.questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleUserInfoChange = (
    field: keyof UserInfo,
    value: string | FileList | null
  ) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleUserInfoChange("files", files);
      const names = Array.from(files).map((file) => file.name);
      setUploadedFileNames(names);
    }
  };

  const handleSendOptionChange = (value: string) => {
    setSendOption(value as SendOption);
  };

  const userLocationRaw = localStorage.getItem("user_location");
  let userLocation: any = null;
  try {
    userLocation = userLocationRaw ? JSON.parse(userLocationRaw) : null;
  } catch (e) {
    console.error("Failed to parse user_location from localStorage:", e);
    userLocation = null;
  }

  const handleSubmit = async () => {
    const payload = {
      serviceId,
      responses,
      professionalId,
      googleProDatails,
      // Narrow the userInfo shape to what the API expects
      userInfo: {
        email: userInfo.email,
        phone: userInfo.phone,
        description: userInfo.description || undefined,
      },
      userLocation,
      // API currently expects the property name "ssendOption" (typo) — provide it here
      sendOption: sendOption,
      // The API expects "professionalIds"
      professionalIds: professionalIds,
    };

    try {
      console.log("Submitting:", payload);
      setIsSubmitting(true);
      await generateLead(payload);
      toast.success("Quotation Sent Successfully", {
        description: "Your quotation has been sent successfully.",
        icon: <Sparkles />,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting lead:", error);

      toast.error("Submission Failed", {
        description:
          "There was an error submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressValue = service
    ? (currentStep / (service.questions.length + 3)) * 100
    : 0;

  // Show loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="default"
              className={`bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${className}`}
            >
              {triggerText}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-3">Loading questions...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error state but still show the trigger button
  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="default"
              className={`bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${className}`}
            >
              {triggerText}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <div className="text-center p-8">
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">
              Unable to Load Questions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was an error loading the service questions. Please try
              again.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If no service data is available, still show the trigger button
  if (!service) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="default"
              className={`bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${className}`}
            >
              {triggerText}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <div className="text-center p-8">
            <p>No questions available for this service.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="default"
            className={`bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${className}`}
          >
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-lg max-h-[100vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
          {/* Visually hidden DialogTitle for accessibility */}
          <DialogHeader className="sr-only">
            <DialogTitle>Request Quotation for {service.name}</DialogTitle>
          </DialogHeader>

          <div className="pt-0 pb-4">
            <CustomProgressBar value={progressValue} />
          </div>

          <div className="p-6 max-h-[100vh] overflow-y-auto">
            {currentStep < service.questions.length ? (
              // Question steps
              <div className="space-y-6">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {service.questions[currentStep].question_name}
                </h3>
                <RadioGroup
                  value={responses[service.questions[currentStep]._id] || ""}
                  onValueChange={(value) =>
                    handleResponse(service.questions[currentStep]._id, value)
                  }
                  className=""
                >
                  {service.questions[currentStep].options.map(
                    (option, index) => {
                      const isSelected =
                        responses[service.questions[currentStep]._id] ===
                        option;
                      const optionId = `option-${currentStep}-${index}`;

                      return (
                        <Label
                          htmlFor={optionId}
                          key={index}
                          className={`flex items-center space-x-3 border p-4 rounded-md transition-colors duration-200 cursor-pointer ${
                            isSelected
                              ? "border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600"
                          }`}
                        >
                          <RadioGroupItem
                            value={option}
                            id={optionId}
                            className={`text-sky-600 ${
                              isSelected
                                ? "border-sky-600 bg-sky-600"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          <span className="text-sm font-normal text-gray-700 dark:text-gray-300 flex-1">
                            {option}
                          </span>
                        </Label>
                      );
                    }
                  )}
                </RadioGroup>
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!responses[service.questions[currentStep]._id]}
                    className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
                  >
                    {currentStep === service.questions.length - 1
                      ? "Continue"
                      : "Next"}
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ) : currentStep === service.questions.length ? (
              // User info step
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) =>
                        handleUserInfoChange("email", e.target.value)
                      }
                      placeholder="your.email@example.com"
                      required
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) =>
                        handleUserInfoChange("phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                      required
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Project Description
                    </Label>
                    <Textarea
                      id="description"
                      value={userInfo.description}
                      onChange={(e) =>
                        handleUserInfoChange("description", e.target.value)
                      }
                      placeholder="Please provide any additional details about your project..."
                      rows={4}
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="files"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Upload Files (Optional)
                    </Label>
                    <Input
                      id="files"
                      type="file"
                      onChange={handleFileUpload}
                      multiple
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                    {uploadedFileNames.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Selected files:</span>
                        <ul className="list-disc list-inside mt-1">
                          {uploadedFileNames.map((name, index) => (
                            <li key={index}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!userInfo.email || !userInfo.phone}
                    className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
                  >
                    Review
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ) : currentStep === service.questions.length + 1 ? (
              // Review step
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Review Your Quotation Request
                </h3>

                <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Your Answers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.questions.map((question) => (
                      <div key={question._id} className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {question.question_name}
                        </p>
                        <p className="text-sky-600 dark:text-sky-400">
                          {responses[question._id] || "No answer provided"}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Email:
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 ml-2">
                        {userInfo.email}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Phone:
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 ml-2">
                        {userInfo.phone}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Description:
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 block mt-1">
                        {userInfo.description || "None provided"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Files:
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 ml-2">
                        {userInfo.files
                          ? `${userInfo.files.length} file(s) uploaded`
                          : "None"}
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              // Professional selection step
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Send Quotation Request
                </h3>

                <p className="text-sky-600 dark:text-sky-400 text-sm">
                  For faster responses and more accurate pricing, we recommend
                  sending your quotation request to the top 5 recommended
                  professionals, including your selected professional.
                </p>

                <RadioGroup
                  value={sendOption} // Now this directly uses the string value
                  onValueChange={handleSendOptionChange}
                >
                  {[
                    {
                      id: "top5",
                      label:
                        "Request to top 5 professionals (selected by default)",
                      value: "top5",
                    },
                    {
                      id: "select",
                      label: "Request to selected professional",
                      value: "selected", // CHANGED from "select" to "selected"
                    },
                  ].map((option) => {
                    const isSelected = sendOption === option.value;

                    return (
                      <Label
                        htmlFor={option.id}
                        key={option.id}
                        className={`flex items-center space-x-3 border p-4 rounded-md transition-colors duration-200 cursor-pointer ${
                          isSelected
                            ? "border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.id}
                          className="text-sky-600 border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm font-normal text-gray-700 dark:text-gray-300 flex-1">
                          {option.label}
                        </span>
                      </Label>
                    );
                  })}
                </RadioGroup>

                <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      (sendOption === SEND_OPTIONS.SELECTED &&
                        professionalIds.length === 0) ||
                      isSubmitting
                    }
                    className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Submit Quotation Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Questioner;
