

export const AI_PROMPT = `Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. Give me a Hotels options list with Hotel Name, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with place Name, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.`;

export const SelectBudgetOptions = [
  {
    icon: '💰',
    title: 'Budget',
    desc: 'Looking for affordable options'
  },
  {
    icon: '💵',
    title: 'Moderate',
    desc: 'Willing to spend a bit more'
  },
  {
    icon: '💎',
    title: 'Luxury',
    desc: 'Want the best experience'
  }
];

export const SelectTravelList = [
  {
    icon: '👫',
    title: 'Couple',
    people: 'Couple',
    desc: 'Romantic getaway'
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family',
    people: 'Family',
    desc: 'Family-friendly options'
  },
  {
    icon: '👥',
    title: 'Friends',
    people: 'Friends',
    desc: 'Fun with friends'
  }
];