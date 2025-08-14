import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

export default function TopKeywords({ keywords, results, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">Top Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getKeywordStats = () => {
    const stats = keywords.map(keyword => {
      const matchCount = results.filter(r => r.keyword_id === keyword.id).length;
      return { ...keyword, matchCount };
    });
    
    return stats.sort((a, b) => b.matchCount - a.matchCount).slice(0, 5);
  };

  const topKeywords = getKeywordStats();

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Top Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        {topKeywords.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Hash className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-slate-600 text-sm">No keywords yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topKeywords.map((keyword, index) => (
              <div key={keyword.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100'][index % 5]
                  }`}>
                    <span className={`text-xs font-semibold ${
                      ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600', 'text-pink-600'][index % 5]
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {keyword.term}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${priorityColors[keyword.priority]} border-0 text-xs`}>
                        {keyword.priority}
                      </Badge>
                      {keyword.category && (
                        <span className="text-xs text-slate-500">
                          {keyword.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900 text-sm">
                    {keyword.matchCount}
                  </span>
                  {keyword.matchCount > 0 && (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}