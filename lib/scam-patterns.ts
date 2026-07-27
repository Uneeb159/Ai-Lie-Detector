export const scamPatterns = [
  {
    id: "bank-impersonation",
    title: "Bank impersonation",
    category: "bank",
    risk: "high",
    example: "Your account has suspicious activity. Verify now or it will be locked.",
    warningSigns: ["Urgency", "Account threat", "Suspicious verification link"],
    safeActions: ["Open your bank app directly", "Do not click the message link", "Call the number on your card"]
  },
  {
    id: "gift-card-payment",
    title: "Gift card payment demand",
    category: "gift_card",
    risk: "critical",
    example: "Buy gift cards and send me the codes immediately.",
    warningSigns: ["Untraceable payment", "Urgency", "Pressure"],
    safeActions: ["Do not buy cards", "Do not share codes", "Report the message"]
  },
  {
    id: "fake-job",
    title: "Fake job offer",
    category: "job",
    risk: "medium",
    example: "Earn $500 daily with no interview. Pay a registration fee now.",
    warningSigns: ["Unrealistic pay", "Upfront fee", "Fast action pressure"],
    safeActions: ["Verify the company website", "Avoid paying to get a job", "Search for official recruiter contacts"]
  },
  {
    id: "marketplace-deposit",
    title: "Marketplace deposit pressure",
    category: "marketplace",
    risk: "high",
    example: "Send a deposit now or I will give the item to someone else.",
    warningSigns: ["Off-platform payment", "Scarcity pressure", "No buyer protection"],
    safeActions: ["Keep payment in the platform", "Meet safely when appropriate", "Avoid deposits to strangers"]
  },
  {
    id: "romance-emergency",
    title: "Romance emergency request",
    category: "romance",
    risk: "high",
    example: "I love you, but I am stuck and need money today. Please do not tell anyone.",
    warningSigns: ["Secrecy", "Emotional pressure", "Urgent money request"],
    safeActions: ["Pause before replying", "Talk to someone you trust", "Do not send money or gift cards"]
  },
  {
    id: "delivery-link",
    title: "Fake delivery link",
    category: "delivery",
    risk: "medium",
    example: "Your parcel is held. Pay a small fee at this link today.",
    warningSigns: ["Small unexpected fee", "Unknown link", "Delivery urgency"],
    safeActions: ["Open the carrier site directly", "Do not enter card details", "Check tracking from your order"]
  }
] as const;
