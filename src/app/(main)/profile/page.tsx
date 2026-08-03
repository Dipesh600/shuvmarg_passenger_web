"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileIdentityCard from "@/components/profile/ProfileIdentityCard";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProfileSecurityCard from "@/components/profile/ProfileSecurityCard";
import UnauthenticatedProfileState from "@/components/profile/UnauthenticatedProfileState";
import { useAuth } from "@/context/AuthContext";
import { request } from "@/lib/api";

interface UserProfileData {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  isVerified?: boolean;
  referralCode?: string;
  profilePicture?: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setIsFetching(true);
    try {
      const res = await request<{ status: boolean; data: UserProfileData }>("/api/getUserDetail");
      if (res.status && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setIsFetching(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Loading State
  if (authLoading || (isAuthenticated && isFetching && !profile)) {
    return (
      <>
        <ProfileHero />
        <section className="bg-[#FAF7F2] py-12 min-h-[60vh]">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="bg-white rounded-2xl p-8 border border-[#E2D6C6] shadow-sm animate-pulse flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-40 bg-neutral-200 rounded" />
                  <div className="h-4 w-28 bg-neutral-100 rounded" />
                </div>
              </div>
              <div className="h-32 bg-neutral-100 rounded-xl" />
              <div className="h-48 bg-neutral-100 rounded-xl" />
            </div>
          </div>
        </section>
      </>
    );
  }

  // Unauthenticated State
  if (!isAuthenticated || !user) {
    return (
      <>
        <ProfileHero />
        <UnauthenticatedProfileState />
      </>
    );
  }

  // Authenticated State
  const displayName = profile?.name || user.name || "Passenger";
  const displayPhone = profile?.phone || user.phone || "";
  const displayEmail = profile?.email || user.email || "";

  return (
    <>
      <ProfileHero />

      <section className="bg-[#FAF7F2] py-8 md:py-12 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">

          <ProfileIdentityCard
            displayName={displayName}
            displayPhone={displayPhone}
            displayEmail={displayEmail}
            displayReferral={profile?.referralCode}
          />

          <ProfileEditForm
            initialName={displayName}
            initialGender={profile?.gender || user.gender || "male"}
            initialAddress={profile?.address || ""}
            displayPhone={displayPhone}
            displayEmail={displayEmail}
            onProfileUpdated={loadProfile}
          />

          <ProfileSecurityCard
            displayName={displayName}
            displayPhone={displayPhone}
          />

        </div>
      </section>
    </>
  );
}
