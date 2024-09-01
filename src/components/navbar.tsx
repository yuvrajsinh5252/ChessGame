import MaxWidthWrapper from "./MaxWidthWrapper";
import ThemeToggle from "./themes/theme-toggle"

export default function Navbar() {
  return (
    <div className="w-full fixed mt-2">
      <MaxWidthWrapper className="w-full flex justify-between p-4 bg-blend-color-burn rounded-lg">
        <div className="flex  items-center space-x-4">
          <a href="/" className="text-lg font-bold">ChessMate</a>
        </div>
        <ThemeToggle />
      </MaxWidthWrapper>
    </div>
  );
}