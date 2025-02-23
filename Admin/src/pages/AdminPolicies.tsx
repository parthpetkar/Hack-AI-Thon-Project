import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Car,
  Truck as Truck2,
} from "lucide-react";

const AdminPolicies = () => {
  interface Policy {
    id: string;
    vehicleDetails: {
      type: string;
      make: string;
      model: string;
      registrationNumber: string;
      year: number;
    };
    personalInfo: {
      fullName: string;
      mobile: string;
      email: string;
      address: string;
      city: string;
      state: string;
    };
    policyDetails: {
      idv: number;
      ncb: number;
      addOns: string[];
      premium: number;
      premiumBreakdown: {
        basic: number;
        addOns: number;
        gst: number;
        total: number;
      };
    };
    status: string;
    forgeryScore: number;
    documents: {
      name: string;
      type: string;
      forgeryScore: number;
    }[];
  }

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch(
        "https://hack-ai-thon-project-d8qt.onrender.com/admin/policies"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch policies");
      }
      const data = await response.json();

      // Transform backend data to match frontend structure
      const transformedPolicies = data.map((policy: Policy) => ({
        id: policy.id,
        vehicleDetails: policy.vehicleDetails,
        personalInfo: policy.personalInfo,
        policyDetails: {
          ...policy.policyDetails,
          premiumBreakdown: {
            basic: policy.policyDetails.premium * 0.7, // Approximate breakdown
            addOns: policy.policyDetails.premium * 0.15,
            gst: policy.policyDetails.premium * 0.15,
            total: policy.policyDetails.premium,
          },
        },
        status:
          policy.status === "PENDING"
            ? "Pending"
            : policy.status === "ACTIVE"
            ? "Active"
            : "Rejected",
        forgeryScore: Math.random() * 100, // Placeholder until backend provides this
        documents: [], // Will be populated when expanded
      }));

      setPolicies(transformedPolicies);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (policyId: string) => {
    try {
      const response = await fetch(`/admin/documents/${policyId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const documents = await response.json();

      // Transform documents to match frontend structure
      return documents.map(
        (doc: { fileName: string; label: string; confidence: number }) => ({
          name: doc.fileName,
          type: doc.label,
          forgeryScore: (1 - doc.confidence) * 100,
        })
      );
    } catch (err) {
      console.error("Error fetching documents:", err);
      return [];
    }
  };

  const toggleExpand = async (policyId: string) => {
    if (expandedPolicy === policyId) {
      setExpandedPolicy(null);
    } else {
      setExpandedPolicy(policyId);
      // Fetch documents when expanding
      const documents = await fetchDocuments(policyId);
      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) =>
          policy.id === policyId ? { ...policy, documents } : policy
        )
      );
    }
  };

  const updatePolicyStatus = async (policyId: string, newStatus: string) => {
    try {
      // Optionally, send an API request to update the policy's status on the backend.
      // await fetch(`https://hack-ai-thon-project-d8qt.onrender.com/admin/policies/${policyId}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // Update the policy status in the state.
      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) =>
          policy.id === policyId ? { ...policy, status: newStatus } : policy
        )
      );
    } catch (err) {
      console.error("Error updating policy status:", err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="p-6">Loading policies...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Policy Management
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premium
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forgery Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {policies.map((policy) => (
              <React.Fragment key={policy.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleExpand(policy.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedPolicy === policy.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {policy.vehicleDetails.type === "Car" ? (
                        <Car size={16} className="mr-2" />
                      ) : (
                        <Truck2 size={16} className="mr-2" />
                      )}
                      {policy.vehicleDetails.make} {policy.vehicleDetails.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.personalInfo.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(
                      policy.policyDetails.premiumBreakdown.total
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        policy.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : policy.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`text-sm ${
                          policy.forgeryScore > 50
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {Math.round(policy.forgeryScore)}%
                      </span>
                      {policy.forgeryScore > 50 && (
                        <AlertTriangle
                          size={16}
                          className="ml-2 text-red-500"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updatePolicyStatus(policy.id, "Active")}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() =>
                          updatePolicyStatus(policy.id, "Rejected")
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedPolicy === policy.id && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 bg-gray-50">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Vehicle Details */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Vehicle Details
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Vehicle Type:
                                </span>
                                <span className="text-gray-900">
                                  {policy.vehicleDetails.type}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Registration Number:
                                </span>
                                <span className="text-gray-900">
                                  {policy.vehicleDetails.registrationNumber}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Make & Model:
                                </span>
                                <span className="text-gray-900">
                                  {policy.vehicleDetails.make}{" "}
                                  {policy.vehicleDetails.model}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Year:</span>
                                <span className="text-gray-900">
                                  {policy.vehicleDetails.year}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Personal Information
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="text-gray-900">
                                  {policy.personalInfo.fullName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Mobile:</span>
                                <span className="text-gray-900">
                                  {policy.personalInfo.mobile}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="text-gray-900">
                                  {policy.personalInfo.email}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Address:</span>
                                <span className="text-gray-900">
                                  {policy.personalInfo.address}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">City:</span>
                                <span className="text-gray-900">
                                  {policy.personalInfo.city}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">State:</span>
                                <span className="text-gray-900">
                                  {policy.personalInfo.state}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Policy Details */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Policy Details
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">IDV:</span>
                                <span className="text-gray-900">
                                  {formatCurrency(policy.policyDetails.idv)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">NCB:</span>
                                <span className="text-gray-900">
                                  {policy.policyDetails.ncb}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Selected Add-ons:
                                </span>
                                <span className="text-gray-900">
                                  {policy.policyDetails.addOns.join(", ")}
                                </span>
                              </div>
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h5 className="font-semibold text-gray-900 mb-2">
                                  Premium Breakdown
                                </h5>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Basic Premium
                                    </span>
                                    <span className="text-gray-900">
                                      {formatCurrency(
                                        policy.policyDetails.premiumBreakdown
                                          .basic
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Add-ons
                                    </span>
                                    <span className="text-gray-900">
                                      {formatCurrency(
                                        policy.policyDetails.premiumBreakdown
                                          .addOns
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      GST (18%)
                                    </span>
                                    <span className="text-gray-900">
                                      {formatCurrency(
                                        policy.policyDetails.premiumBreakdown
                                          .gst
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t border-gray-300 font-semibold">
                                    <span className="text-gray-900">
                                      Total Premium
                                    </span>
                                    <span className="text-gray-900">
                                      {formatCurrency(
                                        policy.policyDetails.premiumBreakdown
                                          .total
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Document Verification */}
                          <div className="lg:col-span-3 space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Document Verification
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {policy.documents.map((doc, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-gray-900 font-medium">
                                        {doc.name}
                                      </p>
                                      <p className="text-gray-500 text-sm">
                                        {doc.type}
                                      </p>
                                    </div>
                                    <div
                                      className={`text-sm ${
                                        doc.forgeryScore > 50
                                          ? "text-red-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {Math.round(doc.forgeryScore)}% forgery
                                      score
                                      {doc.forgeryScore > 50 && (
                                        <AlertTriangle
                                          size={16}
                                          className="ml-2 inline"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {policy.documents.length === 0 && (
                                <div className="lg:col-span-2 text-center py-8 text-gray-500">
                                  Loading documents...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No policies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPolicies;
