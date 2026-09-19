# ZeroPlate — UX Specification (Website, v2)

## 0. Scope Change Notice
This version replaces the single-screen Streamlit prototype with a full website concept: three user-type panels, a surplus-claim marketplace, ID-based claimant verification, a maps/accessibility view, and a payments/allocation page. See SCOPE-NOTE.md for what's realistic to build vs. mock for a hackathon timeline.

## 1. UX Principle
Each panel should be understandable within one screen for its own user type. A judge should be able to follow one full loop — hotel posts surplus → NGO/individual claims → verification → pickup confirmed → payment allocation shown — in under two minutes.

## 2. User Types / Panels
Three distinct logged-in experiences, selected at login:

1. **Personal** — individual users who can claim small surplus quantities for themselves.
2. **NGO / Organization** — verified orgs claiming larger quantities for redistribution.
3. **Hotel / Mess / Restaurant** — surplus food providers; also retains the original demand-prediction tools from v1.

Each panel has its own nav and dashboard. No cross-panel navigation without switching accounts.

## 3. Core Flows Per Panel

### 3a. Hotel / Mess / Restaurant Panel
```
Login → Dashboard
  ├── Predict (original v1 loop: Predict → Prepare → Measure)
  ├── Post Surplus (list today's excess: quantity, menu, ready-by time, pickup window)
  ├── Incoming Claims (see who claimed, verification status, contact)
  └── Earnings (this hotel's view of the Payments page — see §6)
```

### 3b. NGO / Organization Panel
```
Login → Dashboard
  ├── Browse Surplus Map (§5 — filter by distance, accessibility)
  ├── Claim Listing → Upload Verification Docs (§4)
  ├── My Claims (status: pending / verified / picked up)
  └── Impact / Allocation (this org's view of the Payments page — see §6)
```

### 3c. Personal Panel
```
Login → Dashboard
  ├── Browse Surplus Map (§5)
  ├── Claim Listing (smaller quantities only) → Upload Verification Docs (§4)
  └── My Claims (status: pending / verified / picked up)
```

## 4. Claim & Verification Flow
This replaces any celebratory "claimed!" animation with a calm status flow — see §4d.

**4a. Claim**
User taps **Claim** on a surplus listing → confirms quantity and pickup time → listing moves to "pending verification."

**4b. Upload proof**
Two upload moments, both clearly labeled:
- **At claim time:** ID document (Aadhaar/PAN) + a selfie photo, for identity verification.
- **After pickup:** a photo of the received food, as proof of handoff.

**4c. Matching**
The uploaded selfie is compared against the ID photo. Two outcomes:
- **Verified** — face match passes → green confirmation state, claim proceeds, provider sees a "Verified claimant" badge with contact details unlocked.
- **Unverified** — no match, blurry image, or no ID provided → amber/red state, claim is flagged for manual review; provider sees "Unverified — proceed at discretion" and a limited contact option (masked phone/relay message) rather than full contact details.

**4d. Status feedback — no celebratory popup**
Replace any balloon/confetti animation with a plain inline status banner:
- "Claim confirmed — verification pending"
- "Verified ✓ — pickup details sent"
- "Unverified — provider notified, awaiting manual review"
No modal, no animation, no sound. This matches SPIRIT.md's "truth over hype" principle — a food-redistribution claim isn't a celebration moment, it's a logistics confirmation.

**4e. Data handling note**
For the hackathon build, verification should be **mocked**: uploads are accepted and shown in the UI, but no real Aadhaar/PAN number or ID image is parsed, stored, or transmitted anywhere persistent. The "match" result can be simulated (e.g. weighted pass/fail, or a placeholder comparison) and clearly labeled as a prototype simulation, the same way the demand model's synthetic data is labeled. Do not build real government-ID OCR or storage for a hackathon prototype — see SCOPE-NOTE.md.

## 5. Maps / Location Flow
Purpose: let claimants see surplus listings relative to their own location before claiming.

- Map view shows pins for active surplus listings.
- Each pin shows distance from the user and one of two states:
  - **Accessible** — within a reasonable travel radius, route resolvable.
  - **Not accessible / far** — outside a configurable radius (default e.g. 10 km), or no resolvable route.
- Tapping a pin opens the listing card with quantity, menu, pickup window, and a **Claim** button (disabled or warned if marked not-accessible).
- List view is the fallback if a full map integration is too time-costly for a hackathon build (see SCOPE-NOTE.md).

## 6. Payments / Allocation Page
A separate page (not part of the claim flow) showing the money side of the platform:

- **Hotel/mess view:** amount earned from surplus sold/allocated this period.
- **NGO/org view:** amount received/allocated to this org this period.
- **Platform-wide summary (admin or public transparency view):** total amount routed from providers → organizations, broken down by provider and by receiving org.

This page is informational only for the hackathon build — no live payment processing. Numbers can come from the same simulated dataset used elsewhere, clearly labeled as prototype figures, consistent with SPIRIT.md's "truth over hype" rule.

## 7. Login & Contact
- Single login page, role selector (Personal / NGO / Hotel-Mess) determines which panel loads after auth.
- Each account has a contact details section (name, phone, email, address) editable from a profile page.
- Contact details are only exposed to the other party in a claim **after** verification succeeds (§4c) — unverified claims get a masked/relay contact instead, protecting both sides' privacy at the prototype stage.

## 8. Visual Hierarchy (per panel)
Priority 1: the panel's primary action (Predict / Post Surplus / Browse & Claim).
Priority 2: status of in-flight items (claims, verification, predictions).
Priority 3: supporting pages (maps, payments, profile).

## 9. UX Copy Rules
Prefer:
- "Verified claimant" / "Unverified — pending review"
- "Claim confirmed — verification pending"
- "Accessible" / "Outside pickup radius"
- "Simulated allocation figures" (on the Payments page)

Avoid:
- "100% verified"
- "Guaranteed pickup"
- Any celebratory/gamified language on the claim-confirmation state

## 10. Feedback States
- **Success (claim):** "Claim confirmed — verification pending." (plain banner, no animation)
- **Verified:** "Verified ✓ — contact details shared."
- **Unverified:** "Unverified — provider notified. Contact is limited until reviewed."
- **Validation:** "Enter a non-negative quantity." / "Upload a clearer photo to continue."
- **Empty state:** "No surplus listings near you right now."
- **Data note:** "Prototype uses simulated verification and allocation data."
