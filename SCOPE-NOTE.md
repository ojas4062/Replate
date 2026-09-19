# ZeroPlate — Scope Note (v2 Website Pivot)

## What changed
v1 was a single-screen Streamlit MVP (Predict → Prepare → Measure loop) built for a 24-hour beginner hackathon. v2 adds: a real website, 3 login panels, a surplus-claim marketplace, ID-based verification with face matching, a maps/accessibility view, and a payments/allocation page. This is a materially larger build.

## Build vs. mock, for the time available
If the team still has roughly a day, build these for real and mock the rest:

**Build for real:**
- Login + 3-panel routing (this is straightforward with any auth library).
- Post Surplus / Browse / Claim flow with a plain database table (no verification logic needed to demo the core loop).
- The original Predict/Prepare/Measure tool, ported into the Hotel panel as a page.
- Status banners (no confetti) — this is a CSS/copy change, cheap to do properly.

**Mock, clearly labeled as prototype:**
- **ID verification / face matching** — do not build real Aadhaar/PAN parsing or storage. Accept an upload, show it in the UI, and return a simulated verified/unverified result (e.g. randomized, or a placeholder image-hash check). This avoids both the build time and the real legal exposure of handling government ID data (see below).
- **Maps** — if a mapping API integration (routing, distance, accessibility) is too time-costly, fall back to a static list with hardcoded distance/accessibility labels per demo listing. Still demonstrates the concept.
- **Payments page** — display numbers computed from the same simulated dataset already used for demand prediction. No live payment gateway.

## Why ID verification should stay mocked
Collecting and storing real Aadhaar or PAN numbers/images is legally restricted for private applications in India — the Aadhaar Act, 2016 limits who may collect and store Aadhaar data and how. A student hackathon prototype that actually parses and retains ID documents and biometric-style face-match data is taking on real compliance risk, not just extra build time, and this applies whether or not the app ever leaves the demo laptop. Keeping this feature simulated in the UI (accept the upload, show a result, never persist or transmit the actual document) gets the same demo impact without that exposure.

## Suggested judge-facing framing
> "The claim and verification flow is built end-to-end in the UI. For the hackathon prototype, identity verification and payment processing are simulated — in a real deployment these would integrate with a licensed KYC provider and a payment gateway, rather than the app handling ID documents directly."

That sentence does the same job PITCH.md's data-honesty line does for the demand model: it's defensible under a technical judge's follow-up question instead of over-claiming.
