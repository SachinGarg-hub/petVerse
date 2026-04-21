/**
 * PetVerse Demo Seed Script
 * ─────────────────────────
 * Creates a sample "petverse_demo" account pre-loaded with:
 *   • A realistic profile (bio, avatar)
 *   • 9 photo posts (dogs, cats, bunnies, birds)
 *   • 4 video reels (publicly hosted mp4s)
 *   • 8 adoption listings (all pet types, real images)
 *   • Likes & comments on every post/reel
 *
 * Usage:
 *   cd server
 *   node seed.js
 *
 * The script is idempotent — running it twice won't duplicate the demo user,
 * it will wipe & re-seed the demo account's content.
 */

require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS — fixes ISP SRV-record blocking for MongoDB Atlas
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User     = require('./models/User');
const Post     = require('./models/Post');
const Reel     = require('./models/Reel');
const Adoption = require('./models/Adoption');

// ──────────────────────────────────────────────
// DEMO ACCOUNT CREDENTIALS  (login with these!)
// ──────────────────────────────────────────────
const DEMO_EMAIL    = 'demo@petverse.com';
const DEMO_PASSWORD = 'Demo@1234';
const DEMO_USERNAME = 'petverse_demo';

// ──────────────────────────────────────────────
// PUBLICLY AVAILABLE PET MEDIA
// (Unsplash / Pexels CDN — no auth needed)
// ──────────────────────────────────────────────
const PHOTO_POSTS = [
  {
    mediaUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    caption: '🐶 Sunday zoomies hitting different! #GoldenRetriever #PetVerse',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
    caption: '🐱 Cat tax paid in full. You\'re welcome. #CatsOfPetVerse',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
    caption: '🐕 This one stole my heart AND my sandwich. #PuppyLife',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=800',
    caption: '🐰 Bun bun in full flop mode 🐇 #BunnyVibes #FloppyEars',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800',
    caption: '🦜 My parrot has better opinions than most people tbh 🦜 #TalkingBird',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    caption: '😺 Caught in 4K judging me. Classic. #CatMom #JudgyVibes',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
    caption: '🐶 He found the camera and he\'s READY for his close-up 📸 #DogDad',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
    caption: '🐾 Golden hour with my golden boy 🌅 #GoldenHour #PetVerse',
  },
  {
    mediaUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800',
    caption: '🌸 She knows she\'s pretty. Don\'t let her fool you 😂 #FluffyDog',
  },
];

const REELS = [
  {
    videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    caption: '🐶 Watch this pup absolutely NAIL the obstacle course 🏆 #DogTricks #AgilityStar',
    views: 14320,
  },
  {
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    caption: '🐱 3am zoomies caught on camera — this cat has CHAOS energy 😂 #CatLife',
    views: 9870,
  },
  {
    videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    caption: '🐾 First snow reaction and I\'m NOT okay 🥹❄️ #PuppyFirstSnow #TooCute',
    views: 22100,
  },
  {
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    caption: '🐰 Bunny binkies are the purest thing on the internet, period. 🐇✨ #BunnyTok',
    views: 7540,
  },
];

// ──────────────────────────────────────────────
// ADOPTION LISTINGS
// ──────────────────────────────────────────────
const ADOPTIONS = [
  {
    petName: 'Bruno',
    petType: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    gender: 'Male',
    location: 'Mumbai, Maharashtra',
    description: 'Bruno is the friendliest boy you will ever meet! 🐶 He loves fetch, belly rubs, and stealing socks. Fully vaccinated, neutered, and house-trained. Looking for a loving family with a yard or open space. He is great with kids and other dogs!',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 98765 43210',
    isAdopted: false,
  },
  {
    petName: 'Luna',
    petType: 'Cat',
    breed: 'Persian',
    age: '1 year',
    gender: 'Female',
    location: 'Delhi, NCR',
    description: 'Luna is a graceful Persian princess who loves nap time and chin scratches 😺. She is calm, indoor-friendly, and gets along with other calm cats. Spayed and fully vaccinated. She will be your best couch companion ever!',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 91234 56789',
    isAdopted: false,
  },
  {
    petName: 'Mango',
    petType: 'Bird',
    breed: 'Indian Ringneck Parakeet',
    age: '8 months',
    gender: 'Male',
    location: 'Bangalore, Karnataka',
    description: 'Mango is a super talkative and vibrant green Ringneck who already knows 10+ words! 🦜 He loves music, mimicking sounds, and getting millet treats. Hand-tamed and very social. Comes with cage and accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 99887 76655',
    isAdopted: false,
  },
  {
    petName: 'Coco',
    petType: 'Rabbit',
    breed: 'Holland Lop',
    age: '6 months',
    gender: 'Female',
    location: 'Pune, Maharashtra',
    description: 'Coco is a tiny flop-eared sweetheart who binkies around the room all day 🐰. She is litter trained, loves leafy greens, and enjoys gentle cuddles. Perfect for apartment living! Spayed and healthy.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 88776 65544',
    isAdopted: false,
  },
  {
    petName: 'Rocky',
    petType: 'Dog',
    breed: 'Labrador Mix',
    age: '3 years',
    gender: 'Male',
    location: 'Hyderabad, Telangana',
    description: 'Rocky was rescued from the street and has blossomed into a loyal, gentle giant 🐕. He knows basic commands, loves car rides, and is an absolute cuddle machine at night. Good with kids. Vaccinated and neutered.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 77665 54433',
    isAdopted: false,
  },
  {
    petName: 'Whiskers',
    petType: 'Cat',
    breed: 'Tabby',
    age: '4 years',
    gender: 'Male',
    location: 'Chennai, Tamil Nadu',
    description: 'Whiskers is a laid-back tabby who is happiest when curled up in a sunny spot 😸. He is independent but secretly loves being near his humans. Neutered, vaccinated, and very low-maintenance. Perfect for working professionals!',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 66554 43322',
    isAdopted: false,
  },
  {
    petName: 'Daisy',
    petType: 'Dog',
    breed: 'Beagle',
    age: '1.5 years',
    gender: 'Female',
    location: 'Kolkata, West Bengal',
    description: 'Daisy is an energetic Beagle who lives for adventures and sniffing everything in sight 🐾. She is leash-trained, loves playing fetch, and adores kids. Spayed and fully vaccinated. She will fill your home with so much joy!',
    imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 55443 32211',
    isAdopted: false,
  },
  {
    petName: 'Nemo',
    petType: 'Fish',
    breed: 'Clownfish',
    age: '1 year',
    gender: 'Male',
    location: 'Ahmedabad, Gujarat',
    description: 'Yes, we found Nemo! 🐠 This vibrant clownfish comes with a 20-litre tank, filter, heater, and all accessories. Easy to care for and absolutely mesmerizing to watch. Rehoming due to owner relocation.',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600',
    contactEmail: 'demo@petverse.com',
    contactPhone: '+91 44332 21100',
    isAdopted: false,
  },
];

// Fun sample comments to seed on posts
const SAMPLE_COMMENTS = [
  'Absolutely adorable!! 😍',
  'This made my whole day 🥰',
  'Omg look at those eyes!! 😭',
  'I need one immediately 🐾',
  'Sending this to everyone I know lmao',
  'Cutest thing I\'ve seen all week 💕',
  'Living for this content 🙌',
  'Petition to make this the official mascot of PetVerse 🐶',
];

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
function pickRandom(arr, count = 1) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);  // always returns an array
}

// ──────────────────────────────────────────────
// MAIN SEED FUNCTION
// ──────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  PetVerse Demo Seed Script  🌱\n');

  // 1. Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB:', process.env.MONGO_URI);

  // 2. Wipe previous demo content (idempotent)
  const existing = await User.findOne({ email: DEMO_EMAIL });
  if (existing) {
    await Post.deleteMany({ user: existing._id });
    await Reel.deleteMany({ user: existing._id });
    await Adoption.deleteMany({ user: existing._id });
    await User.deleteOne({ _id: existing._id });
    console.log('🗑️   Wiped previous demo account content');
  }

  // 3. Create the demo user
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoUser = await User.create({
    username: DEMO_USERNAME,
    email: DEMO_EMAIL,
    password: hashedPassword,
    profilePic:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop&crop=face',
    bio: '🐾 Pet parent of 3 | Dog mom 🐶 Cat dad 🐱 Bunny bestie 🐰 | Sharing the fluffiest moments of life on PetVerse ✨',
  });
  console.log(`👤  Created demo user: ${DEMO_USERNAME} (${DEMO_EMAIL})`);

  // 4. Create photo posts
  const createdPosts = [];
  for (const p of PHOTO_POSTS) {
    // Assign 3-8 random "likes" from the demo user itself (demo data)
    const randomLikeCount = Math.floor(Math.random() * 500) + 50;
    // comments — just use the demo user as commenter (realistic enough for demo)
    const comments = pickRandom(SAMPLE_COMMENTS, Math.floor(Math.random() * 4) + 1).map((text) => ({
      user: demoUser._id,
      text,
    }));

    const post = await Post.create({
      user: demoUser._id,
      mediaUrl: p.mediaUrl,
      mediaType: 'image',
      caption: p.caption,
      likes: Array(randomLikeCount).fill(demoUser._id), // fake like count
      comments,
    });
    createdPosts.push(post);
  }
  console.log(`📸  Created ${createdPosts.length} photo posts`);

  // 5. Create reels
  const createdReels = [];
  for (const r of REELS) {
    const comments = pickRandom(SAMPLE_COMMENTS, Math.floor(Math.random() * 3) + 1).map((text) => ({
      user: demoUser._id,
      text,
      createdAt: new Date(),
    }));
    const randomLikeCount = Math.floor(Math.random() * 1200) + 200;

    const reel = await Reel.create({
      user: demoUser._id,
      videoUrl: r.videoUrl,
      caption: r.caption,
      views: r.views,
      likes: Array(randomLikeCount).fill(demoUser._id),
      comments,
    });
    createdReels.push(reel);
  }
  console.log(`🎬  Created ${createdReels.length} reels`);

  // 6. Create adoption listings
  const createdAdoptions = [];
  for (const a of ADOPTIONS) {
    const adoption = await Adoption.create({
      user: demoUser._id,
      ...a,
    });
    createdAdoptions.push(adoption);
  }
  console.log(`🐾  Created ${createdAdoptions.length} adoption listings`);

  // 7. Print summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉  Seeding complete! Login with:');
  console.log(`    Email    : ${DEMO_EMAIL}`);
  console.log(`    Password : ${DEMO_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
