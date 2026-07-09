import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackPortfolioEvent } from '../lib/portfolioAnalytics';

export default function useTrackPageView() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // Do not count your own admin dashboard visits as recruiter/public visits.
    if (path.startsWith('/admin')) return;

    trackPortfolioEvent('page_view', {
      page: path
    });
  }, [location.pathname]);
}