import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Sparkles, Trash2, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { toast } from "sonner"
import { Textarea } from '../ui/textarea';

interface Blog {
  genre: string[];
  createdAt: string | number | Date;
  readingTime: number;
  description: string;
  id: number;
  title: string;
  content: string;
  topic: string;
  date: string;
  readTime: string;
}

function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);   // for animation on initial load
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setBlogs(response.data);
        setIsLoaded(true);
      } catch (error) {
        toast.error("Error fetching blogs");
      }
    };

    fetchBlogs();
  }, []);

  // create array of available genre
  const allGenres = Array.from(new Set(blogs?.flatMap(blog => blog.genre || [])));

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts', { topic });
      setBlogs([response.data, ...blogs]);
      toast.success("Blog has been generated");
    } catch (error) {
      toast.error("Error generating the blog");
    } finally {
      setIsGenerating(false);
      setTopic("");
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success("Blog has been deleted");
    } catch (error) {
      toast.error("Error deleting blog");
    }
  };

  const toggleGenreFilter = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  // Filtering blogs by search and selected genres
  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenres = 
      selectedGenres.length === 0 || 
      (blog.genre && selectedGenres.some(genre => blog.genre.includes(genre)));
    
    return matchesSearch && matchesGenres;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-8">


        <header className="text-center mb-12">
          <h1 className="text-4xl h-12 font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-purple-500 animated-gradient-text">
            AI Blog Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Transform your ideas into engaging blog posts with AI
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 bg-white dark:bg-gray-800"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    {selectedGenres.length > 0 && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white text-xs">
                        {selectedGenres.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allGenres.map(genre => (
                    <DropdownMenuCheckboxItem
                      key={genre}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => toggleGenreFilter(genre)}
                    >
                      {genre}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Blog
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className='text-gray-700'>Generate New Blog Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Textarea
                      className='h-[100px]'
                      placeholder="Enter your blog topic..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerate();
                        }
                      }}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>


        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${isLoaded ? 'translate-y-0' : 'translate-y-4'}`}>
          {filteredBlogs?.map((blog) => (
            <Card
              key={blog.id}
              className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
            >
              <CardHeader className="p-3 sm:p-5 border-b">
                <CardTitle className="text-xl font-bold text-gray-600 dark:text-white">
                  Blog post on {blog.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 ">
                  {blog.genre?.map((tag: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGenreFilter(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardDescription className="text-gray-600">
                  {new Date(blog.createdAt).toDateString()}
                </CardDescription>
                <CardDescription className="text-gray-300">
                  {blog.readingTime} minute read
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3 sm:px-5 py-3 relative">
                <div className="relative">
                  <p className="text-gray-700 line-clamp-4 relative">
                    {blog.description}
                    <span className="absolute right-0 bottom-0 w-40 h-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-3 sm:p-5 flex justify-between items-center border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/blog/${blog.id}`, { state: { blog } })}
                >
                  Read More
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(blog.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardFooter>
              <CardDescription className="p-3 sm:px-5 pb-4 text-gray-500 dark:text-gray-400 mt-2">
                Your prompt - {blog.topic}
              </CardDescription>
            </Card>
          ))}
        </div>

        {filteredBlogs?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No blogs found matching your criteria</p>
            {selectedGenres.length > 0 && (
              <Button 
                variant="ghost" 
                className="mt-4 text-blue-500"
                onClick={() => setSelectedGenres([])}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;