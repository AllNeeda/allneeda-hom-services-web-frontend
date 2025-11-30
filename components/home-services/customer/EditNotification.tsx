import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const EditNotification = () => {
  // State for push notifications
  const [prosMessages, setProsMessages] = useState(true);
  const [projectReminders, setProjectReminders] = useState(true);
  const [promotionsTips, setPromotionsTips] = useState(true);
  const [accountSupport, setAccountSupport] = useState(true);

  // State for text notifications
  const [allTextNotifications, setAllTextNotifications] = useState(true);

  // State for email notifications
  const [helpfulTips, setHelpfulTips] = useState(true);
  const [recommendations, setRecommendations] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [feedbackInvitations, setFeedbackInvitations] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [otherEmails, setOtherEmails] = useState(true);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">
        Notification Settings
      </h1>

      {/* Push Notifications Section */}
      <h2 className="text-md mt-6 mb-2 font-medium text-gray-700 dark:text-gray-300">
        Get push notification about
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Messages
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Pros send you messages.
            </h5>
          </div>
          <Switch
            checked={prosMessages}
            onCheckedChange={setProsMessages}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Project reminders and updates
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              You&apos;ve got upcoming projects or there are other updates about
              your projects.
            </h5>
          </div>
          <Switch
            checked={projectReminders}
            onCheckedChange={setProjectReminders}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Promotions and tips
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              There are coupons, promotions, surveys, and project ideas you
              might like.
            </h5>
          </div>
          <Switch
            checked={promotionsTips}
            onCheckedChange={setPromotionsTips}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Account support
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              We have updates about your account, projects, and security/privacy
              matters.
            </h5>
          </div>
          <Switch
            checked={accountSupport}
            onCheckedChange={setAccountSupport}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>
      </div>

      {/* Text Notifications Section */}
      <h2 className="text-md mt-6 mb-2 font-medium text-gray-700 dark:text-gray-300">
        Text me about
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              All text notifications
            </h2>
          </div>
          <Switch
            checked={allTextNotifications}
            onCheckedChange={setAllTextNotifications}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>
      </div>

      {/* Email Notifications Section */}
      <h2 className="text-md mt-6 mb-2 font-medium text-gray-700 dark:text-gray-300">
        Email me about
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Helpful tips and inspiration
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Cost guides, project checklists, and tips from Servicyee pros
            </h5>
          </div>
          <Switch
            checked={helpfulTips}
            onCheckedChange={setHelpfulTips}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Recommendations
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Personalized suggestions for projects, pros, and more
            </h5>
          </div>
          <Switch
            checked={recommendations}
            onCheckedChange={setRecommendations}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Special offers
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Discounts, rewards, and promotions
            </h5>
          </div>
          <Switch
            checked={specialOffers}
            onCheckedChange={setSpecialOffers}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Invitations to give feedback
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Quick surveys to get your ideas for improving Servicyee
            </h5>
          </div>
          <Switch
            checked={feedbackInvitations}
            onCheckedChange={setFeedbackInvitations}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Reminders
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Incomplete request reminders, recurring project reminders, and
              more
            </h5>
          </div>
          <Switch
            checked={reminders}
            onCheckedChange={setReminders}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 mr-4">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              Other
            </h2>
            <h5 className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Feature updates and product announcements
            </h5>
          </div>
          <Switch
            checked={otherEmails}
            onCheckedChange={setOtherEmails}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>
      </div>

      {/* Unsubscribe Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 mt-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 rounded-md border border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto border border-gray-300 dark:border-gray-600 text-red-500 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded"
          >
            Unsubscribe from all emails
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto border border-gray-300 dark:border-gray-600 text-red-500 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded"
          >
            Unsubscribe from all SMS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditNotification;
