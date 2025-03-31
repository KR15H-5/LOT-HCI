import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Hammer, ChevronRight, CircleDot } from "lucide-react";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { apiRequest } from "@/lib/queryClient";
import { DiyProject } from "@/types";

export default function DiyProjectsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  
  const { data: projects, isLoading } = useQuery<DiyProject[]>({
    queryKey: ['/api/diy-projects'],
    queryFn: async () => {
      const response = await apiRequest('/api/diy-projects');
      return response as DiyProject[];
    },
  });

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <StatusBar bg="bg-primary" textColor="text-white" />
      
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-1 pb-5">
        <div className="flex items-center mb-3">
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowLeft className="h-5 w-5" />
            </div>
          </Link>
          <h1 className="text-xl font-bold mx-auto pr-10">DIY Inspiration</h1>
        </div>
        <p className="text-sm text-white/80">
          Find projects to build with tools from our Library of Things. Browse by difficulty or project time.
        </p>
      </div>
      
      <div className="px-4 py-5">
        {/* Filters */}
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-3">
            <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm border border-primary/20 whitespace-nowrap">
              All Projects
            </button>
            <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm border border-gray-200 whitespace-nowrap">
              Easy
            </button>
            <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm border border-gray-200 whitespace-nowrap">
              Medium
            </button>
            <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm border border-gray-200 whitespace-nowrap">
              Hard
            </button>
            <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm border border-gray-200 whitespace-nowrap">
              Quick Projects
            </button>
            <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm border border-gray-200 whitespace-nowrap">
              Weekend
            </button>
          </div>
        </div>
        
        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
            <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
            <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
            <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {projects?.map((project) => (
              <Link key={project.id} href={`/diy-projects/${project.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 group h-full">
                  <div className="relative h-32">
                    <img 
                      src={project.image || "https://images.unsplash.com/photo-1572297870735-d79e4b603f4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shadow-sm ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm">{project.title}</h3>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <CircleDot className="h-3 w-3 mr-1" />
                        <span>{project.duration}</span>
                      </div>
                      <div className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 text-[10px] flex items-center">
                        <Hammer className="h-3 w-3 mr-0.5" />
                        {project.toolsRequired?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}