import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from './firebase';

const ADMIN_SETTINGS_COLLECTION = 'portfolioAdminSettings';
const ADMIN_SECURITY_DOC = 'security';

// Used only for first setup if Firebase password document does not exist yet.
// After you change password from Admin, Firebase password will be used.
const FIRST_SETUP_PASSWORD = 'suprabath1209';

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

  if (snapshot.exists()) {
    const data = snapshot.data();

    if (typeof data.passwordHash === 'string' && data.passwordHash.length > 0) {
      return data.passwordHash;
    }
  }

  const firstSetupHash = await hashPassword(FIRST_SETUP_PASSWORD);

  await setDoc(
    securityRef,
    {
      passwordHash: firstSetupHash,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  return firstSetupHash;
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