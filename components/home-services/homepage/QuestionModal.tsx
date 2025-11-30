import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface QuestionModalProps {
  triggerText?: string;
  triggerClassName?: string;
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
  showDefaultForm?: boolean;
}

const QuestionModal = ({
  triggerText = "Contact for price",
  triggerClassName = "text-sky-500 text-xs cursor-pointer hover:underline focus-visible:outline-none text-start",
  title = "Based on your answer we will provide the price estimation",
  description,
  children,
  showDefaultForm = true,
}: QuestionModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={triggerClassName}>{triggerText}</button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xs font-medium">{title}</DialogTitle>
          {description && (
            <DialogDescription className="flex items-center gap-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children ||
          (showDefaultForm && (
            <div className="space-y-4">
              <div className="p-2 space-y-4">
                <div>
                  <label
                    htmlFor="zipcode"
                    className="block text-sm font-medium mb-1"
                  >
                    Zip Code
                  </label>
                  <Input type="text" id="zipcode" value="22034" readOnly />
                </div>
                <div>
                  <label
                    htmlFor="frequency"
                    className="block text-sm font-medium mb-1"
                  >
                    Frequency
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Just once</SelectItem>
                      <SelectItem value="every_week">Every week</SelectItem>
                      <SelectItem value="every_two_week">
                        Every two week
                      </SelectItem>
                      <SelectItem value="once_a_month">Once a month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm font-medium mb-1"
                  >
                    Number of bedrooms
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 bedroom</SelectItem>
                      <SelectItem value="2">2 bedrooms</SelectItem>
                      <SelectItem value="3">3 bedrooms</SelectItem>
                      <SelectItem value="4">4 bedrooms</SelectItem>
                      <SelectItem value="5">5 bedrooms</SelectItem>
                      <SelectItem value="6">6 bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="cleaningType"
                    className="block text-sm font-medium mb-1"
                  >
                    Cleaning type
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard cleaning
                      </SelectItem>
                      <SelectItem value="deep">Deep cleaning</SelectItem>
                      <SelectItem value="move_out">
                        Move out cleaning
                      </SelectItem>
                      <SelectItem value="vacation">
                        Vacation rental cleaning
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 text-center">
                <Link
                  href={"/home-services/professional-profile/2"}
                  className="bg-sky-500 dark:bg-sky-400 px-4 py-2 text-white rounded hover:bg-sky-600 dark:hover:bg-sky-500 transition-colors"
                >
                  Request Quotation
                </Link>
              </div>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModal;
