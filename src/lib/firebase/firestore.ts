// Mirrors each enquiry into Firestore as a second, independent copy. Postgres
// stays the source of truth for the admin panel; this is best-effort and
// never blocks or fails the enquiry submission.
export async function mirrorEnquiryToFirestore(enquiry: Record<string, unknown>) {
  if (!process.env["FIREBASE_PROJECT_ID"]) {
    console.warn("Firebase env vars not set — skipping Firestore enquiry mirror.");
    return;
  }
  try {
    const { firestore } = await import("@/lib/firebase/admin");
    await firestore()
      .collection("enquiries")
      .add({ ...enquiry, mirrored_at: new Date().toISOString() });
  } catch (err) {
    console.error("Firestore enquiry mirror failed", err);
  }
}
