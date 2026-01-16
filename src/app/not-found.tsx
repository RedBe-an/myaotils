import { H3 } from "@/components/ui/typography";
import Image from "next/image";

export default function Custom404() {
  const images = [
    "/404/404-not-found.png",
    "/404/humor-not-found.jpg",
    "/404/meme-not-found.jpg",
    "/404/page-404-not-found.jpg",
    "/404/time-not-foud.jpg",
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <section className="surface flex flex-col items-center gap-6 text-center">
      <Image
        src={randomImage}
        alt="404 Not Found"
        width={240}
        height={240}
        className="h-48 w-48 rounded-2xl border border-zinc-200/70 object-cover shadow-sm dark:border-zinc-800/80"
      />
      <H3 className="text-zinc-900 dark:text-zinc-100">
        404 - 페이지를 찾을 수 없습니다.
      </H3>
      <p className="max-w-sm text-sm text-muted-foreground">
        잘못된 경로로 접근하셨습니다.
      </p>
    </section>
  );
}
