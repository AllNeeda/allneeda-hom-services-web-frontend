import { ProgressBar } from '@/components/home-services/onboarding/ProgressBar';

export default function Page() {
  return (
    <div>
      <ProgressBar currentStep={2} totalSteps={4} />
    </div>
  );
}
