import Desktop from "@/components/desktop/Desktop";
import MobileView from "@/components/desktop/MobileView";
import WelcomePopup from "@/components/ui/WelcomePopup";

export default function Home() {
  return (
    <>
      {/* Desktop experience */}
      <div className="hidden md:block w-full h-full">
        <WelcomePopup />
        <Desktop />
      </div>
      {/* Mobile experience */}
      <div className="md:hidden w-full min-h-screen overflow-y-auto">
        <MobileView />
      </div>
    </>
  );
}
