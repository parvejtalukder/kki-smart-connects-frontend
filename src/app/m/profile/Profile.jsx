"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Camera,
  Edit,
  FilePen,
  Globe2,
  Link2,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import SelectLanguage from "@/components/popups/SelectLanguage";
import { useEffect, useRef, useState } from "react";
import apiFetch from "@/utils/apiFetch";
import toast from "react-hot-toast";

const PLATFORM_KEY = /^[a-z0-9_-]{1,30}$/;

export default function Profile() {
  const { user, refreshUser, updateUser } = useAuth();
  const dbUser = user?.dbUser;
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    gender: "",
    socialLinks: [],
  });
  const previewUrlRef = useRef("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const role = dbUser?.role
    ? dbUser.role.charAt(0).toUpperCase() + dbUser.role.slice(1)
    : "Member";
  const status = dbUser?.status
    ? dbUser.status.charAt(0).toUpperCase() + dbUser.status.slice(1)
    : "Unavailable";
  const gender = dbUser?.gender
    ? dbUser.gender.charAt(0).toUpperCase() + dbUser.gender.slice(1)
    : "Not specified";
  const bio = dbUser?.bio?.trim() || "No bio added yet.";

  const displayNames = new Intl.DisplayNames(["en"], {
    type: "language",
  });
  const languageName = dbUser?.language
    ? displayNames.of(dbUser.language) || dbUser.language
    : "Not selected";

  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "Not available";

  const initials =
    dbUser?.displayName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";
  
  const socialLinks = Array.isArray(dbUser?.socialLinks)
    ? dbUser.socialLinks
        .map((link) => {
          if (typeof link === "string") {
            return { label: "Social profile", href: link };
          }
          return {
            label: link?.label || link?.platform || link?.name || "Social profile",
            href: link?.url || link?.href || link?.link,
          };
        })
        .filter((link) => link.href)
    : dbUser?.socialLinks && typeof dbUser.socialLinks === "object"
      ? Object.entries(dbUser.socialLinks)
          .filter(([, href]) => typeof href === "string" && href.trim())
          .map(([platform, href]) => ({
            label: platform.charAt(0).toUpperCase() + platform.slice(1),
            href,
          }))
      : [];

  useEffect(() => {
    if (dbUser && !dbUser.language) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowLanguagePopup(true);
    }
  }, [dbUser]);

  const handleLanguageSelect = () => {
    setShowLanguagePopup(false);
  };

  const openEditProfile = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setProfileImage(null);
    setProfileImagePreview(dbUser?.photoURL || "");
    setProfileForm({
      displayName: dbUser?.displayName || "",
      bio: dbUser?.bio || "",
      gender: dbUser?.gender || "",
      socialLinks: Array.isArray(dbUser?.socialLinks)
        ? dbUser.socialLinks.map((link) => {
            if (typeof link === "string") {
              return { platform: "", url: link };
            }
            return {
              platform: link?.label || link?.platform || link?.name || "",
              url: link?.url || link?.href || link?.link || "",
            };
          })
        : dbUser?.socialLinks && typeof dbUser.socialLinks === "object"
          ? Object.entries(dbUser.socialLinks)
              .filter(([, url]) => typeof url === "string" && url.trim())
              .map(([platform, url]) => ({ platform, url }))
          : [],
    });
    setShowEditProfile(true);
  };

  const closeEditProfile = () => {
    if (savingProfile) return;
    setShowEditProfile(false);
  };

  const updateProfileField = (field, value) => {
    setProfileForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setProfileForm((previous) => ({
      ...previous,
      socialLinks: previous.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addSocialLink = () => {
    setProfileForm((previous) => ({
      ...previous,
      socialLinks: [...previous.socialLinks, { platform: "", url: "" }],
    }));
  };

  const removeSocialLink = (index) => {
    setProfileForm((previous) => ({
      ...previous,
      socialLinks: previous.socialLinks.filter(
        (_, linkIndex) => linkIndex !== index
      ),
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    setProfileImage(file);
    setProfileImagePreview(objectUrl);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const displayName = profileForm.displayName.trim();

    if (!displayName) {
      toast.error("Display name is required.");
      return;
    }

    const socialLinks = {};

    for (const link of profileForm.socialLinks) {
      const platform = link.platform.trim().toLowerCase();
      const url = link.url.trim();

      if (!platform && !url) continue;

      if (!platform || !url) {
        toast.error("Each social link needs both a platform and a URL.");
        return;
      }

      if (!PLATFORM_KEY.test(platform)) {
        toast.error(
          `"${link.platform.trim()}" is not a valid platform name. Use letters, numbers, "-" or "_".`
        );
        return;
      }

      if (platform in socialLinks) {
        toast.error(`You have more than one "${platform}" link.`);
        return;
      }

      socialLinks[platform] = url;
    }

    setSavingProfile(true);

    try {
      let newPhotoURL = "";

      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const upload = await apiFetch("/uploads/profile", {
          method: "POST",
          body: formData,
        });

        newPhotoURL = upload?.data?.url || "";

        if (!newPhotoURL) {
          throw new Error("Photo upload did not return a URL. Please try again.");
        }
      }

      const payload = {
        displayName,
        bio: profileForm.bio.trim(),
        gender: profileForm.gender,
        socialLinks,
        ...(newPhotoURL ? { photoURL: newPhotoURL } : {}),
      };

      const data = await apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      try {
        await updateUser({
          displayName,
          ...(newPhotoURL ? { photoURL: newPhotoURL } : {}),
        });
      } catch (error) {
        console.error("Firebase profile sync failed:", error);
      }

      await refreshUser();

      toast.success(data?.message || "Profile updated successfully.");
      setShowEditProfile(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <>
      {showLanguagePopup && (
        <SelectLanguage
          open={showLanguagePopup}
          onOpenChange={setShowLanguagePopup}
          currentLanguage={dbUser?.language}
          onLanguageSelect={handleLanguageSelect}
        />
      )}

      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-24 pt-5 sm:px-6 md:py-8 lg:px-8">
        <div className="mb-5 flex items-center justify-between md:mb-6">
          <div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Profile
            </h1>
          </div>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <div className="space-y-4">
            <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-sm">
              <div className="relative h-24 overflow-hidden bg-gradient-to-r from-amber-200 via-orange-100 to-amber-50 sm:h-32 lg:h-44">
                <div className="absolute -right-16 -top-24 size-64 rounded-full border border-amber-300/40" />
                <div className="absolute right-12 top-8 size-24 rounded-full border border-amber-300/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_38%)]" />
              </div>
              <CardContent className="relative px-5 pb-5 sm:px-6 lg:px-8 lg:pb-8">
                <div className="-mt-12 flex items-end justify-between gap-3 sm:-mt-14 lg:-mt-16">
                  <Avatar className="size-24 border-4 border-white shadow-md sm:size-28 lg:size-32">
                    <AvatarImage
                      src={dbUser?.photoURL}
                      alt={dbUser?.displayName || "User"}
                    />
                    <AvatarFallback className="bg-amber-500 text-xl font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mb-1 flex gap-2 lg:mb-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openEditProfile}
                      className="h-9 border-slate-200 bg-white px-3 text-slate-700 sm:h-10 lg:px-4"
                    >
                      <Edit className="size-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-9 bg-amber-500 px-3 text-white hover:bg-amber-600 sm:h-10 lg:px-4"
                    >
                      <FilePen className="size-4" />
                      <span>Application</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
                    {dbUser?.displayName || "User"}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {role}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 lg:text-base">
                    {bio}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white p-0 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-bold text-slate-900">Social media</h3>
                {socialLinks.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {socialLinks.map((link, index) => (
                      <a
                        key={`${link.label}-${link.href}-${index}`}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex max-w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                      >
                        <Link2 className="size-3.5 shrink-0 text-amber-600" />
                        <span className="truncate">{link.label}</span>
                      </a>
                    ))}
                  </div>
                )}
                {socialLinks.length === 0 && (
                  <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                    No public social profiles yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white p-0 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-bold text-slate-900">Posts</h3>
                <div className="mt-3 min-h-36 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center sm:min-h-44 sm:flex sm:flex-col sm:items-center sm:justify-center">
                  <p className="text-sm font-semibold text-slate-700">No posts yet</p>
                  <p className="mt-1 text-xs text-slate-400">
                    New posts will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-slate-200 bg-white p-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-slate-900">Account details</h3>
                <dl className="mt-4 divide-y divide-slate-100">
                  <div className="py-3">
                    <dt className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="size-3.5 text-amber-600" />
                      Member since
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{memberSince}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="size-3.5 text-amber-600" />
                      Role
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{role}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="flex items-center gap-2 text-xs text-slate-500">
                      <UserRound className="size-3.5 text-amber-600" />
                      Gender
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{gender}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white p-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-slate-900">Community</h3>
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowLanguagePopup(true)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left transition hover:border-amber-200 hover:bg-amber-50"
                  >
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Globe2 className="size-4 text-amber-600" />
                      Language
                    </span>
                    <span className="max-w-32 truncate text-sm font-semibold text-slate-800">
                      {languageName}
                    </span>
                  </button>

                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <ShieldCheck className="size-4 text-amber-600" />
                      Status
                    </span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <span
                        className={`size-2 rounded-full ${
                          dbUser?.status === "active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {showEditProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditProfile();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
          >
            <form onSubmit={handleSaveProfile}>
              <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
                <div>
                  <h2 id="edit-profile-title" className="text-lg font-bold text-slate-900">
                    Edit profile
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Update your public profile information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEditProfile}
                  disabled={savingProfile}
                  aria-label="Close edit profile"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                >
                  <X className="size-5" />
                </button>
              </header>

              <div className="space-y-5 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Avatar className="size-20 shrink-0 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={profileImagePreview}
                      alt={profileForm.displayName || "Profile photo"}
                    />
                    <AvatarFallback className="bg-amber-500 font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <label
                      htmlFor="edit-profile-photo"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                    >
                      <Camera className="size-4 text-amber-600" />
                      Change photo
                    </label>
                    <input
                      id="edit-profile-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      JPG, PNG, or WebP. Maximum 5 MB.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Display name
                    </span>
                    <input
                      type="text"
                      value={profileForm.displayName}
                      onChange={(event) =>
                        updateProfileField("displayName", event.target.value)
                      }
                      maxLength={100}
                      required
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Bio
                    </span>
                    <textarea
                      value={profileForm.bio}
                      onChange={(event) =>
                        updateProfileField("bio", event.target.value)
                      }
                      rows={4}
                      maxLength={500}
                      placeholder="Give your short bio here..."
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                    <span className="mt-1 block text-right text-xs text-slate-400">
                      {profileForm.bio.length}/500
                    </span>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Gender
                    </span>
                    <select
                      value={profileForm.gender}
                      onChange={(event) =>
                        updateProfileField("gender", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    >
                      <option value="">Not specified</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Social media
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Add Facebook, X, LinkedIn, or another profile.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                    >
                      <Plus className="size-3.5 text-amber-600" />
                      Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {profileForm.socialLinks.length === 0 ? (
                      <button
                        type="button"
                        onClick={addSocialLink}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 transition hover:border-amber-300 hover:bg-amber-50"
                      >
                        <Plus className="size-4" />
                        Add a social profile
                      </button>
                    ) : (
                      profileForm.socialLinks.map((link, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[minmax(100px,140px)_minmax(0,1fr)_36px] gap-2"
                        >
                          <input
                            type="text"
                            value={link.platform}
                            onChange={(event) =>
                              updateSocialLink(index, "platform", event.target.value)
                            }
                            placeholder="Platform"
                            className="h-10 min-w-0 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-400"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(event) =>
                              updateSocialLink(index, "url", event.target.value)
                            }
                            placeholder="https://..."
                            className="h-10 min-w-0 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeSocialLink(index)}
                            aria-label={`Remove ${link.platform || "social link"}`}
                            className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditProfile}
                  disabled={savingProfile}
                  className="h-10 border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="h-10 bg-amber-500 px-5 text-white hover:bg-amber-600"
                >
                  {savingProfile ? "Saving..." : "Save changes"}
                </Button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
