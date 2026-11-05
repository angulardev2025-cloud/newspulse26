import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import OwnerOtpModal from '@/components/utility/ownerOtpModal';
import { ThemeProvider } from '@/lib/context/ThemeContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <OwnerOtpModal />
    </ThemeProvider>
  );
}
