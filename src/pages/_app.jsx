import React, { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { imageCacheService } from '../utils/imageCacheService';
import { videoCacheService } from '../utils/videoCacheService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Clear entire media caches to avoid duplication on reload
        await Promise.allSettled([
          imageCacheService.clearCache(),
          videoCacheService.clearCache(),
        ]);

        // Clear hero metadata
        try { localStorage.removeItem('heroImageMetadata'); } catch (_) {}
        try { localStorage.removeItem('AboutImageMetadata'); } catch (_) {}
        try { localStorage.removeItem('heroGifMetadata'); } catch (_) {}
        try { localStorage.removeItem('heroVideoMetadata'); } catch (_) {}

        // Optionally clear runtime Cache Storage buckets if present
        if (typeof caches !== 'undefined') {
          try { await caches.delete('site-images-cache-v1'); } catch (_) {}
          try { await caches.delete('site-videos-cache-v1'); } catch (_) {}
        }
      } catch (_) {
        // Silent by design
      }
      return () => { isMounted = false; };
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp; 