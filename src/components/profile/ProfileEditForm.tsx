"use client";

import React, { useState } from "react";
import { Edit3, MapPin, Lock, Save, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { request, ApiRequestError } from "@/lib/api";

interface ProfileEditFormProps {
  initialName: string;
  initialGender: string;
  initialAddress: string;
  displayPhone?: string;
  displayEmail?: string;
  onProfileUpdated?: () => void;
}

export default function ProfileEditForm({
  initialName,
  initialGender,
  initialAddress,
  displayPhone,
  displayEmail,
  onProfileUpdated,
}: ProfileEditFormProps) {
  const { showToast } = useToast();

  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState(initialGender || "male");
  const [address, setAddress] = useState(initialAddress);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await request<{ status: boolean; message?: string }>(
        "/api/updateProfile",
        {
          method: "PATCH",
          body: {
            name: name.trim(),
            gender: gender.toLowerCase(),
            address: address.trim(),
          },
        }
      );

      if (res.status) {
        showToast(res.message || "Profile details updated successfully!", "success");
        if (onProfileUpdated) onProfileUpdated();
      }
    } catch (err) {
      const msg = err instanceof ApiRequestError ? err.message : "Failed to update profile.";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EDE5D8] shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-[#7A1D1B]" />
          <h3 className="text-lg md:text-xl font-bold text-[#111111]">
            Personal Details
          </h3>
        </div>
        <span className="text-xs font-semibold text-neutral-400">
          Context-Aware & Encrypted
        </span>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="w-full h-12 px-4 rounded-xl border border-neutral-300 outline-none focus:border-[#7A1D1B] focus:ring-1 focus:ring-[#7A1D1B] text-neutral-900 font-medium text-sm transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-neutral-300 outline-none focus:border-[#7A1D1B] focus:ring-1 focus:ring-[#7A1D1B] text-neutral-900 font-medium text-sm bg-white transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Phone Number (Read-only security field) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Mobile Number</span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Phone Verified
              </span>
            </label>
            <div className="flex h-12 rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden text-neutral-500 cursor-not-allowed">
              <span className="flex items-center px-4 bg-neutral-100 border-r border-neutral-200 text-xs font-bold">
                +977
              </span>
              <input
                type="text"
                value={displayPhone || ""}
                disabled
                className="w-full px-4 bg-transparent outline-none font-medium text-sm text-neutral-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Email Address (Read-only if present) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Verified
              </span>
            </label>
            <input
              type="email"
              value={displayEmail || "Not Provided"}
              disabled
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 outline-none font-medium text-sm cursor-not-allowed"
            />
          </div>

        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
            Address / City
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Kathmandu, Nepal"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 outline-none focus:border-[#D94328] focus:ring-1 focus:ring-[#D94328] text-neutral-900 font-medium text-sm transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D94328] hover:bg-[#C93522] text-[#FFF6E8] font-bold text-sm rounded-xl transition-all shadow-md shadow-[#D94328]/20 active:scale-95 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Details...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
      </form>
    </div>
  );
}
