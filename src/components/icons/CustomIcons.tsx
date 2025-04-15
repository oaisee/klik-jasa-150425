
import { LucideProps } from 'lucide-react';
import React from 'react';

export const BroomAndDust = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 8l7 13a1 1 0 0 0 2 0c1.14-2.84 2.2-5.6 3-8.38" />
      <path d="M10 5c.6.4 1 1.17 1 2a3 3 0 0 1-3 3c-.83 0-1.6-.4-2-1" />
      <path d="m7.5 9.5 1.5 2.5h5.8L8.72 5.16a1 1 0 0 0-1.43 1.38L7.5 9.5z" />
      <path d="M13 12h8c0 2-1 2-2 3l-2 2c-1 1-2 0-2-2v-3z" />
    </svg>
  );
};

export const Oil = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2z" />
      <path d="M6 8a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H6z" />
      <line x1="6" y1="14" x2="18" y2="14" />
      <line x1="6" y1="18" x2="18" y2="18" />
    </svg>
  );
};
