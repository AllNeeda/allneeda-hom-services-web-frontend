import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import TravelModal from "./TravelModal";
import DrawOnMapModal from "./DrawModal";
import LocationModal from "./LocationModal";
import NationWide from "./NationWide";



type AddLocationModalProps = {
  onClose: () => void;
};

export default function AddLocationModal({ onClose }: AddLocationModalProps) {
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showDistanceModal, setShowDistanceModal] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showNationWideModal, setShowNationWideModal] = useState(false);


  const [locations] = useState([
    {
      id: 1,
      address: 'Within 150 miles of LL21 9RG',
      zip: 'LL21 9RG',
      milesRadius: 150,
      selected: false,
      servicesCount: 2,
      center: { lat: 53.02252, lng: -3.45073 } // Example coordinates for LL21 9RG
    }
  ]);


  const HandleLocationSelect = () => {
    const selectedOptions = options.find((option) => option.key === activeOption);
    if (!selectedOptions) return;
    if (selectedOptions.key === "draw") {
      setShowDrawModal(true);
      return;
    }
    if (selectedOptions.key === "distance") {
      setShowDistanceModal(true);
      return;
    }

    if (selectedOptions.key === "nationwide") {
      setShowNationWideModal(true);
      return;
    }


  }

  const toggleOption = (option: string) => {
    setActiveOption(activeOption === option ? null : option);
  };

  const options = [
    {
      key: "distance",
      title: "Distance",
      description:
        "Enter a postcode or city and then choose how far from there - as the crow flies.",
      details:
        "This option allows you to specify a radius around a specific location. Ideal for local service providers.",
      icon: (
        <svg
          className="w-5 h-5 text-[#0077B6]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
      ),
    },
    {
      key: "draw",
      title: "Draw on a map",
      description: "Draw your own specific area on the map.",
      details:
        "Manually draw your service area polygon for complete control over your coverage zone.",
      icon: (
        <svg
          className="w-5 h-5 text-[#0077B6]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 19l7-7 2 2-7 7-7-7 2-2z" />
          <path d="M18 13v6H6v-6" />
          <path d="M12 19V6" />
        </svg>
      ),
    },
    {
      key: "nationwide",
      title: "Nationwide",
      description:
        "Choose the nationwide location if you provide services across the whole country.",
      details:
        "Select this if you offer services nationally or can travel anywhere in the country.",
      icon: (
        <svg
          className="w-5 h-5 text-[#0077B6]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15 15 0 0 0 0 20" />
          <path d="M2 12a15 15 0 0 0 20 0" />
          <path d="M12 2v20" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Overlay and modal */}
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto text-[12px] text-gray-500 dark:text-gray-400"
          style={{ lineHeight: 1.4 }}
        >
          {/* Header */}
          <div className="relative bg-[#0077B6] text-white p-5 rounded-sm">
            <h2 className="text-[14px] font-semibold leading-tight">
              Add a location
            </h2>
            <p className="mt-1 text-[11px] opacity-90">
              Choose how you want to set your location
            </p>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 text-white hover:text-gray-300 focus:outline-none focus:ring-white rounded"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Options */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {options.map((option) => (
              <div key={option.key}>
                <button
                  className="w-full flex justify-between items-start p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0077B6]"
                  onClick={() => toggleOption(option.key)}
                  aria-expanded={activeOption === option.key}
                  aria-controls={`${option.key}-content`}
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{option.icon}</div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {option.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {activeOption === option.key ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 ml-2 mt-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-2 mt-1" />
                  )}
                </button>
                {activeOption === option.key && (
                  <div
                    id={`${option.key}-content`}
                    className="px-4 pb-4 text-gray-700 pt-4 dark:text-gray-300 text-[11px] bg-blue-50 dark:bg-blue-900/20"
                  >
                    {option.details}
                    <button
                      onClick={HandleLocationSelect}
                      className="mt-3 w-full bg-[#0077B6] hover:bg-[#005f8e] text-white text-center font-normal py-2 px-4 rounded-[4px] transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#0077B6]"
                      type="button"
                    >
                      Select {option.title}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button
              onClick={onClose}
              className="text-[#0077B6] hover:text-[#005f8e] text-[11px] font-medium"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {showTravelModal && (
        <TravelModal
          onClose={() => setShowTravelModal(false)}
          onContinue={() => setShowTravelModal(false)}
        />
      )}
      {showDrawModal && (
        <DrawOnMapModal
          onClose={() => setShowDrawModal(false)}
          onContinue={() => setShowDrawModal(false)}
        />
      )}
      {showDistanceModal && (
        <LocationModal
          onClose={() => { setShowDistanceModal(false) }}
          onContinue={() => { setShowDistanceModal(false); }}
          zip={locations[0].zip}
          milesRadius={locations[0].milesRadius}
          center={locations[0].center}
        />
      )}

      {showNationWideModal && (
        <NationWide
          onClose={() => setShowNationWideModal(false)}
          onContinue={() => setShowNationWideModal(false)}
        />
      )}
    </>
  );
}