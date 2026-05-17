import Desktop from "@/components/desktop/Desktop";
import MobileView from "@/components/desktop/MobileView";
import WelcomePopup from "@/components/ui/WelcomePopup";

export default function Home() {
  return (
    <>
      <WelcomePopup />
      {/* Desktop experience */}
      <div className="hidden md:block w-full h-full">
        <Desktop />
      </div>
      {/* Mobile experience */}
      <div className="md:hidden w-full min-h-screen overflow-y-auto">
        <MobileView />
      </div>
    </>
  );
}
