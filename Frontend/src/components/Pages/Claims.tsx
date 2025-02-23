import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Upload, X } from "lucide-react";
import type { Claim, FormData, ClaimFormProps } from "../../types";

function ClaimForm({ onClose, onSubmit }: ClaimFormProps) {
  const [formData, setFormData] = useState<FormData>({
    incident_date: "",
    incident_type: "",
    collision_type: "",
    incident_severity: "",
    authorities_contacted: "",
    incident_city: "",
    incident_location: "",
    incident_hour_of_the_day: "",
    number_of_vehicles_involved: "",
    property_damage: "",
    bodily_injuries: "",
    witnesses: "",
    police_report_available: "",
    total_claim_amount: "",
    injury_claim: "",
    property_claim: "",
    vehicle_claim: "",
    description: "",
    images: [],
    repairBill: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const handleBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, repairBill: e.target.files![0] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-blue-600 text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">File New Insurance Claim</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Incident Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-900 pb-2 border-b border-blue-100">
              Incident Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="incident_date"
                  className="block text-sm font-medium text-blue-900"
                >
                  Incident Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="incident_date"
                    name="incident_date"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 pr-10"
                    value={formData.incident_date}
                    onChange={handleInputChange}
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="incident_hour_of_the_day"
                  className="block text-sm font-medium text-blue-900"
                >
                  Time of Incident
                </label>
                <input
                  type="time"
                  id="incident_hour_of_the_day"
                  name="incident_hour_of_the_day"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.incident_hour_of_the_day}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="incident_type"
                  className="block text-sm font-medium text-blue-900"
                >
                  Incident Type
                </label>
                <select
                  id="incident_type"
                  name="incident_type"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.incident_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select incident type</option>
                  <option value="Single Vehicle Collision">
                    Single Vehicle Collision
                  </option>
                  <option value="Vehicle Theft">Vehicle Theft</option>
                  <option value="Multi-vehicle Collision">
                    Multi-vehicle Collision
                  </option>
                  <option value="Parked Car">Parked Car</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="collision_type"
                  className="block text-sm font-medium text-blue-900"
                >
                  Collision Type
                </label>
                <select
                  id="collision_type"
                  name="collision_type"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.collision_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select collision type</option>
                  <option value="Side Collision">Side Collision</option>
                  <option value="Rear Collision">Rear Collision</option>
                  <option value="Front Collision">Front Collision</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="incident_severity"
                  className="block text-sm font-medium text-blue-900"
                >
                  Incident Severity
                </label>
                <select
                  id="incident_severity"
                  name="incident_severity"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.incident_severity}
                  onChange={handleInputChange}
                >
                  <option value="">Select severity</option>
                  <option value="Major Damage">Major Damage</option>
                  <option value="Minor Damage">Minor Damage</option>
                  <option value="Total Loss">Total Loss</option>
                  <option value="Trivial Damage">Trivial Damage</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="authorities_contacted"
                  className="block text-sm font-medium text-blue-900"
                >
                  Authorities Contacted
                </label>
                <select
                  id="authorities_contacted"
                  name="authorities_contacted"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.authorities_contacted}
                  onChange={handleInputChange}
                >
                  <option value="">Select authority</option>
                  <option value="Police">Police</option>
                  <option value="Fire">Fire</option>
                  <option value="Ambulance">Ambulance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="incident_city"
                  className="block text-sm font-medium text-blue-900"
                >
                  City
                </label>
                <input
                  type="text"
                  id="incident_city"
                  name="incident_city"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.incident_city}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="incident_location"
                  className="block text-sm font-medium text-blue-900"
                >
                  Exact Location
                </label>
                <input
                  type="text"
                  id="incident_location"
                  name="incident_location"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.incident_location}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="number_of_vehicles_involved"
                  className="block text-sm font-medium text-blue-900"
                >
                  Number of Vehicles Involved
                </label>
                <input
                  type="number"
                  id="number_of_vehicles_involved"
                  name="number_of_vehicles_involved"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.number_of_vehicles_involved}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="witnesses"
                  className="block text-sm font-medium text-blue-900"
                >
                  Number of Witnesses
                </label>
                <input
                  type="number"
                  id="witnesses"
                  name="witnesses"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.witnesses}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Claims Section */}
            <h3 className="text-xl font-semibold text-blue-900 pb-2 border-b border-blue-100 mt-8">
              Claim Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="total_claim_amount"
                  className="block text-sm font-medium text-blue-900"
                >
                  Total Claim Amount (₹)
                </label>
                <input
                  type="number"
                  id="total_claim_amount"
                  name="total_claim_amount"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.total_claim_amount}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="injury_claim"
                  className="block text-sm font-medium text-blue-900"
                >
                  Injury Claim Amount (₹)
                </label>
                <input
                  type="number"
                  id="injury_claim"
                  name="injury_claim"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.injury_claim}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="property_claim"
                  className="block text-sm font-medium text-blue-900"
                >
                  Property Claim Amount (₹)
                </label>
                <input
                  type="number"
                  id="property_claim"
                  name="property_claim"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.property_claim}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="vehicle_claim"
                  className="block text-sm font-medium text-blue-900"
                >
                  Vehicle Claim Amount (₹)
                </label>
                <input
                  type="number"
                  id="vehicle_claim"
                  name="vehicle_claim"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  value={formData.vehicle_claim}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Property Damage
                  </label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="property_damage"
                        value="Yes"
                        checked={formData.property_damage === "Yes"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="property_damage"
                        value="No"
                        checked={formData.property_damage === "No"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Bodily Injuries
                  </label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="bodily_injuries"
                        value="Yes"
                        checked={formData.bodily_injuries === "Yes"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="bodily_injuries"
                        value="No"
                        checked={formData.bodily_injuries === "No"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Police Report Available
                  </label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="police_report_available"
                        value="Yes"
                        checked={formData.police_report_available === "Yes"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="police_report_available"
                        value="No"
                        checked={formData.police_report_available === "No"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-blue-900"
              >
                Incident Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-3">
                  Accident Images
                </label>
                <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-blue-200 border-dashed rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-12 w-12 text-blue-500" />
                    <div className="flex flex-col items-center text-sm text-blue-900">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload images</span>
                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="text-xs text-blue-500 mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-3">
                  Repair Bill
                </label>
                <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-blue-200 border-dashed rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-12 w-12 text-blue-500" />
                    <div className="flex flex-col items-center text-sm text-blue-900">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload bill</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="sr-only"
                          onChange={handleBillUpload}
                        />
                      </label>
                      <p className="text-xs text-blue-500 mt-1">
                        PDF or image files up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                {formData.repairBill && (
                  <p className="mt-2 text-sm text-blue-600">
                    Selected file: {formData.repairBill.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Claims: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8081/claims/view", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch claims");
      }

      const fetchedClaims = await response.json();
      setClaims(fetchedClaims);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async (formData: FormData) => {
    try {
      setLoading(true);

      // Submit claim data
      const response = await fetch("http://localhost:8081/claims/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit claim");
      }

      const { claim_id } = await response.json();

      // Upload files if any
      if (formData.images.length > 0 || formData.repairBill) {
        const fileFormData = new FormData();
        formData.images.forEach((image, index) => {
          fileFormData.append(`image_${index}`, image);
        });

        if (formData.repairBill) {
          fileFormData.append("repair_bill", formData.repairBill);
        }

        const fileResponse = await fetch(`/api/claims/${claim_id}/files`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: fileFormData,
        });

        if (!fileResponse.ok) {
          throw new Error("Failed to upload files");
        }
      }

      await fetchClaims();
      setShowClaimForm(false);
      toast.success("Claim submitted successfully");
    } catch {
      toast.error("Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  const getFraudLabel = (prediction: string) => {
    switch (prediction.toLowerCase()) {
      case "high":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            High Risk
          </span>
        );
      case "medium":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            Medium Risk
          </span>
        );
      case "low":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Low Risk
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            Pending
          </span>
        );
    }
  };

  if (loading && claims.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && claims.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchClaims}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-blue-900">
            Claims Management
          </h3>
          <button
            onClick={() => setShowClaimForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            File New Claim
          </button>
        </div>
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-blue-900">
                    {claim.type} Claim
                  </h4>
                  <p className="text-sm text-gray-500">Claim ID: {claim.id}</p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {claim.status}
                  </span>
                  {claim.fraud_assessment &&
                    getFraudLabel(claim.fraud_assessment.prediction)}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Filed Date</p>
                  <p className="font-medium text-blue-900">{claim.date}</p>
                </div>
                <div>
                  <p className="text-gray-600">Claim Amount</p>
                  <p className="font-medium text-blue-900">
                    ₹{claim.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium text-blue-900">{claim.details}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium text-blue-900">
                    {claim.location || "N/A"}
                  </p>
                </div>
              </div>
              {claim.fraud_assessment?.reasons && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {claim.fraud_assessment.reasons}
                  </p>
                </div>
              )}
              <div className="mt-4 flex space-x-3">
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                  Track Status
                </button>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                  View Documents
                </button>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showClaimForm && (
        <ClaimForm
          onClose={() => setShowClaimForm(false)}
          onSubmit={handleSubmitClaim}
        />
      )}
    </div>
  );
};

export default Claims;
