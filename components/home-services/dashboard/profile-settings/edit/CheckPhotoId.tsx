import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock } from "lucide-react";
import { useState } from "react";

const CheckPhotoId = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [suitApt, setSuitApt] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [stateName, setStateName] = useState("");

  const handleMiddleNameConfirm = () => {
    alert("confirmed");
  };

  const handleSubmit = () => {
    alert(`the request has been submited ${dob} ${lastName}`);
  };
  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="space-y-6">
        <div className="">
          <h1 className="font-bold text-xl">Confirm your identity</h1>
          <p className="text-sm text-gray-500 mt-2">
            Make sure everything is correct before submitting.
          </p>
        </div>
        <div className=" border border-gray-300 dark:border-gray-700 rounded p-4">
          <section>
            <h1 className="font-bold mb-4">Legal Name</h1>
            <div className="space-y-4">
              <div className="">
                <Input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  id="firstname"
                  className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={firstName}
                  placeholder="first name"
                />
                <small className="text-gray-500">
                  Enter your name exactly as it appears on your
                  government-issued ID.
                </small>
              </div>
              <Input
                type="text"
                onChange={(e) => setMiddleName(e.target.value)}
                id="middlename"
                className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={middleName}
                placeholder="middle name"
              />
              <Checkbox
                id="confirmMiddleName"
                className="my-4 mr-2 data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:text-white dark:data-[state=checked]:border-sky-700 dark:data-[state=checked]:bg-sky-700"
                onCheckedChange={handleMiddleNameConfirm}
              />
              <label htmlFor="confirmMiddleName">
                I confirm I don&apos;t have a middle name
              </label>
              <Input
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                id="setLastName"
                className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={middleName}
                placeholder="last name"
              />
              <div className="">
                <h1 className="font-bold mb-4">Date of birth</h1>
                <Input
                  type="date"
                  onChange={(e) => setDob(e.target.value)}
                  id="dob"
                  className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={middleName}
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div className="">
                <h1 className="font-bold mb-4">Home Address</h1>
                <Input
                  type="text"
                  onChange={(e) => setStreetAddress(e.target.value)}
                  id="street-address"
                  className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={streetAddress}
                  placeholder="street address"
                />
                <Input
                  type="text"
                  onChange={(e) => setSuitApt(e.target.value)}
                  id="suit-apt"
                  className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={suitApt}
                  placeholder="suit / apt"
                />
                <Input
                  type="text"
                  onChange={(e) => setCity(e.target.value)}
                  id="city"
                  className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={city}
                  placeholder="city"
                />
                <div className="flex flex-row gap-4 items-center my-4">
                  <Select
                    value={stateName}
                    onValueChange={(val) => setStateName(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>State</SelectLabel>
                        <SelectItem value="ak">AK</SelectItem>
                        <SelectItem value="al">AL</SelectItem>
                        <SelectItem value="ar">AR</SelectItem>
                        <SelectItem value="az">AZ</SelectItem>
                        <SelectItem value="ca">CA</SelectItem>
                        <SelectItem value="co">CO</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    onChange={(e) => setZipcode(e.target.value)}
                    id="zipcode"
                    className="mt-1 outline-none border-none ring-1 ring-gray-300 dark:ring-gray-600 
             focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={zipcode}
                    placeholder="zip code"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
        <div
          className={`flex flex-row 
            border-gray-200 dark:border-gray-700 justify-between items-center border  p-4`}
        >
          <div className="flex flex-row gap-2 items-center">
            <Lock className="w-4 h-4 text-gray-500" />
            <p>Your information is stored securely.</p>
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-sky-500 dark:bg-sky-400 text-white hover:bg-sky-500 dark:hover:bg-sky-500 rounded px-4"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CheckPhotoId;
