const fs = require('fs/promises');
const path = require('path');
const express = require('express');
const cors = require("cors");

const POSTS_FILE = path.join(__dirname, 'posts.json');

const app = express();


const mockpost = [
  {
    "title": "Attack on Titan",
    "genre": ["Action", "Drama", "Fantasy"],
    "description": "In a world where humanity is confined within massive walls to protect themselves from Titans, giant humanoid creatures that devour humans, young Eren Yeager dreams of seeing the world beyond. However, his life changes when the Colossal Titan breaches the outermost wall, leading to the destruction of his home and the death of his mother. Determined to eradicate the Titans, Eren enlists in the military alongside his friends Mikasa and Armin. They join the elite Survey Corps, tasked with exploring the outside world and fighting Titans. During a battle, Eren discovers he has the power to transform into a Titan himself, making him both an asset and a threat. As the story unfolds, the truth behind the Titans begins to emerge. The government hides critical secrets, and the origins of the walls are far more sinister than anyone imagined. It is revealed that the Titans were once humans, transformed through experiments. Eren and his allies uncover a conspiracy involving a lost civilization, a hidden royal family, and an external enemy—Marley, a nation that created the Titans as weapons of war. As war escalates, Eren takes drastic actions, leading to betrayals, shifting allegiances, and moral dilemmas. The final battle sees Eren taking extreme measures to protect his people, but at great cost. The story ends with a bittersweet resolution as the truth of the world is revealed, and the cycle of conflict continues in new forms.",
    "readingTime": "40 min"
  },
  {
    "title": "Death Note",
    "genre": ["Mystery", "Psychological", "Thriller"],
    "description": "Light Yagami, a brilliant yet cynical high school student, discovers a mysterious notebook called the Death Note, which allows him to kill anyone by writing their name while picturing their face. Driven by his desire to rid the world of criminals, Light adopts the alias 'Kira' and begins a global purge. However, his actions attract the attention of a genius detective known as L. A battle of intellect ensues as L tries to unmask Kira, while Light manipulates those around him to evade capture. As the game of cat and mouse intensifies, Light gains allies such as Misa Amane, who possesses a second Death Note, and manipulates the police and criminals alike. Eventually, Light succeeds in eliminating L, only for a new threat to arise—L’s successors, Near and Mello. As Light grows more reckless, his once-perfect plans begin to crumble. Near ultimately exposes Light as Kira, leading to a climactic final confrontation. With his defeat imminent, Light makes a desperate attempt to kill Near but is betrayed by his own ally. Shot and fatally wounded, Light dies alone, his once-grand vision of becoming a god shattered.",
    "readingTime": "35 min"
  },
  {
    "title": "Fullmetal Alchemist",
    "genre": ["Adventure", "Fantasy", "Steampunk"],
    "description": "Brothers Edward and Alphonse Elric commit the ultimate taboo in alchemy: human transmutation, in an attempt to bring their deceased mother back to life. The experiment goes horribly wrong—Edward loses his arm and leg, while Alphonse’s entire body is lost, with his soul bound to a suit of armor. Determined to restore their bodies, they search for the Philosopher’s Stone, a legendary artifact capable of bypassing the laws of alchemy. Along the way, they uncover dark conspiracies within the government, a war-torn past, and a group of immortal beings called the Homunculi, led by a powerful figure known as Father. As they battle Homunculi, corrupt officials, and their own guilt, the brothers learn that the Philosopher’s Stone is made from human souls. They refuse to use it, choosing instead to find another way. In the final battle, Edward and Alphonse confront Father, who seeks godhood. With the help of their allies, they manage to defeat him. Edward sacrifices his ability to perform alchemy in exchange for restoring Alphonse’s body. The brothers finally find peace, choosing to live without alchemy, and embark on a new journey to understand the world beyond their homeland.",
    "readingTime": "40 min"
  },
  {
    "title": "Demon Slayer",
    "genre": ["Action", "Supernatural", "Fantasy"],
    "description": "Tanjiro Kamado, a kind-hearted boy, returns home one day to find his family slaughtered by demons. The only survivor, his sister Nezuko, has been transformed into a demon. Determined to cure her, Tanjiro joins the Demon Slayer Corps, training under skilled swordsmen and learning the ancient breathing techniques necessary to battle demons. As he embarks on missions, he meets powerful allies such as Zenitsu and Inosuke and encounters the deadly Twelve Kizuki, elite demons serving the Demon King, Muzan Kibutsuji. As Tanjiro grows stronger, he learns of the Sun Breathing technique, the original and most powerful breathing form. The Demon Slayers prepare for their final battle against Muzan and his forces. In the climactic showdown, the Demon Slayer Corps suffers heavy losses, but Tanjiro and his allies ultimately defeat Muzan. However, Tanjiro is briefly transformed into a demon before being saved by his sister. With Muzan’s death, the era of demons comes to an end, and Tanjiro and Nezuko finally find peace, living in a world freed from darkness.",
    "readingTime": "38 min"
  },
  {
    "title": "The Promised Neverland",
    "genre": ["Horror", "Thriller", "Sci-Fi"],
    "description": "Grace Field House appears to be a paradise for orphans, where children are raised with love and care. However, the three oldest orphans—Emma, Norman, and Ray—discover a horrifying truth: the orphanage is actually a farm where children are raised to be fed to monstrous demons. Determined to escape, they devise a plan to outwit their caretaker, Isabella, and flee into the outside world. As they navigate the demon-infested world, they discover a hidden human resistance, a long-lost history of war between humans and demons, and a promise made centuries ago that led to their current plight. The children ally with revolutionary forces and learn of a way to break the cycle. In a dangerous final mission, they infiltrate the capital and expose the truth, leading to a revolution that changes the fate of both humans and demons. Emma makes a personal sacrifice to secure peace, erasing her own memories and separating from her family. Eventually, fate brings her back to her friends, and humanity enters a new era, free from the horrors of the past.",
    "readingTime": "37 min"
  }
]



app.use(
  cors({
    origin: ["http://localhost:5173", "https://c2-scale-assessment-43bt.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "toastId"],
    credentials: true,
  })
);
app.use(express.json());

// Initialize posts file if it doesnt exist
async function initializePostsFile() {
  try {
    await fs.access(POSTS_FILE);
  } catch {
    await fs.writeFile(POSTS_FILE, JSON.stringify([]));
  }
}

// Read & Write posts from file
async function readPosts() {
  const data = await fs.readFile(POSTS_FILE, 'utf8');
  return JSON.parse(data);
}
async function writePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Generate new post
app.post('/api/posts', async (req, res) => {

  try {
    const { topic } = req.body;
    const posts = await readPosts();

    const randompost = mockpost[Math.floor(Math.random() * mockpost.length)]


    const newPost = {
      ...randompost,
      topic: topic,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      readingTime: Math.ceil(randompost.description.split(' ').length / 200), // Estimate reading time
    }

    posts.unshift(newPost);
    await writePosts(posts);

    setTimeout(() => {
      res.status(201).json(newPost);  // mockk generation time
    }, 2000);


  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await readPosts();
    const updatedPosts = posts.filter(post => post.id !== id);
    await writePosts(updatedPosts);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Initialize storage and start server
initializePostsFile().then(() => {
  app.listen(5000, () => {
    console.log('Server running on 5000');
  });
});
