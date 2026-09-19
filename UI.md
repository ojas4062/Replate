# ZeroPlate — UI Specification (Website, v2)

## 0. Stack Note
Website, not Streamlit. Suggested minimal stack: any standard frontend (React/Next.js or plain HTML/CSS/JS) + a lightweight backend (Node/Express or Python/FastAPI) + the existing regression logic exposed as an API endpoint. Auth can be a simple session/JWT login — no need for a full identity provider for a hackathon build. See TRD.md / SCOPE-NOTE.md for what to actually implement vs. stub.

## 1. Site Map
```
/login
/signup (role: Personal | NGO-Org | Hotel-Mess)

/personal/dashboard
/personal/map
/personal/claims

/ngo/dashboard
/ngo/map
/ngo/claims
/ngo/impact          (payments/allocation view)

/hotel/dashboard
/hotel/predict        (v1 Predict/Prepare/Measure loop)
/hotel/post-surplus
/hotel/claims-incoming
/hotel/earnings        (payments/allocation view)

/profile               (contact details, shared across roles)
```

## 2. Login Page
```
--------------------------------------------------
ZERO PLATE
Predict better. Prepare smarter. Waste less.

[ Email/Phone ]
[ Password ]
[ Log In ]

New here? [ Sign Up ]
--------------------------------------------------
```
Signup adds a role selector (Personal / NGO-Org / Hotel-Mess) and a contact-details form (name, phone, email, address). Role determines which panel loads post-login.

## 3. Hotel / Mess Panel

### 3a. Dashboard
```
--------------------------------------------------
Hotel Dashboard — [Name]
[Predict] [Post Surplus] [Incoming Claims] [Earnings]
--------------------------------------------------
Today's surplus listings: 2 active
Pending claims: 3
This period earnings: ₹[simulated figure]
--------------------------------------------------
```

### 3b. Predict Page
Same 3-step layout as the original single-page MVP:
```
01 PREDICT  →  02 PREPARE  →  03 MEASURE
```
(Unchanged from UX.md/UI.md v1 — retained as a page within this panel, not the whole site.)

### 3c. Post Surplus
```
[ Menu item ] [ Quantity ] [ Ready-by time ] [ Pickup window ]
[ Post Listing ]
```

### 3d. Incoming Claims
```
Claimant: [Name/Org]     Status: [Verified ✓ / Unverified]
Quantity: [n]            Contact: [shown if verified / masked if not]
[ Mark Picked Up ]
```

## 4. NGO / Organization Panel

### 4a. Dashboard
```
--------------------------------------------------
NGO Dashboard — [Org Name]
[Browse Map] [My Claims] [Impact/Allocation]
--------------------------------------------------
```

### 4b. Browse Surplus Map — see §6 (shared component)

### 4c. Claim Flow (from a listing card)
```
Listing: [Menu item], [Quantity], [Provider name], [Distance]
[ Claim This ]
   ↓
Upload ID (Aadhaar/PAN) [ file ]
Upload selfie photo     [ file ]
[ Submit for Verification ]
   ↓
Status banner: "Claim confirmed — verification pending"
```

### 4d. Claim Status (post-verification)
```
Verified ✓
Provider contact: [phone/email]
Pickup window: [time]
[ Upload proof-of-pickup photo ]  ← shown after pickup window opens
```
or
```
Unverified
Provider notified — awaiting manual review.
Limited contact: [masked/relay message option]
```
No confetti, no animation, no popup modal — plain status banner per UX.md §4d.

### 4e. Impact / Allocation Page
```
This org received: ₹[simulated figure] / [n] meals this period
[ Chart: allocation over time ]
Prototype uses simulated allocation data.
```

## 5. Personal Panel
Same structure as NGO panel (§4), minus the Impact page, plus a note that claim quantities are capped lower than org claims:
```
--------------------------------------------------
Personal Dashboard — [Name]
[Browse Map] [My Claims]
--------------------------------------------------
```

## 6. Shared Component — Surplus Map (used by NGO and Personal panels)
```
--------------------------------------------------
[Map view]                    [List view toggle]

 • Pin: Hotel A — 2.1 km — Accessible
 • Pin: Mess B — 14 km — Outside pickup radius
 • Pin: Hotel C — 0.8 km — Accessible

[ Filter: distance | menu | quantity ]
--------------------------------------------------
```
Selecting a pin opens the listing card (§4c). "Not accessible" listings show a warning on the Claim button rather than blocking it outright, so a claimant can still choose to travel farther if they wish.

## 7. Shared Component — Verification Status Badge
Used on any claim wherever it appears (incoming claims list, claim status page):
```
[●] Verified      — green dot, contact unlocked
[●] Unverified     — amber dot, contact masked
[●] Pending review — grey dot, upload not yet processed
```

## 8. Profile Page
```
Name: [ ]
Phone: [ ]
Email: [ ]
Address: [ ]
Role: [Personal / NGO-Org / Hotel-Mess]   (read-only after signup)
[ Save ]
```

## 9. Payments / Earnings Page (Hotel view) — parallel to Impact page (§4e)
```
This period earned: ₹[simulated figure]
Allocated to NGOs/orgs: ₹[simulated figure] across [n] claims
[ Chart: earnings vs. allocation over time ]
Prototype uses simulated payment data — no live payment processing in this build.
```

## 10. UI Rules
- No confetti/balloon/celebratory popup anywhere in the claim flow — replaced by the inline status banners in §4c/§4d/§7.
- Verification badges use color + label, never color alone (accessibility).
- Contact details are never displayed in full until a claim shows "Verified."
- Map "not accessible" state is a warning, not a hard block.
- Payments figures are always labeled "simulated" wherever displayed — no exception, matching SPIRIT.md's "truth over hype" rule.
- Keep each panel's own nav to 4 items max; don't let one account see another role's pages.
