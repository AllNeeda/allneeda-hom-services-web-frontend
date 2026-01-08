import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Clock,
  Save,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetResponseTimeSettings, useUpdateResponseTime } from '@/hooks/useMarketing';
import { getAccessToken } from '@/app/api/axios';
import GlobalLoader from '@/components/ui/global-loader';
import toast from 'react-hot-toast';

interface LocalSettings {
  average_response_time: number;
  response_time_unit: 'minutes' | 'hours' | 'days';
  last_updated?: string;
}

interface ResponseTimeSettingsProps {
  token?: string | null;
  professional_id?: string | null;
}

const ResponseTimeSettings: React.FC<ResponseTimeSettingsProps> = ({
  professional_id: propProfessionalId
}) => {
  const token = getAccessToken() || "";
  const professionalId = propProfessionalId ?? '';

  const { data, isLoading, error, refetch } = useGetResponseTimeSettings(professionalId, token!);
  const { mutate: updateResponseTime, isPending: isUpdating } = useUpdateResponseTime();

  const [settings, setSettings] = useState<LocalSettings>({
    average_response_time: 2,
    response_time_unit: 'hours',
  });

  const [originalSettings, setOriginalSettings] = useState<LocalSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Parse response time from API
  useEffect(() => {
    if (data && !originalSettings) {
      const api = (data as any).data ?? data;
      const responseString = api.expected_response_time ?? api.response_time;

      let parsedSettings: LocalSettings = {
        average_response_time: 2,
        response_time_unit: 'hours',
      };

      if (responseString) {
        try {
          const timeString = String(responseString).toLowerCase();
          const match = timeString.match(/^(\d+)\s+(minute|hour|day)s?$/);

          if (match) {
            const value = parseInt(match[1]);
            let unit: 'minutes' | 'hours' | 'days' = 'hours';

            if (timeString.includes('minute')) unit = 'minutes';
            else if (timeString.includes('hour')) unit = 'hours';
            else if (timeString.includes('day')) unit = 'days';

            parsedSettings = {
              average_response_time: value,
              response_time_unit: unit,
              last_updated: api.last_updated ?? (data as any).last_updated,
            };
          }
        } catch (error) {
          console.error('Error parsing response time:', error);
        }
      } else if (api.average_response_time && api.response_time_unit) {
        parsedSettings = {
          average_response_time: api.average_response_time,
          response_time_unit: api.response_time_unit,
          last_updated: api.last_updated ?? (data as any).last_updated,
        };
      }

      setSettings(parsedSettings);
      setOriginalSettings(parsedSettings);
    }
  }, [data, originalSettings]);

  const handleValueChange = (value: number) => {
    setSettings(prev => ({ ...prev, average_response_time: value }));
    checkForChanges({ ...settings, average_response_time: value });
  };

  const handleUnitChange = (value: 'minutes' | 'hours' | 'days') => {
    setSettings(prev => ({ ...prev, response_time_unit: value }));
    checkForChanges({ ...settings, response_time_unit: value });
  };

  const checkForChanges = (newSettings: LocalSettings) => {
    if (!originalSettings) return;

    const hasChanged =
      newSettings.average_response_time !== originalSettings.average_response_time ||
      newSettings.response_time_unit !== originalSettings.response_time_unit;

    setHasChanges(hasChanged);
  };

  const getResponseTimeLabel = () => {
    const { average_response_time, response_time_unit } = settings;
    const unit = response_time_unit === 'minutes' ? 'minute' :
      response_time_unit === 'hours' ? 'hour' : 'day';
    const plural = average_response_time !== 1 ? 's' : '';
    return `${average_response_time} ${unit}${plural}`;
  };

  const handleSaveSettings = () => {
    if (!hasChanges) {
      toast.error('No changes to save');
      return;
    }

    const payload = `${settings.average_response_time} ${settings.response_time_unit}`;

    updateResponseTime(
      {
        response_time: payload,
        professional_id: professionalId,
        token
      },
      {
        onSuccess: () => {
          setOriginalSettings(settings);
        },
      }
    );
  };

  const getMaxValue = () => {
    switch (settings.response_time_unit) {
      case 'minutes': return 180;
      case 'hours': return 72;
      case 'days': return 30;
      default: return 24;
    }
  };

  const getStep = () => {
    switch (settings.response_time_unit) {
      case 'minutes': return 5;
      case 'hours': return 1;
      case 'days': return 1;
      default: return 1;
    }
  };

  const primaryColor = '#0077B6';

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <Card className="w-full rounded-sm">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-sm bg-destructive/10 flex items-center justify-center mb-3 dark:bg-destructive/20">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="font-semibold mb-2 text-sm dark:text-gray-100">Unable to Load Settings</h3>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="mt-2 text-sm"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-sm border dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-sm flex items-center justify-center bg-blue-50 dark:bg-blue-900/30">
              <Timer className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold dark:text-gray-100">Response Time</CardTitle>
              <CardDescription className="text-xs dark:text-gray-400">
                Set your expected response time to customer
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
        {/* Current Setting Display */}
        <div className="p-3 rounded-sm border from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium dark:text-gray-300">Current Setting</span>
            </div>
            {hasChanges && (
              <span className="text-xs px-2 py-0.5 rounded-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Unsaved
              </span>
            )}
          </div>
          <p className="text-center text-xs mt-2 dark:text-gray-400">
            You respond within{' '}
            <span className="font-bold text-base" style={{ color: primaryColor }}>
              {getResponseTimeLabel()}
            </span>
          </p>
        </div>

        {/* Editing Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-xs dark:text-gray-300">
                <Clock className="h-3.5 w-3.5" />
                Adjust Response Time
              </Label>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
                {settings.average_response_time} {settings.response_time_unit}
              </span>
            </div>

            <Slider
              value={[settings.average_response_time]}
              onValueChange={(value) => handleValueChange(value[0])}
              max={getMaxValue()}
              min={1}
              step={getStep()}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-0.5">
              <span>1 {settings.response_time_unit.charAt(0)}</span>
              <span className="text-xs">Max: {getMaxValue()} {settings.response_time_unit}</span>
            </div>
          </div>

          {/* Unit Selector */}
          <div className="space-y-1">
            <Label className="text-xs dark:text-gray-300">Time Unit</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['minutes', 'hours', 'days'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => handleUnitChange(unit)}
                  className={`p-2 rounded-sm border text-xs transition-all ${settings.response_time_unit === unit
                    ? 'shadow-sm'
                    : 'hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  style={
                    settings.response_time_unit === unit
                      ? {
                        backgroundColor: primaryColor,
                        borderColor: primaryColor,
                        color: 'white'
                      }
                      : {}
                  }
                >
                  <div className="flex flex-col items-center">
                    <span>{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: hasChanges ? 1 : 0.6, y: 0 }}
            className={`pt-3 border-t dark:border-gray-800 ${!hasChanges ? 'pointer-events-none' : ''}`}
          >
            <Button
              onClick={handleSaveSettings}
              disabled={isUpdating || !hasChanges}
              className="w-full text-sm py-2 h-auto"
              size="lg"
              style={{
                backgroundColor: hasChanges ? primaryColor : '#e5e7eb',
                color: hasChanges ? 'white' : '#6b7280'
              }}
            >
              {isUpdating ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-sm animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseTimeSettings;