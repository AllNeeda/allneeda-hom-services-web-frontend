import { ReferralHero } from "@/components/it-services/referral/referral-hero"
import { ReferralForm } from "@/components/it-services/referral/referral-form"
import { ReferralSteps } from "@/components/it-services/referral/referral-steps"

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main>
        <ReferralHero />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <ReferralForm />
          <ReferralSteps />
        </div>
      </main>
    </div>
  )
}
