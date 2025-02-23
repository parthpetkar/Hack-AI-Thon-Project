import React, { useState, useEffect } from "react";
import { Shield, Pencil, Check, X } from "lucide-react";
import axios from "axios";
import { User, Insurance } from "../../types";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://hack-ai-thon-project-d8qt.onrender.com/api";

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [insurancePolicies, setInsurancePolicies] = useState<Insurance[]>([]);
  const [editMode, setEditMode] = useState({
    personal: false,
    banking: false,
    address: false,
    otherDetails: false,
  });
  const [tempData, setTempData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const apiRequest = async <T,>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> => {
    try {
      const config = getAuthConfig();
      const url = `${API_BASE_URL}${endpoint}`;
      let response;
      if (method.toLowerCase() === "get") {
        response = await axios.get(url, config);
      } else if (method.toLowerCase() === "put") {
        response = await axios.put(url, data, config);
      } else {
        throw new Error(`Unsupported method: ${method}`);
      }
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/", {
          state: { message: "Your session has expired. Please log in again." },
        });
        throw new Error("Authentication failed. Redirecting to login...");
      }
      const errorMessage =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        (err as Error).message ||
        "An unknown error occurred";
      setError(errorMessage);
      throw err;
    }
  };

  const fetchProfile = async () => {
    try {
      const userData = await apiRequest<User>("get", "/profile");
      setUser(userData);
      setTempData(userData);
      console.log(userData);
      return userData;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsurancePolicies = async () => {
    try {
      const policies = await apiRequest<Insurance[]>(
        "get",
        "/profile/insurance"
      );
      setInsurancePolicies(Array.isArray(policies) ? policies : []);
    } catch (err) {
      console.error("Failed to fetch insurance policies:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchProfile();
        await fetchInsurancePolicies();
      } catch (err) {
        console.error("Initial data loading failed:", err);
      }
    };
    loadData();
  }, []);

  const handleEdit = (section: keyof typeof editMode) => {
    setEditMode((prev) => ({ ...prev, [section]: true }));
    setTempData(user);
  };

  const handleCancel = (section: keyof typeof editMode) => {
    setEditMode((prev) => ({ ...prev, [section]: false }));
    setTempData(user);
  };

  const handleSave = async (section: keyof typeof editMode) => {
    if (!tempData) return;
    try {
      let endpoint = "";
      let data = {};
      switch (section) {
        case "personal":
          endpoint = "/profile/personal";
          data = { name: tempData.name, mobile: tempData.mobile };
          break;
        case "banking":
          endpoint = "/profile/banking";
          data = {
            aadharNumber: tempData.aadharNumber,
            panNumber: tempData.panNumber,
            accountNumber: tempData.accountNumber,
            ifscCode: tempData.ifscCode,
          };
          break;
        case "address":
          endpoint = "/profile/address";
          data = { address: tempData.address };
          break;
        case "otherDetails":
          endpoint = "/profile/other-details";
          data = {
            sex: tempData?.otherDetails.sex,
            dob: tempData?.otherDetails.dob,
            education_level: tempData?.otherDetails.education_level,
            occupation: tempData?.otherDetails.occupation,
            hobbies: tempData?.otherDetails.hobbies,
            relationship: tempData?.otherDetails.relationship,
          };
          break;
      }
      await apiRequest("put", endpoint, data);
      const updatedProfile = await fetchProfile();
      if (updatedProfile) {
        setEditMode((prev) => ({ ...prev, [section]: false }));
      }
    } catch (err) {
      console.error(`Failed to save ${section} data:`, err);
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    setTempData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  interface InputFieldProps {
    label: string;
    field: keyof User;
    value: string;
    onChange: (field: keyof User, value: string) => void;
  }

  const InputField: React.FC<InputFieldProps> = ({
    label,
    field,
    value,
    onChange,
  }) => (
    <div>
      <label className="block text-sm text-gray-600">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );

  const DisplayField = ({ label, value }: { label: string; value: string }) => (
    <div>
      <label className="block text-sm text-gray-600">{label}</label>
      <p className="text-gray-900 font-medium">{value || "Not provided"}</p>
    </div>
  );

  if (isLoading)
    return (
      <div className="flex justify-center p-8">Loading profile data...</div>
    );
  if (error)
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        Error: {error}
      </div>
    );
  if (!user)
    return (
      <div className="text-center p-8">
        No user profile data available. Please try logging in again.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* User Information Top Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold">User Information</h3>
          {!editMode.personal ? (
            <button
              onClick={() => handleEdit("personal")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave("personal")}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => handleCancel("personal")}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={user.profilePicture || "/api/placeholder/96/96"}
                alt={user.name || "User profile"}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-50">
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            {editMode.personal && tempData ? (
              <>
                <InputField
                  label="Full Name"
                  field="name"
                  value={tempData.name}
                  onChange={handleChange}
                />
                <DisplayField label="Email Address" value={user.email} />
                <InputField
                  label="Mobile Number"
                  field="mobile"
                  value={tempData.mobile}
                  onChange={handleChange}
                />
                <DisplayField label="Customer ID" value={user.customerId} />
              </>
            ) : (
              <>
                <DisplayField label="Full Name" value={user.name} />
                <DisplayField label="Email Address" value={user.email} />
                <DisplayField label="Mobile Number" value={user.mobile} />
                <DisplayField label="Customer ID" value={user.customerId} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Banking & Identity Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold">Banking & Identity Details</h3>
          {!editMode.banking ? (
            <button
              onClick={() => handleEdit("banking")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave("banking")}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => handleCancel("banking")}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {editMode.banking && tempData ? (
            <>
              <InputField
                label="Aadhar Number"
                field="aadharNumber"
                value={tempData.aadharNumber || ""}
                onChange={handleChange}
              />
              <InputField
                label="PAN Number"
                field="panNumber"
                value={tempData.panNumber || ""}
                onChange={handleChange}
              />
              <InputField
                label="Account Number"
                field="accountNumber"
                value={tempData.accountNumber || ""}
                onChange={handleChange}
              />
              <InputField
                label="IFSC Code"
                field="ifscCode"
                value={tempData.ifscCode || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <DisplayField
                label="Aadhar Number"
                value={user.aadharNumber || "Not provided"}
              />
              <DisplayField
                label="PAN Number"
                value={user.panNumber || "Not provided"}
              />
              <DisplayField
                label="Account Number"
                value={user.accountNumber || "Not provided"}
              />
              <DisplayField
                label="IFSC Code"
                value={user.ifscCode || "Not provided"}
              />
            </>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Address Information</h3>
          {!editMode.address ? (
            <button
              onClick={() => handleEdit("address")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave("address")}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => handleCancel("address")}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600">Address</label>
          {editMode.address && tempData ? (
            <textarea
              value={tempData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          ) : (
            <p className="text-gray-900 font-medium">
              {user.address || "No address provided"}
            </p>
          )}
        </div>
      </div>

      {/* Insurance Policies */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Active Insurance Policies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insurancePolicies.length > 0 ? (
            insurancePolicies.map((policy) => (
              <div key={policy.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {policy.vehicleType}
                  </span>
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-lg font-semibold">
                  ₹{policy.total_insurance_amount}
                </p>
                <p className="text-sm text-gray-500">
                  Policy: {policy.application_id}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-4 text-gray-500">
              No active insurance policies found
            </div>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Other Details</h3>
          {!editMode.otherDetails ? (
            <button
              onClick={() => handleEdit("otherDetails")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave("otherDetails")}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => handleCancel("otherDetails")}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
        {editMode.otherDetails && tempData ? (
          <>
            <InputField
              label="Sex"
              field="otherDetails"
              value={tempData.otherDetails.sex || ""}
              onChange={handleChange}
            />
            <InputField
              label="Date Of Birth"
              field="otherDetails"
              value={tempData?.otherDetails.dob || ""}
              onChange={handleChange}
            />
            <InputField
              label="Education Level"
              field="otherDetails"
              value={tempData?.otherDetails.education_level || ""}
              onChange={handleChange}
            />
            <InputField
              label="Occupation"
              field="otherDetails"
              value={tempData?.otherDetails.occupation || ""}
              onChange={handleChange}
            />
            <InputField
              label="Hobbies"
              field="otherDetails"
              value={tempData?.otherDetails.hobbies || ""}
              onChange={handleChange}
            />
            <InputField
              label="Relationship Status"
              field="otherDetails"
              value={tempData?.otherDetails.relationship || ""}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <DisplayField
              label="Sex"
              value={user.otherDetails.sex || "Not provided"}
            />
            <DisplayField
              label="Date Of Birth"
              value={user.otherDetails.dob || "Not provided"}
            />
            <DisplayField
              label="Education Level"
              value={user.otherDetails.education_level}
            />
            <DisplayField
              label="Occupation"
              value={user.otherDetails.occupation}
            />
            <DisplayField label="Hobbies" value={user.otherDetails.hobbies} />
            <DisplayField
              label="Relationship Status"
              value={user.otherDetails.relationship}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
