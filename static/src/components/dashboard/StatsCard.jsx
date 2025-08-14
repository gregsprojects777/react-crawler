import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  bgColor, 
  trend, 
  isLoading 
}) {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full opacity-10 transform translate-x-8 -translate-y-8`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900">
              {value}
            </CardTitle>
          </div>
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center mt-3 text-sm">
            {trend > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-green-600 font-medium">+{trend}%</span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                <span className="text-red-600 font-medium">{trend}%</span>
              </>
            ) : (
              <span className="text-slate-500 font-medium">No change</span>
            )}
            <span className="text-slate-500 ml-1">vs yesterday</span>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}