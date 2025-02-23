import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Shield,
  User,
  Lock,
  Smartphone,
  Mail,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import OTPInput from "../components/Auth/OTPInput";

function App() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const endpoint = isLogin
        ? "https://hack-ai-thon-project-d8qt.onrender.com/auth/sign-in"
        : "https://hack-ai-thon-project-d8qt.onrender.com/auth/register";

      // Create payload based on whether it's login or register
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
            mobile: formData.mobile,
            name: formData.name,
          };

      const response = await axios.post(endpoint, payload);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", response.data.token);
        console.log(
          isLogin ? "Sign-in successful!" : "Registration successful!"
        );

        if (isLogin) {
          setShowOTP(true);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            (isLogin
              ? "Invalid email or password."
              : "Registration failed. Please try again.")
        );
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(isLogin ? "Sign-in error:" : "Registration error:", err);
    }
  };

  const handleOTPVerification = (otp: string) => {
    console.log("OTP Verified:", otp);
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1580155463481-021e40d6e74c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80')`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-900/95 via-blue-900/95 to-blue-950/95 -z-10" />

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-b from-black/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
                <Shield className="h-6 w-6 text-green-500" />
                <IndianRupee className="h-5 w-5 text-green-500" />
                <span className="text-xl font-bold text-white">
                  State Bank of India
                </span>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLogin
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isLogin
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Register
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="w-full max-w-md">
          {!showOTP ? (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-6 space-x-2">
                <Shield className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-200" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-green-200/20 rounded-lg text-white placeholder-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-200" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-green-200/20 rounded-lg text-white placeholder-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-200" />
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-green-200/20 rounded-lg text-white placeholder-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-200" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-green-200/20 rounded-lg text-white placeholder-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-200" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-green-200/20 rounded-lg text-white placeholder-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-blue-900 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {isLogin && (
                  <p className="text-sm text-center text-green-200/80">
                    <a href="#" className="hover:text-white hover:underline">
                      Forgot your password?
                    </a>
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-6 space-x-2">
                <Smartphone className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-bold text-white">
                  Verify Your Mobile
                </h2>
              </div>
              <p className="text-green-200/80 mb-6 text-center">
                We've sent a verification code to your mobile number ending in{" "}
                {formData.mobile.slice(-4)}
              </p>
              <OTPInput length={6} onComplete={handleOTPVerification} />
              <button
                onClick={() => setShowOTP(false)}
                className="w-full mt-4 text-sm text-green-200/80 hover:text-white hover:underline text-center"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
