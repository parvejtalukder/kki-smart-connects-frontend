"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import useAuth from "@/hooks/useAuth";
import { dateOfToday } from "@/utils/timeAgo";

const inputClass =
  "input input-bordered h-12 w-full rounded-xl border-paper-200 bg-white text-ink focus:border-royal-500 focus:outline-none focus:ring-2 focus:ring-royal-500/25";
const textareaClass =
  "textarea textarea-bordered min-h-28 w-full rounded-xl border-paper-200 bg-white text-ink focus:border-royal-500 focus:outline-none focus:ring-2 focus:ring-royal-500/25";
const lockedInputClass =
  "input input-bordered h-12 w-full cursor-not-allowed rounded-xl border-paper-200 bg-paper-100 text-ink-500";
const lockedTextareaClass =
  "textarea textarea-bordered min-h-28 w-full cursor-not-allowed rounded-xl border-paper-200 bg-paper-100 text-ink-500";

const WORK_CATEGORIES = ["Poem", "Article", "Story", "Essay"];
const POEM_SET_SIZE = 3;
const SINGLE_WORK_COUNT = 1;
const MIN_CONTENT_LENGTH = 50;
const MAX_CONTENT_LENGTH = 10000;
const MIN_BIOGRAPHY_LENGTH = 50;

const createWork = () => ({ title: "", theme: "", content: "" });
const getWorkCount = (category) =>
  category === "Poem" ? POEM_SET_SIZE : SINGLE_WORK_COUNT;

const getTodayInputValue = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
};

const Submit = () => {
  const { user } = useAuth();
  const dbUser = user?.dbUser;

  const profileName = dbUser?.displayName || user?.displayName || "";
  const profileEmail = dbUser?.email || user?.email || "";
  const profilePhoto = dbUser?.photoURL || user?.photoURL || "";
  const profileGender = dbUser?.gender || "";
  const profileBio = dbUser?.bio?.trim() || "";

  const [details, setDetails] = useState({
    fullName: "",
    gender: "",
    email: "",
    biography: "",
    dateOfBirth: "",
    phone: "",
    address: "",
  });
  const [submissionType, setSubmissionType] = useState("");
  const [works, setWorks] = useState([createWork()]);
  const [formStatus, setFormStatus] = useState(null);

  const updateDetail = (field) => (event) => {
    const { value } = event.target;
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const updateWork = (index, field) => (event) => {
    const { value } = event.target;
    setWorks((current) =>
      current.map((work, workIndex) =>
        workIndex === index ? { ...work, [field]: value } : work
      )
    );
  };

  const handleSubmissionType = (event) => {
    const { value } = event.target;
    const count = value ? getWorkCount(value) : SINGLE_WORK_COUNT;

    setSubmissionType(value);
    setWorks((current) =>
      Array.from({ length: count }, (_, index) => current[index] || createWork())
    );
    setFormStatus(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!submissionType) {
      setFormStatus({
        tone: "error",
        message: "Choose what you want to submit: poem, article, story, or essay.",
      });
      return;
    }

    const requiredCount = getWorkCount(submissionType);

    if (works.length !== requiredCount) {
      setFormStatus({
        tone: "error",
        message:
          submissionType === "Poem"
            ? `Poems are submitted as a set of ${POEM_SET_SIZE}. Fill all ${POEM_SET_SIZE} poem boxes.`
            : `One ${submissionType.toLowerCase()} is submitted per application.`,
      });
      return;
    }

    const cleanedWorks = works.map((work) => ({
      category: submissionType,
      title: work.title.trim(),
      theme: work.theme.trim(),
      content: work.content.trim(),
    }));

    const incompleteIndex = cleanedWorks.findIndex(
      (work) => !work.title || !work.theme || work.content.length < MIN_CONTENT_LENGTH
    );

    if (incompleteIndex !== -1) {
      const target =
        submissionType === "Poem"
          ? `poem ${incompleteIndex + 1}`
          : `the ${submissionType.toLowerCase()}`;

      setFormStatus({
        tone: "error",
        message: `Add a title, theme, and at least ${MIN_CONTENT_LENGTH} characters of content for ${target}.`,
      });
      return;
    }

    // Frontend-only for now: send this payload to your API when the endpoint is ready.
    // {
    //   submissionType,
    //   applicant: {
    //     fullName: profileName || details.fullName,
    //     email: profileEmail || details.email,
    //     gender: profileGender || details.gender,
    //     biography: profileBio || details.biography,
    //     dateOfBirth: details.dateOfBirth,
    //     phone: details.phone,
    //     address: details.address,
    //     photoURL: profilePhoto,
    //   },
    //   works: cleanedWorks.map((work) => ({
    //     ...work,
    //     authorName: profileName || details.fullName,
    //   })),
    // }
    setFormStatus({
      tone: "success",
      message:
        submissionType === "Poem"
          ? `Application checked successfully. ${POEM_SET_SIZE} poems are ready for submission.`
          : `Application checked successfully. Your ${submissionType.toLowerCase()} is ready for submission.`,
    });
  };

  return (
    <main className="min-h-screen bg-paper p-3 sm:p-6 lg:p-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-paper-200 bg-white shadow-xl"
      >
        <header className="border-b border-brand-800/40 bg-brand-900 px-5 py-6 text-white sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-300">
            {dateOfToday()}
          </p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            Application for Authorship
          </h1>
          <p className="mt-2 text-sm text-brand-100">
            To: Editorial Board, KKI Smart Connects
          </p>
        </header>

        <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Applicant details</h2>
            <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
                <FiLock size={13} /> Locked fields
              </span>
              are taken from your profile and cannot be edited here.
              <Link
                href="/m/profile"
                className="font-semibold text-ink underline underline-offset-2 hover:text-royal-700"
              >
                Update your profile
              </Link>
            </p>

            <div className="mb-5 flex items-center gap-4 rounded-2xl border border-paper-200 bg-paper-50 p-4">
              <div className="size-16 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow sm:size-20">
                {profilePhoto ? (
                  <div
                    role="img"
                    aria-label={`${profileName || "Applicant"} profile photo`}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${profilePhoto}")` }}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-ink-300">
                    <FiUser size={26} />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-ink">
                  {profileName || "Applicant"}
                </p>
                <p className="truncate text-sm text-ink-500">
                  {profileEmail || "No email on file"}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  Your profile photo is used on this application.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control">
                <span className="label-text mb-2 font-semibold text-ink-700">
                  Full name
                  {profileName && (
                    <span className="ml-2 text-xs font-normal text-ink-300">
                      locked from profile
                    </span>
                  )}
                </span>
                <span className="relative">
                  <FiUser className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-ink-300" />
                  <input
                    id="fullName"
                    value={profileName || details.fullName}
                    onChange={updateDetail("fullName")}
                    readOnly={Boolean(profileName)}
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={`${profileName ? lockedInputClass : inputClass} pl-11`}
                  />
                </span>
              </label>

              <label className="form-control">
                <span className="label-text mb-2 font-semibold text-ink-700">Date of birth</span>
                <span className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-ink-300" />
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={details.dateOfBirth}
                    onChange={updateDetail("dateOfBirth")}
                    required
                    max={getTodayInputValue()}
                    className={`${inputClass} pl-11`}
                  />
                </span>
              </label>

              <label className="form-control">
                <span className="label-text mb-2 font-semibold text-ink-700">
                  Gender
                  {profileGender && (
                    <span className="ml-2 text-xs font-normal text-ink-300">
                      locked from profile
                    </span>
                  )}
                </span>
                <select
                  id="gender"
                  value={profileGender || details.gender}
                  onChange={updateDetail("gender")}
                  disabled={Boolean(profileGender)}
                  required
                  className={`${profileGender ? `${lockedInputClass} appearance-none` : inputClass} px-4`}
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </label>

              <label className="form-control">
                <span className="label-text mb-2 font-semibold text-ink-700">
                  Email address
                  {profileEmail && (
                    <span className="ml-2 text-xs font-normal text-ink-300">
                      locked from account
                    </span>
                  )}
                </span>
                <span className="relative">
                  <FiMail className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-ink-300" />
                  <input
                    id="email"
                    type="email"
                    value={profileEmail || details.email}
                    onChange={updateDetail("email")}
                    readOnly={Boolean(profileEmail)}
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`${profileEmail ? lockedInputClass : inputClass} pl-11`}
                  />
                </span>
              </label>

              <label className="form-control sm:col-span-2">
                <span className="label-text mb-2 font-semibold text-ink-700">Phone number</span>
                <span className="relative">
                  <FiPhone className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-ink-300" />
                  <input
                    id="phone"
                    type="tel"
                    value={details.phone}
                    onChange={updateDetail("phone")}
                    required
                    maxLength={30}
                    autoComplete="tel"
                    placeholder="Include country code"
                    className={`${inputClass} pl-11`}
                  />
                </span>
              </label>

              <label className="form-control sm:col-span-2">
                <span className="label-text mb-2 font-semibold text-ink-700">Address</span>
                <textarea
                  id="address"
                  value={details.address}
                  onChange={updateDetail("address")}
                  required
                  maxLength={300}
                  autoComplete="street-address"
                  placeholder="House, road, area, city, country"
                  className={textareaClass}
                />
              </label>

              <label className="form-control sm:col-span-2">
                <span className="label-text mb-2 flex items-center justify-between gap-3 font-semibold text-ink-700">
                  <span>
                    Biography
                    {profileBio && (
                      <span className="ml-2 text-xs font-normal text-ink-300">
                        locked from profile
                      </span>
                    )}
                  </span>
                  {!profileBio && (
                    <span className="text-xs font-normal text-ink-300">
                      {details.biography.length}/2000
                    </span>
                  )}
                </span>
                <textarea
                  id="biography"
                  value={profileBio || details.biography}
                  onChange={updateDetail("biography")}
                  readOnly={Boolean(profileBio)}
                  required
                  minLength={MIN_BIOGRAPHY_LENGTH}
                  maxLength={2000}
                  placeholder="Describe your writing journey, experience, publications, and interests (minimum 50 characters)."
                  className={profileBio ? lockedTextareaClass : textareaClass}
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-ink">
              <FiBookOpen /> Your submission
            </h2>
            <p className="mb-4 text-sm text-ink-500">
              Choose what you want to submit. Poems are submitted as a set of {POEM_SET_SIZE};
              articles, stories, and essays are submitted one at a time. The author name is
              published from your profile.
            </p>

            <label className="block sm:max-w-sm">
              <span className="label-text mb-2 block font-semibold text-ink-700">
                What do you want to submit?
              </span>
              <select
                value={submissionType}
                onChange={handleSubmissionType}
                required
                className={`${inputClass} px-4`}
              >
                <option value="">Select category</option>
                {WORK_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs text-ink-500">
                {submissionType === "Poem"
                  ? `${POEM_SET_SIZE} poems are required for a poetry submission.`
                  : submissionType
                    ? `One ${submissionType.toLowerCase()} is submitted per application.`
                    : "Pick a category to open the submission box."}
              </span>
            </label>

            <div className="mt-5 space-y-4">
              {submissionType &&
                works.map((work, index) => (
                  <fieldset
                    key={index}
                    className="rounded-2xl border border-paper-200 bg-paper-50 p-4 sm:p-5"
                  >
                    <legend className="px-2 text-sm font-bold text-ink">
                      {submissionType === "Poem"
                        ? `Poem ${index + 1} of ${POEM_SET_SIZE}`
                        : submissionType}
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="label-text mb-2 block font-semibold text-ink-700">
                          Title
                        </span>
                        <input
                          value={work.title}
                          onChange={updateWork(index, "title")}
                          required
                          maxLength={150}
                          placeholder="Enter the work title"
                          className={inputClass}
                        />
                      </label>

                      <label>
                        <span className="label-text mb-2 block font-semibold text-ink-700">
                          Theme
                        </span>
                        <input
                          value={work.theme}
                          onChange={updateWork(index, "theme")}
                          required
                          maxLength={150}
                          placeholder="What is this piece about?"
                          className={inputClass}
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="label-text mb-2 flex items-center justify-between gap-3 font-semibold text-ink-700">
                          <span>
                            {submissionType === "Poem" ? "Poem text" : `${submissionType} content`}
                          </span>
                          <span className="text-xs font-normal text-ink-300">
                            {work.content.length}/{MAX_CONTENT_LENGTH}
                          </span>
                        </span>
                        <textarea
                          value={work.content}
                          onChange={updateWork(index, "content")}
                          required
                          minLength={MIN_CONTENT_LENGTH}
                          maxLength={MAX_CONTENT_LENGTH}
                          rows={10}
                          placeholder={
                            submissionType === "Poem"
                              ? "Paste the full poem here."
                              : `Paste the full ${submissionType.toLowerCase()} here.`
                          }
                          className={textareaClass}
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="label-text mb-2 block font-semibold text-ink-700">
                          Author name
                        </span>
                        <input
                          value={profileName || details.fullName || "Complete your profile name"}
                          readOnly
                          aria-describedby={`work-${index}-author-hint`}
                          className={lockedInputClass}
                        />
                        <span
                          id={`work-${index}-author-hint`}
                          className="mt-2 flex items-center gap-1 text-xs text-ink-500"
                        >
                          <FiLock size={12} /> Taken from your profile and cannot be edited here.
                        </span>
                      </label>
                    </div>
                  </fieldset>
                ))}
            </div>
          </section>

          {formStatus && (
            <p
              role="status"
              aria-live="polite"
              className={`rounded-xl p-3 text-sm ${
                formStatus.tone === "success"
                  ? "bg-royal-50 text-royal-700"
                  : "bg-error/10 text-error"
              }`}
            >
              {formStatus.message}
            </p>
          )}

          <button
            type="submit"
            className="btn h-14 min-h-14 w-full rounded-xl border-0 bg-royal-700 text-base font-bold text-white shadow-lg hover:bg-royal-800"
          >
            Check application
          </button>
        </div>
      </form>
    </main>
  );
};

export default Submit;
