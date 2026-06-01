// Run with: node scripts/test-keys.mjs
import { createHmac } from "crypto";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");

// Parse .env.local
const env = {};
readFileSync(envPath, "utf-8")
  .split("\n")
  .forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, "");
  });

console.log("\n==============================");
console.log("  API Key Verification Test");
console.log("==============================\n");

// ── 1. Resend ──────────────────────────────────────────────
console.log("1. Resend (Email)");
if (!env.RESEND_API_KEY) {
  console.log("   ❌ RESEND_API_KEY not set\n");
} else {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lumina Store <onboarding@resend.dev>",
        to: "delivered@resend.dev", // Resend's test sink — never actually sends
        subject: "API Key Test",
        html: "<p>This is a test email to verify the Resend API key.</p>",
      }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("   ✅ Resend API key is valid — test email sent successfully");
      console.log(`   ID: ${data.id}\n`);
    } else {
      console.log(`   ❌ Resend error: ${data.message || JSON.stringify(data)}\n`);
    }
  } catch (e) {
    console.log(`   ❌ Network error: ${e.message}\n`);
  }
}

// ── 2. Razorpay ────────────────────────────────────────────
console.log("2. Razorpay");
if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
  console.log("   ❌ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set\n");
} else {
  try {
    const creds = Buffer.from(
      `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders?count=1", {
      headers: { Authorization: `Basic ${creds}` },
    });
    const data = await res.json();
    if (res.ok) {
      console.log("   ✅ Razorpay keys are valid — authenticated successfully");
      console.log(`   Mode: ${env.RAZORPAY_KEY_ID.startsWith("rzp_test_") ? "TEST" : "LIVE"}\n`);
    } else {
      console.log(`   ❌ Razorpay error: ${data.error?.description || JSON.stringify(data)}\n`);
    }
  } catch (e) {
    console.log(`   ❌ Network error: ${e.message}\n`);
  }
}

// ── 3. Google OAuth ────────────────────────────────────────
console.log("3. Google OAuth");
if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
  console.log("   ❌ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set\n");
} else {
  // We can't fully test OAuth without a browser flow, but we can validate the format
  const isClientIdValid = env.GOOGLE_CLIENT_ID.endsWith(".apps.googleusercontent.com");
  const isSecretValid = env.GOOGLE_CLIENT_SECRET.startsWith("GOCSPX-");
  if (isClientIdValid && isSecretValid) {
    console.log("   ✅ Google OAuth credentials look valid (correct format)");
    console.log("   Note: Full test requires a browser OAuth flow\n");
  } else {
    console.log("   ❌ Google OAuth credentials look malformed\n");
  }
}

// ── 4. Redis (Upstash) ─────────────────────────────────────
console.log("4. Redis (Upstash)");
if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
  console.log("   ⚠️  Not configured (optional — app works without it)\n");
} else {
  try {
    const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/ping`, {
      headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
    });
    const data = await res.json();
    if (res.ok && data.result === "PONG") {
      console.log("   ✅ Upstash Redis is reachable\n");
    } else {
      console.log(`   ❌ Redis error: ${JSON.stringify(data)}\n`);
    }
  } catch (e) {
    console.log(`   ❌ Network error: ${e.message}\n`);
  }
}

// ── 5. Cloudinary ──────────────────────────────────────────
console.log("5. Cloudinary");
if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
  console.log("   ⚠️  Not fully configured — need CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET\n");
} else {
  try {
    const creds = Buffer.from(
      `${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`
    ).toString("base64");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/resources/image?max_results=1`,
      { headers: { Authorization: `Basic ${creds}` } }
    );
    const data = await res.json();
    if (res.ok) {
      console.log("   ✅ Cloudinary credentials are valid\n");
    } else {
      console.log(`   ❌ Cloudinary error: ${data.error?.message || JSON.stringify(data)}\n`);
    }
  } catch (e) {
    console.log(`   ❌ Network error: ${e.message}\n`);
  }
}

console.log("==============================\n");
