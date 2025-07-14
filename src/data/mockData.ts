// City data
export const cities = [
  { id: 1, name: "Mumbai" },
  { id: 2, name: "Delhi" },
  { id: 3, name: "Bangalore" },
  { id: 4, name: "Hyderabad" },
  { id: 5, name: "Chennai" },
  { id: 6, name: "Kolkata" },
  { id: 7, name: "Pune" },
  { id: 8, name: "Ahmedabad" },
  { id: 9, name: "Jaipur" },
  { id: 10, name: "Lucknow" },
  { id: 11, name: "Chandigarh" },
  { id: 12, name: "Kochi" }
];

// Experience types
export const experiences = [
  { 
    id: 1, 
    name: "Music Festivals", 
    description: "Immerse yourself in beats and rhythms",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop"
  },
  { 
    id: 2, 
    name: "Theatre Shows", 
    description: "Experience the magic of live performances",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2832&auto=format&fit=crop"
  },
  { 
    id: 3, 
    name: "Tech Conferences", 
    description: "Stay ahead with cutting-edge innovations",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop"
  },
  { 
    id: 4, 
    name: "Comedy Nights", 
    description: "Laugh out loud with top comedians",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2731&auto=format&fit=crop"
  },
  { 
    id: 5, 
    name: "Food Festivals", 
    description: "Taste culinary delights from around the world",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2874&auto=format&fit=crop"
  }
];

// Banner images
export const banners = [
  {
    id: 1,
    title: "Sunburn Festival 2025",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2938&auto=format&fit=crop",
    link: "/event/1"
  },
  {
    id: 2,
    title: "Prithvi Theatre Festival",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2940&auto=format&fit=crop",
    link: "/event/3"
  },
  {
    id: 3,
    title: "Comic Con India",
    image: "https://images.unsplash.com/photo-1608889825105-eebdb9aa6b8d?q=80&w=2880&auto=format&fit=crop",
    link: "/event/5"
  }
];

// Artists
// export const artists = [
//   {
//     id: 1,
//     name: "Arijit Singh",
//     genre: "Music",
//     image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2940&auto=format&fit=crop",
//     bio: "Arijit Singh is an Indian singer and music composer. He sings predominantly in Hindi and Bengali, but has also performed in various other Indian languages."
//   },
//   {
//     id: 2,
//     name: "Zakir Hussain",
//     genre: "Classical",
//     image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=2721&auto=format&fit=crop",
//     bio: "Zakir Hussain is an Indian tabla virtuoso, composer, percussionist, music producer and film actor. He is considered one of the greatest tabla players of all time."
//   },
//   {
//     id: 3,
//     name: "Vir Das",
//     genre: "Comedy",
//     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop",
//     bio: "Vir Das is an Indian comedian, actor and musician known for his stand-up comedy specials and roles in Bollywood films."
//   },
//   {
//     id: 4,
//     name: "Shubha Mudgal",
//     genre: "Classical",
//     image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2888&auto=format&fit=crop",
//     bio: "Shubha Mudgal is an Indian singer who performs in the classical genre of Hindustani classical music as well as in Indian pop and fusion styles."
//   },
//   {
//     id: 5,
//     name: "Divine",
//     genre: "Hip Hop",
//     image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop",
//     bio: "Divine is an Indian rapper from Mumbai who is known for his explicit socio-political lyrics in Hindi and English."
//   }
// ];

// Events
export const events = [
  {
    id: 1,
    title: "Sunburn Festival 2025",
    subtitle: "Asia's Biggest Electronic Dance Music Festival",
    description: "Experience the ultimate electronic music festival featuring top DJs from around the world, stunning visual effects, and an electric atmosphere. Sunburn combines music, entertainment, food, shopping, and lifestyle into one unforgettable experience.",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2938&auto=format&fit=crop",
    city: "Mumbai",
    venue: "MMRDA Grounds, BKC",
    date: "2025-01-15",
    time: "16:00",
    duration: "8 hours",
    category: "Music",
    categoryId: 1,
    price: 2499,
    featured: true,
    host: "Percept Live",
    artistIds: [1, 5],
    reviews: [
      { id: 1, name: "Rohit Sharma", rating: 5, comment: "Incredible experience! The music and lights were amazing.", date: "2024-01-20" },
      { id: 2, name: "Priya Patel", rating: 4, comment: "Great lineup of artists, though it was a bit crowded.", date: "2024-01-18" }
    ],
    faq: [
      { question: "What should I bring?", answer: "Valid ID, ticket confirmation, comfortable clothing, and cash/cards for food and merchandise." },
      { question: "Is re-entry allowed?", answer: "No, once you exit the venue, re-entry is not permitted." },
      { question: "Is there parking available?", answer: "Limited parking is available. We recommend using public transportation or ride-sharing services." }
    ]
  },
  {
    id: 2,
    title: "Zakir Hussain Live",
    subtitle: "Classical Tabla Maestro in Concert",
    description: "Witness the magic of tabla maestro Zakir Hussain in a mesmerizing live performance. Experience the rhythmic brilliance and improvisational genius of one of India's greatest musicians in an intimate concert setting.",
    image: "https://images.unsplash.com/photo-1448485780098-7e0b78781ffb?q=80&w=2874&auto=format&fit=crop",
    city: "Delhi",
    venue: "Siri Fort Auditorium",
    date: "2025-02-10",
    time: "19:00",
    duration: "2 hours",
    category: "Music",
    categoryId: 1,
    price: 1999,
    featured: true,
    host: "Pandit Music Foundation",
    artistIds: [2],
    reviews: [
      { id: 3, name: "Amit Kumar", rating: 5, comment: "Once in a lifetime experience. Zakir ji's performance was divine!", date: "2024-02-12" },
      { id: 4, name: "Meera Reddy", rating: 5, comment: "Absolutely spellbinding. Couldn't take my eyes off the stage.", date: "2024-02-11" }
    ],
    faq: [
      { question: "Is photography allowed?", answer: "No, photography and recording are strictly prohibited during the performance." },
      { question: "What is the dress code?", answer: "Smart casual or formal attire is recommended." },
      { question: "Are children allowed?", answer: "Yes, but we recommend the event for children aged 10 and above who can appreciate classical music." }
    ]
  },
  {
    id: 3,
    title: "Prithvi Theatre Festival",
    subtitle: "Celebrating 45 Years of Theatre Excellence",
    description: "The annual Prithvi Theatre Festival brings together the best of Indian theatre with performances by leading theatre groups and artists. Experience thought-provoking plays, workshops, and discussions in this celebration of theatrical arts.",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2940&auto=format&fit=crop",
    city: "Mumbai",
    venue: "Prithvi Theatre, Juhu",
    date: "2025-03-05",
    time: "18:30",
    duration: "10 days (multiple shows)",
    category: "Theatre",
    categoryId: 2,
    price: 599,
    featured: true,
    host: "Prithvi Theatre",
    artistIds: [],
    reviews: [
      { id: 5, name: "Sanjay Mehta", rating: 4, comment: "Wonderful selection of plays this year. I attended three and each was unique and engaging.", date: "2024-03-10" },
      { id: 6, name: "Anjali Singh", rating: 5, comment: "The intimate setting of Prithvi Theatre makes every play feel special. Great experience!", date: "2024-03-08" }
    ],
    faq: [
      { question: "Can I buy tickets for multiple shows?", answer: "Yes, you can purchase tickets for individual shows or get a festival pass for multiple performances." },
      { question: "Is there a café at the venue?", answer: "Yes, the famous Prithvi Café is open before and after shows for refreshments." },
      { question: "How early should I arrive?", answer: "We recommend arriving 30 minutes before the show as seating is on a first-come basis." }
    ]
  },
  {
    id: 4,
    title: "Comedy Nights with Vir Das",
    subtitle: "Laugh Out Loud with India's Global Comedy Star",
    description: "Enjoy an evening of laughter with the internationally acclaimed comedian Vir Das. Known for his sharp wit and insightful humor, Vir brings his latest stand-up special to the stage for a night you won't forget.",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2731&auto=format&fit=crop",
    city: "Bangalore",
    venue: "The Comedy Theatre, MG Road",
    date: "2025-04-12",
    time: "20:00",
    duration: "90 minutes",
    category: "Comedy",
    categoryId: 3,
    price: 999,
    featured: false,
    host: "Comedy Central India",
    artistIds: [3],
    reviews: [
      { id: 7, name: "Ravi Desai", rating: 5, comment: "Vir was hilarious! My stomach hurt from laughing so much.", date: "2024-04-14" },
      { id: 8, name: "Neha Gupta", rating: 4, comment: "Great show, though some jokes felt recycled from his Netflix special.", date: "2024-04-13" }
    ],
    faq: [
      { question: "Is there a minimum age requirement?", answer: "Yes, the show is for audiences 18 and above due to mature content." },
      { question: "Will there be a meet and greet?", answer: "VIP tickets include a short meet and greet session after the show." },
      { question: "Can I bring my own food and drinks?", answer: "Outside food and beverages are not allowed. The venue has a full-service bar and snacks available for purchase." }
    ]
  },
  {
    id: 5,
    title: "Comic Con India",
    subtitle: "India's Greatest Pop Culture Experience",
    description: "Comic Con India brings together fans of comics, movies, TV shows, gaming, anime, and more for an epic celebration of pop culture. Meet your favorite artists, shop for exclusive merchandise, participate in cosplay contests, and immerse yourself in the world of comics and entertainment.",
    image: "https://images.unsplash.com/photo-1608889825105-eebdb9aa6b8d?q=80&w=2880&auto=format&fit=crop",
    city: "Delhi",
    venue: "NSIC Exhibition Ground, Okhla",
    date: "2025-05-20",
    time: "10:00",
    duration: "3 days",
    category: "Art",
    categoryId: 6,
    price: 899,
    featured: true,
    host: "Comic Con India",
    artistIds: [],
    reviews: [
      { id: 9, name: "Vikram Chandra", rating: 4, comment: "So much to see and do! Loved the cosplay competition and artist alley.", date: "2024-05-23" },
      { id: 10, name: "Shreya Kapoor", rating: 3, comment: "Great event but too crowded to enjoy properly. Better crowd management needed.", date: "2024-05-22" }
    ],
    faq: [
      { question: "Can I come in cosplay?", answer: "Absolutely! Cosplay is encouraged and there's a contest with prizes for the best costumes." },
      { question: "Are there food options available?", answer: "Yes, there will be food stalls with a variety of options inside the venue." },
      { question: "Can I get autographs from artists and celebrities?", answer: "Yes, there are scheduled signing sessions. Some may require separate tickets or have limited availability." }
    ]
  },
  {
    id: 6,
    title: "Divine: Gully Fest",
    subtitle: "Hip Hop Revolution",
    description: "Experience the raw energy of Indian hip hop with Divine and friends. This street-inspired festival celebrates the gully rap movement with performances by pioneering artists who have transformed the Indian music scene.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2940&auto=format&fit=crop",
    city: "Mumbai",
    venue: "Phoenix Marketcity, Kurla",
    date: "2025-06-15",
    time: "17:00",
    duration: "5 hours",
    category: "Music",
    categoryId: 1,
    price: 1499,
    featured: false,
    host: "Sony Music India",
    artistIds: [5],
    reviews: [
      { id: 11, name: "Jay Sharma", rating: 5, comment: "The energy was unreal! Divine killed it with his performance.", date: "2024-06-17" },
      { id: 12, name: "Zoya Qureshi", rating: 4, comment: "Great showcase of Indian hip hop talent. Would have liked better sound quality though.", date: "2024-06-16" }
    ],
    faq: [
      { question: "Is this an indoor or outdoor event?", answer: "This is primarily an outdoor event with some covered areas." },
      { question: "Are there age restrictions?", answer: "The event is for all ages, but parental discretion is advised due to explicit lyrics." },
      { question: "Can I bring my camera?", answer: "Small personal cameras are allowed, but professional photography equipment requires press credentials." }
    ]
  }
];
