export function resolveProfessionalStep(data: any): number | "dashboard" {
  const professional = data?.professional?.professional;
  const payment = data?.professional?.payment ?? [];
  const services = data?.professional?.services ?? [];

  if (!professional) return 3;

  if (
    !professional.introduction ||
    !professional.founded_year ||
    !professional.business_type
  ) {
    return 4;
  }

// if (professional.total_review === 0) return 5;

  const businessHours = professional.business_hours;
  if (!Array.isArray(businessHours) || businessHours.length === 0) {
    return 7;
  }

  if (
    services.some(
      (s: any) => !Array.isArray(s.question_ids) || s.question_ids.length === 0
    )
  ) {
    return 8;
  }

  if (
    services.some(
      (s: any) => !Array.isArray(s.location_ids) || s.location_ids.length === 0
    )
  ) {
    return 9;
  }

  if (payment.length === 0) return 10;

  return "dashboard";
}
