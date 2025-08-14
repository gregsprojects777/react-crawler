import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle, PauseCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  active: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    badgeColor: "bg-green-100 text-green-800"
  },
  paused: {
    icon: PauseCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    badgeColor: "bg-yellow-100 text-yellow-800"
  },
  error: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    badgeColor: "bg-red-100 text-red-800"
  }
};

export default function ActiveDomains({ domains, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">Active Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeDomains = domains.filter(d => d.status === 'active').slice(0, 5);

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Active Domains</CardTitle>
      </CardHeader>
      <CardContent>
        {activeDomains.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-slate-600 text-sm">No active domains</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDomains.map((domain) => {
              const config = statusConfig[domain.status] || statusConfig.active;
              const StatusIcon = config.icon;
              
              return (
                <div key={domain.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                    <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {domain.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {domain.url}
                    </p>
                  </div>
                  <Badge className={`${config.badgeColor} border-0 text-xs`}>
                    {domain.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}