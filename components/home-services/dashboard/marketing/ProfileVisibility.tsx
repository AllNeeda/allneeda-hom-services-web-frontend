// src/components/marketing-hub/ProfileVisibility.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EyeIcon,
  EyeOffIcon,
  XIcon,
  SettingsIcon,
  MonitorIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  TrendingUpIcon
} from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import {
  useUpdateAllVisibilitySettings,
  useVisibilityWithOptimisticUpdate
} from "@/hooks/useMarketing";
import { useGetServices } from "@/hooks/useServices";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import ProfilePreview from "./ProfilePreview";
import GlobalLoader from "@/components/ui/global-loader";

interface VisibilitySettings {
  total_hire: boolean;
  last_hire: boolean;
  expected_response_time: boolean;
  last_seen: boolean;
}

const ProfileVisibility: React.FC = () => {
  const token = getAccessToken();
  const { data: profileData, isLoading, error, refetch } = useGetServices(token!);
  const { mutate: updateAllSettings, isPending: isUpdatingAll } = useUpdateAllVisibilitySettings();
  const { mutate: updateWithOptimistic, isPending: isUpdatingSingle } = useVisibilityWithOptimisticUpdate();
  const [activeTab, setActiveTab] = useState("settings");
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    total_hire: true,
    last_hire: false,
  expected_response_time: true,
    last_seen: true,
  });
  const [recentChanges, setRecentChanges] = useState<string[]>([]);

  useEffect(() => {
    if (profileData) {
      const apiSettings = profileData.services.professional.visibility_settings ||
        profileData.services.professional.visibility ||
        profileData.services.professional.settings?.visibility ||
        profileData.services.professional;
      setVisibilitySettings({
        total_hire: apiSettings.total_hire ?? true,
        last_hire: apiSettings.last_hire ?? false,
        expected_response_time: apiSettings.expected_response_time ?? true,
        last_seen: apiSettings.last_seen ?? true,
      });
    }
  }, [profileData]);

  const handleToggle = (settingType: keyof VisibilitySettings) => {
    if (!token) return;
    const newValue = !visibilitySettings[settingType];
    const settingName = getSettingLabel(settingType);
    
    setVisibilitySettings(prev => ({
      ...prev,
      [settingType]: newValue
    }));

    // Track recent change
    setRecentChanges(prev => [
      `${settingName} ${newValue ? 'enabled' : 'disabled'}`,
      ...prev.slice(0, 2)
    ]);

    updateWithOptimistic(
      {
        setting_type: settingType,
        value: newValue,
        token: token
      },
      {
        onSuccess: () => {
          toast.success(`${settingName} ${newValue ? 'enabled' : 'disabled'}`);
          refetch();
        },
      }
    );
  };

  const getSettingLabel = (key: keyof VisibilitySettings): string => {
    const labels = {
      total_hire: "Total hires",
      last_hire: "Last hire date",
  expected_response_time: "Expected response time",
      last_seen: "Last seen"
    };
    return labels[key];
  };

  const applyToAll = (value: boolean) => {
    if (!token) return;
    const updatedSettings: VisibilitySettings = {
      total_hire: value,
      last_hire: value,
      expected_response_time: value,
      last_seen: value,
    };
    setVisibilitySettings(updatedSettings);
    
    // Track bulk change
    setRecentChanges(prev => [
      `All settings ${value ? 'enabled' : 'disabled'}`,
      ...prev.slice(0, 2)
    ]);

    updateAllSettings(
      {
        settings: updatedSettings,
        token: token
      },
      {
        onSuccess: () => {
          toast.success(`All settings ${value ? 'enabled' : 'disabled'}`);
          refetch();
        },
      }
    );
  };
  const settingConfigs: Record<keyof VisibilitySettings, {
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = {
    total_hire: {
      label: "Total Hires",
      description: "Show your total number of completed projects",
      icon: <TrendingUpIcon className="h-4 w-4" />
    },
    last_hire: {
      label: "Recent Hire",
      description: "Display your most recent customer engagement",
      icon: <CalendarIcon className="h-4 w-4" />
    },
    last_seen: {
      label: "Online Status",
      description: "Show when you were last active",
      icon: <ClockIcon className="h-4 w-4" />
    },
    expected_response_time: {
      label: "Expected Response Time",
      description: "Show how quickly you typically respond to inquiries",
      icon: <UsersIcon className="h-4 w-4" />
    }
  };

  const isPending = isUpdatingAll || isUpdatingSingle;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border rounded-sm bg-white dark:bg-gray-900">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <XIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load settings
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">
            We could not load your visibility settings. Please check your connection and try again.
          </p>
          <Button
            variant="default"
            onClick={() => refetch()}
            style={{ backgroundColor: '#0077B6' }}
            className="hover:opacity-90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with Visibility Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Visibility
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Customize the visibility of your profile metrics and activity data
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {isPending && <GlobalLoader />}
        </div>
      </div>

      {/* Recent Changes */}
      {recentChanges.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-[#0077B6] rounded-sm p-3">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" style={{ color: '#40A4FF' }} />
            <span className="font-medium text-sm" style={{ color: '#0077B6' }}>Recent changes:</span>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {recentChanges.join(", ")}
            </span>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger
            value="settings"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-sm"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-sm"
          >
            <MonitorIcon className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6 mt-6">
          {/* Quick Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4  dark:bg-gray-900 rounded-sm border dark:border-[#0077B6]">
            <div>
              <h3 className="font-normal text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Apply settings to all sections
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => applyToAll(true)}
                className="text-white"
                disabled={isPending}
                size="sm"
                style={{ backgroundColor: '#0077B6' }}
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Show All
              </Button>
              <Button
                variant="outline"
                onClick={() => applyToAll(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                disabled={isPending}
                size="sm"
              >
                <EyeOffIcon className="w-4 h-4 mr-2" />
                Hide All
              </Button>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(visibilitySettings).map(([key, value]) => {
              const settingKey = key as keyof VisibilitySettings;
              const config = settingConfigs[settingKey];
              
              return (
                <div
                  key={key}
                  className={`p-4 border rounded-sm transition-all hover:shadow-md ${
                    value
                      ? 'border-blue-200 dark:border-[#0077B6] bg-blue-50 dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-sm ${
                        value 
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      style={value ? { color: '#0077B6' } : { color: '#6B7280' }}>
                        {config.icon}
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label
                          htmlFor={key}
                          className="font-medium text-gray-900 dark:text-white cursor-pointer text-sm"
                        >
                          {config.label}
                        </Label>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={() => handleToggle(settingKey)}
                      className="ml-2"
                      disabled={isPending}
                    />
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className={`${value ? 'text-[#0077B6] dark:text-[#0077B6]' : 'text-gray-500'} text-sm`}>
                      {value ? 'Visible to customers' : 'Hidden from customers'}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              value ? 'bg-[#0077B6]' : 'bg-gray-400'
                            }`} />
                            <span className="text-gray-500 text-sm">
                              {value ? 'On' : 'Off'}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">{value ? 'customers can see this' : 'Only you can see this'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <ProfilePreview
            visibilitySettings={visibilitySettings}
            isPending={isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileVisibility;