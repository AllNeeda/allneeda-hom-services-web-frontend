'use client';

import { Button } from "@/components/ui/button";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { professionalSchema, ProfessionalFormData } from "@/schemas/professional/professional";
import { useGetProfessionalbyUserId, useUpdateProfessionalbyUserId } from "@/hooks/useProfessional";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/context/auth-context";

const EditIntroduction = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, getAccessToken } = useAuth();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const token = getAccessToken();
  
  // 🎯 Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/home-services/dashboard/profile-settings/edit-intro');
    }
  }, [isAuthenticated, authLoading, router]);

  // 🎯 Professional data query
  const { 
    data: professional, 
    isLoading: isFetching, 
    isError: isFetchError,
    error: fetchError,
    refetch 
  } = useGetProfessionalbyUserId(token);

  // 🎯 Update mutation
  const { 
    updateProfessional, 
    isUpdating, 
    isError: isUpdateError, 
    error: updateError,
  } = useUpdateProfessionalbyUserId(token, {
    onSuccessRedirect: '/home-services/dashboard/profile-settings'
  });

  // 🎯 Form setup
  const { 
    handleSubmit, 
    control, 
    reset, 
    formState: { errors, isDirty },
    watch 
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: { 
      introduction: '' 
    },
  });

  // 🎯 Watch for form changes
  const introductionValue = watch('introduction');
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // 🎯 Reset form when professional data loads
  useEffect(() => {
    if (professional) {
      reset({ 
        introduction: professional.introduction || '' 
      });
    }
  }, [professional, reset]);

  // 🎯 Handle form submission
  const onSubmit = (formData: ProfessionalFormData) => {
    if (!professional?._id || !token) {
      toast.error("Missing professional information");
      return;
    }

    updateProfessional({
      id: professional._id,
      data: formData
    });
  };

  // 🎯 Handle cancel with confirmation
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    router.back();
  };

  // 🎯 Handle beforeunload event for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 🎯 Loading states
  if (authLoading || isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex justify-end gap-2">
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 Authentication error
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Authentication Required</h2>
          <p className="text-gray-600">Please log in to edit your introduction.</p>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // 🎯 Data fetching error
  if (isFetchError) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-red-600">Failed to Load Data</h2>
          <p className="text-gray-600">
            {fetchError?.message || 'Unable to load your professional information.'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => refetch()}
              className="bg-sky-500 hover:bg-sky-600 text-white"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 No professional data
  if (!professional) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Professional Profile Not Found</h2>
          <p className="text-gray-600">Unable to find your professional profile information.</p>
          <Button
            onClick={() => router.back()}
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Introduction</h1>
          <p className="text-sm text-gray-600 mt-1">
            Tell customers why they should choose your business
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border rounded-lg bg-white space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Why should customers hire you?</h2>
              <p className="text-sm text-gray-600">
                Explain what makes your business stand out and why you will do a great job.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="introduction"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Textarea
                      {...field}
                      placeholder="Describe your expertise, experience, and what sets you apart from competitors. This is your chance to make a great first impression!"
                      className="min-h-40 resize-y"
                      disabled={isUpdating}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        {errors.introduction && (
                          <p className="text-red-500 text-sm font-medium">
                            {errors.introduction.message}
                          </p>
                        )}
                        {isUpdateError && (
                          <p className="text-red-500 text-sm font-medium">
                            {updateError?.message || 'Failed to save introduction'}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {introductionValue?.length || 0} characters
                      </div>
                    </div>
                  </div>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || !isDirty}
                  className="bg-sky-500 hover:bg-sky-600 text-white min-w-24"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-gray-50 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-sm">Tips for a Great Introduction</h3>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Be Specific</p>
                <p>Mention your specific skills, experience, and what makes you unique.</p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Show Personality</p>
                <p>Let your passion and professionalism shine through.</p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Focus on Benefits</p>
                <p>Explain how your services will help solve customer problems.</p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Keep it Concise</p>
                <p>Aim for 2-3 paragraphs that are easy to read and engaging.</p>
              </div>
            </div>
          </div>

          {/* Character Limit Info */}
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <h4 className="font-medium text-sm text-blue-900 mb-2">Character Guidelines</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Ideal length: 150-500 characters</li>
              <li>• Minimum: 50 characters</li>
              <li>• Maximum: 2000 characters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditIntroduction;