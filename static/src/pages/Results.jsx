import React, { useState, useEffect } from "react";
import { CrawlResult, Domain, Keyword } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ResultCard from "../components/results/ResultCard";
import ResultFilters from "../components/results/ResultFilters";
import ResultStats from "../components/results/ResultStats";

export default function Results() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [domains, setDomains] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [keywordFilter, setKeywordFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterResults();
  }, [results, searchQuery, domainFilter, keywordFilter, dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    const [resultsData, domainsData, keywordsData] = await Promise.all([
      CrawlResult.list("-crawl_date"),
      Domain.list(),
      Keyword.list()
    ]);
    
    setResults(resultsData);
    setDomains(domainsData);
    setKeywords(keywordsData);
    setIsLoading(false);
  };

  const filterResults = () => {
    let filtered = results;

    if (searchQuery) {
      filtered = filtered.filter(result =>
        result.content_snippet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.url?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (domainFilter !== "all") {
      filtered = filtered.filter(result => result.domain_id === domainFilter);
    }

    if (keywordFilter !== "all") {
      filtered = filtered.filter(result => result.keyword_id === keywordFilter);
    }

    if (dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();
      
      switch (dateRange) {
        case "today":
          cutoff.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(result => 
        result.crawl_date && new Date(result.crawl_date) >= cutoff
      );
    }

    setFilteredResults(filtered);
  };

  const getDomainName = (domainId) => {
    const domain = domains.find(d => d.id === domainId);
    return domain?.name || "Unknown Domain";
  };

  const getKeywordTerm = (keywordId) => {
    const keyword = keywords.find(k => k.id === keywordId);
    return keyword?.term || "Unknown Keyword";
  };

  const exportResults = () => {
    const csvContent = [
      ["Date", "Domain", "Keyword", "URL", "Title", "Snippet", "Matches", "Relevance Score"].join(','),
      ...filteredResults.map(result => [
        result.crawl_date ? new Date(result.crawl_date).toISOString().split('T')[0] : '',
        getDomainName(result.domain_id),
        getKeywordTerm(result.keyword_id),
        result.url || '',
        (result.title || '').replace(/,/g, ';'),
        (result.content_snippet || '').replace(/,/g, ';').slice(0, 100),
        result.match_count || 0,
        result.relevance_score || 0
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crawl-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Crawl Results
            </h1>
            <p className="text-slate-600 text-lg">
              View and analyze keyword matches found across your monitored domains
            </p>
          </div>
          <Button 
            onClick={exportResults}
            variant="outline"
            className="gap-2"
            disabled={filteredResults.length === 0}
          >
            <Download className="w-4 h-4" />
            Export Results
          </Button>
        </div>

        <ResultStats 
          results={filteredResults}
          totalResults={results.length}
          isLoading={isLoading}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search results by content, title, or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <ResultFilters 
              domains={domains}
              keywords={keywords}
              domainFilter={domainFilter}
              keywordFilter={keywordFilter}
              dateRange={dateRange}
              onDomainFilterChange={setDomainFilter}
              onKeywordFilterChange={setKeywordFilter}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No results found
                </h3>
                <p className="text-slate-600">
                  {searchQuery || domainFilter !== "all" || keywordFilter !== "all" || dateRange !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Results will appear here as your domains are crawled for keywords"
                  }
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredResults.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  domainName={getDomainName(result.domain_id)}
                  keywordTerm={getKeywordTerm(result.keyword_id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}