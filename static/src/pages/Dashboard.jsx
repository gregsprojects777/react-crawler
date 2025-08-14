import React, { useState, useEffect } from "react";
import { Domain, Keyword, CrawlResult } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Globe, Hash, Search, TrendingUp, Clock, AlertTriangle,
  Plus, ArrowRight, Activity
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

import StatsCard from "../components/dashboard/StatsCard";
import RecentResults from "../components/dashboard/RecentResults";
import ActiveDomains from "../components/dashboard/ActiveDomains";
import TopKeywords from "../components/dashboard/TopKeywords";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDomains: 0,
    activeDomains: 0,
    totalKeywords: 0,
    resultsToday: 0,
    resultsYesterday: 0
  });
  const [recentResults, setRecentResults] = useState([]);
  const [domains, setDomains] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [domainsData, keywordsData, resultsData] = await Promise.all([
        Domain.list("-created_date"),
        Keyword.list("-created_date"),
        CrawlResult.list("-crawl_date", 50)
      ]);

      setDomains(domainsData);
      setKeywords(keywordsData);
      setRecentResults(resultsData);

      // Calculate stats
      const activeDomains = domainsData.filter(d => d.status === 'active').length;
      const resultsToday = resultsData.filter(r => 
        r.crawl_date && isToday(new Date(r.crawl_date))
      ).length;
      const resultsYesterday = resultsData.filter(r => 
        r.crawl_date && isYesterday(new Date(r.crawl_date))
      ).length;

      setStats({
        totalDomains: domainsData.length,
        activeDomains,
        totalKeywords: keywordsData.length,
        resultsToday,
        resultsYesterday
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getTrendPercentage = () => {
    if (stats.resultsYesterday === 0) return stats.resultsToday > 0 ? 100 : 0;
    return Math.round(((stats.resultsToday - stats.resultsYesterday) / stats.resultsYesterday) * 100);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Crawl Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Monitor your domains and track keyword mentions across the web
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Domains")}>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Domain
              </Button>
            </Link>
            <Link to={createPageUrl("Keywords")}>
              <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
                <Hash className="w-4 h-4" />
                Manage Keywords
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Domains"
            value={stats.totalDomains}
            icon={Globe}
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Crawling"
            value={stats.activeDomains}
            icon={Activity}
            iconColor="text-green-600" 
            bgColor="bg-green-50"
            isLoading={isLoading}
          />
          <StatsCard
            title="Keywords Tracked"
            value={stats.totalKeywords}
            icon={Hash}
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
            isLoading={isLoading}
          />
          <StatsCard
            title="Results Today"
            value={stats.resultsToday}
            icon={Search}
            iconColor="text-orange-600"
            bgColor="bg-orange-50"
            trend={getTrendPercentage()}
            isLoading={isLoading}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentResults 
              results={recentResults}
              domains={domains}
              keywords={keywords}
              isLoading={isLoading}
            />
          </div>
          
          <div className="space-y-6">
            <ActiveDomains 
              domains={domains}
              isLoading={isLoading}
            />
            <TopKeywords 
              keywords={keywords}
              results={recentResults}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}