import Image from "next/image";

export default function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/dock/background.jpg"
        alt="Wallpaper"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
