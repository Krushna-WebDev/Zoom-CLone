import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Mode = "loggedIn" | "loggedOut";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  token?: string | null;
  email?: string;
}

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  mode,
  token,
  email,
}: Props) => {
  const [step, setStep] = useState<"otp" | "reset">("otp");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [autoSent, setAutoSent] = useState(false);

  const authHeaders =
    mode === "loggedIn" && token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!isOpen) {
      setStep("otp");
      setOtp("");
      setOtpSent(false);
      setNewPassword("");
      setConfirmPass("");
      setAutoSent(false);
    }
  }, [isOpen]);

  const sendOtp = async () => {
    try {
      if (mode === "loggedOut") {
        if (!email) {
          toast.error("Please enter your email first.");
          return;
        }
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/forgot-password/otpsend",
          { email },
          { withCredentials: true },
        );
        if (res.status === 200) {
          setOtpSent(true);
          toast.success(res.data.message);
        }
      } else {
        const res = await axios.get(
          "http://localhost:5000/api/v1/auth/otpsend",
          {
            withCredentials: true,
            headers: authHeaders,
          },
        );
        if (res.status === 200) {
          setOtpSent(true);
          toast.success(res.data.message);
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to send OTP. Try again.";
      toast.error(msg);
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otpSent) {
        toast.error("Please request an OTP first.");
        return;
      }
      if (otp.trim().length !== 6) {
        toast.error("Please enter a 6-digit OTP");
        return;
      }

      if (mode === "loggedOut") {
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/forgot-password/verify-otp",
          { email, otp },
          { withCredentials: true },
        );
        if (res.status === 200) {
          toast.success(res.data.message);
          setStep("reset");
        }
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/verifyotp",
          { otp },
          { withCredentials: true, headers: authHeaders },
        );
        if (res.status === 200) {
          toast.success(res.data.message);
          setStep("reset");
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "OTP verification failed. Please try again.";
      toast.error(msg);
    }
  };

  const resetPassword = async () => {
    try {
      if (newPassword !== confirmPass) {
        toast.error("Confirm Password MissMatch");
        return;
      }

      if (mode === "loggedOut") {
        await axios.post(
          "http://localhost:5000/api/v1/auth/forgot-password/reset-pass",
          { email, newPassword },
          { withCredentials: true },
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/auth/changepass-otp",
          { newPassword },
          { withCredentials: true, headers: authHeaders },
        );
      }

      toast.success("Password updated");
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update password.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (isOpen && !autoSent) {
      sendOtp();
      setAutoSent(true);
    }
  }, [isOpen, autoSent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mx-auto w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6 border border-orange-100 shadow-sm">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {step === "otp" ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-sm text-gray-500 mb-8 px-2">
              We&apos;ve sent a 6-digit verification code to your email address.
            </p>

            <div className="mb-6">
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="••••••"
                className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-gray-50 focus:bg-white uppercase"
              />
            </div>

            <button
              onClick={verifyOtp}
              className="w-full py-3.5 px-4 bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] mb-6"
            >
              Verify Code
            </button>

            <p className="text-sm text-gray-500">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={sendOtp}
                className="font-semibold text-orange-600 hover:text-orange-700 hover:underline focus:outline-none transition-colors underline-offset-2"
              >
                Resend now
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Set new password
            </h2>
            <p className="text-sm text-gray-500 mb-8 px-2">
              Enter a new password for your account.
            </p>

            <div className="space-y-4 text-left mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-white"
                />
              </div>
            </div>

            <button
              onClick={resetPassword}
              className="w-full py-3.5 px-4 bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Update Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
