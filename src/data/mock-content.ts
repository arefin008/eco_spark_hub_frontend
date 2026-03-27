import type { IdeaCard } from "@/types/idea";

export const featuredIdeas: IdeaCard[] = [
  {
    id: "solar-roof-coop",
    title: "Solar Roof Co-op",
    category: "Energy",
    summary:
      "Shared financing model for rooftop solar across apartment buildings.",
    voteScore: 328,
    isPaid: false,
    author: "Nadia Rahman",
    publishedAt: "March 18, 2026",
    status: "APPROVED",
    problemStatement:
      "Apartment dwellers struggle to access affordable clean energy despite high rooftop potential.",
    proposedSolution:
      "Create a neighborhood cooperative that funds installation and shares savings across members.",
    description:
      "The idea combines pooled financing, bulk vendor negotiation, and transparent production dashboards so residents can adopt solar without managing infrastructure alone.",
  },
  {
    id: "river-plastic-audit",
    title: "River Plastic Audit",
    category: "Waste",
    summary:
      "Citizen-led plastic source tracking across canals, markets, and schools.",
    voteScore: 241,
    isPaid: true,
    author: "Farhan Ahmed",
    publishedAt: "March 12, 2026",
    status: "UNDER_REVIEW",
    problemStatement:
      "Communities see waste accumulation but lack data on where it enters the water system.",
    proposedSolution:
      "Launch monthly audit teams and map hotspots to guide reusable packaging pilots.",
    description:
      "The project includes volunteer kits, route templates, data capture rules, and partnerships with local vendors to reduce repeat dumping patterns.",
  },
  {
    id: "bike-school-corridor",
    title: "Bike-to-School Corridor",
    category: "Transportation",
    summary:
      "Protected low-cost cycling corridors linking schools, clinics, and parks.",
    voteScore: 199,
    isPaid: false,
    author: "Sharmin Sultana",
    publishedAt: "March 8, 2026",
    status: "APPROVED",
    problemStatement:
      "Students rely on short car trips that worsen traffic, noise, and emissions.",
    proposedSolution:
      "Pilot protected cycling lanes and volunteer crossing support during peak school hours.",
    description:
      "The corridor model emphasizes school safety, low-cost paint-and-post materials, and neighborhood awareness campaigns to shift short-trip behavior.",
  },
];

export const ideaList = featuredIdeas.concat([
  {
    id: "food-compost-market",
    title: "Market Compost Exchange",
    category: "Waste",
    summary:
      "Convert produce-market leftovers into compost for community gardens.",
    voteScore: 164,
    isPaid: false,
    author: "Ishrat Jahan",
    publishedAt: "February 28, 2026",
    status: "APPROVED",
    problemStatement:
      "Organic waste from markets is often dumped instead of reused productively.",
    proposedSolution:
      "Set up collection, sorting, and compost exchange points run by local youth groups.",
    description:
      "This model reduces landfill pressure while improving soil quality for nearby community farms and school gardens.",
  },
  {
    id: "cool-roof-lab",
    title: "Cool Roof Lab",
    category: "Energy",
    summary:
      "Test reflective paint strategies for heat reduction in dense urban blocks.",
    voteScore: 118,
    isPaid: true,
    author: "Mahin Kabir",
    publishedAt: "February 20, 2026",
    status: "REJECTED",
    problemStatement:
      "Heat islands raise indoor temperatures and energy demand in low-ventilation neighborhoods.",
    proposedSolution:
      "Pilot reflective roof coating on a cluster of homes and monitor indoor comfort changes.",
    description:
      "The concept packages a measurable pilot with resident training and before-after monitoring to prove feasibility.",
  },
  {
    id: "repair-club-network",
    title: "Neighborhood Repair Club",
    category: "Waste",
    summary:
      "Monthly repair sessions to extend the life of small appliances and bikes.",
    voteScore: 93,
    isPaid: false,
    author: "Samiul Islam",
    publishedAt: "February 15, 2026",
    status: "UNDER_REVIEW",
    problemStatement:
      "Repairable goods are discarded due to weak local repair culture and limited access to tools.",
    proposedSolution:
      "Host recurring club events with volunteer technicians and shared repair equipment.",
    description:
      "The club model reduces waste, transfers practical skills, and creates a visible culture of maintenance over disposal.",
  },
]);

export const testimonials = [
  {
    author: "Asha Dutta",
    role: "Community member",
    quote:
      "The solar co-op blueprint helped our neighborhood discuss clean energy in practical terms instead of abstract goals.",
  },
  {
    author: "Rafid Chowdhury",
    role: "Volunteer organizer",
    quote:
      "Voting and comments made it obvious which waste projects had real community backing before we spent time fundraising.",
  },
  {
    author: "Maliha Noor",
    role: "Admin moderator",
    quote:
      "Clear review states and structured submissions make it easier to support good ideas without letting poor proposals through.",
  },
];

export const blogPosts = [
  {
    slug: "community-energy-playbook",
    title: "How communities turn energy ideas into pilot projects",
    excerpt:
      "A practical look at what makes small energy pilots credible enough to attract volunteers and sponsors.",
    date: "March 20, 2026",
  },
  {
    slug: "designing-paid-knowledge-products",
    title: "When a sustainability idea should become a paid knowledge product",
    excerpt:
      "Packaging research, feasibility models, and implementation guides without locking away public-good basics.",
    date: "March 14, 2026",
  },
  {
    slug: "moderation-workflows",
    title: "Moderation workflows for civic idea platforms",
    excerpt:
      "Status models, feedback loops, and review checklists that keep member trust intact.",
    date: "March 6, 2026",
  },
];

export const ideasPageFilters = [
  {
    title: "Category",
    options: ["Energy", "Waste", "Transportation"],
  },
  {
    title: "Payment",
    options: ["Free", "Paid"],
  },
  {
    title: "Sorting",
    options: ["Recent", "Top Voted", "Most Commented"],
  },
];
