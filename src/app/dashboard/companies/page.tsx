"use client"
import { useState, useMemo } from "react";
import { Search, Filter, Building2, MapPin, Calendar, Eye, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface Company {
    id: string;
    name: string;
    logo?: string;
    unitType: string;
    workType: string;
    location: string;
    gst?: string;
    lastUpdated: string;
}

// Mock data
const mockCompanies: Company[] = [
    {
        id: "1",
        name: "TechCorp Solutions",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=TechCorp",
        unitType: "Private Limited",
        workType: "IT Services",
        location: "Bangalore, Karnataka",
        gst: "29ABCDE1234F1Z5",
        lastUpdated: "2025-01-15",
    },
    {
        id: "2",
        name: "BuildRight Constructions",
        unitType: "Partnership",
        workType: "Construction",
        location: "Mumbai, Maharashtra",
        gst: "27FGHIJ5678K2Y4",
        lastUpdated: "2025-01-14",
    },
    {
        id: "3",
        name: "GreenEnergy Ltd",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=GreenEnergy",
        unitType: "Public Limited",
        workType: "Renewable Energy",
        location: "Pune, Maharashtra",
        gst: "27LMNOP9012M3X3",
        lastUpdated: "2025-01-13",
    },
    {
        id: "4",
        name: "Fashion Hub",
        unitType: "Sole Proprietorship",
        workType: "Retail",
        location: "Delhi, NCR",
        gst: "07QRSTU3456N4W2",
        lastUpdated: "2025-01-12",
    },
    {
        id: "5",
        name: "HealthPlus Pharma",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=HealthPlus",
        unitType: "Private Limited",
        workType: "Pharmaceuticals",
        location: "Hyderabad, Telangana",
        gst: "36VWXYZ7890O5V1",
        lastUpdated: "2025-01-11",
    },
];

const Companies = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [unitTypeFilter, setUnitTypeFilter] = useState<string>("all");
    const [workTypeFilter, setWorkTypeFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("name");

    const unitTypes = ["all", "Private Limited", "Public Limited", "Partnership", "Sole Proprietorship"];
    const workTypes = ["all", "IT Services", "Construction", "Renewable Energy", "Retail", "Pharmaceuticals"];

    // Filtered and sorted companies
    const filteredCompanies = useMemo(() => {
        let filtered = mockCompanies.filter((company) => {
            const matchesSearch =
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.gst?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesUnitType = unitTypeFilter === "all" || company.unitType === unitTypeFilter;
            const matchesWorkType = workTypeFilter === "all" || company.workType === workTypeFilter;

            return matchesSearch && matchesUnitType && matchesWorkType;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "date") return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
            return 0;
        });

        return filtered;
    }, [searchTerm, unitTypeFilter, workTypeFilter, sortBy]);

    const handleView = (id: string) => {
        toast({
            title: "View Company",
            description: `Viewing details for company ID: ${id}`,
        });
    };

    const handleEdit = (id: string) => {
        toast({
            title: "Edit Company",
            description: `Editing company ID: ${id}`,
        });
    };

    const handleDelete = (id: string) => {
        toast({
            title: "Delete Company",
            description: `Company ID ${id} has been deleted`,
            variant: "destructive",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Companies</h1>
                    </div>
                    <p className="text-muted-foreground">Manage your company portfolio</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Filters and Search Bar */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by company name or GST..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4">
                            <Select value={unitTypeFilter} onValueChange={setUnitTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Unit Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type === "all" ? "All Unit Types" : type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Work Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {workTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type === "all" ? "All Work Types" : type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[150px]">
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="date">Last Updated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="text-sm text-muted-foreground">
                        Showing {filteredCompanies.length} of {mockCompanies.length} companies
                    </div>
                </div>

                {/* Companies Table */}
                <div className="rounded-lg border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">Logo</TableHead>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Unit Type</TableHead>
                                <TableHead>Work Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCompanies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        No companies found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <TableRow key={company.id} className="group hover:bg-accent/50 transition-colors">
                                        <TableCell>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={company.logo} alt={company.name} />
                                                <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div className="font-semibold text-foreground">{company.name}</div>
                                                {company.gst && (
                                                    <div className="text-xs text-muted-foreground">GST: {company.gst}</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {company.unitType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {company.workType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                {company.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(company.lastUpdated).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleView(company.id)}
                                                    className="h-8 w-8"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(company.id)}
                                                    className="h-8 w-8"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(company.id)}
                                                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    );
};

export default Companies;
