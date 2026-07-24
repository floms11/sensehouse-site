import { ImageResponse } from "next/og";

/**
 * Open Graph image: фірмовий знак Sense House + головний меседж.
 * За потреби можна замінити на дизайнерський банер 1200×630 —
 * покладіть файл public/og.png і додайте його в metadata.openGraph.images.
 */
export const alt =
  "Sense House — електрика та розумний будинок під ключ у Кропивницькому";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Mark({ width }: { width: number }) {
  return (
    <svg width={width} height={width} viewBox="0 0 901 901">
      <path
        d="M 200 486 L 200 408 L 158 408 L 158 386 L 452 180 L 555 257 L 555 208 L 631 208 L 631 312 L 744 387 L 744 408 L 707 408 L 707 486 M 707 535 L 707 718 L 477 718 M 427 718 L 200 718 L 200 535"
        fill="none"
        stroke="#D6E5EC"
        strokeWidth="26"
        strokeLinecap="square"
      />
      <g
        fill="none"
        stroke="#2AA9D6"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 144 511 L 301 511 L 338 546 L 365 546 L 452 480 L 533 426 L 634 511 L 759 511" />
        <path d="M 452 480 L 452 259" />
        <path d="M 452 590 L 452 724" />
        <path d="M 452 590 L 549 535" />
        <path d="M 244 583 L 244 674 L 361 674" />
      </g>
      <g fill="#42C8E9">
        <circle cx="144" cy="511" r="30" />
        <circle cx="351" cy="553" r="33" />
        <circle cx="452" cy="369" r="33" />
        <circle cx="452" cy="259" r="30" />
        <circle cx="533" cy="426" r="33" />
        <circle cx="452" cy="590" r="33" />
        <circle cx="361" cy="674" r="30" />
      </g>
      <g fill="#FFC452">
        <circle cx="659" cy="441" r="28" />
        <circle cx="759" cy="511" r="30" />
        <circle cx="549" cy="535" r="28" />
        <circle cx="244" cy="583" r="28" />
      </g>
    </svg>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "linear-gradient(160deg, #050f26 0%, #081a3a 70%, #0c2148 100%)",
          color: "#e8edf3",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 720,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
            Sense House
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.12 }}>
            Будинок, у якому все працює як одне ціле.
          </div>
          <div style={{ fontSize: 26, color: "#9fb0c8" }}>
            Електрика та розумний будинок під ключ · Кропивницький
          </div>
          <div style={{ fontSize: 24, color: "#21b4ff", display: "flex" }}>
            +380 73 198 49 18 · sense-house.com
          </div>
        </div>

        <Mark width={360} />
      </div>
    ),
    { ...size },
  );
}
