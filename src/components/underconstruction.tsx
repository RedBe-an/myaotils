import { Typewriter } from "nextjs-simple-typewriter";
import Image from "next/image";

export default function UnderConstruction() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-mono dark:bg-black text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 flex justify-center">
            <Image src="/under-construction.png" alt="Under Construction" width={40} height={40} />
          </div>
          <Typewriter
            words={['Hello.', 'This page is under construction.', 'Please come back later.', 'Thank you.']}
            typeSpeed={40}
            deleteSpeed={30}
            delaySpeed={1000} />
        </div>
    </div>
  );
}
