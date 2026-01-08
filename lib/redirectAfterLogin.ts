import { getProfessionalStepsAPI } from "@/app/api/services/services";
import { resolveProfessionalStep } from "@/lib/resolveProfessionalStep";

export async function redirectAfterLogin(token: string, router: any) {
  try {
    const data = await getProfessionalStepsAPI(token);
    const step = resolveProfessionalStep(data);

    // Redirect based on step
    if (step === "dashboard") {
      router.replace("/home-services/dashboard");
    } else {
      const nextStep = Number(step) + 1;
      router.replace(`/home-services/dashboard/services/step-${nextStep}`);
    }
  } catch {
    router.replace("/home-services/dashboard");
  }
}
