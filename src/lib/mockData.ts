// Topics list for the MVP
// This is kept as mock data since it's just a category list used throughout the app
export const topics = [
  { id: "1", name: "God & Existence", slug: "god-existence" },
  { id: "2", name: "Suffering & Evil", slug: "suffering-evil" },
  { id: "3", name: "Jesus & Resurrection", slug: "jesus-resurrection" },
  { id: "4", name: "Bible Reliability", slug: "bible-reliability" },
  { id: "5", name: "Science & Faith", slug: "science-faith" },
  { id: "6", name: "Prayer & Miracles", slug: "prayer-miracles" },
  { id: "7", name: "Salvation & Grace", slug: "salvation-grace" },
  { id: "8", name: "Heaven & Hell", slug: "heaven-hell" },
  { id: "9", name: "Meaning & Purpose", slug: "meaning-purpose" },
  { id: "10", name: "Church History", slug: "church-history" },
  { id: "11", name: "Morality & Ethics", slug: "morality-ethics" },
  { id: "12", name: "Other", slug: "other" },
];

export type Topic = typeof topics[0];
