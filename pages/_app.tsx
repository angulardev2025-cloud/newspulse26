import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import OwnerOtpModal from '@/components/utility/ownerOtpModal';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { BookmarkProvider } from '@/lib/context/BookmarkContext';
import SavedArticlesModal from '@/components/news/savedModal';
import BookmarkToast from '@/components/utility/bookmarkToast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <BookmarkProvider>
        <Component {...pageProps} />
        <SavedArticlesModal />
        <BookmarkToast />
        <OwnerOtpModal />
      </BookmarkProvider>
    </ThemeProvider>
  );
}

