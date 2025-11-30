import Link from "next/link";

const FAQs = () => {
  const EditFAQs = "edit-q-and-a";
  return (
    <div className="rounded bg-white dark:bg-gray-800 p-4 my-4">
      <div className="flex flex-row justify-between items-center my-5">
        <h1 className="font-bold text-lg">Frequently asked question</h1>
        <Link
          href={`/home-services/dashboard/profile-settings/${EditFAQs}`}
          className="text-sky-500 font-semibold"
        >
          Edit
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            What should the customer know about your pricing (e.g., discounts,
            fees)?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            What is your typical process for working with a new customer?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            What education and/or training do you have that relates to your
            work?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            How did you get started doing this type of work?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            What types of customers have you worked with?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            Describe a recent project you are fond of. How long did it take?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            What advice would you give a customer looking to hire a provider in
            your area of work?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <p className="font-bold text-md">
            What questions should customers think through before talking to
            professionals about their project?
          </p>
          <p className="text-sm">Not Answered</p>
        </div>
      </div>
    </div>
  );
};
export default FAQs;
