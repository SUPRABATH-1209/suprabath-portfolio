import {
  addDoc,
  collection,
  doc,
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
  isAdminExcluded?: boolean;
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
  excludedAdminVisitors?: number;
};

const VISITOR_KEY = 'suprabath-visitor-id';
const SESSION_KEY = 'suprabath-session-id';
const SESSION_COUNTED_KEY = 'suprabath-session-counted';
const ADMIN_EXCLUDED_KEY = 'suprabath-admin-excluded';

const EVENTS_COLLECTION = 'portfolioEvents';
const VISITORS_COLLECTION = 'portfolioVisitors';
const STATS_COLLECTION = 'portfolioStats';
const ADMIN_EXCLUDED_COLLECTION = 'portfolioAdminExcludedVisitors';

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

function toDateSafe(value: any): Date | null {
  try {
    if (!value) return null;

    if (typeof value.toDate === 'function') {
      return value.toDate();
    }

    if (value instanceof Date) {
      return value;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

function isPublicPortfolioPath(path: string) {
  return !path.startsWith('/admin');
}

function cleanMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, String(value ?? '')])
  );
}

function getLatestEventDate(events: PortfolioEvent[]) {
  let latestEvent: PortfolioEvent | null = null;
  let latestTime = 0;

  for (const event of events) {
    const date = toDateSafe(event.createdAt);
    const time = date?.getTime() || 0;

    if (time > latestTime) {
      latestTime = time;
      latestEvent = event;
    }
  }

  return latestEvent?.createdAt || null;
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

export function isCurrentVisitorAdminExcluded() {
  return safeLocalStorageGet(ADMIN_EXCLUDED_KEY) === 'yes';
}

export async function markCurrentVisitorAsAdmin() {
  if (!isBrowser()) return;

  const visitorId = getVisitorId();
  const deviceType = getDeviceType();

  safeLocalStorageSet(ADMIN_EXCLUDED_KEY, 'yes');

  try {
    await setDoc(
      doc(db, ADMIN_EXCLUDED_COLLECTION, visitorId),
      {
        visitorId,
        deviceType,
        reason: 'admin_login',
        markedAt: serverTimestamp()
      },
      { merge: true }
    );

    await setDoc(
      doc(db, VISITORS_COLLECTION, visitorId),
      {
        visitorId,
        deviceType,
        isAdminExcluded: true,
        adminExcludedAt: serverTimestamp(),
        lastSeenAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Failed to mark admin visitor:', error);
  }
}

export async function getExcludedAdminVisitorIds() {
  const snapshot = await getDocs(collection(db, ADMIN_EXCLUDED_COLLECTION));

  return new Set(
    snapshot.docs
      .map((item) => item.data().visitorId as string | undefined)
      .filter(Boolean)
  );
}

export async function trackPortfolioEvent(
  type: PortfolioEventType,
  metadata: Record<string, unknown> = {}
) {
  if (!isBrowser()) return;

  try {
    const path = window.location.pathname || '/';

    if (!isPublicPortfolioPath(path)) return;
    if (isCurrentVisitorAdminExcluded()) return;

    const visitorWasNew = isNewVisitorForThisBrowser();
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const deviceType = getDeviceType();

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

    await addDoc(collection(db, EVENTS_COLLECTION), eventPayload);

    const visitorPayload: Record<string, unknown> = {
      visitorId,
      deviceType,
      isAdminExcluded: false,
      lastSeenAt: serverTimestamp(),
      visitCount: shouldCountNewVisit ? increment(1) : increment(0),
      eventCount: increment(1)
    };

    if (visitorWasNew) {
      visitorPayload.firstSeenAt = serverTimestamp();
    }

    await setDoc(doc(db, VISITORS_COLLECTION, visitorId), visitorPayload, {
      merge: true
    });

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

    await setDoc(doc(db, STATS_COLLECTION, 'summary'), summaryUpdates, {
      merge: true
    });
  } catch (error) {
    console.warn('Portfolio analytics tracking failed:', error);
  }
}

export async function getCleanPortfolioEvents() {
  const [excludedVisitorIds, eventsSnapshot] = await Promise.all([
    getExcludedAdminVisitorIds(),
    getDocs(collection(db, EVENTS_COLLECTION))
  ]);

  return eventsSnapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data()
    }))
    .filter((event: any) => !excludedVisitorIds.has(event.visitorId)) as PortfolioEvent[];
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const [excludedVisitorIds, eventsSnapshot] = await Promise.all([
    getExcludedAdminVisitorIds(),
    getDocs(collection(db, EVENTS_COLLECTION))
  ]);

  const events = eventsSnapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data()
    }))
    .filter((event: any) => !excludedVisitorIds.has(event.visitorId)) as PortfolioEvent[];

  const uniqueVisitors = new Set(events.map((event) => event.visitorId));
  const uniqueSessions = new Set(events.map((event) => event.sessionId));

  const summary: PortfolioSummary = {
    totalUniqueVisitors: uniqueVisitors.size,
    totalVisits: uniqueSessions.size,
    pageViews: 0,
    totalEvents: events.length,
    resumeOpens: 0,
    resumeDownloads: 0,
    githubClicks: 0,
    linkedinClicks: 0,
    emailClicks: 0,
    certificateClicks: 0,
    projectClicks: 0,
    contactClicks: 0,
    contactFormSubmits: 0,
    mobileEvents: 0,
    desktopEvents: 0,
    lastEventAt: getLatestEventDate(events),
    excludedAdminVisitors: excludedVisitorIds.size
  };

  for (const event of events) {
    if (event.type === 'page_view') summary.pageViews! += 1;
    if (event.type === 'resume_open') summary.resumeOpens! += 1;
    if (event.type === 'resume_download') summary.resumeDownloads! += 1;
    if (event.type === 'github_click') summary.githubClicks! += 1;
    if (event.type === 'linkedin_click') summary.linkedinClicks! += 1;
    if (event.type === 'email_click') summary.emailClicks! += 1;
    if (event.type === 'certificate_click') summary.certificateClicks! += 1;
    if (event.type === 'project_click') summary.projectClicks! += 1;
    if (event.type === 'contact_click') summary.contactClicks! += 1;
    if (event.type === 'contact_form_submit') summary.contactFormSubmits! += 1;

    if (event.deviceType === 'mobile') summary.mobileEvents! += 1;
    if (event.deviceType === 'desktop') summary.desktopEvents! += 1;
  }

  return summary;
}

export async function getRecentPortfolioEvents(limitCount = 30) {
  const excludedVisitorIds = await getExcludedAdminVisitorIds();

  const eventsQuery = query(
    collection(db, EVENTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(Math.max(limitCount * 4, 100))
  );

  const snapshot = await getDocs(eventsQuery);

  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data()
    }))
    .filter((event: any) => !excludedVisitorIds.has(event.visitorId))
    .slice(0, limitCount) as PortfolioEvent[];
}

export async function getRecentPortfolioVisitors(limitCount = 20) {
  const excludedVisitorIds = await getExcludedAdminVisitorIds();

  const visitorsQuery = query(
    collection(db, VISITORS_COLLECTION),
    orderBy('lastSeenAt', 'desc'),
    limit(Math.max(limitCount * 4, 100))
  );

  const snapshot = await getDocs(visitorsQuery);

  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data()
    }))
    .filter((visitor: any) => {
      return !visitor.isAdminExcluded && !excludedVisitorIds.has(visitor.visitorId);
    })
    .slice(0, limitCount) as PortfolioVisitor[];
}