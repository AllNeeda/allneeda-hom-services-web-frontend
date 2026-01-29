// components/home-services/homepage/professional/ProfileTabs.tsx
import { RefObject } from "react";

interface Tab {
  id: string;
  name: string;
  ref: RefObject<HTMLDivElement | null>;
}

interface ProfileTabsProps {
  activeTab: string;
  /* eslint-disable no-unused-vars */
  scrollTo: (tabId: string) => void;
  /* eslint-enable no-unused-vars */
  tabs: Tab[];
}

export default function ProfileTabs({ activeTab, scrollTo, tabs }: ProfileTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 flex overflow-x-auto py-2 hide-scrollbar">
      <div className="flex space-x-6 min-w-max">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`pb-2 px-1 relative whitespace-nowrap ${activeTab === item.id
              ? "text-sky-500 dark:text-sky-400 font-medium"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
          >
            {item.name}
            {activeTab === item.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 dark:bg-sky-400"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}