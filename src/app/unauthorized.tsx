import { H3 } from "@/components/ui/typography";
import Image from "next/image";

export default function Custom401() {
  const images = [
    "/401/401 (1).jpg",
    "/401/401.jpg",
    "/401/dog.jpg",
    "/401/FPcL6uEWUAgYtrJ.jpg",
    "/401/ibjb7.jpg",
    "/401/images (1).jpg",
    "/401/images.jpg",
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <section className="surface flex flex-col items-center gap-6 text-center">
      <Image
        src={randomImage}
        alt="401 Unauthorized"
        width={240}
        height={240}
        className="h-48 w-48 rounded-2xl border border-zinc-200/70 object-cover shadow-sm dark:border-zinc-800/80"
      />
      <H3 className="text-zinc-900 dark:text-zinc-100">
        401 - 권한이 없습니다.
      </H3>
      <p className="max-w-sm text-sm text-muted-foreground">
        접근 권한이 없는 페이지입니다.
      </p>
    </section>
  );
}
