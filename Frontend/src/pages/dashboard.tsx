import { useState } from "react";
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import PersonalInfo from "../components/Pages/Info";
import Claims from "../components/Pages/Claims";
import Policies from "../components/Pages/Policies";
import Payments from "../components/Pages/Payment";
import { User } from "../types";
import SupportTickets from "../components/Pages/Support";
import Nominees from "../components/Pages/Nominees";
import Documents from "../components/Pages/Document";
import Security from "../components/Pages/Security";
import Reward from "../components/Pages/Rewards";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const user: User = {
    name: "",
    customerId: "SBI87654321",
    email: "rajesh.kumar@email.com",
    mobile: "+91 98765 43210",
    address: "123, Park Street, Mumbai",
    otherDetails: {
      sex: undefined,
      dob: undefined,
      education_level: "",
      occupation: "",
      hobbies: "",
      relationship: "",
    },
  };

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "policies":
        return <Policies />;
      case "claims":
        return <Claims />;
      case "payments":
        return <Payments />;
      case "support":
        return <SupportTickets />;
      case "nominees":
        return <Nominees />;
      case "documents":
        return <Documents />;
      case "security":
        return <Security />;
      case "reward":
        return <Reward />;
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600">Select a tab to view details</p>
          </div>
        );
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "personal":
        return {
          title: "My Profile",
          subtitle: "Manage your insurance profile and policies",
        };
      case "policies":
        return {
          title: "Insurance Policies",
          subtitle: "View and manage your active insurance policies",
        };
      case "claims":
        return {
          title: "Claims Management",
          subtitle: "Track and manage your insurance claims",
        };
      case "payments":
        return {
          title: "Payments & Billing",
          subtitle: "Manage your payment methods and view transactions",
        };
      case "support":
        return {
          title: "Support Tickets",
          subtitle: "Get help and track your support requests",
        };
      case "nominees":
        return {
          title: "Nominee Management",
          subtitle: "Add and manage your policy nominees",
        };
      case "documents":
        return {
          title: "My Documents",
          subtitle: "Access and download your insurance documents",
        };
      case "security":
        return {
          title: "Security Settings",
          subtitle: "Manage your account security and privacy preferences",
        };
      case "rewards":
        return {
          title: "Rewards & Benefits",
          subtitle: "View your reward points and exclusive member benefits",
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "Select a tab to view details",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {getTabTitle().title}
              </h1>
              <p className="text-sm text-gray-600">{getTabTitle().subtitle}</p>
            </div>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
