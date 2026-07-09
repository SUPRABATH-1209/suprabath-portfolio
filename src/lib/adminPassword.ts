import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from './firebase';

const ADMIN_SETTINGS_COLLECTION = 'portfolioAdminSettings';
const ADMIN_SECURITY_DOC = 'security';

async function hashPassword(value: string) {
  const encoded = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);

  return Array.from(new Uint8Array(hashBuffer))
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('');
}

function getSecurityDocRef() {
  return doc(db, ADMIN_SETTINGS_COLLECTION, ADMIN_SECURITY_DOC);
}

async function getStoredPasswordHash() {
  const securityRef = getSecurityDocRef();
  const snapshot = await getDoc(securityRef);

  if (!snapshot.exists()) {
    throw new Error('Admin password is not configured in Firebase.');
  }

  const data = snapshot.data();

  if (typeof data.passwordHash !== 'string' || data.passwordHash.length === 0) {
    throw new Error('Admin password hash is missing in Firebase.');
  }

  return data.passwordHash;
}

export async function verifyAdminPassword(password: string) {
  const cleanPassword = password.trim();

  if (!cleanPassword) {
    return false;
  }

  const storedHash = await getStoredPasswordHash();
  const enteredHash = await hashPassword(cleanPassword);

  return storedHash === enteredHash;
}

export async function updateAdminPassword(currentPassword: string, newPassword: string) {
  const currentClean = currentPassword.trim();
  const newClean = newPassword.trim();

  if (!currentClean || !newClean) {
    throw new Error('Password fields cannot be empty.');
  }

  if (newClean.length < 8) {
    throw new Error('New password must be at least 8 characters.');
  }

  const currentPasswordCorrect = await verifyAdminPassword(currentClean);

  if (!currentPasswordCorrect) {
    throw new Error('Current password is wrong.');
  }

  const newHash = await hashPassword(newClean);

  await setDoc(
    getSecurityDocRef(),
    {
      passwordHash: newHash,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  return true;
}