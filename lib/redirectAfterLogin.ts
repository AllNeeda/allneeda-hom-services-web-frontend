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
      router.replace(`/home-services/dashboard/services/step-${step}`);
    }
  } catch {
    router.replace("/home-services/dashboard"); 
  }
}
