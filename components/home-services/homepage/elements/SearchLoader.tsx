import { Loader2 } from "lucide-react";

export default function SearchLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin h-12 w-12 text-sky-600" />
    </div>
  );
}
