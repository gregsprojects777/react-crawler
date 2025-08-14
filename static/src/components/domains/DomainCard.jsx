import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, MoreHorizontal, Pause, Play, Trash2, Settings, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { motion } from "framer-motion";

const statusConfig = {
  active: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "●"
  },
  paused: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: "⏸"
  },
  error: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "⚠"
  }
};

export default function DomainCard({ domain, onUpdate, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusToggle = async () => {
    setIsUpdating(true);
    const newStatus = domain.status === 'active' ? 'paused' : 'active';
    await onUpdate(domain.id, { status: newStatus });
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${domain.name}"?`)) {
      await onDelete(domain.id);
    }
  };

  const frequencyLabels = {
    hourly: "Every Hour",
    daily: "Daily",
    weekly: "Weekly"
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                <Globe className="w-6 h-6 text-slate-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {domain.name}
                </h3>
                <p className="text-sm text-slate-500 truncate">
                  {domain.url}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open(domain.url, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Site
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleStatusToggle} disabled={isUpdating}>
                  {domain.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Crawling
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume Crawling
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Domain
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Badge 
              className={`${statusConfig[domain.status]?.color} border font-medium`}
            >
              {statusConfig[domain.status]?.icon} {domain.status}
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              {frequencyLabels[domain.crawl_frequency]}
            </span>
          </div>
          
          <div className="text-xs text-slate-500">
            {domain.last_crawled ? (
              <>
                Last crawled {format(new Date(domain.last_crawled), "MMM d, yyyy 'at' HH:mm")}
              </>
            ) : (
              "Never crawled"
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}