import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const DeactivateAccount = () => {
  const [reason, setReason] = useState("");
  const handleDeactivate = () => {
    alert(`Deactivate request for ${reason} submitted`);
  };

  return (
    <div className="rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 my-5 p-6 space-y-5">
      <h1 className="text-lg font-bold">Deactivate your account</h1>
      <p className="text-sm font-semibold">
        Are you sure you want deactivate your account?
      </p>
      <div className="space-y-2 text-sm">
        <p className="">
          When you deactivate your account, you will lose access to all of your
          projects, profile information, and any reviews you&apos;ve written or
          received on Servicyee.
        </p>
        <p className="">
          If you&apos;re going on a vacation or need a break from leads, try{" "}
          <Link href="#" className="text-sky-500">
            Hide my Business
          </Link>{" "}
          instead.
        </p>
        <p>
          If you are receiving too many emails from us, then you can{" "}
          <Link href="#" className="text-sky-500">
            change your notification settings
          </Link>
          .
        </p>
        <p className="">
          We&apos;ad hate to see you go. If there&apos;s anything we can do to
          help, please visit our{" "}
          <Link href="#" className="text-sky-500">
            Help Center
          </Link>
          .
        </p>
      </div>
      <div>
        <Input
          type="text"
          className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          onChange={(e) => setReason(e.target.value)}
          placeholder="Type your reason..."
        />
        <p className="text-xs">
          Reason for deactivating your account (optional)
        </p>
      </div>
      <Checkbox id="confirm" className="mr-2" />
      <label htmlFor="confirm">
        I confirm I want to deactivate Esmatullah Hashimi&apos;s account
      </label>

      <div className=" my-5 space-x-2">
        <Button
          type="submit"
          onClick={handleDeactivate}
          className="bg-sky-500 text-white font-semibold"
        >
          Deactivate account
        </Button>
        <Button type="submit" className="text-sky-500 bg-white ">
          Cancel
        </Button>
      </div>
    </div>
  );
};
export default DeactivateAccount;
