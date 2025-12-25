"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ProfileForm, type ProfileFormValues } from "@/components/forms/profile-form";
import { Loader } from "@/components/loader";
import { updateUserProfile } from "@/lib/api/profile";
import { useUserProfile } from "@/lib/api/tanstack";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profileResponse, isLoading } = useUserProfile();

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      const formData = new FormData();

      if (values.email !== null && values.email !== undefined && values.email !== "") {
        formData.append("email", values.email);
      }
      if (values.phone !== null && values.phone !== undefined && values.phone !== "") {
        // Remove all non-digit characters except the leading + sign
        // This handles spaces, underscores, and any other formatting characters from the input mask
        const hasLeadingPlus = values.phone.trim().startsWith("+");
        const digitsOnly = values.phone.replace(/\D/g, "");
        const cleanedPhone = hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
        formData.append("phone", cleanedPhone);
      }
      if (values.description !== null && values.description !== undefined && values.description !== "") {
        formData.append("description", values.description);
      }
      if (values.photo) {
        formData.append("photo", values.photo);
      }
      if (values.favouriteDanceCategories && values.favouriteDanceCategories.length > 0) {
        formData.append("favouriteDanceCategories", values.favouriteDanceCategories.join(","));
      }

      const result = await updateUserProfile(
        formData,
        typeof document !== 'undefined' ? document.cookie : undefined
      );

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["user:profile"] });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("An unexpected error occurred while updating profile");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader />
        </CardContent>
      </Card>
    );
  }

  const profileData = profileResponse?.userData;

  const initialValues = profileData
    ? {
        email: profileData.email,
        phone: profileData.phone,
        description: profileData.description,
        favouriteDanceCategories: profileData.favouriteDanceCategories,
        name: profileData.name,
        surname: profileData.surname,
        photoPath: profileData.photoPath,
      }
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm
          initialValues={initialValues}
          onSubmit={handleUpdateProfile}
          profileData={profileData}
        />
      </CardContent>
    </Card>
  );
}
