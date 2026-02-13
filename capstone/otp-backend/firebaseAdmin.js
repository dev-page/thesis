import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFile } from "fs/promises";

dotenv.config();

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH; // optional path to JSON file

let serviceAccountJson;

if (serviceAccountPath) {
  try {
    serviceAccountJson = await readFile(serviceAccountPath, "utf8");
  } catch (err) {
    throw new Error(
      `Failed to read FIREBASE_SERVICE_ACCOUNT_PATH (${serviceAccountPath}): ${err.message}`
    );
  }
} else if (serviceAccountEnv) {
  serviceAccountJson = serviceAccountEnv;
} else {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH is missing. Add one to your .env (service account JSON single-line) or provide a path to the JSON file."
  );
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (err) {
  throw new Error(
    "Invalid JSON for Firebase service account. Ensure the JSON is valid. If using .env, place it as a single-line value without surrounding quotes."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firestore = admin.firestore();