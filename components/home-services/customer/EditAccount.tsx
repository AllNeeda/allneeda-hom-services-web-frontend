import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface CustomerType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: string;
  phone: string;
  reviews: number;
  project: number;
}

type CustomerProps = {
  customer: CustomerType;
};

const EditAccount = ({ customer }: CustomerProps) => {
  const [firstName, setFirstName] = useState(customer.first_name);
  const [lastName, setLastName] = useState(customer.last_name);
  const [phone, setPhone] = useState(customer.phone);

  // Reset form when customer prop changes
  useEffect(() => {
    setFirstName(customer.first_name);
    setLastName(customer.last_name);
    setPhone(customer.phone);
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ firstName, lastName, phone });
  };

  const handleCancel = () => {
    // Reset to original values
    setFirstName(customer.first_name);
    setLastName(customer.last_name);
    setPhone(customer.phone);
  };

  return (
    <>
      <h1 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">
        Account Settings
      </h1>

      {/* Push Notifications Section */}
      <h2 className="text-md mt-6 mb-2 font-medium text-gray-700 dark:text-gray-300">
        Edit Personal Information
      </h2>
      <div className="my-4 bg-white dark:bg-gray-800 rounded p-6 ">
        <form onSubmit={handleSubmit} className="px-4 md:px-10">
          <label
            htmlFor="firstname"
            className="text-sm mt-4 font-semibold text-gray-700 dark:text-gray-300 block"
          >
            First Name
          </label>
          <Input
            type="text"
            id="firstname"
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={firstName}
            placeholder="First name"
          />

          <label
            htmlFor="lastname"
            className="text-sm mt-4 font-semibold text-gray-700 dark:text-gray-300 block"
          >
            Last Name
          </label>
          <Input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            id="lastname"
            className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={lastName}
            placeholder="Last name"
          />

          <label
            htmlFor="phone"
            className="text-sm mt-4 font-semibold text-gray-700 dark:text-gray-300 block"
          >
            Phone
          </label>
          <Input
            type="text"
            onChange={(e) => setPhone(e.target.value)}
            id="phone"
            className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={phone}
            placeholder="Phone"
          />

          <label
            htmlFor="email"
            className="text-sm mt-4 font-semibold text-gray-700 dark:text-gray-300 block"
          >
            Email
          </label>
          <Input
            type="text"
            id="email"
            className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            value={customer.email}
            placeholder="Email"
            disabled
          />

          <div className="flex flex-row justify-end items-center gap-4 mt-10">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 
                       text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white"
              size="lg"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAccount;
