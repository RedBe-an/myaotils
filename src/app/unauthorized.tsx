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
        <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black text-center">
            <Image src={randomImage} alt="401 Unauthorized" width={240} height={240} className="mb-6 rounded-xl" />
            <H3>401 - 권한이 없습니다.</H3>
            <p>접근 권한이 없는 페이지입니다.</p>
        </div>
    );
};