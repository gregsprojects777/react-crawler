import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash, MoreHorizontal, Pause, Play, Trash2, Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const priorityColors = {
  low: "bg-gray-100 text-gray-800 border-gray-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200"
};

const priorityIcons = {
  low: "▫",
  medium: "◐",
  high: "●",
  critical: "🔥"
};

export default function KeywordCard({ keyword, onUpdate, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusToggle = async () => {
    setIsUpdating(true);
    const newStatus = keyword.status === 'active' ? 'paused' : 'active';
    await onUpdate(keyword.id, { status: newStatus });
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete the keyword "${keyword.term}"?`)) {
      await onDelete(keyword.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                <Hash className="w-6 h-6 text-slate-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 truncate text-lg">
                  {keyword.term}
                </h3>
                {keyword.category && (
                  <p className="text-sm text-slate-500 truncate">
                    {keyword.category}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStatusToggle} disabled={isUpdating}>
                  {keyword.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Tracking
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume Tracking
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Keyword
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Badge 
              className={`${priorityColors[keyword.priority]} border font-medium`}
            >
              {priorityIcons[keyword.priority]} {keyword.priority}
            </Badge>
            <Badge 
              variant="outline"
              className={keyword.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
            >
              {keyword.status}
            </Badge>
          </div>
          
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Case Sensitive:</span>
              <span className="font-medium">{keyword.case_sensitive ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Added:</span>
              <span className="font-medium">
                {keyword.created_date ? new Date(keyword.created_date).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}