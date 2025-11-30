'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, X, Search, HelpCircle, Phone, Mail } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';
import { useAddNewService, useGetServicesList } from '@/hooks/useServices';
import { getAccessToken } from '@/app/api/axios';
import { cn } from '@/lib/utils';
import GlobalLoader from '@/components/ui/global-loader';
import { useProfesssionalProgress } from '@/hooks/RegisterPro/useRegister';

interface Service {
  id: string;
  name: string;
}

export default function Services() {
  const token = getAccessToken() || "";
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetServicesList(token);
  const addNewServiceMutation = useAddNewService(token);
  const { data: ProfessionalAccount } = useProfesssionalProgress(token);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (servicesData) {
      let servicesArray: any[] = [];
      if (Array.isArray(servicesData)) {
        servicesArray = servicesData;
      } else if (servicesData?.data && Array.isArray(servicesData.data)) {
        servicesArray = servicesData.data;
      } else if (servicesData?.services && Array.isArray(servicesData.services)) {
        servicesArray = servicesData.services;
      } else if (servicesData?.results && Array.isArray(servicesData.results)) {
        servicesArray = servicesData.results;
      } else if (servicesData?.items && Array.isArray(servicesData.items)) {
        servicesArray = servicesData.items;
      } else if (servicesData?.content && Array.isArray(servicesData.content)) {
        servicesArray = servicesData.content;
      } else {
        // If no array found, try to find any array in the object
        const findAnyArray = (obj: any): any[] => {
          if (Array.isArray(obj)) return obj;
          if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
              const value = obj[key];
              if (Array.isArray(value)) {
                return value;
              }
              // Also check nested objects
              if (typeof value === 'object' && value !== null) {
                const nestedArray = findAnyArray(value);
                if (nestedArray.length > 0) return nestedArray;
              }
            }
          }
          return [];
        };
        servicesArray = findAnyArray(servicesData);
      }


      // More flexible filtering - accept services with either id or _id
      const cleanServices = servicesArray
        .filter((service) => {
          if (!service) return false;

          // Check for id in different possible formats
          const hasId = (
            (service.id && service.id !== null && service.id !== undefined) ||
            (service._id && service._id !== null && service._id !== undefined) ||
            (service.service_id && service.service_id !== null && service.service_id !== undefined)
          );

          // Check for name in different possible formats
          const hasName = (
            (service.name && service.name !== null && service.name !== undefined) ||
            (service.service_name && service.service_name !== null && service.service_name !== undefined) ||
            (service.title && service.title !== null && service.title !== undefined)
          );

          return hasId && hasName;
        })
        .map((service) => {
          // Use the first available ID field
          const id = service.id || service._id || service.service_id;
          // Use the first available name field
          const name = service.name || service.service_name || service.title;

          return {
            id: id,
            name: name
          };
        });

      setServices(cleanServices);
    }
  }, [servicesData]);

  const filteredServices = searchQuery
    ? services.filter(service =>
      service?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : services;

  const toggleService = (id: string, name: string) => {
    setSelectedService(id);
    setSelectedServiceName(name);
    setIsPopoverOpen(false);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedService || !selectedServiceName) {
      return;
    }

    const professional_id = ProfessionalAccount?._id || ProfessionalAccount?.id;

    if (!professional_id) {
      return;
    }

    await addNewServiceMutation.mutateAsync({
      service_name: selectedServiceName,
      service_id: selectedService,
      professional_id: professional_id
    });
  };

  if (servicesLoading) {
    return <GlobalLoader />;
  }

  if (servicesError) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center p-8 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <X className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            Unable to Load Services
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">
            There was a problem loading the services data.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Service
        </h2>
        <p className="text-md text-gray-800 dark:text-gray-300 max-w-md mx-auto">
          Connect with customers looking for your expertise
        </p>
      </div>

      {/* Services Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            Select Your Service
          </label>
          {services.length > 0 && (
            <span className="text-sm text-gray-800 dark:text-gray-400">
              {services.length} services available
            </span>
          )}
        </div>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
                "hover:border-[#0077B6] dark:hover:border-[#90e0ef] transition-all duration-200",
                "justify-between font-normal text-gray-700 dark:text-gray-300",
                selectedService && "border-[#0077B6] dark:border-[#90e0ef]"
              )}
              disabled={services.length === 0}
            >
              <span className="truncate">
                {selectedService
                  ? services.find(s => s.id === selectedService)?.name
                  : services.length === 0
                    ? 'No services available'
                    : 'Choose a service...'
                }
              </span>
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
            </Button>
          </PopoverTrigger>

          {services.length > 0 && (
            <PopoverContent
              className="w-full p-0 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
              align="start"
            >
              <Command className="rounded-lg">
                <div className="flex items-center px-3 border-b border-gray-100 dark:border-gray-800">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <CommandInput
                    placeholder="Search services..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="border-0 focus:ring-0"
                  />
                </div>
                <CommandList className="max-h-64">
                  <CommandEmpty className="py-6 text-center text-gray-500 dark:text-gray-400">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No service found</p>
                    <p className="text-sm">Try a different search term</p>
                  </CommandEmpty>
                  {filteredServices.map((item) => (
                    <CommandItem
                      key={`service-${item.id}`}
                      value={item.name}
                      onSelect={() => toggleService(item.id, item.name)}
                      className={cn(
                        "cursor-pointer py-3 px-4 text-sm transition-colors",
                        "hover:bg-gray-50 dark:hover:bg-gray-800",
                        selectedService === item.id && "bg-[#0077B6]/10 dark:bg-[#0077B6]/20"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{item.name}</span>
                        {selectedService === item.id && (
                          <div className="w-5 h-5 rounded-full bg-[#0077B6] dark:bg-[#90e0ef] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>

        {/* Selected Service Badge */}
        <div className="min-h-[40px]">
          {selectedService && (
            <Badge
              className="bg-gradient-to-r from-[#0077B6] to-[#0096C7] text-white px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 group"
            >
              <span className="font-medium">
                {services.find(s => s.id === selectedService)?.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedService('');
                  setSelectedServiceName('');
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          )}
        </div>

        {services.length === 0 && !servicesLoading && (
          <div className="text-center p-6 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <p className="text-amber-800 dark:text-amber-300 font-medium mb-2">
              No Services Available
            </p>
            <p className="text-amber-700 dark:text-amber-400 text-sm mb-4">
              Please check your connection or contact support
            </p>
            <div className="text-xs text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 p-3 rounded">
              <p>Debug Info:</p>
              <p>Services Data: {servicesData ? 'Exists' : 'Null'}</p>
              <p>Data Type: {typeof servicesData}</p>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-[#0077B6] dark:text-[#90e0ef]" />
          <p className="font-semibold text-gray-900 dark:text-white">Need assistance?</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Phone className="h-4 w-4 text-[#0077B6] dark:text-[#90e0ef]" />
            <span>
              Call us at:{' '}
              <a
                href="tel:+12028304424"
                className="text-[#0077B6] dark:text-[#90e0ef] hover:underline font-medium transition-colors"
              >
                +1 (202) 830-4424
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Mail className="h-4 w-4 text-[#0077B6] dark:text-[#90e0ef]" />
            <span>
              Email:{' '}
              <a
                href="mailto:support@allneeda.com"
                className="text-[#0077B6] dark:text-[#90e0ef] hover:underline font-medium transition-colors"
              >
                support@allneeda.com
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={addNewServiceMutation.isPending || !selectedService || services.length === 0}
        className={cn(
          "w-full py-2.5 px-6 text-sm rounded-sm transition-all duration-300",
          "flex items-center justify-center space-x-2",
          addNewServiceMutation.isPending || !selectedService || services.length === 0
            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#0077B6] to-[#0096C7] hover:from-[#006da4] hover:to-[#0082b3] text-white shadow-sm hover:shadow-xl transform hover:-translate-y-0.5"
        )}
      >
        {addNewServiceMutation.isPending ? (
          <>
            <Loader2 className="animate-spin h-3 w-3" />
            <span>Adding Service...</span>
          </>
        ) : (
          <span>Continue to Next Step</span>
        )}
      </button>
    </form>
  );
}