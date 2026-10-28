import React from 'react';

export type BankGlyphName =
  | 'bank'
  | 'between'
  | 'card'
  | 'contract'
  | 'details'
  | 'swift'
  | 'mobile'
  | 'utilities'
  | 'games'
  | 'government'
  | 'loan'
  | 'internet'
  | 'request'
  | 'pay'
  | 'topup'
  | 'transfer'
  | 'lock'
  | 'refresh'
  | 'freeze'
  | 'budget'
  | 'schedule'
  | 'exchange'
  | 'tax'
  | 'devices'
  | 'verify'
  | 'limits'
  | 'emergency'
  | 'support'
  | 'info'
  | 'shield'
  | 'search'
  | 'bookmark';

export const BankGlyph: React.FC<{ name: BankGlyphName }> = ({ name }) => {
  const paths: Record<BankGlyphName, React.ReactNode> = {
    bank: (
      <path
        d="m4.73 6.904 2.172 3.882v2.368l-2.17 3.875V6.904Zm8.34 2.469 2.034-1.247 4.165-.004-6.2 3.799V9.373Zm0-2.492v5.14l-2.177-1.338V3l2.177 3.881Zm6.2 1.241-4.165.004-2.047-1.245L10.893 3l8.377 5.122Zm-6.2 8.928v-2.493l-2.177-1.327v7.706l2.177-3.886ZM15.1 15.815 6.9 10.786 4.73 6.904l14.53 8.905-4.16.006Zm-4.205 5.121 2.175-3.886 2.03-1.236 4.162-.005-8.367 5.127Zm-6.163-3.907 6.177-3.784-2.076-1.275L6.9 13.154l-2.17 3.875Z"
        fill="currentColor"
      />
    ),
    between: (
      <>
        <path
          d="M15 5V0l9 8.5-9 8.5v-5H9V7l-4.13 3.9A4.99 4.99 0 0 1 3 7V5h12Z"
          fill="currentColor"
        />
        <path
          d="M9 19v5l-9-8.5L9 7v5h6v5l4.13-3.9A4.99 4.99 0 0 1 21 17v2H9Z"
          fill="currentColor"
          opacity=".45"
        />
      </>
    ),
    card: (
      <>
        <path
          d="M9.5 4.5c2.05 0 3.77 1.065 4.732 2.707L17 12l-2.768 4.793C13.264 18.468 11.5 19.5 9.5 19.5h9a4 4 0 0 0 4-4v-11h-13Z"
          fill="currentColor"
          opacity=".45"
        />
        <path
          d="M5.5 4.5a4 4 0 0 0-4 4v11h8.044a5.417 5.417 0 0 0 4.688-2.706L17 12.001l-2.768-4.794A5.412 5.412 0 0 0 9.544 4.5H5.5Zm-2.333 12a2 2 0 0 1 2-2h3.5a2 2 0 0 1-2 2h-3.5Z"
          fill="currentColor"
        />
      </>
    ),
    contract: (
      <>
        <path
          d="M14 1H4v19a3 3 0 0 0 3 3h13V7h-6V1ZM7.5 11.5H16v.5a2 2 0 0 1-2 2H7.5v-2.5Zm5.5 5H7.5V19H11a2 2 0 0 0 2-2v-.5Z"
          fill="currentColor"
        />
        <path d="M14 1v6h6l-6-6Z" fill="currentColor" opacity=".4" />
      </>
    ),
    details: (
      <path
        d="M12 .5C5.649.5.5 5.649.5 12S5.649 23.5 12 23.5 23.5 18.351 23.5 12 18.351.5 12 .5ZM9 11V6h3.96c1.017 0 2.072.154 2.821.841C16.396 7.405 17 8.271 17 9.5c0 1.229-.604 2.095-1.218 2.659-.75.688-1.805.841-2.823.841H11.5v1.041H15A1.959 1.959 0 0 1 13.041 16H11.5v.063a2 2 0 0 1-2 2H9V16l-1.5-.041V15.5A1.46 1.46 0 0 1 9 14.041V13l-1.5-.041v-.5A1.46 1.46 0 0 1 9 11Zm4-3h-1.5v3H13s1.5.106 1.5-1.447C14.5 8 13 8 13 8Z"
        fill="currentColor"
      />
    ),
    swift: (
      <>
        <path
          d="M10.5 3.5 12.959 1.041A11.142 11.142 0 0 0 12 1C5.925 1 1 5.925 1 12c0 1.58.333 3.08.932 4.438a3 3 0 0 1 3.19.683L7 19l3-3 1.879 1.879a3 3 0 0 1 0 4.242l-.838.838a10.99 10.99 0 0 0 10.092-4.826l-.547-.547A2 2 0 0 1 20 16.172V11l-2-2-1.879 1.879a3 3 0 0 1-4.242 0L9 8l1.586-1.586a2 2 0 0 0 0-2.828L10.5 3.5Z"
          fill="currentColor"
        />
        <path
          d="M9 8 11.879 10.879a3 3 0 0 0 4.242 0L18 8.998l2 2v5.172a2 2 0 0 0 .586 1.415l.547.547A10.949 10.949 0 0 0 23 12C23 6.248 18.585 1.527 12.959 1.04L10.5 3.5l.086.086a2 2 0 0 1 0 2.828L9 8Z"
          fill="currentColor"
          opacity=".45"
        />
      </>
    ),
    mobile: (
      <path
        d="M7 1h10.5a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2h-13V3a2 2 0 0 1 2-2H7Zm1.4 17.5a.9.9 0 1 0 0 1.8h4.2a.9.9 0 1 0 0-1.8H8.4ZM7 1l.544 1.632A2 2 0 0 0 9.442 4h2.117a2 2 0 0 0 1.897-1.368L14 1H7Z"
        fill="currentColor"
      />
    ),
    utilities: (
      <path
        d="m12 1 9 9v8a3 3 0 0 1-3 3h-3v-7H9v7H3V10l9-9Z"
        fill="currentColor"
      />
    ),
    games: (
      <>
        <path
          d="M1 5h22v9a5 5 0 0 1-5 5H1V5Zm13 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-8-2a1 1 0 0 1 2 0v1h1a1 1 0 1 1 0 2H8v1a1 1 0 1 1-2 0v-1H5a1 1 0 1 1 0-2h1v-1Z"
          fill="currentColor"
        />
        <circle cx="17" cy="12" r="3" fill="currentColor" opacity=".35" />
      </>
    ),
    government: (
      <path
        d="M10 9.113V9l-.772-2.316A1 1 0 0 0 8.279 6H6.5v-.5a2 2 0 0 1 2-2h2L12 8l1.5-4.5h2a2 2 0 0 1 2 2V6h-1.78a1 1 0 0 0-.948.684L14 9v.113a1 1 0 0 0 1.316.948L15.5 10l.133-.044A2 2 0 0 0 17 8.058V8l6-4v7.032a5 5 0 0 1-2.606 4.39L17.5 17s-.5-2-2-2c-2 0-2 1.5-2 1.5L18 21s-2.5 2-6 2-6-2-6-2l4.5-4.5s0-1.5-2-1.5c-1.5 0-2 2-2 2l-2.894-1.579A5 5 0 0 1 1 11.031V4l6 4v.058a2 2 0 0 0 1.368 1.898L8.5 10l.184.061A1 1 0 0 0 10 9.113Z"
        fill="currentColor"
      />
    ),
    loan: (
      <>
        <path
          d="M22.5 4.5h-17A4 4 0 0 0 1.531 8H22.5V4.5Zm-21 15V11h21v4.5a4 4 0 0 1-4 4h-17Zm2.5-3a2 2 0 0 1 2-2h4a2 2 0 0 1-2 2H4Z"
          fill="currentColor"
        />
        <path d="M1.5 8h21v3h-21V8Z" fill="currentColor" opacity=".35" />
      </>
    ),
    internet: (
      <>
        <path
          d="M16.556 16.757A5.981 5.981 0 0 0 12.314 15a5.981 5.981 0 0 0-4.243 1.757L12.314 21l4.242-4.243Z"
          fill="currentColor"
          opacity=".35"
        />
        <path
          d="M17.71 11.413A10.95 10.95 0 0 0 12.314 10a10.966 10.966 0 0 0-7.778 3.222L1 9.686A15.95 15.95 0 0 1 12.314 5a15.95 15.95 0 0 1 11.313 4.686l-1.414 1.415c-1.171 1.171-3.06 1.126-4.503.312Z"
          fill="currentColor"
        />
        <path
          d="M14.004 15.241a6.005 6.005 0 0 0-1.69-.241 5.981 5.981 0 0 0-4.243 1.757l-3.535-3.535A10.966 10.966 0 0 1 12.314 10c3.037 0 5.787 1.231 7.778 3.222l-1.414 1.414c-1.172 1.172-3.084 1.071-4.674.605Z"
          fill="currentColor"
          opacity=".65"
        />
      </>
    ),
    request: (
      <path
        d="M23 12c0-6.075-4.925-11-11-11S1 5.925 1 12s4.925 11 11 11 11-4.925 11-11Zm-6.185 1.15-.74-.741a1.571 1.571 0 0 0-2.223 0l-.543.543V6.238h-1.571c-.579 0-1.048.469-1.048 1.047v5.665l-.542-.542a1.571 1.571 0 0 0-2.222 0l-.741.74 4.817 4.818 4.813-4.817Z"
        fill="currentColor"
      />
    ),
    pay: (
      <>
        <path
          d="M4 3h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 4h16V5H4v2Z"
          fill="currentColor"
        />
        <path
          d="m8.2 13.2 2.1 2.1 4.7-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    topup: (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".35" />
        <path d="M11 6h2v5h5v2h-5v5h-2v-5H6v-2h5V6Z" fill="currentColor" />
      </>
    ),
    transfer: <path d="M14 4 22 12l-8 8v-5H3v-6h11V4Z" fill="currentColor" />,
    lock: (
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v9H4v-9a2 2 0 0 1 2-2h1Zm3 0h4V7a2 2 0 1 0-4 0v3Z"
        fill="currentColor"
      />
    ),
    refresh: (
      <path
        d="M19.1 7A8 8 0 1 0 20 16h-3.4a5 5 0 1 1-.4-7H13v3h9V3h-2.9v4Z"
        fill="currentColor"
      />
    ),
    freeze: (
      <path
        d="M11 2h2v7.1l5-5 1.4 1.4-5 5H22v2h-7.6l5 5-1.4 1.4-5-5V22h-2v-7.1l-5 5-1.4-1.4 5-5H2v-2h7.6l-5-5L6 5.1l5 5V2Z"
        fill="currentColor"
      />
    ),
    budget: (
      <path
        d="M3 3h18v18H3V3Zm4 12h2V9H7v6Zm4 2h2V7h-2v10Zm4-4h2v-3h-2v3Z"
        fill="currentColor"
      />
    ),
    schedule: (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".35" />
        <path d="M11 6h2v5.6l4 2.4-1 1.7-5-3V6Z" fill="currentColor" />
      </>
    ),
    exchange: (
      <path
        d="m7 4-5 5 5 5v-3h8V7H7V4Zm10 6v3H9v4h8v3l5-5-5-5Z"
        fill="currentColor"
      />
    ),
    tax: (
      <path
        d="M5 2h10l4 4v16H5V2Zm9 2v4h4l-4-4ZM8 12h8v-2H8v2Zm0 4h8v-2H8v2Zm0 4h5v-2H8v2Z"
        fill="currentColor"
      />
    ),
    devices: (
      <path
        d="M3 3h14v12H3V3Zm2 2v8h10V5H5Zm4 12h12v4H9v-4Zm2 2h8v-1h-8v1Z"
        fill="currentColor"
      />
    ),
    verify: (
      <path
        d="M12 2 21 6v6c0 5.2-3.8 9-9 10-5.2-1-9-4.8-9-10V6l9-4Zm-1 13.2 6-6-1.4-1.4-4.6 4.6-2.6-2.6L7 11.2l4 4Z"
        fill="currentColor"
      />
    ),
    limits: (
      <path
        d="M5 3h2v18H5V3Zm6 0h2v18h-2V3Zm6 0h2v18h-2V3ZM2 8h8v3H2V8Zm6 7h8v3H8v-3Zm6-9h8v3h-8V6Z"
        fill="currentColor"
      />
    ),
    emergency: (
      <path
        d="M12 2 23 21H1L12 2Zm-1 6v7h2V8h-2Zm0 9v2h2v-2h-2Z"
        fill="currentColor"
      />
    ),
    support: (
      <path
        d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 6v2h10V9H7Zm0 4v2h7v-2H7Z"
        fill="currentColor"
      />
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".35" />
        <path d="M11 10h2v7h-2v-7Zm0-4h2v2h-2V6Z" fill="currentColor" />
      </>
    ),
    shield: (
      <path
        d="M12 2 21 6v6c0 5.2-3.8 9-9 10-5.2-1-9-4.8-9-10V6l9-4Zm0 5a3 3 0 0 0-3 3v1H8v6h8v-6h-1v-1a3 3 0 0 0-3-3Zm-1 4v-1a1 1 0 0 1 2 0v1h-2Z"
        fill="currentColor"
      />
    ),
    search: (
      <path
        d="M10.5 3a7.5 7.5 0 1 0 4.73 13.32L20.9 22l1.1-1.1-5.68-5.67A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
        fill="currentColor"
      />
    ),
    bookmark: (
      <path
        d="M6 2h12a2 2 0 0 1 2 2v18l-8-4.8L4 22V4a2 2 0 0 1 2-2Zm1 3v11.7l5-3 5 3V5H7Z"
        fill="currentColor"
      />
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
};
