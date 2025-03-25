import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

function Blog() {
  const navigate = useNavigate();
  const location = useLocation();
  const blog = location.state?.blog;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:to-gray-800 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {blog ? (
          <article className={`mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg transition-all duration-300 ${isLoaded ? 'translate-y-0' : 'translate-y-4'}`}>
            <header className="mb-8">
              <h1 className="text-xl md:text-4xl font-bold text-gray-600 mb-4">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-2 mb-4">
                {blog.genre?.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-sm">
                <span className='text-gray-600'>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span className='text-gray-400'>{blog.readingTime} min read</span>
              </div>
            </header>

            {/* Content section */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="leading-relaxed text-gray-700 dark:text-gray-300 space-y-4">
                {blog.description.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="transition-opacity duration-300 delay-100">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Footer section */}
            <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <Button
                  className='flex items-start hover:-translate-x-1 transition-transform duration-200'
                  variant="link"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft size={20} className='me-1 mt-[1px]' /> Back to Blogs
                </Button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </footer>
          </article>
        ) : (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog