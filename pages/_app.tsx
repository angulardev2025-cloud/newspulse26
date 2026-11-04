import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import OwnerOtpModal from '@/components/utility/ownerOtpModal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <OwnerOtpModal />
    </>
  );
}
