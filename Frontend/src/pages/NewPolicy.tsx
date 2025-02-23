import { useState } from "react";
import axios from "axios";
import {
  Car,
  User,
  Shield,
  FileText,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import StepIndicator from "../components/Policy/StepIndicator";
import VehicleDetails from "../components/Policy/VehicleDetails";
import PersonalInfo from "../components/Policy/PersonalInfo";
import PolicyCustomization from "../components/Policy/PolicyCustomization";
import Summary from "../components/Policy/Summary";
import Payment from "../components/Policy/Payment";
import Success from "../components/Policy/Success";

export type FormData = {
  policy_number: string;
  vehicleType: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  idv: string;
  ncb: string;
  addons?: string[];
  policy_annual_premium?: number;
  umbrella_limit?: number;
  policy_csl?: number;
  total_insurance_amount?: number;
};

function Apply() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    policy_number: "",
    vehicleType: "",
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    idv: "",
    ncb: "",
    addons: [],
    policy_annual_premium: 0,
    umbrella_limit: 0,
    policy_csl: 0,
    total_insurance_amount: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: "Vehicle Details", icon: Car },
    { number: 2, title: "Personal Info", icon: User },
    { number: 3, title: "Customize Policy", icon: Shield },
    { number: 4, title: "Summary", icon: FileText },
    { number: 5, title: "Payment", icon: CreditCard },
    { number: 6, title: "Success", icon: CheckCircle },
  ];

  const submitFormData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        "http://localhost:8081/apply/new",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return true;
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the application"
      );
      return false;
    }
  };

  const handleNext = async () => {
    if (step === 4) {
      // Submit form data before proceeding to payment
      const submitted = await submitFormData();
      if (!submitted) {
        return; // Don't proceed if submission failed
      }
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setError(null); // Clear any existing errors when going back
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <VehicleDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PersonalInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PolicyCustomization
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Summary
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return <Payment onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <Success />;
      default:
        return null;
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <StepIndicator steps={steps} currentStep={step} />
      <div className="mt-8">{renderStep()}</div>
    </main>
  );
}

export default Apply;
