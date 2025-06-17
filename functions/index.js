const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {v4: uuidv4} = require("uuid");
const nodemailer = require("nodemailer");

admin.initializeApp();

// =================================================================
// 💡 PLACEHOLDER #1: CONFIGURE YOUR GMAIL CREDENTIALS
// These are used to send the invitation email.
// For this to work with Gmail, you must create an "App Password".
// How to get it: https://support.google.com/accounts/answer/185833
//
// Run these commands in your terminal (outside the functions folder)
// to securely store your credentials:
// firebase functions:config:set gmail.email="your-email@gmail.com"
// firebase functions:config:set gmail.password="your-16-digit-app-password"
// =================================================================


/**
 * Creates an invitation document and sends an email.
 */
exports.sendInvitation = functions.https.onCall(async (data, context) => {
  // Moved transporter initialization inside the function
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: functions.config().gmail.email,
      pass: functions.config().gmail.password,
    },
  });

  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "You must be an admin.");
  }
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError(
        "invalid-argument", "Missing email argument.");
  }
  const token = uuidv4();
  const db = admin.firestore();
  await db.collection("invitations").doc(token).set({
    email: email,
    token: token,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // =================================================================
  // 💡 PLACEHOLDER #2: YOUR WEBSITE URL
  // Replace "https://empusaai.com" with your actual website domain.
  // =================================================================
  const signUpUrl = `https://empusaai.com/signup?token=${token}`;

  const mailOptions = {
    from: `"Empusa AI" <${functions.config().gmail.email}>`,
    to: email,
    subject: "Invitation to join Empusa AI",
    html: `
      <p>Hello, you have been invited to create an account.</p>
      <p>Click here to sign up: <a href="${signUpUrl}">${signUpUrl}</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return {success: true, message: `Invitation sent to ${email}.`};
});

/**
 * Creates a user account from a valid invitation token.
 */
exports.createInvitedUser = functions.https.onCall(async (data, context) => {
  const {token, password} = data;
  if (!token || !password) {
    throw new functions.https.HttpsError(
        "invalid-argument", "Missing token or password.");
  }
  const db = admin.firestore();
  const invitationRef = db.collection("invitations").doc(token);
  const invitationDoc = await invitationRef.get();

  if (!invitationDoc.exists || invitationDoc.data().status !== "pending") {
    throw new functions.https.HttpsError("not-found",
        "This invitation is invalid or has been used.");
  }
  const email = invitationDoc.data().email;

  const userRecord = await admin.auth().createUser({
    email: email,
    password: password,
    emailVerified: true,
  });

  await invitationRef.update({
    status: "accepted",
    acceptedByUid: userRecord.uid,
  });

  await db.collection("users").doc(userRecord.uid).set({
    email: userRecord.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {success: true, uid: userRecord.uid};
});
