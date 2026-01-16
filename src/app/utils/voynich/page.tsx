"use client";

import { useMemo, useState } from "react";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const rotl32 = (value: number, shift: number) =>
  ((value << shift) | (value >>> (32 - shift))) >>> 0;

const roundConstants = [
  0x9e3779b9, 0x7f4a7c15, 0xf39cc060, 0x106aa070, 0xbb67ae85, 0x3c6ef372,
  0xa54ff53a, 0x510e527f, 0x1f83d9ab, 0x5be0cd19, 0xc2b2ae3d, 0x27d4eb2f,
];

const permute = (state: Uint32Array) => {
  for (let round = 0; round < 12; round += 1) {
    for (let i = 0; i < 16; i += 1) {
      const a = state[i];
      const b = state[(i + 5) % 16];
      const c = state[(i + 10) % 16];
      state[i] = (a + rotl32(b, 7)) ^ rotl32(c, 11);
    }

    const shuffled = new Uint32Array(16);
    const order = [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11];
    for (let i = 0; i < 16; i += 1) {
      shuffled[i] = state[order[i]];
    }
    state.set(shuffled);

    state[0] ^= roundConstants[round];
    state[7] ^= rotl32(state[3], 13);
    state[12] ^= rotl32(state[9], 9);
  }
};

const bytesToU32Le = (bytes: Uint8Array, offset: number) =>
  (bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)) >>>
  0;

const u32ToBytesLe = (value: number, out: Uint8Array, offset: number) => {
  out[offset] = value & 0xff;
  out[offset + 1] = (value >>> 8) & 0xff;
  out[offset + 2] = (value >>> 16) & 0xff;
  out[offset + 3] = (value >>> 24) & 0xff;
};

const padToWord = (input: Uint8Array) => {
  const paddedLength = Math.ceil((input.length + 1) / 4) * 4;
  const out = new Uint8Array(paddedLength);
  out.set(input);
  out[input.length] = 0x80;
  return out;
};

const initState = (key: Uint8Array, nonce: Uint8Array) => {
  const state = new Uint32Array(16);
  for (let i = 0; i < 8; i += 1) {
    state[i] = bytesToU32Le(key, i * 4);
  }
  for (let i = 0; i < 4; i += 1) {
    state[8 + i] = bytesToU32Le(nonce, i * 4);
  }
  state[12] = 0xa5a5a5a5;
  state[13] = 0x3c3c3c3c;
  state[14] = 0x5a5a5a5a;
  state[15] = 0xc3c3c3c3;
  return state;
};

const absorbAd = (state: Uint32Array, ad: Uint8Array) => {
  if (ad.length === 0) {
    return;
  }
  const padded = padToWord(ad);
  for (let i = 0; i < padded.length; i += 4) {
    const word = bytesToU32Le(padded, i);
    state[(i / 4) % 16] ^= word;
    permute(state);
  }
};

const generateKeystream = (state: Uint32Array, length: number) => {
  const out = new Uint8Array(length);
  let offset = 0;
  while (offset < length) {
    permute(state);
    const block = new Uint8Array(32);
    for (let i = 0; i < 8; i += 1) {
      u32ToBytesLe(state[i], block, i * 4);
    }
    const chunk = Math.min(block.length, length - offset);
    out.set(block.subarray(0, chunk), offset);
    offset += chunk;
  }
  return out;
};

const finalizeTag = (
  state: Uint32Array,
  adLength: number,
  msgLength: number,
) => {
  state[0] ^= adLength >>> 0;
  state[1] ^= msgLength >>> 0;
  permute(state);
  permute(state);
  const tag = new Uint8Array(16);
  for (let i = 0; i < 4; i += 1) {
    u32ToBytesLe(state[8 + i], tag, i * 4);
  }
  return tag;
};

const xorBytes = (a: Uint8Array, b: Uint8Array) => {
  const out = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i += 1) {
    out[i] = a[i] ^ b[i];
  }
  return out;
};

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

const fromHex = (value: string) => {
  const clean = value.trim().replace(/^0x/i, "").replace(/\s+/g, "");
  if (clean.length % 2 !== 0) {
    return null;
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    const byte = Number.parseInt(clean.slice(i, i + 2), 16);
    if (Number.isNaN(byte)) {
      return null;
    }
    out[i / 2] = byte;
  }
  return out;
};

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  try {
    const binary = atob(value.trim());
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  } catch {
    return null;
  }
};

const createRandomHex = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
};

export default function VoynichPage() {
  const [keyHex, setKeyHex] = useState(() => createRandomHex(32));
  const [nonceHex, setNonceHex] = useState(() => createRandomHex(16));
  const [adInput, setAdInput] = useState("");
  const [plainInput, setPlainInput] = useState("");
  const [cipherInput, setCipherInput] = useState("");

  const keyBytes = useMemo(() => fromHex(keyHex), [keyHex]);
  const nonceBytes = useMemo(() => fromHex(nonceHex), [nonceHex]);

  const errors = useMemo(() => {
    const next: string[] = [];
    if (!keyBytes || keyBytes.length !== 32) {
      next.push("키는 32바이트(64 hex)여야 합니다.");
    }
    if (!nonceBytes || nonceBytes.length !== 16) {
      next.push("논스는 16바이트(32 hex)여야 합니다.");
    }
    return next;
  }, [keyBytes, nonceBytes]);

  const encryptResult = useMemo(() => {
    if (errors.length > 0 || !keyBytes || !nonceBytes) {
      return { cipher: "", tag: "" };
    }
    const state = initState(keyBytes, nonceBytes);
    const adBytes = encoder.encode(adInput);
    absorbAd(state, adBytes);
    const plainBytes = encoder.encode(plainInput);
    const keystream = generateKeystream(state, plainBytes.length);
    const cipherBytes = xorBytes(plainBytes, keystream);
    const tag = finalizeTag(state, adBytes.length, plainBytes.length);
    return { cipher: toBase64(cipherBytes), tag: toHex(tag) };
  }, [adInput, errors.length, keyBytes, nonceBytes, plainInput]);

  const decryptResult = useMemo(() => {
    if (errors.length > 0 || !keyBytes || !nonceBytes) {
      return { plain: "", tag: "" };
    }
    const cipherBytes = fromBase64(cipherInput);
    if (!cipherBytes) {
      return { plain: "", tag: "" };
    }
    const state = initState(keyBytes, nonceBytes);
    const adBytes = encoder.encode(adInput);
    absorbAd(state, adBytes);
    const keystream = generateKeystream(state, cipherBytes.length);
    const plainBytes = xorBytes(cipherBytes, keystream);
    const tag = finalizeTag(state, adBytes.length, plainBytes.length);
    return { plain: decoder.decode(plainBytes), tag: toHex(tag) };
  }, [adInput, cipherInput, errors.length, keyBytes, nonceBytes]);

  return (
    <section className="surface mx-auto max-w-4xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Voynich 암호화/복호화
        </h1>
        <p className="text-sm text-muted-foreground">
          신규 설계된 Voynich-Stream(교육용) 알고리즘을 이용한 실험
          페이지입니다.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        <p>
          주의: 본 알고리즘은 검증되지 않았습니다. 실제 보안 용도로 사용하지
          마세요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              키 &amp; 논스
            </h2>
            <p className="text-xs text-muted-foreground">
              hex 형식으로 입력하세요.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              키 (32바이트)
            </label>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-xs text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
              value={keyHex}
              onChange={(event) => setKeyHex(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              논스 (16바이트)
            </label>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-xs text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
              value={nonceHex}
              onChange={(event) => setNonceHex(event.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
              onClick={() => setKeyHex(createRandomHex(32))}
            >
              키 재생성
            </button>
            <button
              type="button"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
              onClick={() => setNonceHex(createRandomHex(16))}
            >
              논스 재생성
            </button>
          </div>
          {errors.length > 0 ? (
            <div className="space-y-1 text-xs text-red-500">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              연관 데이터 (선택)
            </label>
            <textarea
              className="min-h-20 w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
              value={adInput}
              onChange={(event) => setAdInput(event.target.value)}
              placeholder="AD를 입력하면 태그에 반영됩니다."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              암호화
            </h2>
            <textarea
              className="min-h-40 w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
              value={plainInput}
              onChange={(event) => setPlainInput(event.target.value)}
              placeholder="평문을 입력하세요."
            />
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                암호문 (Base64)
              </label>
              <textarea
                className="min-h-30 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                value={encryptResult.cipher}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                태그 (hex)
              </label>
              <input
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 shadow-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                value={encryptResult.tag}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            복호화
          </h2>
          <textarea
            className="min-h-40 w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
            value={cipherInput}
            onChange={(event) => setCipherInput(event.target.value)}
            placeholder="암호문(Base64)을 입력하세요."
          />
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              복호화 결과
            </label>
            <textarea
              className="min-h-30 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              value={decryptResult.plain}
              readOnly
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              계산된 태그 (hex)
            </label>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 shadow-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              value={decryptResult.tag}
              readOnly
            />
          </div>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>복호화 시 동일한 키/논스/AD를 사용해야 합니다.</p>
          <p>태그가 같으면 AD와 평문 길이가 일치했음을 의미합니다.</p>
        </div>
      </div>
    </section>
  );
}
