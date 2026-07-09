import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

import { db } from './firebase';

export type PortfolioEventType =
  | 'page_view'
  | 'resume_open'
  | 'resume_download'
  | 'github_click'
  | 'linkedin_click'
  | 'email_click'
  | 'certificate_click'
  | 'project_click'
  | 'contact_click'
  | 'contact_form_submit'
  | 'admin_open';

export type DeviceType = 'mobile' | 'desktop';

export type PortfolioEvent = {
  id?: string;
  type: PortfolioEventType;
  path: string;
  visitorId: string;
  sessionId: string;
  deviceType: DeviceType;
  metadata?: Record<string, string>;
  createdAt?: any;
};

export type PortfolioVisitor = {
  id?: string;
  visitorId: string;
  deviceType?: DeviceType;
  visitCount?: number;
  eventCount?: number;
  firstSeenAt?: any;
  lastSeenAt?: any;
};

export type PortfolioSummary = {
  totalUniqueVisitors?: number;
  totalVisits?: number;
  pageViews?: number;
  totalEvents?: number;
  resumeOpens?: number;
  resumeDownloads?: number;
  githubClicks?: number;
  linkedinClicks?: number;
  emailClicks?: number;
  certificateClicks?: number;
  projectClicks?: number;
  contactClicks?: number;
  contactFormSubmits?: number;
  mobileEvents?: number;
  desktopEvents?: number;
  lastEventAt?: any;
};

const VISITOR_KEY = 'suprabath-visitor-id';
const SESSION_KEY = 'suprabath-session-id';
const SESSION_COUNTED_KEY = 'suprabath-session-counted';

function isBrowser() {
  return typeof window !== 'undefined';
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

function safeLocalStorageGet(key: string) {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore blocked storage.
  }
}

function safeSessionStorageGet(key: string) {
  if (!isBrowser()) return null;

  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionStorageSet(key: string, value: string) {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore blocked storage.
  }
}

export function getVisitorId() {
  let visitorId = safeLocalStorageGet(VISITOR_KEY);

  if (!visitorId) {
    visitorId = createId('visitor');
    safeLocalStorageSet(VISITOR_KEY, visitorId);
  }

  return visitorId;
}

export function isNewVisitorForThisBrowser() {
  return !safeLocalStorageGet(VISITOR_KEY);
}

export function getSessionId() {
  let sessionId = safeSessionStorageGet(SESSION_KEY);

  if (!sessionId) {
    sessionId = createId('session');
    safeSessionStorageSet(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export function getDeviceType(): DeviceType {
  if (!isBrowser()) return 'desktop';

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 768;

  return isMobileUserAgent || isSmallScreen ? 'mobile' : 'desktop';
}

function cleanMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, String(value ?? '')])
  );
}

export async function trackPortfolioEvent(
  type: PortfolioEventType,
  metadata: Record<string, unknown> = {}
) {
  if (!isBrowser()) return;

  try {
    const visitorWasNew = isNewVisitorForThisBrowser();
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const path = window.location.pathname || '/';

    const sessionAlreadyCounted =
      safeSessionStorageGet(SESSION_COUNTED_KEY) === 'yes';

    const shouldCountNewVisit = !sessionAlreadyCounted;

    if (shouldCountNewVisit) {
      safeSessionStorageSet(SESSION_COUNTED_KEY, 'yes');
    }

    const eventPayload: PortfolioEvent = {
      type,
      path,
      visitorId,
      sessionId,
      deviceType,
      metadata: cleanMetadata(metadata),
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'portfolioEvents'), eventPayload);

    await setDoc(
      doc(db, 'portfolioVisitors', visitorId),
      {
        visitorId,
        deviceType,
        firstSeenAt: visitorWasNew ? serverTimestamp() : undefined,
        lastSeenAt: serverTimestamp(),
        visitCount: shouldCountNewVisit ? increment(1) : increment(0),
        eventCount: increment(1)
      },
      { merge: true }
    );

    const summaryUpdates: Record<string, unknown> = {
      totalEvents: increment(1),
      lastEventAt: serverTimestamp()
    };

    if (visitorWasNew) summaryUpdates.totalUniqueVisitors = increment(1);
    if (shouldCountNewVisit) summaryUpdates.totalVisits = increment(1);

    if (type === 'page_view') summaryUpdates.pageViews = increment(1);
    if (type === 'resume_open') summaryUpdates.resumeOpens = increment(1);
    if (type === 'resume_download') summaryUpdates.resumeDownloads = increment(1);
    if (type === 'github_click') summaryUpdates.githubClicks = increment(1);
    if (type === 'linkedin_click') summaryUpdates.linkedinClicks = increment(1);
    if (type === 'email_click') summaryUpdates.emailClicks = increment(1);
    if (type === 'certificate_click') summaryUpdates.certificateClicks = increment(1);
    if (type === 'project_click') summaryUpdates.projectClicks = increment(1);
    if (type === 'contact_click') summaryUpdates.contactClicks = increment(1);
    if (type === 'contact_form_submit') {
      summaryUpdates.contactFormSubmits = increment(1);
    }

    if (deviceType === 'mobile') summaryUpdates.mobileEvents = increment(1);
    if (deviceType === 'desktop') summaryUpdates.desktopEvents = increment(1);

    await setDoc(doc(db, 'portfolioStats', 'summary'), summaryUpdates, {
      merge: true
    });
  } catch (error) {
    console.warn('Portfolio analytics tracking failed:', error);
  }
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const snapshot = await getDoc(doc(db, 'portfolioStats', 'summary'));

  if (!snapshot.exists()) {
    return {};
  }

  return snapshot.data() as PortfolioSummary;
}

export async function getRecentPortfolioEvents(limitCount = 30) {
  const eventsQuery = query(
    collection(db, 'portfolioEvents'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(eventsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  })) as PortfolioEvent[];
}

export async function getRecentPortfolioVisitors(limitCount = 20) {
  const visitorsQuery = query(
    collection(db, 'portfolioVisitors'),
    orderBy('lastSeenAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(visitorsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  })) as PortfolioVisitor[];
}