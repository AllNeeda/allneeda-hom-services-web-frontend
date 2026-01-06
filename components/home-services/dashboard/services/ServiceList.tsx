"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiAlertCircle, FiChevronDown, FiDollarSign, FiMapPin,
  FiLoader,
  FiEdit, FiSettings
} from 'react-icons/fi';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { TriangleAlert, Sparkles, ArrowRight, Target, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import GlobalLoader from '@/components/ui/global-loader';
import { useDeleteService, useUpdateServiceStatus } from '@/hooks/useServices';
import { getAccessToken } from '@/app/api/axios';

interface Location {
  _id: string;
  country?: string;
  city?: string;
  state?: string;
  address_line?: string;
  type: string;
  professional_id: string;
  service_id: string;
}

interface ServiceQuestion {
  _id: string;
  service_id: string;
  question_name: string;
  form_type: string;
  options: any[];
}

interface Service {
  _id: string;
  service_id: string;
  service_name: string;
  description?: string;
  service_status: boolean;
  completed_tasks: number;
  totalLeads: number;
  pricing_type: string;
  location_ids: Location[];
  question_ids: ServiceQuestion[];
  professional_id: string;
  createdAt: string;
  updatedAt: string;
  maximum_price?: number;
  minimum_price?: number;
}

interface TransformedService {
  id: string;
  name: string;
  active: boolean;
  completed: boolean;
  description: string,
  performance: {
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
  pricing_type: string;
  setupProgress: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
  };
  missingSteps: string[];
  originalData: Service;
}

interface ServicesListProps {
  data: any;
}

const ServicesList = ({ data }: ServicesListProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getAccessToken() || "";
  const [open, setOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [loadingServiceId, setLoadingServiceId] = useState<string | null>(null);
  const { mutate: updateStatus } = useUpdateServiceStatus();
  const { mutate: deleteService } = useDeleteService();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transformedServices, setTransformedServices] = useState<TransformedService[]>([]);

  // Format pricing type to be professional with capital first letter
  const formatPricingType = (pricingType: string) => {
    if (!pricingType) return "";
    return pricingType.charAt(0).toUpperCase() + pricingType.slice(1).toLowerCase();
  };

  // Generate mock performance data
  const generatePerformanceData = () => {
    const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    const change = randomTrend === 'up' ? Math.random() * 30 + 5 :
      randomTrend === 'down' ? -(Math.random() * 20 + 5) : 0;

    return {
      trend: randomTrend,
      change: Math.round(change)
    };
  };

  // Get the next incomplete step for smart navigation
  const getNextIncompleteStep = (service: TransformedService): string => {
    if (!service.setupProgress.step1) return 'service_name';
    if (!service.setupProgress.step2) return 'pricing';
    if (!service.setupProgress.step3) return 'questions';
    if (!service.setupProgress.step4) return 'locations';
    return 'service_name'; // fallback
  };

  const navigateToStep = (step: string, service: TransformedService) => {
    // Set the current service data in cache before navigation
    queryClient.setQueryData(["currentService"], {
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    });

    const params = new URLSearchParams({
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    }).toString();

    // Navigate to the step
    switch (step) {
      case 'service_name':
        router.push(`/home-services/dashboard/services/addServices?${params}`);
        break;
      case 'pricing':
        router.push(`/home-services/dashboard/services/pricing?${params}`);
        break;
      case 'addypricing':
        router.push(`/home-services/dashboard/services/addpricing?${params}`);
        break;
      case 'questions':
        router.push(`/home-services/dashboard/services/questions?${params}`);
        break;
      case 'locations':
        router.push(`/home-services/dashboard/services/serviceLocation?${params}`);
        break;
      default:
        router.push(`/home-services/dashboard/services/addServices?${params}`);
    }
  };

  const handleEdit = (service: TransformedService) => {
    const currentServiceData = {
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    };
    queryClient.setQueryData(["currentService"], currentServiceData);
    const params = new URLSearchParams({
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    }).toString();
    router.push(`/home-services/dashboard/services/edit?${params}`);
  };

  const handleEditLocation = (service: TransformedService) => {
    const currentServiceData = {
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    };
    const params = new URLSearchParams({
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    }).toString();
    queryClient.setQueryData(["currentService"], currentServiceData);
    router.push(`/home-services/dashboard/services/locations?${params}`);
  };

  const questionsDetails = (service: TransformedService) => {
    const currentServiceData = {
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    };
    const params = new URLSearchParams({
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
    }).toString();
    queryClient.setQueryData(["currentService"], currentServiceData);

    router.push(`/home-services/dashboard/services/questionsDetails?${params}`);
  };

  // Navigate to the next incomplete step
  const navigateToNextStep = (service: TransformedService) => {
    const nextStep = getNextIncompleteStep(service);
    navigateToStep(nextStep, service);
  };

  useEffect(() => {
    if (data?.services?.services) {
      const transformed = data.services.services.map((service: Service): TransformedService => {
        const step1 = !!service.service_name;
        const step2 = !!(typeof service.minimum_price === 'number' && service.minimum_price > 0);
        const step3 = !!(service.question_ids && service.question_ids.length > 0);
        const step4 = !!(service.location_ids && service.location_ids.length > 0);

        const isCompleted = step1 && step2 && step3 && step4;

        const missingSteps = [];
        if (!step1) missingSteps.push('service_name');
        if (!step2) missingSteps.push('pricing');
        if (!step3) missingSteps.push('questions');
        if (!step4) missingSteps.push('locations');

        return {
          id: service._id,
          name: service.service_name,
          description: service.description || '',
          active: service.service_status,
          completed: isCompleted,
          performance: generatePerformanceData(),
          pricing_type: formatPricingType(service.pricing_type),
          setupProgress: {
            step1,
            step2,
            step3,
            step4
          },
          missingSteps,
          originalData: service
        };
      });
      setTransformedServices(transformed);
    }
  }, [data]);

  const toggleService = async (id: string) => {
    const service = transformedServices.find((s) => s.id === id);
    if (!service || !service.completed) return;

    setLoadingServiceId(id);

    try {
      updateStatus({
        service_id: service.originalData.service_id,
        professional_id: service.originalData.professional_id,
        service_status: !service.active,
        token: token
      });

      setTransformedServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id
            ? {
              ...service,
              active: !service.active,
            }
            : service
        )
      );
    } finally {
      setLoadingServiceId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prevId => prevId === id ? null : id);
  };

  const calculateCompletion = (service: TransformedService) => {
    if (service.completed) return 100;
    if (!service.setupProgress) return 0;

    const totalSteps = Object.keys(service.setupProgress).length;
    const completedSteps = Object.values(service.setupProgress).filter(Boolean).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const handleRemoveService = (serviceId: string) => {
    const service = transformedServices.find(s => s.id === serviceId);
    if (!service) return;

    deleteService({
      service_id: service.originalData.service_id,
      professional_id: service.originalData.professional_id,
      token: token
    });

    setTransformedServices(prev => prev.filter(service => service.id !== serviceId));
    setOpen(false);
    setServiceToDelete(null);
  };

  const openDeleteDialog = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setOpen(true);
  };

  if (!data) {
    return <GlobalLoader />;
  }

  return (
    <div className="w-full">
      <main className="w-full max-w-7xl mx-auto">
        <div className="space-y-4">
          {transformedServices.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-sm border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-[#0077B6]/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-[#0077B6]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No services yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">
                Start by adding your first service to begin receiving leads and growing your business.
              </p>
              <button
                onClick={() => router.push('/home-services/dashboard/services/addServices')}
                className="inline-flex items-center px-5 py-2.5 bg-[#0077B6] text-white rounded-sm hover:bg-[#0066A3] transition-all text-sm font-medium shadow-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add Your First Service
              </button>
            </div>
          ) : (
            transformedServices.map((service) => {
              const isLoading = loadingServiceId === service.id;
              const completion = calculateCompletion(service);
              const isInactive = !service.active || !service.completed;
              const showWarning = !service.completed;

              return (
                <motion.div
                  key={service.id}
                  layout
                  className={`group relative overflow-hidden rounded-sm transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#0077B6]/20 dark:hover:border-[#0077B6]/30 ${showWarning ? 'ring-1 ring-gray-100 dark:ring-gray-100' : ''
                    }`}
                >
                  {/* Service Header */}
                  <div
                    className={`cursor-pointer transition-colors ${showWarning
                        ? 'hover:bg-[#6742EE]/5 dark:hover:bg-[#6742EE]/10'
                        : isInactive
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    onClick={() => toggleExpand(service.id)}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 min-w-0">
                              <h2 className={`font-semibold truncate text-[13px] ${showWarning
                                  ? 'text-gray-900 dark:text-gray-300'
                                  : isInactive
                                    ? 'text-gray-600 dark:text-gray-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                {service.name}
                              </h2>
                              {/* Pricing Type Badge */}
                              {service.completed && service.active && service.pricing_type && (
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium bg-[#0077B6]/10 text-[#0077B6] dark:bg-[#0077B6]/20 dark:text-[#0077B6]">
                                  {service.pricing_type}
                                </div>
                              )}
                            </div>

                            {/* Status Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {showWarning && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium bg-[#6742EE]/10 text-[#6742EE] dark:bg-[#6742EE]/20 dark:text-[#6742EE]">
                                  <FiAlertCircle className="w-3 h-3 mr-1" />
                                  {completion}% Complete
                                </span>
                              )}

                              {!showWarning && !service.completed && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                  {completion}% Complete
                                </span>
                              )}

                              {service.active ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium bg-[#0077B6]/10 text-[#0077B6] dark:bg-[#0077B6]/20 dark:text-[#0077B6]">
                                  Active
                                </span>
                              ) : service.completed ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                  Paused
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                  Incomplete
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Toggle Switch */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(service.id);
                            }}
                            disabled={!service.completed || isLoading}
                            className={`relative inline-flex h-6 w-11 rounded-sm transition-colors ${service.active ? 'bg-[#0077B6]' : 'bg-gray-300 dark:bg-gray-600'
                              } ${!service.completed || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
                              }`}
                          >
                            {isLoading ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <FiLoader className="w-3 h-3 text-white animate-spin" />
                              </div>
                            ) : (
                              <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-sm transform transition-transform ${service.active ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                              />
                            )}
                          </button>

                          {/* Expand Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(service.id);
                            }}
                            className={`p-2 rounded-sm transition-colors ${showWarning
                                ? 'text-[#6742EE] hover:bg-[#6742EE]/10'
                                : isInactive
                                  ? 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                          >
                            <FiChevronDown
                              className={`transition-transform duration-300 ${expandedId === service.id ? 'rotate-180' : ''
                                }`}
                              size={16}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar - Only show for incomplete services */}
                      {!service.completed && service.setupProgress && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className={`font-medium ${showWarning
                                ? 'text-[#6742EE] dark:text-[#6742EE]'
                                : 'text-gray-600 dark:text-gray-400'
                              }`}>
                              Setup Progress: {completion}%
                            </span>
                            <span className={`${showWarning
                                ? 'text-[#6742EE]/80 dark:text-[#6742EE]/60'
                                : 'text-gray-500 dark:text-gray-400'
                              }`}>
                              {Object.values(service.setupProgress).filter(Boolean).length}/
                              {Object.keys(service.setupProgress).length} steps
                            </span>
                          </div>
                          <div className="w-full rounded-sm h-1.5 bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-1.5 rounded-sm bg-[#0077B6] transition-all duration-300"
                              style={{
                                width: `${completion}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Expanded Content - Single Column Layout */}
                  <AnimatePresence>
                    {expandedId === service.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30"
                      >
                        <div className="p-5 space-y-4">
                          {/* Special Case: Max price = 0 with questions and locations */}
                          {service.originalData.maximum_price === 0 &&
                            service.originalData.question_ids?.length > 0 &&
                            service.originalData.location_ids?.length > 0 && (
                              <div className="rounded-sm p-4  border border-[#6742EE]/20 dark:border-[#6742EE]/10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-[#6742EE]" />
                                      Complete Service Price
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">
                                      Finish setting up your service to start receiving leads
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => navigateToStep('addypricing', service)}
                                    className="inline-flex items-center px-4 py-2 bg-[#0077B6] text-white rounded-sm hover:bg-[#0066A3] transition-colors text-sm "
                                  >
                                    Set Service Pricing
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </button>
                                </div>
                              </div>
                            )}

                          {/* Show "Complete Service Setup" only when:
                            1. Service is incomplete
                            2. AND NOT in the specific case above */}
                          {!service.completed &&
                            !(service.originalData.maximum_price === 0 &&
                              service.originalData.question_ids?.length > 0 &&
                              service.originalData.location_ids?.length > 0) && (
                              <div className={`rounded-sm p-4 ${showWarning
                                  ? ' border border-[#6742EE]/20 dark:border-[#6742EE]/10'
                                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
                                }`}>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-[#0077B6]" />
                                      Complete Service Setup
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">
                                      Finish setting up your service to start receiving leads
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => navigateToNextStep(service)}
                                    className="inline-flex items-center px-4 py-2 bg-[#0077B6] text-white rounded-sm hover:bg-[#0066A3] transition-colors text-sm font-medium "
                                  >
                                    Complete Setup
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </button>
                                </div>
                              </div>
                            )}

                          {/* Service Configuration */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                              <FiSettings className="w-4 h-4 text-[#0077B6]" />
                              Service Configuration
                            </h3>

                            <div className="space-y-3">
                              {/* Pricing Section */}
                              {service.setupProgress.step2 && (
                                <div className={`flex items-center justify-between p-3 rounded-sm border ${isInactive
                                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600'
                                  }`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${isInactive ? 'bg-gray-100 dark:bg-gray-700' : 'bg-[#0077B6]/10 dark:bg-[#0077B6]/20'
                                      }`}>
                                      <FiDollarSign className={`w-4 h-4 ${isInactive ? 'text-gray-400' : 'text-[#0077B6] dark:text-[#0077B6]'
                                        }`} />
                                    </div>
                                    <div>
                                      <p className={`font-medium text-sm ${isInactive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                                        }`}>
                                        Pricing
                                      </p>
                                      <p className={`text-xs ${isInactive ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                                        }`}>
                                        {service.originalData.minimum_price && `From $${service.originalData.minimum_price}`}
                                        {service.originalData.minimum_price && service.originalData.maximum_price && ' '}
                                        {service.originalData.maximum_price && ` - $${service.originalData.maximum_price}`}
                                      </p>
                                    </div>
                                  </div>
                                  {!isInactive && (
                                    <button
                                      onClick={() => handleEdit(service)}
                                      className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm text-[#0077B6] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium"
                                    >
                                      <FiEdit className="w-3 h-3 mr-1" />
                                      Edit
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Locations Section */}
                              {service.setupProgress.step4 && (
                                <div className={`flex items-center justify-between p-3 rounded-sm border ${isInactive
                                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600'
                                  }`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${isInactive ? 'bg-gray-100 dark:bg-gray-700' : 'bg-[#BE13BF]/10 dark:bg-[#BE13BF]/20'
                                      }`}>
                                      <FiMapPin className={`w-4 h-4 ${isInactive ? 'text-gray-400' : 'text-[#BE13BF] dark:text-[#BE13BF]'
                                        }`} />
                                    </div>
                                    <div>
                                      <p className={`font-medium text-sm ${isInactive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                                        }`}>
                                        Service Areas
                                      </p>
                                      <p className={`text-xs ${isInactive ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                                        }`}>
                                        {service.originalData.location_ids?.length || 0} Service Area
                                      </p>
                                    </div>
                                  </div>
                                  {!isInactive && (
                                    <button
                                      onClick={() => handleEditLocation(service)}
                                      className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm text-[#0077B6] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium"
                                    >
                                      <FiEdit className="w-3 h-3 mr-1" />
                                      Manage
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Questions Section */}
                              {service.setupProgress.step3 && (
                                <div className={`flex items-center justify-between p-3 rounded-sm border ${isInactive
                                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600'
                                  }`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${isInactive ? 'bg-gray-100 dark:bg-gray-700' : 'bg-[#6742EE]/10 dark:bg-[#6742EE]/20'
                                      }`}>
                                      <FiSettings className={`w-4 h-4 ${isInactive ? 'text-gray-400' : 'text-[#6742EE] dark:text-[#6742EE]'
                                        }`} />
                                    </div>
                                    <div>
                                      <p className={`font-medium text-sm ${isInactive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                                        }`}>
                                        Service Questions
                                      </p>
                                      <p className={`text-xs ${isInactive ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                                        }`}>
                                        {service.originalData.question_ids?.length || 0} questions configured
                                      </p>
                                    </div>
                                  </div>
                                  {!isInactive && (
                                    <button
                                      onClick={() => questionsDetails(service)}
                                      className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm text-[#0077B6] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium"
                                    >
                                      <FiEdit className="w-3 h-3 mr-1" />
                                      Configure
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                            {service.completed && service.active && (
                              <button
                                onClick={() => router.push('#service-insights')}
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-[#0077B6] text-white rounded-sm hover:bg-[#0066A3] transition-colors text-sm font-medium shadow-sm"
                              >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                View Detailed Insights
                              </button>
                            )}

                            <button
                              onClick={() => openDeleteDialog(service.id)}
                              className="inline-flex items-center justify-center px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                              Remove Service
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={open} onClose={setOpen} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-sm bg-white dark:bg-gray-900 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 border border-gray-200 dark:border-gray-700"
              >
                <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-sm bg-[#0077B6]/10 dark:bg-[#0077B6]/20">
                      <TriangleAlert aria-hidden="true" className="size-6 text-[#0077B6] dark:text-[#0077B6]" />
                    </div>
                    <div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="font-semibold text-gray-900 dark:text-white text-sm">
                        Delete Service
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Are you sure you want to delete {serviceToDelete && transformedServices.find(s => s.id === serviceToDelete)?.name}?
                          This action cannot be undone and all service data will be permanently removed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-5 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => serviceToDelete && handleRemoveService(serviceToDelete)}
                    className="inline-flex w-full justify-center rounded-sm bg-[#0077B6] px-4 py-2.5 font-semibold text-white shadow-xs hover:bg-[#0066A3] transition-colors sm:ml-3 sm:w-auto text-sm"
                  >
                    Delete Service
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-sm bg-white dark:bg-gray-700 px-4 py-2.5 font-semibold text-gray-900 dark:text-white shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors sm:mt-0 sm:w-auto text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
};

export default ServicesList;