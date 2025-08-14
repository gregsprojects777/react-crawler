import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Globe, Hash, Calendar } from "lucide-react";

export default function ResultFilters({ 
  domains,
  keywords,
  domainFilter,
  keywordFilter,
  dateRange,
  onDomainFilterChange,
  onKeywordFilterChange,
  onDateRangeChange
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-slate-400" />
        <Select value={domainFilter} onValueChange={onDomainFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {domains.map(domain => (
              <SelectItem key={domain.id} value={domain.id}>
                {domain.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Hash className="w-4 h-4 text-slate-400" />
        <Select value={keywordFilter} onValueChange={onKeywordFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Keywords</SelectItem>
            {keywords.map(keyword => (
              <SelectItem key={keyword.id} value={keyword.id}>
                {keyword.term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-slate-400" />
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}