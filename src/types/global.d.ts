declare global {
  interface Window {
    NJ_CONFIG: {
      VITAL_PAYWALL_MODE: "paid" | "trial" | "free";
      TRIAL_LENGTH_DAYS: number;
      MEMBER_DISCOUNT_PCT: number;
      REGULAR_PRICE: number;
    };
    NJ: {
      isMember: boolean;
      hasVitalTrial: boolean;
      trialEndsAt: Date | null;
      memberEmail: string | null;
    };
  }
}

export {};