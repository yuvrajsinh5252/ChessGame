import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { buttonVariants } from "@/Components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 min-h-screen max-sm:pb-10">
          <p>Work in progress...</p>
          <div className="pt-2 text-center">
            <p>Check out the two-player game instead!</p>
            <Link
              className={buttonVariants({ variant: "secondary" }) + " mt-2"}
              href="/two-player"
            >
              Two Player
            </Link>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
