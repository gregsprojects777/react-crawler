import React, { useState, useEffect } from "react";
import { Domain } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import DomainCard from "../components/domains/DomainCard";
import AddDomainDialog from "../components/domains/AddDomainDialog";
import DomainFilters from "../components/domains/DomainFilters";

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    filterDomains();
  }, [domains, searchQuery, statusFilter]);

  const loadDomains = async () => {
    setIsLoading(true);
    const data = await Domain.list("-created_date");
    setDomains(data);
    setIsLoading(false);
  };

  const filterDomains = () => {
    let filtered = domains;

    if (searchQuery) {
      filtered = filtered.filter(domain =>
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(domain => domain.status === statusFilter);
    }

    setFilteredDomains(filtered);
  };

  const handleAddDomain = async (domainData) => {
    await Domain.create(domainData);
    setShowAddDialog(false);
    loadDomains();
  };

  const handleUpdateDomain = async (id, updates) => {
    await Domain.update(id, updates);
    loadDomains();
  };

  const handleDeleteDomain = async (id) => {
    await Domain.delete(id);
    loadDomains();
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Domains
            </h1>
            <p className="text-slate-600 text-lg">
              Manage the websites you want to monitor for keywords
            </p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-slate-900 hover:bg-slate-800 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Domain
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DomainFilters 
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
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
          ) : filteredDomains.length === 0 ? (
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
                  No domains found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Add your first domain to start monitoring websites"
                  }
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button 
                    onClick={() => setShowAddDialog(true)}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    Add Your First Domain
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
              {filteredDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  onUpdate={handleUpdateDomain}
                  onDelete={handleDeleteDomain}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AddDomainDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddDomain}
        />
      </div>
    </div>
  );
}