"use client";

import { useMemo, useState } from "react";
import { Check, Languages, Search, X } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const languageCodes = [
  "aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az",
  "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs",
  "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy",
  "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu",
  "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu",
  "ha", "he", "hi", "hr", "ht", "hu", "hy", "ia", "id", "ie", "ig", "is",
  "it", "ja", "jv", "ka", "kg", "kk", "km", "kn", "ko", "ks", "ku", "kw",
  "ky", "la", "lb", "lg", "ln", "lo", "lt", "lv", "mg", "mi", "mk", "ml",
  "mn", "mr", "ms", "mt", "my", "nb", "ne", "nl", "nn", "no", "ny", "oc",
  "om", "or", "os", "pa", "pl", "ps", "pt", "qu", "ro", "ru", "rw", "sa",
  "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "su", "sv", "sw",
  "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "tt", "ug",
  "uk", "ur", "uz", "vi", "wo", "xh", "yi", "yo", "zh", "zu",
];

const displayNames = new Intl.DisplayNames(["en"], {
  type: "language",
});

const languages = languageCodes
  .map((code) => ({
    code,
    name: displayNames.of(code) || code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function SelectLanguage({
  open,
  onOpenChange,
  currentLanguage,
  onLanguageSelect,
}) {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    currentLanguage || ""
  );

  const filteredLanguages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return languages;

    return languages.filter(
      ({ code, name }) =>
        name.toLowerCase().includes(query) ||
        code.toLowerCase().includes(query)
    );
  }, [search]);

  const closeDialog = () => onOpenChange?.(false);

const { user, setLoading } = useAuth();
// console.log(user);

const handleContinue = async () => {
  if (!selectedLanguage) return;

  try {
    const token = await user.accessToken;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/update/language`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          language: selectedLanguage,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update language.");
    }

    onLanguageSelect?.(selectedLanguage);
    toast.success("Language selected successfully!");
    window.location.reload();
    closeDialog();
  } catch (error) {
    toast.error(error.message || "Failed to save language.");
  }
};

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-dialog-title"
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-5 overflow-hidden rounded-2xl border bg-background p-5 text-foreground shadow-2xl"
      >
        <header className="relative pr-8">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Languages className="size-6" />
          </div>

          <h2 id="language-dialog-title" className="text-xl font-semibold">
            Choose your language
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Search and select your preferred language for KKI Smart Connects.
          </p>

          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close language selection"
            className="absolute right-0 top-0 rounded-lg p-2 hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search languages..."
            autoFocus
            className="h-11 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
          {filteredLanguages.length ? (
            filteredLanguages.map(({ code, name }) => {
              const selected = selectedLanguage === code;

              return (
                <button
                  type="button"
                  key={code}
                  onClick={() => setSelectedLanguage(code)}
                  className={`flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-accent ${
                    selected ? "bg-accent" : ""
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium">{name}</span>
                    <span className="text-xs uppercase text-muted-foreground">
                      {code}
                    </span>
                  </span>

                  {selected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              );
            })
          ) : (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No languages found.
            </p>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3">
          <span className="truncate text-sm text-muted-foreground">
            {selectedLanguage
              ? displayNames.of(selectedLanguage)
              : "Select a language"}
          </span>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Set It
          </button>
        </footer>
      </section>
    </div>
  );
}