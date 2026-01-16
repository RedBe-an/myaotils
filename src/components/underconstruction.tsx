import { Typewriter } from "nextjs-simple-typewriter";
import Image from "next/image";

export default function UnderConstruction() {
  return (
    <section className="surface">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <Image
            src="/under-construction.png"
            alt="Under Construction"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          <Typewriter
            words={[
              "Hello.",
              "This page is under construction.",
              "Please come back later.",
              "Thank you.",
            ]}
            typeSpeed={40}
            deleteSpeed={30}
            delaySpeed={1000}
          />
        </p>
      </div>
    </section>
  );
}
