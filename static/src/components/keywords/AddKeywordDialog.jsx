import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddKeywordDialog({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    term: "",
    category: "",
    priority: "medium",
    case_sensitive: false,
    status: "active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.term) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ 
        term: "", 
        category: "", 
        priority: "medium", 
        case_sensitive: false, 
        status: "active" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Keyword</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="term">Keyword or Phrase</Label>
            <Input
              id="term"
              placeholder="e.g. artificial intelligence"
              value={formData.term}
              onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              placeholder="e.g. Technology, Business"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">▫ Low Priority</SelectItem>
                <SelectItem value="medium">◐ Medium Priority</SelectItem>
                <SelectItem value="high">● High Priority</SelectItem>
                <SelectItem value="critical">🔥 Critical Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="case_sensitive"
              checked={formData.case_sensitive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, case_sensitive: checked }))}
            />
            <Label htmlFor="case_sensitive" className="text-sm">
              Case sensitive search
            </Label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800">
              {isSubmitting ? "Adding..." : "Add Keyword"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}