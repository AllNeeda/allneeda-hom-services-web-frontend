export function resolveProfessionalStep(data: any): number | "dashboard" {
  const professional = data?.professional?.professional;
  const payment = data?.professional?.payment ?? [];
  const services = data?.professional?.services ?? [];
  if (!professional) {
    return 3;
  }
  const hasIntro =
    typeof professional.introduction === "string" &&
    professional.introduction.trim().length > 0;

  const hasFoundedYear =
    typeof professional.founded_year === "number" &&
    professional.founded_year > 1900;

  const hasBusinessType =
    typeof professional.business_type === "string" &&
    professional.business_type.trim().length > 0;

  if (!hasIntro || !hasFoundedYear || !hasBusinessType) {
    return 4;
  }
 
  const businessHours = professional.business_hours;
  if (!Array.isArray(businessHours) || businessHours.length === 0) {
    return 7;
  }

  const hasEmptyQuestions = services.some(
    (service: any) =>
      !Array.isArray(service.question_ids) || service.question_ids.length === 0
  );

  if (hasEmptyQuestions) {
    return 8;
  }

  const hasEmptyLocations = services.some(
    (service: any) =>
      !Array.isArray(service.location_ids) || service.location_ids.length === 0
  );

  if (hasEmptyLocations) {
    return 9;
  };

  if (payment.length === 0) {
    return 10;
  };
  return "dashboard";
}
