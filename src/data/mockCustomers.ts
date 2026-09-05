import { Customer } from '../types/customer';
import { classifyCustomer } from '../utils/segmentation';

const rawMockData: Omit<Customer, 'segment' | 'engagementScore' | 'explanation'>[] = [
  // High Value & Loyal tier (Spend in INR ₹)
  { customerId: 'CUST-1001', name: 'Sophia Chen', email: 'sophia.chen@example.com', age: 34, location: 'Mumbai, MH', totalSpent: 385000, purchaseCount: 14, lastPurchaseDate: '2026-08-28', websiteVisits: 38, emailOpens: 22, emailClicks: 15 },
  { customerId: 'CUST-1002', name: 'Marcus Vance', email: 'm.vance@example.com', age: 42, location: 'Bengaluru, KA', totalSpent: 315000, purchaseCount: 11, lastPurchaseDate: '2026-08-25', websiteVisits: 45, emailOpens: 19, emailClicks: 12 },
  { customerId: 'CUST-1003', name: 'Elena Rostova', email: 'elena.r@example.com', age: 29, location: 'Delhi, DL', totalSpent: 245000, purchaseCount: 8, lastPurchaseDate: '2026-08-30', websiteVisits: 28, emailOpens: 15, emailClicks: 9 },
  { customerId: 'CUST-1004', name: 'David Kim', email: 'dkim.tech@example.com', age: 38, location: 'Hyderabad, TS', totalSpent: 420000, purchaseCount: 16, lastPurchaseDate: '2026-08-29', websiteVisits: 52, emailOpens: 30, emailClicks: 21 },
  { customerId: 'CUST-1005', name: 'Amara Nwosu', email: 'amara.n@example.com', age: 31, location: 'Pune, MH', totalSpent: 210000, purchaseCount: 6, lastPurchaseDate: '2026-08-20', websiteVisits: 22, emailOpens: 14, emailClicks: 7 },
  { customerId: 'CUST-1006', name: 'Liam O\'Connor', email: 'liam.oc@example.com', age: 45, location: 'Chennai, TN', totalSpent: 165000, purchaseCount: 9, lastPurchaseDate: '2026-08-22', websiteVisits: 31, emailOpens: 18, emailClicks: 8 },
  { customerId: 'CUST-1007', name: 'Isabella Gomez', email: 'isabella.g@example.com', age: 27, location: 'Kolkata, WB', totalSpent: 280000, purchaseCount: 7, lastPurchaseDate: '2026-08-27', websiteVisits: 40, emailOpens: 25, emailClicks: 14 },
  { customerId: 'CUST-1008', name: 'James Miller', email: 'jmiller.dev@example.com', age: 36, location: 'Ahmedabad, GJ', totalSpent: 230000, purchaseCount: 9, lastPurchaseDate: '2026-08-18', websiteVisits: 29, emailOpens: 16, emailClicks: 10 },
  { customerId: 'CUST-1009', name: 'Chloe Dubois', email: 'chloe.d@example.com', age: 30, location: 'Jaipur, RJ', totalSpent: 350000, purchaseCount: 12, lastPurchaseDate: '2026-08-31', websiteVisits: 48, emailOpens: 27, emailClicks: 18 },
  { customerId: 'CUST-1010', name: 'Alexander Wright', email: 'awright@example.com', age: 51, location: 'Chandigarh, PB', totalSpent: 175000, purchaseCount: 8, lastPurchaseDate: '2026-08-15', websiteVisits: 20, emailOpens: 12, emailClicks: 5 },

  // Regular & Active tier
  { customerId: 'CUST-1011', name: 'Hannah Abbott', email: 'hannah.a@example.com', age: 26, location: 'Kochi, KL', totalSpent: 72000, purchaseCount: 4, lastPurchaseDate: '2026-08-12', websiteVisits: 18, emailOpens: 8, emailClicks: 3 },
  { customerId: 'CUST-1012', name: 'Benjamin Hayes', email: 'ben.hayes@example.com', age: 39, location: 'Lucknow, UP', totalSpent: 98000, purchaseCount: 5, lastPurchaseDate: '2026-08-10', websiteVisits: 24, emailOpens: 11, emailClicks: 6 },
  { customerId: 'CUST-1013', name: 'Priya Patel', email: 'priya.p@example.com', age: 33, location: 'Surat, GJ', totalSpent: 85000, purchaseCount: 4, lastPurchaseDate: '2026-08-14', websiteVisits: 21, emailOpens: 13, emailClicks: 5 },
  { customerId: 'CUST-1014', name: 'Lucas Tanaka', email: 'ltanaka@example.com', age: 28, location: 'Indore, MP', totalSpent: 68000, purchaseCount: 3, lastPurchaseDate: '2026-08-08', websiteVisits: 15, emailOpens: 9, emailClicks: 2 },
  { customerId: 'CUST-1015', name: 'Emily Santos', email: 'emily.s@example.com', age: 35, location: 'Goa, GA', totalSpent: 115000, purchaseCount: 5, lastPurchaseDate: '2026-08-05', websiteVisits: 27, emailOpens: 14, emailClicks: 7 },

  // New / Potential Customers
  { customerId: 'CUST-1016', name: 'Noah Jenkins', email: 'njenkins@example.com', age: 24, location: 'Bhopal, MP', totalSpent: 14500, purchaseCount: 1, lastPurchaseDate: '2026-08-28', websiteVisits: 8, emailOpens: 4, emailClicks: 2 },
  { customerId: 'CUST-1017', name: 'Olivia Taylor', email: 'olivia.t@example.com', age: 29, location: 'Nagpur, MH', totalSpent: 22000, purchaseCount: 1, lastPurchaseDate: '2026-08-29', websiteVisits: 12, emailOpens: 5, emailClicks: 3 },
  { customerId: 'CUST-1018', name: 'Ethan Hunt', email: 'ehunt@example.com', age: 32, location: 'Patna, BR', totalSpent: 34000, purchaseCount: 2, lastPurchaseDate: '2026-08-30', websiteVisits: 14, emailOpens: 7, emailClicks: 4 },
  { customerId: 'CUST-1019', name: 'Mia Robinson', email: 'mrobinson@example.com', age: 27, location: 'Vadodara, GJ', totalSpent: 18000, purchaseCount: 1, lastPurchaseDate: '2026-08-26', websiteVisits: 9, emailOpens: 3, emailClicks: 1 },
  { customerId: 'CUST-1020', name: 'Oliver Scott', email: 'oscott@example.com', age: 31, location: 'Visakhapatnam, AP', totalSpent: 25000, purchaseCount: 1, lastPurchaseDate: '2026-08-27', websiteVisits: 10, emailOpens: 6, emailClicks: 3 },

  // At Risk Customers
  { customerId: 'CUST-1021', name: 'Victoria Sterling', email: 'v.sterling@example.com', age: 48, location: 'Coimbatore, TN', totalSpent: 180000, purchaseCount: 6, lastPurchaseDate: '2026-05-10', websiteVisits: 4, emailOpens: 2, emailClicks: 0 },
  { customerId: 'CUST-1022', name: 'Daniel Brooks', email: 'dbrooks@example.com', age: 41, location: 'Thane, MH', totalSpent: 155000, purchaseCount: 5, lastPurchaseDate: '2026-04-18', websiteVisits: 3, emailOpens: 1, emailClicks: 0 },
  { customerId: 'CUST-1023', name: 'Grace Montgomery', email: 'gmontgomery@example.com', age: 37, location: 'Guwahati, AS', totalSpent: 110000, purchaseCount: 4, lastPurchaseDate: '2026-05-22', websiteVisits: 5, emailOpens: 3, emailClicks: 0 },
  { customerId: 'CUST-1024', name: 'Henry Cavendish', email: 'hcavendish@example.com', age: 53, location: 'Ludhiana, PB', totalSpent: 82000, purchaseCount: 3, lastPurchaseDate: '2026-04-05', websiteVisits: 2, emailOpens: 0, emailClicks: 0 },
  { customerId: 'CUST-1025', name: 'Zoe Kravitz', email: 'zkravitz@example.com', age: 30, location: 'Agra, UP', totalSpent: 135000, purchaseCount: 5, lastPurchaseDate: '2026-05-01', websiteVisits: 6, emailOpens: 2, emailClicks: 1 },
];

const names = ['Aarav', 'Ananya', 'Rohan', 'Isha', 'Kabir', 'Diya', 'Vivaan', 'Sanya', 'Aditya', 'Riya', 'Vihaan', 'Kavya', 'Reyansh', 'Meera', 'Arjun', 'Pooja', 'Sai', 'Tara', 'Dev', 'Neha'];
const surnames = ['Sharma', 'Verma', 'Gupta', 'Mehta', 'Rao', 'Nair', 'Singh', 'Kumar', 'Reddy', 'Deshmukh', 'Joshi', 'Chopra', 'Malhotra', 'Bhat', 'Saxena', 'Kapoor', 'Pillai', 'Iyer', 'Agarwal', 'Chatterjee'];
const cities = ['Mumbai, MH', 'Bengaluru, KA', 'Delhi, DL', 'Hyderabad, TS', 'Pune, MH', 'Chennai, TN', 'Kolkata, WB', 'Ahmedabad, GJ', 'Jaipur, RJ', 'Chandigarh, PB'];

for (let i = 26; i <= 105; i++) {
  const firstName = names[(i * 3) % names.length];
  const lastName = surnames[(i * 7) % surnames.length];
  const city = cities[(i * 2) % cities.length];
  const age = 22 + ((i * 11) % 40);

  let totalSpent = 12000 + ((i * 3470) % 360000);
  let purchaseCount = 1 + ((i * 3) % 15);
  let websiteVisits = 3 + ((i * 5) % 45);
  let emailOpens = 1 + ((i * 2) % 25);
  let emailClicks = (i % 3 === 0) ? Math.floor(emailOpens * 0.6) : Math.floor(emailOpens * 0.2);

  const daysAgo = (i % 5 === 0) ? 95 + (i % 25) : (i % 4 === 0) ? 15 + (i % 12) : 35 + (i % 40);
  const purchaseDateObj = new Date('2026-09-01T00:00:00Z');
  purchaseDateObj.setDate(purchaseDateObj.getDate() - daysAgo);
  const lastPurchaseDate = purchaseDateObj.toISOString().split('T')[0];

  rawMockData.push({
    customerId: `CUST-${1000 + i}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
    age,
    location: city,
    totalSpent,
    purchaseCount,
    lastPurchaseDate,
    websiteVisits,
    emailOpens,
    emailClicks,
  });
}

export const initialCustomers: Customer[] = rawMockData.map((raw) => {
  const result = classifyCustomer(raw);
  return {
    ...raw,
    segment: result.segment,
    engagementScore: result.engagementScore,
    explanation: result.explanation,
  };
});
