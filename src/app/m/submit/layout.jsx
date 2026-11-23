import AllowUserOnly from "@/lib/protection/AllowUserOnly";

export default function SubmitLayout({ children }) {
  return (
    <AllowUserOnly>
      {children}
    </AllowUserOnly>
  );
}
