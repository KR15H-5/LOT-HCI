import { DiyProject } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface InspirationCardProps {
  project: DiyProject;
}

export function InspirationCard({ project }: InspirationCardProps) {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={1 / 1}>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      <CardContent className="p-2">
        <h3 className="text-xs font-medium">{project.title}</h3>
        <p className="text-[10px] text-gray-500">{project.duration}</p>
      </CardContent>
    </Card>
  );
}
