import { getProfessionalStepsAPI } from "@/app/api/services/services";
import { resolveProfessionalStep } from "./redirectProfessionalStep";

export async function safeProfessionalRedirect(
  token: string,
  router: any
) {
  const data = await getProfessionalStepsAPI(token);
  const step = resolveProfessionalStep(data);

  if (step === "dashboard") {
    router.replace("/home-services/dashboard");
  } else {
    router.replace(
      `/home-services/dashboard/services/step-${step}`
    );
  }
}
