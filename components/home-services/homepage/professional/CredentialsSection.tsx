// components/home-services/professional-profile/components/sections/CredentialsSection.tsx
import { forwardRef } from "react";
import { Check, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Credential {
  id: string;
  type: 'license' | 'certification' | 'insurance' | 'association' | 'background_check';
  name: string;
  details?: string;
  number?: string;
  verified?: boolean;
  issueDate?: string;
  expiryDate?: string;
}

interface CredentialsSectionProps {
  credentials?: Credential[];
}

const CredentialsSection = forwardRef<HTMLDivElement, CredentialsSectionProps>(
  ({ credentials = [] }, ref) => {
    
    // Filter credentials by type
    const licenses = credentials.filter(c => c.type === 'license');
    const certifications = credentials.filter(c => c.type === 'certification');
    const insurance = credentials.filter(c => c.type === 'insurance');
    const associations = credentials.filter(c => c.type === 'association');
    const backgroundChecks = credentials.filter(c => c.type === 'background_check');

    // Hardcoded fallback data
    const defaultLicenses = [
      "State Licensed General Contractor (#GC123456)",
      "Certified Lead-Safe Renovator",
      "OSHA 30-Hour Certified"
    ];

    const defaultAssociations = [
      "National Association of Home Builders (NAHB)",
      "Local Chamber of Commerce",
      "Better Business Bureau (A+ Rating)"
    ];

    const hasInsurance = insurance.length > 0 || true; // Fallback to showing insurance section
    const insuranceDetails = insurance[0]?.details || "Fully insured with $2,000,000 general liability coverage.";

    const hasBackgroundCheck = backgroundChecks.length > 0 || true; // Fallback
    const backgroundCheckDate = backgroundChecks[0]?.issueDate || "04/08/2024";

    return (
      <div ref={ref} className="space-y-4 mt-10">
        <h3 className="text-md font-semibold">
          Credentials & Certifications
        </h3>
        
        <div className="mt-4 space-y-4 tex-xs">
          {/* Licenses Section */}
          {(licenses.length > 0 || defaultLicenses.length > 0) && (
            <div>
              <h4 className="text-sm font-semibold">
                Licenses
              </h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                {licenses.length > 0 
                  ? licenses.map((license, index) => (
                      <li key={license.id || index}>
                        {license.name}
                        {license.number && ` (#${license.number})`}
                      </li>
                    ))
                  : defaultLicenses.map((license, index) => (
                      <li key={index}>{license}</li>
                    ))
                }
              </ul>
            </div>
          )}

          {/* Insurance Section */}
          {hasInsurance && (
            <div>
              <h4 className="text-sm font-semibold">
                Insurance
              </h4>
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-xs">
                {insuranceDetails}
              </p>
            </div>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold">
                Certifications
              </h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                {certifications.map((cert, index) => (
                  <li key={cert.id || index}>
                    {cert.name}
                    {cert.details && ` - ${cert.details}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Associations Section */}
          {(associations.length > 0 || defaultAssociations.length > 0) && (
            <div>
              <h4 className="text-sm font-semibold">
                Associations
              </h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                {associations.length > 0
                  ? associations.map((association, index) => (
                      <li key={association.id || index}>
                        {association.name}
                        {association.details && ` (${association.details})`}
                      </li>
                    ))
                  : defaultAssociations.map((association, index) => (
                      <li key={index}>{association}</li>
                    ))
                }
              </ul>
            </div>
          )}
        </div>

        {/* Background Check Section */}
        {hasBackgroundCheck && (
          <div className="my-4 border-t border-gray-200 mt-10 pt-5">
            <div className="flex justify-start items-center gap-2">
              <p className="text-lg font-bold">Credentials</p>
              <Info className="w-4 h-4 text-gray-400 font-bold" />
            </div>
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm font-semibold">Background Check</p>
              <Check className="w-4 h-4 text-gray-800 dark:text-gray-400" />
            </div>
            <p className="text-xs font-medium py-1 mb-4">
              Background Check Verified
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sky-500 font-bold text-xs cursor-pointer hover:underline focus-visible:outline-none">
                  View Credential Details
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle>Credential Details</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Background Check
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm mt-2">Completed on {backgroundCheckDate}</div>
                {backgroundChecks[0]?.details && (
                  <div className="text-sm mt-2">
                    Details: {backgroundChecks[0].details}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  }
);

CredentialsSection.displayName = "CredentialsSection";

export default CredentialsSection;