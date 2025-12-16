import Link from "next/link";
import Image from "next/image";
import { libreBaskerville } from "@/lib/fonts";

export default function Home() {
  return (
    <Link href="/poem/1" className="fixed inset-0 w-full h-[100dvh]">
      <div className="relative h-full w-full">
        <Image
          src="/images/poems/cover.jpg"
          alt="Kid's Finger 表紙"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          <h1
            className={`
              ${libreBaskerville.className}
              relative text-center text-[min(8vw,5rem)] whitespace-nowrap
              font-bold leading-normal
              text-transparent bg-clip-text
              bg-gradient-to-b from-white to-white/80
              [text-shadow:_0_4px_24px_rgba(255,255,255,0.2)]
              after:absolute after:inset-0
              after:translate-y-[0.05em] after:translate-x-[0.05em]
              after:text-white/10 after:content-[attr(data-text)]
              after:[text-shadow:_none]
            `}
            data-text="Kid's Finger"
          >
            Kid&apos;s Finger
          </h1>
        </div>
      </div>
    </Link>
  );
}
