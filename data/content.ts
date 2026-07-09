// Centralized content — client edits text here, never in layout files.
// Values marked PLACEHOLDER must be replaced with verified data before launch.

export const brand = {
  name: "Let's Help Pakistan",
  tagline: "Serving Humanity – Building a Better Future",
  eyebrow: "A non-profit serving Parachinar for 15 years",
  phone1: "+92 926 311116",
  phone2: "+92 302 5722798",
  location: "Parachinar, Pakistan",
} as const;

export const seo = {
  title: "Let's Help Pakistan — Education, Health & Empowerment in Parachinar",
  description:
    "A non-profit serving underprivileged communities in Parachinar for 15 years through education, healthcare, women empowerment, and interest-free livelihood support.",
} as const;

export const hero = {
  headline: "Real change begins where communities are empowered.",
  subcopy:
    "For fifteen years, Let's Help Pakistan has stood with underprivileged families in Parachinar — opening classrooms, clinics, and livelihoods for people the system left behind. We serve humanity without discrimination.",
  cta: {
    primary: { label: "Donate now", href: "/get-involved" },
    secondary: { label: "Become a volunteer", href: "/get-involved" },
  },
  // PLACEHOLDER: Replace with a high-resolution photograph of the community (Unsplash license)
  image: {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=85",
    alt: "Children studying — Let's Help Pakistan education program",
  },
} as const;

export const intro = {
  body: "Based in Parachinar, we believe lasting change starts when communities hold the knowledge, health, and means to build a dignified life. For fifteen years we have created opportunities, supported vulnerable families, and invested in self-reliance — never charity for its own sake.",
} as const;

// PLACEHOLDER: All stat values must be replaced with verified figures before launch.
// Fabricated statistics destroy donor trust.
export const stats: Array<{ value: string; label: string; prefix?: string; suffix?: string }> = [
  { value: "15", suffix: "+", label: "Years serving communities" },
  { value: "3500", suffix: "+", label: "Students supported" }, // PLACEHOLDER
  { value: "8200", suffix: "+", label: "Patients treated" },   // PLACEHOLDER
  { value: "650", suffix: "+", label: "Families empowered" },  // PLACEHOLDER
  { value: "24", suffix: "+", label: "Communities reached" },  // PLACEHOLDER
];

export const visionMission = {
  vision: {
    label: "Our Vision",
    body: "To build a prosperous, educated, healthy, and self-reliant society where every person has the opportunity to reach their full potential.",
  },
  mission: {
    label: "Our Mission",
    body: "To uplift communities through educational support, healthcare initiatives, and small-business development — while protecting social welfare, dignity, and self-sufficiency.",
  },
} as const;

export const programs = [
  {
    id: "education",
    title: "Education",
    lead: "Opening the classroom to every child.",
    items: [
      "Skill development centers",
      "Scholarships for deserving students",
      "Support for orphan and needy children",
      "Digital literacy and computer training",
      "Teacher training",
      "School improvement projects",
    ],
    icon: "GraduationCap",
  },
  {
    id: "health",
    title: "Health",
    lead: "Care that reaches the last mile.",
    items: [
      "Free community clinics",
      "Mother and child healthcare",
      "Mobile health camps in remote areas",
      "Medical support for deserving patients",
      "Preventive-care awareness",
      "Rehabilitation for special-needs individuals",
    ],
    icon: "HeartPulse",
  },
  {
    id: "women",
    title: "Women Empowerment",
    lead: "Skills that turn into independence.",
    items: [
      "Vocational training",
      "Entrepreneurship development",
      "Capacity-building workshops",
      "Financial literacy and business-management training",
    ],
    icon: "Users",
  },
  {
    id: "youth",
    title: "Youth Development",
    lead: "Building the next generation of leaders.",
    items: [
      "Leadership programs",
      "Career counseling",
      "Sports and community activities",
      "Volunteer development",
    ],
    icon: "Sparkles",
  },
  {
    id: "business",
    title: "Small Business Development",
    lead: "Dignity through livelihood.",
    items: [
      "Support for small entrepreneurs",
      "Interest-free microfinance",
      "Business training and mentorship",
      "Local startup promotion",
      "Income-generating projects for low-income families",
    ],
    icon: "Briefcase",
  },
  {
    id: "community",
    title: "Community Welfare",
    lead: "There in the moments that matter.",
    items: [
      "Emergency relief and disaster response",
      "Clean water and sanitation",
      "Awareness campaigns",
      "Humanitarian assistance",
    ],
    icon: "HandHeart",
  },
] as const;

export const initiatives = [
  {
    id: "clinics",
    eyebrow: "Healthcare",
    headline: "Free clinics for families who can't afford to be sick.",
    body: "In the remote valleys around Parachinar, distance and poverty have long kept families from the care they need. Our mobile health camps and free community clinics bring qualified physicians, medicines, and maternal healthcare directly to those who could never travel to a hospital. Every visit — from a routine checkup to an emergency — is provided at no cost, because health is not a privilege.",
    // PLACEHOLDER: Replace with community healthcare photograph
    image: {
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=85",
      alt: "Healthcare worker attending to a patient at a free community clinic",
    },
    imageLeft: false,
  },
  {
    id: "microfinance",
    eyebrow: "Livelihoods",
    headline: "Interest-free capital, not handouts.",
    body: "Dependency is not empowerment. Our interest-free microfinance program gives small entrepreneurs — many of them women — the capital to start or grow a business without the crushing weight of conventional interest. Paired with hands-on business training and mentorship, these loans become launchpads. Recipients become earners, then employers, then contributors to a healthier local economy.",
    // PLACEHOLDER: Replace with entrepreneur/small business photograph
    image: {
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85",
      alt: "Woman entrepreneur running her small business after receiving microfinance support",
    },
    imageLeft: true,
  },
  {
    id: "education",
    eyebrow: "Education",
    headline: "A classroom is the fastest way out of poverty.",
    body: "An educated child becomes an asset to their entire family. Our scholarship program funds tuition, books, and uniforms for orphans and children whose families cannot afford school. Our skill development centers give older youth and adults vocational qualifications that translate directly to employment. We don't just open doors to education — we walk through them together.",
    // PLACEHOLDER: Replace with children in classroom photograph
    image: {
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=85",
      alt: "Children studying in a classroom supported by Let's Help Pakistan",
    },
    imageLeft: false,
  },
] as const;

export const values = [
  { label: "Humanity", icon: "Heart" },
  { label: "Integrity", icon: "Shield" },
  { label: "Transparency", icon: "Eye" },
  { label: "Service", icon: "HandHeart" },
  { label: "Equality", icon: "Scale" },
  { label: "Empowerment", icon: "Zap" },
  { label: "Community Development", icon: "Building2" },
] as const;

export const getInvolved = {
  headline: "Your support becomes someone's turning point.",
  options: [
    {
      label: "Donate",
      description: "Fund education, healthcare, and livelihoods for families in need.",
      href: "/contact",
      variant: "primary" as const,
    },
    {
      label: "Volunteer",
      description: "Bring your skills to communities that can put them to work.",
      href: "/contact",
      variant: "secondary" as const,
    },
    {
      label: "Partner with us",
      description: "Organizations and businesses — let's multiply our impact together.",
      href: "/contact",
      variant: "ghost" as const,
    },
  ],
} as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
] as const;
