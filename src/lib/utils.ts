
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getStatusBarHeight(): number {
  const heightVar = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top');
  return parseInt(heightVar) || 0;
}

export function getBottomInsetHeight(): number {
  const heightVar = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom');
  return parseInt(heightVar) || 0;
}

export function updateStatusBarColor(isDark: boolean): void {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const statusBarStyle = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  
  if (isDark) {
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#1EAEDB');
    if (statusBarStyle) statusBarStyle.setAttribute('content', 'light-content');
    document.documentElement.classList.add('status-bar-dark');
    document.documentElement.classList.remove('status-bar-light');
  } else {
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
    if (statusBarStyle) statusBarStyle.setAttribute('content', 'default');
    document.documentElement.classList.add('status-bar-light');
    document.documentElement.classList.remove('status-bar-dark');
  }
}
