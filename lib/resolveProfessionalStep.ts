export function resolveProfessionalStep(data: any): number | "dashboard" {
  const professional = data?.professional?.professional;


  const currentStep = professional.step ?? 0;
  if (currentStep >= 9) return "dashboard";
  return currentStep;
}
