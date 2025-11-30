import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notMatchError, setError] = useState("");
  const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      alert(`The ${currentPassword} changed to ${newPassword}`);
    } else {
      setError("Password dose not match");
    }
  };
  return (
    <div className="rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 space-y-5 p-6">
      <h1 className="text-center text-lg font-bold">Change password</h1>

      <div className="">
        <label htmlFor="current">Current password</label>
        <Input
          className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          type="password"
          id="current"
          placeholder="current password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label htmlFor="new">New Password</label>
        <Input
          className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          type="password"
          id="new"
          placeholder="new password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="confirm">Confirm Pasword</label>
        <Input
          type="password"
          className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          id="confirm"
          placeholder="confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <small className="text-red-500">{notMatchError}</small>
        <div className="">
          <p className="text-gray-500">Your password must:</p>
          <ul className="list-disc px-4 text-sm">
            <li>be 8 to 72 character long</li>
            <li>not contains your name or email</li>
            <li>
              not be commonly used, easily guessed or contains any vairation of
              the word Servicyee
            </li>
          </ul>
        </div>
        <div className="my-5">
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-sky-500 text-white dark:bg-sky-400 hover:bg-sky-600"
          >
            Save Password
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
