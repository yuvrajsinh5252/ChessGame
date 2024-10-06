import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ThemeToggle from "./themes/theme-toggle"

export default function Navbar() {
  return (
    <div className="w-full fixed mt-2">
      <MaxWidthWrapper className="w-full flex justify-between p-4 bg-blend-color-burn rounded-lg">
        <div className="flex  items-center space-x-2">
          <Image src="/logo.png" width={40} height={40} alt="logo" />
          <a href="/" className="text-lg font-bold">ChessMate</a>
        </div>
        <ThemeToggle />
      </MaxWidthWrapper>
    </div>
  );
}