import React, { useState, useEffect } from "react";
import { Keyword } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import KeywordCard from "../components/keywords/KeywordCard";
import AddKeywordDialog from "../components/keywords/AddKeywordDialog";
import KeywordFilters from "../components/keywords/KeywordFilters";

export default function Keywords() {
  const [keywords, setKeywords] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadKeywords();
  }, []);

  useEffect(() => {
    filterKeywords();
  }, [keywords, searchQuery, priorityFilter, categoryFilter]);

  const loadKeywords = async () => {
    setIsLoading(true);
    const data = await Keyword.list("-created_date");
    setKeywords(data);
    setIsLoading(false);
  };

  const filterKeywords = () => {
    let filtered = keywords;

    if (searchQuery) {
      filtered = filtered.filter(keyword =>
        keyword.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (keyword.category && keyword.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(keyword => keyword.priority === priorityFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(keyword => keyword.category === categoryFilter);
    }

    setFilteredKeywords(filtered);
  };

  const getUniqueCategories = () => {
    const categories = keywords
      .map(k => k.category)
      .filter(Boolean)
      .filter((category, index, arr) => arr.indexOf(category) === index);
    return categories;
  };

  const handleAddKeyword = async (keywordData) => {
    await Keyword.create(keywordData);
    setShowAddDialog(false);
    loadKeywords();
  };

  const handleUpdateKeyword = async (id, updates) => {
    await Keyword.update(id, updates);
    loadKeywords();
  };

  const handleDeleteKeyword = async (id) => {
    await Keyword.delete(id);
    loadKeywords();
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Keywords
            </h1>
            <p className="text-slate-600 text-lg">
              Define the terms and phrases you want to track across your domains
            </p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-slate-900 hover:bg-slate-800 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Keyword
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <KeywordFilters 
              priorityFilter={priorityFilter}
              categoryFilter={categoryFilter}
              categories={getUniqueCategories()}
              onPriorityFilterChange={setPriorityFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredKeywords.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No keywords found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchQuery || priorityFilter !== "all" || categoryFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Add your first keyword to start tracking mentions"
                  }
                </p>
                {!searchQuery && priorityFilter === "all" && categoryFilter === "all" && (
                  <Button 
                    onClick={() => setShowAddDialog(true)}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    Add Your First Keyword
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredKeywords.map((keyword) => (
                <KeywordCard
                  key={keyword.id}
                  keyword={keyword}
                  onUpdate={handleUpdateKeyword}
                  onDelete={handleDeleteKeyword}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AddKeywordDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddKeyword}
        />
      </div>
    </div>
  );
}