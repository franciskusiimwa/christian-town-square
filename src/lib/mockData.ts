// Mock data for the MVP
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

export const questions = [
  {
    id: "1",
    title: "If God is loving, why is there suffering?",
    details: "I struggle to understand how an all-powerful, all-loving God can allow so much pain in the world. Children get sick, natural disasters kill thousands, and evil seems to go unpunished. How do Christians reconcile this?",
    author: "Community",
    isAnonymous: false,
    createdAt: new Date("2025-12-28"),
    topics: ["Suffering & Evil", "God & Existence"],
    answerCount: 12,
    viewCount: 1240,
    status: "active" as const,
  },
  {
    id: "2",
    title: "Does God exist, or is faith just wishful thinking?",
    details: "I've been an atheist most of my life, but I'm genuinely curious about the evidence Christians point to for God's existence. Is there rational justification, or does it come down to personal experience?",
    author: "Community",
    isAnonymous: false,
    createdAt: new Date("2025-12-27"),
    topics: ["God & Existence"],
    answerCount: 8,
    viewCount: 890,
    status: "active" as const,
  },
  {
    id: "3",
    title: "Is the Bible historically reliable?",
    details: "How do we know the Bible hasn't been changed over centuries of copying? What evidence supports its historical accuracy?",
    author: "Community",
    isAnonymous: false,
    createdAt: new Date("2025-12-26"),
    topics: ["Bible Reliability", "Church History"],
    answerCount: 15,
    viewCount: 1560,
    status: "active" as const,
  },
  {
    id: "4",
    title: "Did Jesus really rise from the dead?",
    details: "The resurrection is central to Christianity. What evidence exists that this actually happened historically, and how do historians evaluate it?",
    author: "Community",
    isAnonymous: false,
    createdAt: new Date("2025-12-25"),
    topics: ["Jesus & Resurrection"],
    answerCount: 18,
    viewCount: 2100,
    status: "active" as const,
  },
  {
    id: "5",
    title: "Why does God allow hell to exist?",
    details: "If God is merciful, why would He create a place of eternal punishment? This seems contradictory to His nature.",
    author: "Anonymous",
    isAnonymous: true,
    createdAt: new Date("2025-12-24"),
    topics: ["Heaven & Hell", "Morality & Ethics"],
    answerCount: 6,
    viewCount: 780,
    status: "active" as const,
  },
  {
    id: "6",
    title: "Can science and faith coexist?",
    details: "Many people see science and religion as opposing forces. Are they really incompatible, or can someone be a serious scientist and a devout Christian?",
    author: "Community",
    isAnonymous: false,
    createdAt: new Date("2025-12-23"),
    topics: ["Science & Faith"],
    answerCount: 11,
    viewCount: 950,
    status: "active" as const,
  },
  {
    id: "7",
    title: "Why do Christians disagree on doctrine?",
    details: "If there's one truth and one Bible, why are there so many denominations with different beliefs? How do you know which interpretation is correct?",
    author: "Community",
    isAnonymous: false,
    createdAt: new Date("2025-12-22"),
    topics: ["Church History", "Bible Reliability"],
    answerCount: 9,
    viewCount: 720,
    status: "active" as const,
  },
  {
    id: "8",
    title: "What is the meaning of life from a Christian perspective?",
    details: "I'm searching for purpose and meaning. What does Christianity offer as an answer to why we exist?",
    author: "Anonymous",
    isAnonymous: true,
    createdAt: new Date("2025-12-21"),
    topics: ["Meaning & Purpose", "Salvation & Grace"],
    answerCount: 14,
    viewCount: 1100,
    status: "active" as const,
  },
];

export const answers = [
  {
    id: "1",
    questionId: "1",
    author: "Dr. Sarah Mitchell",
    body: `This is one of the deepest questions in theology, often called "the problem of evil." Here's my understanding:

**Free Will Argument**: God created beings with genuine freedom to choose. Love requires choice—forced love isn't real love. Unfortunately, free beings can choose to harm others.

**Soul-Making Theodicy**: Philosopher John Hick argued that suffering can produce growth, compassion, and character that couldn't develop in a world without challenges. As Romans 5:3-4 says, "suffering produces perseverance; perseverance, character."

**Mystery and Trust**: We must acknowledge our limited perspective. In Job 38-41, God doesn't fully explain suffering to Job but invites him to trust in God's wisdom and goodness.

**The Cross**: Christianity doesn't promise freedom from suffering but that God enters into it with us. Jesus suffered on the cross, showing God's solidarity with human pain.

This doesn't eliminate the difficulty, but it offers a framework for holding suffering and faith together with intellectual honesty.`,
    createdAt: new Date("2025-12-28"),
    votes: 47,
    isVerified: true,
    isPinned: true,
    hasCitations: true,
    status: "active" as const,
  },
  {
    id: "2",
    questionId: "1",
    author: "Marcus Johnson",
    body: `I came to faith precisely because of suffering, not in spite of it.

When my daughter was diagnosed with cancer, I expected my atheism to be confirmed. Instead, I found Christians who wept with us, cared for us, and showed a love that demanded explanation.

C.S. Lewis wrote in "The Problem of Pain" that pain is God's megaphone to rouse a deaf world. I don't think God causes suffering, but He can redeem it.

The question isn't whether suffering exists with God—it's whether it has meaning. In Christianity, suffering can have profound purpose. That changed everything for me.`,
    createdAt: new Date("2025-12-28"),
    votes: 32,
    isVerified: false,
    isPinned: false,
    hasCitations: true,
    status: "active" as const,
  },
  {
    id: "3",
    questionId: "1",
    author: "Anonymous",
    body: `I'm still wrestling with this honestly. I believe in God, but I don't have clean answers.

What I've found helpful is distinguishing between types of evil:
- Natural evil (earthquakes, disease) - may be necessary for a physical world with consistent laws
- Moral evil (human cruelty) - result of human freedom

I also find comfort in knowing this isn't the end of the story. Revelation 21:4 promises God will "wipe every tear from their eyes." The Christian hope isn't that suffering won't happen, but that it will be overcome.`,
    createdAt: new Date("2025-12-28"),
    votes: 18,
    isVerified: false,
    isPinned: false,
    hasCitations: true,
    status: "active" as const,
  },
];

export type Question = typeof questions[0];
export type Answer = typeof answers[0];
export type Topic = typeof topics[0];
