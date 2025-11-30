export interface CreateLeadPayload {
  serviceId: string;
  responses: Record<string, any>;
  professionalId?: string;
  userInfo: {
    email: string;
    phone: string;
    description?: string;
  };
  userLocation?: {
    lat: number;
    lng: number;
  };
  sendOption: "top5" | "selected"; // ✅ restrict to specific options
  selectedProfessionals?: string[];
}