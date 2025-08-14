import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, TrendingUp, Filter, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultStats({ results, totalResults, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-6 w-8" />
                </div>
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const averageRelevance = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + (r.relevance_score || 0), 0) / results.length)
    : 0;

  const totalMatches = results.reduce((sum, r) => sum + (r.match_count || 0), 0);

  const stats = [
    {
      label: "Filtered Results",
      value: results.length,
      icon: Filter,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Total Results",
      value: totalResults,
      icon: Search,
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    },
    {
      label: "Total Matches",
      value: totalMatches,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Avg Relevance",
      value: `${averageRelevance}%`,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}