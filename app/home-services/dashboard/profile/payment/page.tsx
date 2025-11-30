"use client";
import CardDetails from '@/components/home-services/dashboard/profile/Card-Details'
import Funds from '@/components/home-services/dashboard/profile/Funds'

import React, { useState } from "react";

// Mock data for payment methods
const paymentMethods = [
    { id: 1, type: "Visa", last4: "4589", expiry: "12/25", isDefault: true },
    { id: 2, type: "Mastercard", last4: "7632", expiry: "08/24", isDefault: false },
];

// Mock transaction data
const transactions = [
    { id: 1, date: "2023-10-15", description: "Lead purchase - Plumbing job", amount: -12.5, status: "Completed" },
    { id: 2, date: "2023-10-12", description: "Account top-up", amount: 100.0, status: "Completed" },
    { id: 3, date: "2023-10-10", description: "Lead purchase - Electrical work", amount: -15.75, status: "Completed" },
];

const PaymentsPage = () => {
    const [activeTab, setActiveTab] = useState("activity");

    // separate modals
    const [openCard, setOpenCard] = useState(false);
    const [openFunds, setOpenFunds] = useState(false);

    const [balance] = useState(71.75);
    const [cards] = useState(paymentMethods);
    const [activity] = useState(transactions);

    const handleSaveCard = () => { };

    const Tabs = ({
        tabs,
        activeTab,
        setActiveTab,
    }: {
        tabs: string[];
        activeTab: string;
        /* eslint-disable no-unused-vars */
        setActiveTab: (tab: string) => void;
        /* eslint-enable no-unused-vars */

    }) => (
        <div className="flex w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`flex-1 text-center py-2 px-4 rounded-md text-[13px] font-normal transition-colors ${activeTab === tab.toLowerCase()
                        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Payments</h1>

                {/* Payment Methods */}
                <section className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                        <h2 className="text-lg font-semibold">Payment methods</h2>
                        <button
                            onClick={() => setOpenCard(true)}
                            className="px-4 py-2 rounded-sm transition-colors flex items-center w-full sm:w-auto justify-center"
                            style={{ backgroundColor: "#0077B6", color: "#fff" }}
                        >
                            + Add a new card
                        </button>
                        {openCard && <CardDetails open={openCard} setOpen={setOpenCard} onSave={handleSaveCard} />}
                    </div>
                    {cards.length === 0 ? (
                        <p className="text-gray-500">No card on file</p>
                    ) : (
                        <div className="space-y-4">
                            {cards.map((card) => (
                                <div
                                    key={card.id}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {card.type} ending in {card.last4}
                                        </p>
                                        <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                                    </div>
                                    {card.isDefault && (
                                        <span
                                            className="mt-2 sm:mt-0 ml-0 sm:ml-4 text-xs px-2.5 py-0.5 rounded"
                                            style={{ backgroundColor: "#0077B622", color: "#0077B6" }}
                                        >
                                            Default
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Billing Settings */}
                <section className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                        <h2 className="text-lg font-semibold">Billing settings</h2>
                        <button
                            onClick={() => setOpenFunds(true)}
                            className="px-4 py-2 rounded-sm transition-colors w-full sm:w-auto"
                            style={{ backgroundColor: "#0077B6", color: "#fff" }}
                        >
                            Add funds
                        </button>
                        <Funds open={openFunds} setOpen={setOpenFunds} />
                    </div>
                    <div
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
                        style={{ backgroundColor: "#0077B622" }}
                    >
                        <p className="text-gray-500 text-sm uppercase mb-1">Current Balance</p>
                        <p className="text-2xl font-bold mb-4">{balance.toFixed(2)} Credits</p>
                        <p className="text-gray-500 text-sm">You are being charged per lead.</p>
                    </div>
                </section>

                {/* Activity Section */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                    <Tabs tabs={["Activity", "Receipts"]} activeTab={activeTab} setActiveTab={setActiveTab} />

                    {activeTab === "activity" ? (
                        <div className="overflow-x-auto mt-6">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Description</th>
                                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {activity.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-4 py-4 text-sm sm:text-base text-gray-500">{transaction.date}</td>
                                            <td className="px-4 py-4 text-sm sm:text-base">{transaction.description}</td>
                                            <td
                                                className={`px-4 py-4 text-sm sm:text-base font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                                    }`}
                                            >
                                                {transaction.amount > 0 ? "+" : ""}
                                                {transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-2 inline-flex text-xs sm:text-sm font-semibold rounded-full bg-green-100 text-green-800">
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">No receipts available</div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default PaymentsPage;
