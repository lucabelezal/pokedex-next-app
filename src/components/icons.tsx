import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PokedexActiveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
      <path d="M2.16677 12.9997C2.16677 14.4223 2.44698 15.8311 2.99141 17.1454C3.53583 18.4598 4.33381 19.654 5.33978 20.66C6.34575 21.666 7.54 22.4639 8.85436 23.0084C10.1687 23.5528 11.5774 23.833 13.0001 23.833C14.4228 23.833 15.8315 23.5528 17.1458 23.0084C18.4602 22.4639 19.6545 21.666 20.6604 20.66C21.6664 19.654 22.4644 18.4598 23.0088 17.1454C23.5532 15.831 23.8334 14.4223 23.8334 12.9997L13.0001 12.9997H2.16677Z" fill="white"/>
      <path d="M23.8333 12.9993C23.8333 11.5767 23.5531 10.168 23.0087 8.85361C22.4642 7.53925 21.6663 6.34499 20.6603 5.33903C19.6543 4.33306 18.4601 3.53508 17.1457 2.99065C15.8313 2.44623 14.4226 2.16602 13 2.16602C11.5773 2.16602 10.1686 2.44623 8.85422 2.99065C7.53986 3.53508 6.3456 4.33306 5.33964 5.33903C4.33367 6.34499 3.53569 7.53925 2.99126 8.85361C2.44684 10.168 2.16663 11.5767 2.16663 12.9994L13 12.9993H23.8333Z" fill="#CD3131"/>
      <circle cx="13.0002" cy="13" r="3.25" fill="white"/>
      <path d="M13 23.8327C18.9832 23.8327 23.8333 18.9826 23.8333 12.9993C23.8333 7.0161 18.9832 2.16602 13 2.16602C7.01671 2.16602 2.16663 7.0161 2.16663 12.9993C2.16663 18.9826 7.01671 23.8327 13 23.8327Z" stroke="#173EA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.9999 16.249C13.8618 16.249 14.6885 15.9066 15.298 15.2971C15.9075 14.6876 16.2499 13.861 16.2499 12.999C16.2499 12.1371 15.9075 11.3104 15.298 10.7009C14.6885 10.0914 13.8618 9.74902 12.9999 9.74902C12.1379 9.74902 11.3113 10.0914 10.7018 10.7009C10.0923 11.3104 9.74988 12.1371 9.74988 12.999C9.74988 13.861 10.0923 14.6876 10.7018 15.2971C11.3113 15.9066 12.1379 16.249 12.9999 16.249Z" stroke="#173EA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.16663 12.999H9.74996M16.25 12.999H23.8333" stroke="#173EA5" strokeWidth="1.5"/>
    </svg>
  );
}

export function RegionActiveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
      <path d="M13 24.9163C3.79167 16.7913 4.33333 14.6247 3.25 10.833H22.75C22.75 15.708 18.4167 21.6663 13 24.9163Z" fill="white"/>
      <path d="M22.75 10.833H3.25C3.43056 7.94412 5.41667 1.62467 13 1.08301C20.0417 1.08301 22.5694 7.58301 22.75 10.833Z" fill="#CD3131"/>
      <circle cx="13" cy="10.833" r="3.25" fill="white"/>
      <path d="M22.75 10.833C22.75 18.4163 13 24.9163 13 24.9163C13 24.9163 3.25 18.4163 3.25 10.833C3.25 8.24715 4.27723 5.7672 6.10571 3.93872C7.93419 2.11024 10.4141 1.08301 13 1.08301C15.5859 1.08301 18.0658 2.11024 19.8943 3.93872C21.7228 5.7672 22.75 8.24715 22.75 10.833Z" stroke="#173EA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 14.083C13.862 14.083 14.6886 13.7406 15.2981 13.1311C15.9076 12.5216 16.25 11.695 16.25 10.833C16.25 9.97105 15.9076 9.1444 15.2981 8.53491C14.6886 7.92542 13.862 7.58301 13 7.58301C12.138 7.58301 11.3114 7.92542 10.7019 8.53491C10.0924 9.1444 9.75 9.97105 9.75 10.833C9.75 11.695 10.0924 12.5216 10.7019 13.1311C11.3114 13.7406 12.138 14.083 13 14.083Z" fill="white" stroke="#173EA5" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.25 10.833L10.075 10.833M15.925 10.833L22.75 10.833" stroke="#173EA5" strokeWidth="1.625"/>
    </svg>
  );
}

export function HeartActiveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 26 26" fill="none" aria-hidden="true" {...props}>
      <path d="M22.5766 4.99419C22.0233 4.44061 21.3663 4.00147 20.6433 3.70187C19.9202 3.40226 19.1452 3.24805 18.3625 3.24805C17.5798 3.24805 16.8047 3.40226 16.0817 3.70187C15.3586 4.00147 14.7016 4.44061 14.1483 4.99419L13 6.14252L11.8516 4.99419C10.734 3.87652 9.21809 3.24863 7.63747 3.24863C6.05685 3.24863 4.54097 3.87652 3.4233 4.99419C2.30563 6.11186 1.67773 7.62774 1.67773 9.20836C1.67773 10.789 2.30563 12.3049 3.4233 13.4225L4.57163 14.5709L13 22.9992L21.4283 14.5709L22.5766 13.4225C23.1302 12.8692 23.5693 12.2122 23.869 11.4892C24.1686 10.7661 24.3228 9.99105 24.3228 9.20836C24.3228 8.42566 24.1686 7.65064 23.869 6.92756C23.5693 6.20448 23.1302 5.54751 22.5766 4.99419Z" fill="#FD525C" stroke="#173EA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ContaActiveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="#173EA5"/>
      <circle cx="12" cy="9" r="3.5" fill="white"/>
      <path d="M5.5 19.5C6.8 16.5 9.2 14.5 12 14.5C14.8 14.5 17.2 16.5 18.5 19.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 20.4C10.2 18.7 4 14.1 4 9.6C4 7.1 5.9 5.2 8.4 5.2C9.9 5.2 11.3 5.9 12 7C12.7 5.9 14.1 5.2 15.6 5.2C18.1 5.2 20 7.1 20 9.6C20 14.1 13.8 18.7 12 20.4Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M14 5L7 12L14 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" />
      <path d="M9 7V5H15V7" stroke="currentColor" strokeWidth="2" />
      <path d="M7 7V20H17V7" stroke="currentColor" strokeWidth="2" />
      <path d="M10 11V17" stroke="currentColor" strokeWidth="2" />
      <path d="M14 11V17" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PokeballCore(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function PokedexIcon(props: IconProps) {
  return <PokeballCore {...props} />;
}

export function RegionIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 21C15.5 16.9 19 13.7 19 9.8C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.8C5 13.7 8.5 16.9 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="9.5" r="2" fill="currentColor" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20C5.7 16.8 8.4 15 12 15C15.6 15 18.3 16.8 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DownArrowVectorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 28" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.63419 26.8291C8.23441 27.3085 7.49801 27.3085 7.09823 26.8291L0.234326 18.5988C-0.308808 17.9476 0.15429 16.9583 1.00231 16.9583L2.8568 16.9583C3.40885 16.9583 3.85647 16.511 3.8568 15.9589L3.86562 0.999413C3.86595 0.44736 4.31357 2.78749e-06 4.86562 2.83267e-06L10.8662 3.32371e-06C11.4185 3.3689e-06 11.8662 0.447717 11.8662 1L11.8662 15.9583C11.8662 16.5106 12.3139 16.9583 12.8662 16.9583L14.7301 16.9583C15.5781 16.9583 16.0412 17.9476 15.4981 18.5988L8.63419 26.8291Z"
        fill="currentColor"
      />
    </svg>
  );
}
