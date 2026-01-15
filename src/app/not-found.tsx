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
        <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black text-center">
            <Image src={randomImage} alt="404 Not Found" width={240} height={240} className="mb-6 rounded-xl" />
            <H3>404 - 페이지를 찾을 수 없습니다.</H3>
            <p>잘못된 경로로 접근하셨습니다.</p>
        </div>
    );
};