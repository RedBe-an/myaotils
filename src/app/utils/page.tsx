'use client';

import { ArrowRightLeft, Book, CaseSensitive, Dices, EarthLock, Hamburger, Music } from "lucide-react";

import { UtilityCard } from "@/components/utils/utilitycard";

export default function UtilsPage() {
  return (
    <section className="surface mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Utilities
        </h1>
        <p className="text-sm text-muted-foreground">All utilities for my easy life</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <UtilityCard
          name="글자 수 세기"
          slug="count-characters"
          status="stable"
          icon={CaseSensitive}
          description="텍스트를 붙여 넣으면 글자 수와 띄어쓰기 등을 한 번에 파악해요."
        />
        <UtilityCard
          name="KICE 국어 지문 다운로드"
          slug="kice-korean-download"
          status="onplan"
          icon={Book}
          description="평가원 국어 지문을 원하는 형식으로 변환하고 내려받을 수 있는 도구입니다."
        />
        <UtilityCard
          name="Voynich"
          slug="voynich"
          status="onplan"
          icon={EarthLock}
          description="아무도 알아볼 수 없는 비밀스러운 암호문을 만들어보세요."
        />
        <UtilityCard
          name="아스키코드 변환"
          slug="change-them-to-ascii"
          status="onplan"
          icon={ArrowRightLeft}
          description="텍스트를 아스키코드로 변환하거나, 아스키코드를 텍스트로 변환해요."
        />
        <UtilityCard
          name="서브웨이 주문 시각화"
          slug="subway-order-generator"
          status="onplan"
          icon={Hamburger}
          description="서브웨이 주문할 때 어려우셨다면 이 도구를 사용해보세요."
        />
        <UtilityCard
          name="랜덤 뽑기"
          slug="random-picker"
          status="onplan"
          icon={Dices}
          description="랜덤하게 무언가를 선택해야 할 때 유용한 도구입니다."
        />
        <UtilityCard
          name="음악 다운로드"
          slug="music-downloader"
          status="onplan"
          icon={Music}
          description="Spotify와 유튜브를 이용해서 음악을 다운로드 받아보세요."
        />
      </div>
    </section>
  );
}
