import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  Tag, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  Globe,
  Download,
  Eye,
  Star,
  Bookmark
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { apiFetch } from "@/lib/api";

const SearchFilter = () => {
  const { sector } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedFilters, setSelectedFilters] = useState({
    documentType: [],
    department: [],
    language: [],
    status: [],
    urgency: []
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "under-review":
        return <AlertTriangle className="w-4 h-4 text-accent" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      case "low":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-warning";
    return "text-muted-foreground";
  };

  const runSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (sector) params.set("sector", sector);
      const data = await apiFetch(`/api/search?${params.toString()}`);
      const normalized = (data.results || []).map((d: any) => ({
        id: d.id,
        title: d.title || d.fileName,
        content: d.description || "",
        type: (d.mimeType || "").split("/")[1]?.toUpperCase() || "FILE",
        department: d.sector || "",
        language: "",
        status: "completed",
        urgency: "low",
        date: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "",
        author: "",
        tags: d.tags || [],
        relevanceScore: 90,
        highlights: [],
        url: d.url,
      }));
      setResults(normalized);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search & Filter
          </h1>
          <p className="text-muted-foreground">
            Advanced search with semantic understanding and multilingual support for English and Malayalam.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="kmrl-card sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Type */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">Search Type</h4>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="semantic">Semantic Search</SelectItem>
                      <SelectItem value="exact">Exact Match</SelectItem>
                      <SelectItem value="ai">AI-Enhanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Document Type */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">Document Type</h4>
                  <div className="space-y-2">
                    {["PDF", "DOCX", "XLSX", "PPTX", "TXT"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={`type-${type}`} />
                        <label htmlFor={`type-${type}`} className="text-sm text-card-foreground">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Department */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">Department</h4>
                  <div className="space-y-2">
                    {["Engineering", "Finance", "Procurement", "HR", "Operations"].map((dept) => (
                      <div key={dept} className="flex items-center space-x-2">
                        <Checkbox id={`dept-${dept}`} />
                        <label htmlFor={`dept-${dept}`} className="text-sm text-card-foreground">
                          {dept}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Language */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">Language</h4>
                  <div className="space-y-2">
                    {[
                      { value: "english", label: "English" },
                      { value: "malayalam", label: "മലയാളം" },
                      { value: "mixed", label: "Mixed" }
                    ].map((lang) => (
                      <div key={lang.value} className="flex items-center space-x-2">
                        <Checkbox id={`lang-${lang.value}`} />
                        <label htmlFor={`lang-${lang.value}`} className="text-sm text-card-foreground">
                          {lang.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Status */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">Status</h4>
                  <div className="space-y-2">
                    {["Active", "Pending", "Under Review", "Completed", "Archived"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox id={`status-${status}`} />
                        <label htmlFor={`status-${status}`} className="text-sm text-card-foreground">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Date Range */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">Date Range</h4>
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />
                </div>

                <Button className="w-full" variant="outline">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <Card className="kmrl-card">
              <CardContent className="p-4">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents... (supports English and Malayalam)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="px-6" onClick={runSearch} disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Brain className="w-4 h-4" />
                    <span>AI-powered semantic search enabled</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>Multilingual support active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Search Results ({results.length} found)
              </h2>
              <div className="flex items-center space-x-2">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">By Relevance</SelectItem>
                    <SelectItem value="date">By Date</SelectItem>
                    <SelectItem value="title">By Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="kmrl-card hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-card-foreground hover:text-primary cursor-pointer">
                              {result.title}
                            </h3>
                            <Badge className={`text-xs ${getRelevanceColor(result.relevanceScore)}`}>
                              <Star className="w-3 h-3 mr-1" />
                              {result.relevanceScore}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{result.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Globe className="w-4 h-4" />
                              <span>{result.language}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{result.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon("completed")}
                              <span className="capitalize">completed</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3 leading-relaxed">
                            {result.content}
                          </p>
                        </div>
                        
                        <div className="flex items-start space-x-2 ml-4">
                          <Badge className={`text-xs ${getUrgencyColor("low")}`}>
                            low
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Highlights */}
                      {result.highlights && result.highlights.length > 0 && (
                        <div className="p-3 bg-accent/5 rounded-lg">
                          <h4 className="text-sm font-medium text-card-foreground mb-2">
                            Key Highlights
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {result.highlights.map((highlight: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => window.open(result.url, "_blank") }>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => window.open(result.url, "_blank") }>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="px-8" onClick={runSearch} disabled={loading}>
                {loading ? "Loading..." : "Reload Results"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchFilter;