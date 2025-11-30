'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@radix-ui/react-switch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LeadLocation from './LeadAddLocation';
import { useState } from 'react';
import { FiChevronRight, FiPlus, FiMapPin, FiX, FiEdit } from 'react-icons/fi';
import LocationModal from './LocationModal';

const LeadSettings = () => {
  const router = useRouter();
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);

  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Home Insulation',
      leads: 'All leads',
      locations: 1,
      expanded: false
    },
    {
      id: 2,
      name: 'Basement Finishing or Remodeling',
      leads: 'All leads',
      locations: 1,
      expanded: false
    }
  ]);

  const [locations, setLocations] = useState([
    {
      id: 1,
      address: '150 miles of LL21 9RG',
      zip: 'LL21 9RG',
      milesRadius: 150,
      selected: false,
      servicesCount: 2,
      center: { lat: 53.02252, lng: -3.45073 }
    }
  ]);

  const HandleLead = () => {
    router.push('/home-services/dashboard/leads/leadLocation');
  };

  const [onlineLeadsEnabled, setOnlineLeadsEnabled] = useState(false);

  const toggleServiceExpand = (index: number) => {
    const updated = [...services];
    updated[index].expanded = !updated[index].expanded;
    setServices(updated);
  };

  const toggleLocationSelect = (id: number) => {
    const updated = locations.map(loc =>
      loc.id === id ? { ...loc, selected: !loc.selected } : loc
    );
    setLocations(updated);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 text-sm text-gray-800 dark:text-gray-200 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-6">Lead settings</h1>

      {/* Services */}
      <section className="mb-10">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Leads you can choose to contact
        </h2>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your services</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Fine tune the leads you want to be alerted about.
          </p>

          <div className="space-y-2">
            {services.map((service, index) => (
              <Link href={`/home-services/dashboard/leads/leadSetting/${service.id}`} key={index}>
                <div
                  onClick={() => toggleServiceExpand(index)}
                  className="group flex justify-between items-center p-4 border rounded-md cursor-pointer mt-2
                  border-gray-200 dark:border-gray-700 hover:border-[#0077B6] transition flex-wrap sm:flex-nowrap gap-2"
                >
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{service.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {service.leads}  -  {service.locations} location
                    </p>
                  </div>
                  <FiChevronRight className="text-gray-400 group-hover:text-[#0077B6] flex-shrink-0" />
                </div>
              </Link>
            ))}

            <Link
              href="/home-services/dashboard/services/addServices"
              className="flex items-center text-sm text-[#0077B6] hover:text-[#005f8f] mt-2"
            >
              <FiPlus className="mr-1" size={14} />
              Add a service
            </Link>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="mb-10">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your locations</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose where you want to find new customers.
        </p>

        <div className="space-y-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className="flex flex-col sm:flex-row sm:items-start p-2 border border-gray-200 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-800 relative gap-3"
            >
              <input
                type="checkbox"
                checked={location.selected}
                onChange={() => toggleLocationSelect(location.id)}
                className="mt-1 h-4 w-4 text-[#0077B6] rounded border-gray-300 dark:border-gray-600 focus:ring-[#0077B6]"
              />
              <div className="flex-1">
                <label className="block text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {location.address}
                </label>

                <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 dark:text-gray-400 gap-3">
                  <Link
                    href="/home-services/dashboard/leads/leadLocation"
                    className="flex items-center text-[#0077B6] hover:text-[#005f8f]"
                  >
                    <FiMapPin className="mr-1" size={12} /> View on map
                  </Link>

                  <button className="flex items-center hover:underline">
                    <FiX className="mr-1" size={12} /> Remove
                  </button>

                  <span>{location.servicesCount} services</span>
                </div>
              </div>

              <button
                onClick={() => { setLocationModal(true) }}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#0077B6]"
              >
                <FiEdit size={16} />
              </button>

              {locationModal && (
                <LocationModal
                  onClose={() => { setLocationModal(false); router.back() }}
                  onContinue={() => { setLocationModal(false); router.back(); }}
                  zip={locations[0].zip}
                  milesRadius={locations[0].milesRadius}
                  center={locations[0].center}
                />
              )}
            </div>
          ))}

          <span
            onClick={() => setShowAddLocationModal(true)}
            className="flex items-center cursor-pointer text-sm text-[#0077B6] hover:text-[#005f8f] mt-2"
          >
            <FiPlus className="mr-1" size={14} />
            {showAddLocationModal && (
              <LeadLocation onClose={() => setShowAddLocationModal(false)} />
            )}
            Add a location
          </span>
        </div>
      </section>

      {/* Online/Remote Leads */}
      <section className="mb-10">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Online/remote leads</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Customers tell us if they are happy to receive services online or remotely.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Switch
            id="online-mode"
            checked={onlineLeadsEnabled}
            onCheckedChange={setOnlineLeadsEnabled}
            className={`w-10 h-5 rounded-full relative transition ${onlineLeadsEnabled ? 'bg-[#0077B6]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${onlineLeadsEnabled ? 'translate-x-5' : 'translate-x-1'
                }`}
            />
          </Switch>

          <Label htmlFor="online-mode" className="flex items-center space-x-2">
            <span>See online/remote leads</span>
            <span
              className={`text-xs font-semibold ${onlineLeadsEnabled ? 'text-green-600' : 'text-red-500'
                }`}
            >
              {onlineLeadsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </Label>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            onClick={HandleLead}
            className="w-full py-3 bg-[#0077B6] hover:bg-[#005f8f] text-white text-sm font-medium rounded-md transition-colors"
          >
            View leads
          </button>
        </div>
      </section>
    </div>
  );
};

export default LeadSettings;
