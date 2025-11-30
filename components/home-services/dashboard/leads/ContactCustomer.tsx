import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

type CreditPurchaseModalProps = {
  onClose: () => void;
  onBuyCredits?: () => void;
};

export default function CreditPurchaseModal({ onClose, onBuyCredits }: CreditPurchaseModalProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      key: "credits",
      title: "What are credits?",
      content:
        "Credits are Servicyee online currency. If you see a job that you like and you want to get in contact with that customer, then you use credits to purchase their contact details (you will receive their personal phone number and email address). The amount of credits required to contact a customer varies depending on the potential value of the job e.g. you will need less credits to contact a customer looking for a cleaner once a month for a 1 bedroomed flat than a customer looking for a cleaner once a week for a 5 bedroomed house.",
    },
    {
      key: "starter",
      title: "What is the starter pack?",
      content:
        "The starter pack is the only way to get started and trial Servicyee properly. It provides enough credits to contact roughly 10 customers and is designed so that you get hired at least once and get a great return on your investment. We’re so confident that you’ll get hired at least once from the starter pack that we offer a full Get Hired Guarantee. We also offer a massive 20% discount off the standard price.",
    },
    {
      key: "guarantee",
      title: "What is the Get Hired Guarantee?",
      content:
        "The Get Hired Guarantee is there as we’re so confident that you’ll get hired at least once that if you don’t, we’ll return all of the credits so you can try again.",
    },
  ];

  return (
    <>
      {/* Overlay and modal */}
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
        onClick={onClose} // close modal on background click
      >
        <div
          onClick={(e) => e.stopPropagation()} // prevent modal close on modal click
          className="bg-white dark:bg-gray-900 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 max-w-lg w-full max-h-[90vh] text-[12px] text-gray-500 dark:text-gray-400"
          style={{ lineHeight: 1.4 }}
        >
          {/* Header */}
          <div className="relative bg-[#0077B6] text-white p-5 rounded-sm">
            <h2 className="text-[12px] font-semibold leading-tight">
              You need 7 credits to contact John
            </h2>
            <p className="mt-1 text-[11px] opacity-90 max-w-[400px]">
              To get some credits, you need to buy a starter pack of credits
            </p>
            <p className="text-[11px] opacity-80">(Enough for this lead + roughly another 9 leads)</p>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 text-white hover:text-gray-300 focus:outline-none  focus:ring-white rounded"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Accordion */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sections.map((section) => (
              <div key={section.key}>
                <button
                  className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0077B6]"
                  onClick={() => toggleSection(section.key)}
                  aria-expanded={activeSection === section.key}
                  aria-controls={`${section.key}-content`}
                  id={`${section.key}-header`}
                  type="button"
                >
                  <span className="font-medium">{section.title}</span>
                  {activeSection === section.key ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {activeSection === section.key && (
                  <div
                    id={`${section.key}-content`}
                    role="region"
                    aria-labelledby={`${section.key}-header`}
                    className="px-4 pb-4 text-gray-700 text-justify font-normal text-[11px] dark:text-gray-300"
                  >
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Offer Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-sm">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-sm p-3 mb-4 text-[11px]">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">100 credits</span>
                <span className="font-semibold">£140.00 (ex VAT)</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>£1.40 per credit</span>
                <span>Enough for about 10 leads</span>
              </div>
              <div className="text-right text-xs text-gray-400 mt-0.5">£175.00 (ex VAT)</div>
            </div>

            <div className="text-gray-700 mb-4 text-[11px] space-y-0.5">
              <p className="font-semibold">Get Hired Guarantee</p>
              <p>
                We are so confident you will get hired at least once that if you do not,
                we will return all the credits.
              </p>
            </div>

            {/* Buy credits button */}
            <div
              onClick={() => {
                if (onBuyCredits) {
                  onBuyCredits();
                }
              }}
              className="w-full bg-[#0077B6] hover:bg-[#005f8e] text-white text-center cursor-pointer font-normal py-2.5  px-4 rounded-[4px] transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#0077B6]"
            >
              Buy 100 credits
            </div>

            {/* Checkbox */}
            <div className="flex items-center text-gray-700 text-[11px] mt-3">
              <input
                type="checkbox"
                id="auto-topup"
                className="h-4 w-4 text-[#0077B6] border-gray-300 dark:border-gray-600 rounded focus:ring-[#0077B6] mr-2"
              />
              <label htmlFor="auto-topup" className="select-none cursor-pointer">
                Auto top-up next time
              </label>
            </div>

            <p className="text-center text-gray-700 mt-4 text-[11px] max-w-xs mx-auto">
              You will use <strong>7</strong> of your <strong>100</strong> purchased credits to contact John
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
