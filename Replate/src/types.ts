export type UserRole = 'personal' | 'ngo' | 'hotel';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  orgName?: string;
}

export interface SurplusListing {
  id: string;
  providerId: string;
  providerName: string;
  menuItem: string;
  quantity: number; // in portions/meals
  readyByTime: string;
  pickupWindow: string;
  distanceKm: number;
  accessible: boolean;
  postedAt: string;
  status: 'available' | 'claimed' | 'completed';
  lat?: number;
  lng?: number;
}

export type VerificationStatus = 'pending' | 'verified' | 'unverified';

export interface Claim {
  id: string;
  listingId: string;
  listingTitle: string;
  providerName: string;
  providerPhone: string;
  claimantId: string;
  claimantName: string;
  claimantRole: UserRole;
  quantity: number;
  pickupWindow: string;
  claimedAt: string;
  verificationStatus: VerificationStatus;
  idDocUploaded: boolean;
  selfieUploaded: boolean;
  proofOfPickupUploaded: boolean;
  proofPhotoUrl?: string;
}

export interface DailyPredictionInput {
  dayOfWeek: string;
  expectedBookings: number;
  weatherCondition: string;
  isHoliday: boolean;
  specialEvent: boolean;
}

export interface DailyPredictionResult {
  predictedDiners: number;
  suggestedPrepBuffer: number;
  recommendedPrepMeals: number;
  estimatedWasteSavedKg: number;
}
