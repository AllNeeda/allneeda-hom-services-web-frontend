// src/components/marketing-hub/ProfileVisibility.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";
import {
  useUpdateAllVisibilitySettings,
  useVisibilityWithOptimisticUpdate
} from "@/hooks/useMarketing";
import { useGetServices } from "@/hooks/useServices";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
interface VisibilitySettings {
  total_hire: boolean;
  last_hire: boolean;
  last_activity: boolean;
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
    last_activity: true,
    last_seen: true,
  });

  useEffect(() => {
    if (profileData) {
      const apiSettings = profileData.services.professional.visibility_settings ||
        profileData.services.professional.visibility ||
        profileData.services.professional.settings?.visibility ||
        profileData.services.professional;
      setVisibilitySettings({
        total_hire: apiSettings.total_hire ?? true,
        last_hire: apiSettings.last_hire ?? false,
        last_activity: apiSettings.last_activity ?? true,
        last_seen: apiSettings.last_seen ?? true,
      });
    }
  }, [profileData]);
  const handleToggle = (settingType: keyof VisibilitySettings) => {
    if (!token) return;
    const newValue = !visibilitySettings[settingType];
    setVisibilitySettings(prev => ({
      ...prev,
      [settingType]: newValue
    }));
    updateWithOptimistic(
      {
        setting_type: settingType,
        value: newValue,
        token: token
      },
      {
        onSuccess: () => {
          toast.success(`Setting updated successfully`);
          refetch();
        },
      }
    );
  };

  // Apply to all settings
  const applyToAll = (value: boolean) => {
    if (!token) return;
    const updatedSettings: VisibilitySettings = {
      total_hire: value,
      last_hire: value,
      last_activity: value,
      last_seen: value,
    };
    setVisibilitySettings(updatedSettings);
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

  const settingLabels: Record<keyof VisibilitySettings, { label: string; description: string }> = {
    total_hire: {
      label: "Total Hire",
      description: "Show your total number of hires"
    },
    last_hire: {
      label: "Last Hire",
      description: "Display information about your most recent hire"
    },
    last_seen: {
      label: "Last Seen",
      description: "Show when you were last seen online"
    },
    last_activity: {
      label: "Last Activity",
      description: "Display when you were last active on the platform"
    }
  };

  const isPending = isUpdatingAll || isUpdatingSingle;

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <Card className="shadow-none border-none rounded-sm border-gray-300">
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Failed to load visibility settings</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50 overflow-hidden relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2 ">
            <EyeIcon className="w-6 h-6 text-[#0077B6]" />
            Profile Visibility
          </CardTitle>
          {isPending && (
            <span className="text-xs text-blue-500 animate-pulse">
              Updating...
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Control what information is visible to potential clients
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 bg-gray-100 dark:bg-gray-900 p-1">
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Visibility Settings
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Visibility Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="space-y-1">
                <h3 className="font-medium dark:text-white">Visibility Controls</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Customize what others see when they visit your profile
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyToAll(true)}
                  className="dark:border-gray-700 dark:text-gray-300"
                  disabled={isPending}
                >
                  Show All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyToAll(false)}
                  className="dark:border-gray-700 dark:text-gray-300"
                  disabled={isPending}
                >
                  Hide All
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {Object.entries(visibilitySettings).map(([key, value]) => {
                const settingKey = key as keyof VisibilitySettings;
                return (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-900 dark:bg-gray-900/50 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-full ${value ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        {value ? (
                          <EyeIcon className={`h-4 w-4 ${value ? 'text-[#0077B6] dark:text-blue-400' : 'text-gray-500'}`} />
                        ) : (
                          <EyeOffIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={key} className="flex items-center gap-2 dark:text-gray-300">
                          {settingLabels[settingKey]?.label}
                          <span className={`text-xs px-2 py-1 rounded-full ${value ? 'bg-blue-100 dark:bg-blue-900/30 text-[#0077B6] dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                            Status: {value ? "Visible" : "Hidden"}
                          </span>
                        </Label>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {settingLabels[settingKey]?.description}
                        </p>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={() => handleToggle(settingKey)}
                        className="dark:data-[state=checked]:bg-[#0077B6]"
                        disabled={isPending}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="space-y-1">
                  <h3 className="font-medium dark:text-white">Profile Preview</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    See how your profile appears to potential clients based on your visibility settings
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Live Preview
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileVisibility;