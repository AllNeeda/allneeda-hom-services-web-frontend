export interface LicensePayload {
  professional_id: string;
  license_type_id: string;
  state_id: string;
  license_owner_name: string;
  license_expiration: string | null;
  link_to_licensing_agency: string | null;
  status?: string;
}
