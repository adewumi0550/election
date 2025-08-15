import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Future Forward: Vote for Tomorrow
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Your voice, your choice. Participate in the election that will shape our collective future. Make your vote count.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/vote">
                <Button>Cast Your Vote</Button>
              </Link>
              <Link href="/results">
                <Button variant="outline">View Results</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Fair and Transparent Election Process
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform ensures every vote is counted securely and transparently. Explore candidate profiles, understand their manifestos, and make an informed decision.
                </p>
              </div>
              <ul className="grid gap-2 py-4">
                <li>✓ Secure electronic voting</li>
                <li>✓ Real-time result tracking</li>
                <li>✓ Comprehensive candidate information</li>
              </ul>
            </div>
            <img
              alt="Feature"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src="https://placehold.co/550x310.png"
              data-ai-hint="voting democracy"
              width="550"
            />
          </div>
        </div>
      </section>
    </>
  );
}
