'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

type ReviewRequestProps = {
    serverData: {
        userId: string | null;
        imageUrl: string | null;
        username: string | null;
        status?: 'success' | 'error';
        message?: string;
    };
};

export default function ReviewRequestClient({ serverData }: ReviewRequestProps) {
    const [emails, setEmails] = useState<string[]>(['']);
    const [sending, setSending] = useState(false);
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState('');

    const userId = serverData?.userId || null;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailChange = (index: number, value: string) => {
        const updated = [...emails];
        updated[index] = value;
        setEmails(updated);
    };

    const addEmailField = () => setEmails([...emails, '']);

    const removeEmailField = (index: number) => {
        if (emails.length > 1) {
            const updated = emails.filter((_, i) => i !== index);
            setEmails(updated);
        }
    };

    const handleSendAllEmails = async () => {
        if (!userId) {
            toast.message('Missing user information.');
            return;
        }

        // Filter valid emails
        const validEmails = emails.filter((email) => validateEmail(email));

        if (validEmails.length === 0) {
            toast.message('Please enter at least one valid email address.');
            return;
        }

        setSending(true);

        const reviewLink = `${origin}/ask-reviews/services/${userId}/reviews`;

        for (const email of validEmails) {
            try {
                const res = await fetch('/api/send-review-request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipientEmail: email,
                        userName: 'Company',
                        reviewLink,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    toast.success(`Review request sent to: ${email}`);
                } else {
                    toast.error(data.error || `Failed to send review request to: ${email}`);
                }
            } catch (err) {
                toast.error(`Fetch error for ${email}: ${err}`);
            }
        }

        setSending(false);
    };

    const reviewLink = userId ? `${origin}/ask-reviews/services/${userId}/reviews` : '';

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(reviewLink);
            setCopied(true);
            toast.success('Link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    return (
        <div className=" bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-[13px]">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="rounded-[7px] p-8 md:p-6 bg-white dark:bg-gray-900">
                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">
                            Add recent ratings for your business
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Add reviews from customers your business had before you joined Thumbtack.
                            This will help generate more jobs earlier on.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="space-y-3">
                                {emails.map((email, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <div className="flex-1 relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-800 dark:text-white text-sm"
                                                placeholder="Enter customer email address"
                                                disabled={sending}
                                            />
                                            {!validateEmail(email) && email && (
                                                <span className="absolute right-3 top-2 text-red-500 text-xs">Invalid</span>
                                            )}
                                        </div>
                                        {emails.length > 1 && (
                                            <button
                                                onClick={() => removeEmailField(index)}
                                                className="text-gray-500 hover:text-red-500 p-1"
                                                aria-label="Remove email"
                                                disabled={sending}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addEmailField}
                                className="text-[#0096C7] hover:underline text-sm mt-3 flex items-center"
                                disabled={sending}
                            >
                                + Add another email address
                            </button>
                        </div>



                        <div className="pt-6">
                            <button className="w-full border border-gray-300 dark:border-gray-600 py-2 rounded-[4px] flex items-center justify-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300">
                                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.256-2.696-6.735-2.696-5.526 0-10 4.474-10 10s4.474 10 10 10c8.396 0 10-7.524 10-10 0-0.669-0.043-1.355-0.129-2.016h-9.871z" />
                                </svg>
                                Add reviews from Google
                            </button>

                            {userId && (
                                <div className="mt-6 space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                        Or share this link with your customers:
                                    </p>
                                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-[4px]">
                                        <input
                                            type="text"
                                            value={reviewLink}
                                            readOnly
                                            className="flex-1 bg-transparent text-xs text-gray-600 dark:text-gray-300 px-2 py-1 truncate"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="ml-2 bg-[#0077B6] hover:bg-[#005f8e] text-white px-3 py-1 rounded-[4px] text-xs transition duration-300 flex items-center"
                                        >
                                            {copied ? (
                                                <Check className="h-3 w-3 mr-1" />
                                            ) : (
                                                <Copy className="h-3 w-3 mr-1" />
                                            )}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* The single "Send Review Request" button at the bottom */}
                        <div className="flex justify-end">
                        <button
                            onClick={handleSendAllEmails}
                            type="submit"
                            disabled={sending}
                            className={`
                            text-white text-[13px] py-2 px-6 rounded-[4px]
                            transition duration-300 flex items-center justify-center gap-2
                            ${sending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
                            `}
                        >
                            {sending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Sending...
                            </>
                            ) : (
                            'Send Review Request'
                            )}
                        </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
