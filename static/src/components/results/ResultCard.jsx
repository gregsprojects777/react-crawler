import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Hash, Globe, Clock, Target } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export default function ResultCard({ result, domainName, keywordTerm }) {
  const getRelevanceColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-2 line-clamp-2">
                {result.title || "No Title Available"}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-xs gap-1">
                  <Globe className="w-3 h-3" />
                  {domainName}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs gap-1">
                  <Hash className="w-3 h-3" />
                  {keywordTerm}
                </Badge>
                {result.match_count && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Target className="w-3 h-3" />
                    {result.match_count} matches
                  </Badge>
                )}
                {result.relevance_score && (
                  <Badge className={`${getRelevanceColor(result.relevance_score)} border text-xs`}>
                    {result.relevance_score}% relevant
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(result.url, '_blank')}
              className="shrink-0"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {result.content_snippet}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {result.crawl_date 
                  ? formatDistanceToNow(new Date(result.crawl_date), { addSuffix: true })
                  : "Date unknown"
                }
              </div>
              <div className="truncate max-w-64">
                {result.url}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}