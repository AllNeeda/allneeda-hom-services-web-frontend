'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProgressBar } from "@/components/home-services/onboarding/ProgressBar";
import { getAccessToken } from '@/app/api/axios';
import { useProfessionalReview } from '@/hooks/RegisterPro/useRegister';
import { useSendReview } from '@/hooks/useSendReview';
import GlobalLoader from '@/components/ui/global-loader';
import { safeProfessionalRedirect } from '@/lib/redirectProfessional';
import toast from 'react-hot-toast';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Reviews' },
  { id: 3, name: 'Preferences' },
  { id: 4, name: 'Location' },
  { id: 5, name: 'Payment' },
  { id: 6, name: 'Background' },
];

export default function ReviewRequest() {
  const router = useRouter();
  const params = useSearchParams();
  const serviceId = params.get('id');

  const token = getAccessToken() || "";
  const { data, isLoading, isError } = useProfessionalReview(token); // add loading state
  const sendReviewMutation = useSendReview(token);

  const [emails, setEmails] = useState(['']);
  const [sendingIndex, setSendingIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <GlobalLoader></GlobalLoader>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load professional data. Please try again.
      </div>
    );
  }

  const professional = data?.professional?.professional || {};
  const businessName = professional.business_name || 'Your Business';
  const professional_id = professional._id || '';
  const imageUrl = professional.profile_image || '';
  const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_MEDIA || 'http://localhost:4000';
  const username = professional.business_name || 'Your Business';
  const reviewLink = professional_id ? `${window.location.origin}/home-services/reviews/${professional_id}` : '';
  const handleEmailChange = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => setEmails([...emails, '']);

  const handleSendEmail = async (email: string, index: number) => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setSendingIndex(index);

    try {
      const reviewRequestLink = `${window.location.origin}/home-services/reviews/${professional_id}`;

      await sendReviewMutation.mutateAsync({
        recipientEmail: email,
        businessName,
        reviewLink: reviewRequestLink,
      });
      toast.success(`Review request sent to: ${email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send review request.');
    } finally {
      setSendingIndex(null);
    }
  };

  const handleNext = async () => {
    if (serviceId) router.back();
    else await safeProfessionalRedirect(token, router);

  };

  return (
    <div>
      {!serviceId && (
        <ProgressBar
          currentStep={2}
          totalSteps={ONBOARDING_STEPS.length}
          steps={ONBOARDING_STEPS}
          className="mb-8"
        />
      )}

      <div className="dark:bg-gray-900 text-gray-800 dark:text-white text-[13px]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 rounded-[7px] p-4 sm:p-8 md:p-10 dark:bg-gray-900">
            {/* Left Section */}
            <div>
              <h2 className="text-2xl font-bold text-[#023E8A] mb-3">
                Add recent ratings for your business
              </h2>
              <p className="text-gray-600 mb-5">
                Add reviews from customers your business had before joining. This will help you get more jobs faster.
              </p>

              {emails.map((email, index) => (
                <div key={index} className="flex flex-col sm:flex-row mb-2 gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-500 text-sm"
                    placeholder="Enter customer email address"
                  />
                  <button
                    onClick={() => handleSendEmail(email, index)}
                    className="bg-[#0077B6] hover:bg-[#005f8e] text-white px-4 py-2 rounded-[4px] text-sm transition flex items-center justify-center disabled:opacity-70"
                    disabled={sendingIndex === index}
                  >
                    {sendingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                  </button>
                </div>
              ))}

              <button
                onClick={addEmailField}
                className="text-[#0096C7] hover:underline text-sm mb-6 mt-2 flex items-center"
              >
                + Add another email address
              </button>

              {professional_id && (
                <div className="mt-6 flex flex-col items-center w-full">

                  <div className="flex flex-col sm:flex-row w-full max-w-md gap-2">
                    <input
                      type="text"
                      readOnly
                      value={reviewLink}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-500 text-sm cursor-pointer text-gray-700 dark:text-white"
                      placeholder="Copy your review link"
                    />
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(reviewLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        } catch {
                          toast.error('Failed to copy link.');
                        }
                      }}
                      className="bg-[#0077B6] hover:bg-[#005f8e] text-white px-4 py-2 rounded-[4px] text-sm transition flex items-center justify-center disabled:opacity-70"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Share this link with your clients to request reviews directly.
                  </p>
                </div>
              )}

            </div>

            {/* Right Section - Email Preview */}
            <div className="space-y-6 font-[Segoe UI,Arial,Helvetica,sans-serif]">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[4px] border text-center">
                <FaRegStar className="text-[#0096C7] w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Build Trust</h3>
                <p className="text-gray-600">More verified reviews help you earn more jobs.</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-[8px] px-6 py-6 flex flex-col items-center text-center shadow-md">
                <div className="w-full py-2 bg-gradient-to-r from-[#0077B6] to-[#005f8e] text-white text-center rounded-t-[4px] mb-3">
                  <h2 className="text-lg font-medium">{businessName}</h2>
                </div>

                <p className="text-xs text-gray-500 mb-2">Email Preview</p>
                {imageUrl ? (
                  <Image
                    src={`${Backend_URL}/uploads/professionals/${imageUrl}`}
                    alt="Business Logo"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-1 border-[#0077B6] mb-3 shadow"
                  />
                ) : (
                  <Loader2 className="w-20 h-20 text-gray-400 border-2 border-[#0077B6] rounded-full mb-3 p-4 bg-gray-100" />
                )}

                <p className="text-[12px] text-[#475569] mb-2 mt-2">
                  Thank you for being a valued client...
                </p>
                <p className="text-[12px] text-[#475569] mb-3">
                  Please take a moment to write a brief review about your experience.
                </p>

                <div className="flex justify-center text-[#facc15] text-2xl mb-3">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="mr-1" />)}
                </div>

                <Link
                  href={reviewLink}
                  target="_blank"
                  className="inline-block bg-[#0077B6] text-white px-6 py-2 rounded-[6px] text-[13px] shadow hover:bg-[#005f8e] transition"
                >
                  Submit Review
                </Link>

                <p className="text-xs text-[#94a3b8] mt-3">
                  Requested by: <strong>{username}</strong>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="text-white py-2 px-6 rounded-[4px] bg-[#0077B6] hover:bg-[#005f8e] transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
