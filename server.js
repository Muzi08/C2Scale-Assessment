import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this in your environment
});

// In-memory storage (replace with a proper database in production)
let blogs = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence",
    content: "AI is transforming how we live and work. From autonomous vehicles to smart assistants, artificial intelligence is becoming increasingly integrated into our daily lives. As we look to the future, the potential applications of AI seem limitless. Machine learning algorithms are getting more sophisticated, neural networks are becoming more complex, and the processing power available to train these systems continues to grow exponentially. However, with these advancements come important ethical considerations and challenges that we must address as a society.",
    topic: "Technology",
    date: "2024-04-10",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Sustainable Living in Modern Cities",
    content: "Urban sustainability is becoming increasingly important as cities continue to grow and expand. Modern urban planning focuses on creating environmentally friendly spaces that promote both ecological health and human wellbeing. From green buildings to public transportation systems, cities are implementing various initiatives to reduce their carbon footprint and create more livable spaces for their residents. Community gardens, renewable energy projects, and waste reduction programs are just a few examples of how cities are working towards a more sustainable future.",
    topic: "Environment",
    date: "2024-04-09",
    readTime: "4 min"
  }
];

// Get all blogs
app.get('/api/blogs', (req, res) => {
  res.json(blogs);
});

// Get single blog
app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find(b => b.id === parseInt(req.params.id));
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

// Generate new blog
app.post('/api/blogs/generate', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional blog writer. Write a comprehensive blog post about the given topic."
        },
        {
          role: "user",
          content: `Write a blog post about: ${topic}`
        }
      ],
    });

    const content = completion.choices[0].message.content;
    const newBlog = {
      id: blogs.length + 1,
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
      content,
      topic,
      date: new Date().toISOString().split('T')[0],
      readTime: `${Math.ceil(content.split(' ').length / 200)} min`
    };

    blogs.unshift(newBlog);
    res.json(newBlog);
  } catch (error) {
    console.error('Error generating blog:', error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
});

// Delete blog
app.delete('/api/blogs/:id', (req, res) => {
  const blogId = parseInt(req.params.id);
  blogs = blogs.filter(blog => blog.id !== blogId);
  res.json({ message: 'Blog deleted successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});