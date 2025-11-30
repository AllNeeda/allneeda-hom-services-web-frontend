import { Button } from "@/components/ui/button";
import Link from "next/link";

const PaymentMethod = () => {
  const EditPayment = "edit-payment";

  return (
    <div className="rounded bg-white dark:bg-gray-800 p-4 my-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-lg my-4">Payment Methods accepted</h1>
        <Link
          href={`/home-services/dashboard/profile-settings/${EditPayment}`}
          className="text-sky-500 font-semibold"
        >
          Edit
        </Link>
      </div>
      <div className="border-2 my-4 border-gray-200 border-dashed dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500 flex flex-row gap-2 p-6">
        <p className="flex-2">
          Let customers know what kind of payments you take
        </p>
        <Button
          type="button"
          className="bg-sky-500 rounded text-white dark:bg-sky-500"
        >
          <Link
            href={`/home-services/dashboard/profile-settings/${EditPayment}`}
          >
            Add
          </Link>
        </Button>
      </div>
      {/* <div className="border-2 border-gray-200 dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500 flex flex-row gap-2 p-6">
        <p className="flex-2">
          Let customers know what kind of payments you take
        </p>
        <Button
          type="button"
          className="bg-sky-500 rounded text-white dark:bg-sky-500"
        >
          Add
        </Button>
      </div> */}
    </div>
  );
};
export default PaymentMethod;
