import { Password } from "@convex-dev/auth/providers/Password";
import { Phone } from "@convex-dev/auth/providers/Phone";
import { convexAuth } from "@convex-dev/auth/server";
function normalizePakistaniPhone(value: string) { const compact = value.replace(/[\s()-]/g, ""); if (/^03\d{9}$/.test(compact)) return `+92${compact.slice(1)}`; if (/^923\d{9}$/.test(compact)) return `+${compact}`; if (/^\+923\d{9}$/.test(compact)) return compact; throw new Error("Enter a valid Pakistani phone number."); }
const phoneOtp = Phone({
  normalizeIdentifier: normalizePakistaniPhone,
  async generateVerificationToken() { const bytes = new Uint32Array(1); crypto.getRandomValues(bytes); return String(100000 + (bytes[0] % 900000)); },
  async sendVerificationRequest({ identifier, token }) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID; const authToken = process.env.TWILIO_AUTH_TOKEN; const from = process.env.TWILIO_PHONE_NUMBER;
    if (!accountSid || !authToken || !from) throw new Error("Phone OTP is not configured. Ask an administrator to configure Twilio.");
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ To: identifier, From: from, Body: `Your scholarship verification code is ${token}. It expires in 20 minutes.` }) });
    if (!response.ok) throw new Error("Could not send the verification code.");
  },
});
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({ providers: [Password, phoneOtp] });