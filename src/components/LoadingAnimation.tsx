import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingAnimationProps {
  icon: LucideIcon;
  text: string;
  className?: string;
}

export function LoadingAnimation({ icon: Icon, text, className = "" }: LoadingAnimationProps) {
  return (
    <Card className={`border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-pulse-soft">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-blue-700 font-medium">{text}</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}