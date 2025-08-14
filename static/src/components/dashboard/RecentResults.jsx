import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Hash } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentResults({ results, domains, keywords, isLoading }) {
  const getDomainName = (domainId) => {
    const domain = domains.find(d => d.id === domainId);
    return domain?.name || "Unknown Domain";
  };

  const getKeywordTerm = (keywordId) => {
    const keyword = keywords.find(k => k.id === keywordId);
    return keyword?.term || "Unknown Keyword";
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-32 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Recent Results</CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-600">No crawl results yet</p>
            <p className="text-sm text-slate-500">Results will appear here as your domains are crawled</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.slice(0, 10).map((result) => (
              <div 
                key={result.id}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                    {result.title || "No Title"}
                  </h4>
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                    <Clock className="w-3 h-3" />
                    {result.crawl_date 
                      ? formatDistanceToNow(new Date(result.crawl_date), { addSuffix: true })
                      : "Unknown"
                    }
                  </div>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {getDomainName(result.domain_id)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                    {getKeywordTerm(result.keyword_id)}
                  </Badge>
                  {result.match_count && (
                    <Badge variant="outline" className="text-xs">
                      {result.match_count} matches
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                  {result.content_snippet}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-500">
                    Relevance: {result.relevance_score || 0}%
                  </div>
                  <a 
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}