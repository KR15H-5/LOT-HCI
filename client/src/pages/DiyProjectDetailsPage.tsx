import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Hammer, Clock, Star, Info, ExternalLink, Check, ChevronRight, Share2, Wrench } from "lucide-react";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { apiRequest } from "@/lib/queryClient";
import { DiyProject } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DiyProjectDetailsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [, params] = useRoute('/diy-projects/:id');
  const projectId = params?.id ? parseInt(params.id) : null;
  
  const { data: project, isLoading } = useQuery<DiyProject>({
    queryKey: ['/api/diy-projects', projectId],
    queryFn: async () => {
      const response = await apiRequest(`/api/diy-projects/${projectId}`); 
      return response as DiyProject;
    },
    enabled: !!projectId,
  });

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock steps for the tutorial (normally would come from API)
  const projectSteps = [
    {
      step: 1,
      title: "Gather materials",
      description: "Collect all required tools and materials before starting.",
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      step: 2,
      title: "Measure and plan",
      description: "Take accurate measurements and sketch out your design.",
      image: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      step: 3,
      title: "Cut materials",
      description: "Carefully cut wood or other materials according to your measurements.",
      image: "https://images.unsplash.com/photo-1572297870735-d79e4b603f4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      step: 4, 
      title: "Assemble pieces",
      description: "Join the cut pieces together using screws, nails, or adhesive.",
      image: "https://images.unsplash.com/photo-1598902108854-10e335adac99?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      step: 5,
      title: "Finish and decorate",
      description: "Sand rough edges, apply paint or stain, and add any decorative elements.",
      image: "https://images.unsplash.com/photo-1547050605-2f268cd5dbbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  // Mock related projects
  const relatedProjects = [
    {
      id: 4,
      title: "Build a herb planter",
      difficulty: "Easy",
      image: "https://images.unsplash.com/photo-1595352865347-3a2b90224bee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 5,
      title: "Custom kitchen shelf",
      difficulty: "Medium",
      image: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 6,
      title: "Backyard fire pit",
      difficulty: "Hard",
      image: "https://images.unsplash.com/photo-1525890374104-c89fe65af084?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-2">Project not found</h1>
        <p className="text-gray-500 mb-4">The DIY project you're looking for doesn't exist or has been removed.</p>
        <Link href="/diy-projects">
          <button className="px-4 py-2 bg-primary text-white rounded-lg">
            Browse all projects
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={pageRef}>
      <StatusBar bg="bg-transparent" textColor="text-white" absolute />
      
      {/* Header Image */}
      <div className="relative h-72">
        <img 
          src={project.image || "https://images.unsplash.com/photo-1572297870735-d79e4b603f4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Back Button */}
        <Link href="/diy-projects">
          <div className="absolute top-12 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-white" />
          </div>
        </Link>
        
        {/* Share Button */}
        <div className="absolute top-12 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <Share2 className="h-5 w-5 text-white" />
        </div>
        
        {/* Difficulty Badge */}
        <div className="absolute top-24 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </span>
        </div>
        
        {/* Title Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-white/80" />
              <span className="text-sm">{project.duration}</span>
            </div>
            <div className="flex items-center">
              <Wrench className="h-4 w-4 mr-1 text-white/80" />
              <span className="text-sm">{project.toolsRequired?.length || 0} tools needed</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="px-4 mt-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="steps">Steps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold mb-2">Description</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {project.description}
              </p>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Skills you'll learn</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Measuring</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Cutting</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Assembly</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Finishing</span>
                </div>
              </div>
            </div>
            
            {/* Similar Projects */}
            <div>
              <h2 className="text-lg font-bold mb-3">Similar Projects</h2>
              <div className="grid grid-cols-3 gap-3">
                {relatedProjects.map((relProject) => (
                  <Link key={relProject.id} href={`/diy-projects/${relProject.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                      <div className="relative h-20">
                        <img 
                          src={relProject.image} 
                          alt={relProject.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-1 left-2 right-2">
                          <h3 className="text-white text-xs font-medium line-clamp-1">{relProject.title}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold mb-3">Tools Required</h2>
              <ul className="space-y-3">
                {project.toolsRequired?.map((tool, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:pb-0 last:border-0">
                    <div className="flex items-center">
                      <div className="bg-primary/10 w-8 h-8 rounded-md flex items-center justify-center mr-3">
                        <Wrench className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{tool}</span>
                    </div>
                    <Link href={`/search?query=${encodeURIComponent(tool)}`}>
                      <button className="text-xs text-primary font-medium px-3 py-1.5 bg-primary/10 rounded-full">
                        Rent
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex">
                <div className="mr-3">
                  <Info className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">Don't have the tools?</h3>
                  <p className="text-xs text-yellow-700 mb-3">
                    Rent all the tools you need for this project from our Library of Things.
                  </p>
                  <Link href="/search">
                    <button className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg font-medium">
                      Browse Tool Collection
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="steps" className="pb-20">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Step-by-Step Guide</h2>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {projectSteps.length} steps
                </span>
              </div>
              
              <div className="space-y-5">
                {projectSteps.map((step, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img src={step.image} alt={`Step ${step.step}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mr-2">
                          {step.step}
                        </div>
                        <h3 className="font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/">
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-md mx-auto">
                  Rent Tools and Start Project
                </button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Tools can be reserved in advance or picked up same-day.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <HomeIndicator />
    </div>
  );
}