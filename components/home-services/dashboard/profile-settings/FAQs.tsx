"use client";
import { getAccessToken } from "@/app/api/axios";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { useFAQ } from "@/hooks/profileSettings/useProfileSettings";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const FAQs = () => {
  const token = getAccessToken() || "";
  const { data: professionalData } = useProfesssionalProgress(token);

  const proId = useMemo(() => {
    if (!professionalData) return null;
    const id = Array.isArray(professionalData)
      ? professionalData?.[0]?._id
      : professionalData?._id;
    if (id) localStorage.setItem("proId", id);
    return id;
  }, [professionalData]);
  const { data: FAQData, isError, isLoading } = useFAQ(proId, token);
  const QuestionData = FAQData?.questions || [];
  if (isError) {
    return <ErrorDisplay />;
  }
  if (isLoading) {
    return <Loader2 />;
  }

  const EditFAQs = "edit-q-and-a";
  return (
    <div className="rounded bg-white dark:bg-gray-800 p-4 my-4">
      <div className="flex flex-row justify-between items-center my-5">
        <h1 className="font-bold text-lg">Frequently asked question</h1>
        <Link
          href={`/home-services/dashboard/profile-settings/${EditFAQs}`}
          className="text-sky-500 font-semibold"
        >
          Edit
        </Link>
      </div>
      <div className="flex flex-col">
        {QuestionData.map((q: any, index: number) => (
          <div
            key={q._id ?? q.question_id ?? `faq-${index}`}
            className="border-b border-gray-200 dark:border-gray-700 p-4"
          >
            <p className="font-bold text-md">{q.question}</p>
            <p className="text-sm">{q.answer ? q.answer : "Not Answerd"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FAQs;
