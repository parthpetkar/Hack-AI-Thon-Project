export interface User {
  otherDetails: {
    sex?: string;
    dob?: string; // Added dob property
    education_level: string;
    occupation: string;
    hobbies: string;
    relationship: string;
  };
  name: string;
  email: string;
  mobile: string;
  customerId: string;
  address: string;
  profilePicture?: string;
  aadharNumber?: string;
  panNumber?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface Insurance {
  vehicleType: string;
  total_insurance_amount: string;
  application_id: string;
  id: string;
  type: string;
  amount: number;
  policyNumber: string;
}

export interface Policy {
  type: string;
  policyNumber: string;
  sumInsured: number;
  premium: number;
  status: string;
  renewalDate: string;
  vehicle?: {
    make: string;
    model: string;
    year: string;
    registration: string;
  };
}

export interface Claim {
  fraud_assessment: {
    prediction: string;
    reasons: string[];
    score: number;
    riskLevel: string;
    details?: string;
  };
  location: string;
  id: string;
  type: string;
  status: string;
  amount: number;
  date: string;
  details: string;
}

export interface FormData {
  incident_date: string;
  incident_type: string;
  collision_type: string;
  incident_severity: string;
  authorities_contacted: string;
  incident_city: string;
  incident_location: string;
  incident_hour_of_the_day: string;
  number_of_vehicles_involved: string;
  property_damage: string;
  bodily_injuries: string;
  witnesses: string;
  police_report_available: string;
  total_claim_amount: string;
  injury_claim: string;
  property_claim: string;
  vehicle_claim: string;
  description: string;
  images: File[];
  repairBill: File | null;
}

export interface ClaimFormProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export interface PaymentMethod {
  type: string;
  lastFour: string;
  isPrimary: boolean;
}

export interface Transaction {
  id: string;
  policy: string;
  amount: number;
  date: string;
  status: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  count: number;
  uploadedOn: Date;
  size: number;
  icon: React.ComponentType; // This would be a Lucide icon component type
}

export interface Nominee {
  name: string;
  relation: string;
  share: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: string;
}

export interface NomineeFormData {
  name: string;
  dateOfBirth: string;
  relation: string;
  aadharNumber: string;
  panNumber?: string;
  mobileNumber: string;
  email?: string;
  accountNumber?: string;
  ifscCode?: string;
  share: string;
}
