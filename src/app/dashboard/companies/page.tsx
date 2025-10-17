"use client"
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Building2, MapPin, Calendar, Eye, Pencil, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const BACKEND_SERVICE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL || "";

interface LocationData {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
}

interface Company {
    id: string;
    name: string;
    companyLogo?: string;
    unitType: string;
    workType: string;
    updatedAt: string;
    location: LocationData;
}

interface ApiResponse {
    success: boolean;
    data: Company[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const unitTypes = [
    "YARN_SPINNING",
    "YARN_PROCESSING",
    "WEAVING_UNIT",
    "KNITTING_UNIT",
    "DYEING_UNIT",
    "FABRIC_PROCESSING_UNIT",
    "FABRIC_FINISHING_UNIT",
    "WASHING_UNIT",
    "CUTTING_UNIT",
    "COMPUTERIZED_EMBROIDERY_UNIT",
    "MANUAL_EMBROIDERY_UNIT",
    "FUSING_UNIT",
    "PRINTING_UNIT",
    "STITCHING_UNIT",
    "CHECKING_UNIT",
    "IRONING_PACKING_UNIT",
    "KAJA_BUTTON_UNIT",
    "MULTI_NEEDLE_DOUBLE_CHAIN_UNIT",
    "OIL_REMOVING_MENDING_CENTER",
    "PATTERN_MAKING_CENTER",
    "FILM_SCREEN_MAKING_CENTER",
];

const workTypes = ["DOMESTIC_WORK", "EXPORT_WORK"];

const Companies = () => {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [unitTypeFilter, setUnitTypeFilter] = useState<string>("all");
    const [workTypeFilter, setWorkTypeFilter] = useState<string>("all");
    const [locationFilter, setLocationFilter] = useState("");
    const [sortBy, setSortBy] = useState<string>("date");
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch companies from API
    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (searchTerm) params.append("name", searchTerm);
            if (unitTypeFilter !== "all") params.append("unitType", unitTypeFilter);
            if (workTypeFilter !== "all") params.append("workType", workTypeFilter);
            if (locationFilter) params.append("location", locationFilter);

            const response = await fetch(`${BACKEND_SERVICE_URL}/companies/list?${params}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch companies");
            }

            const data: ApiResponse = await response.json();

            if (data.success) {
                setCompanies(data.data);
                setPagination(data.pagination);
            } else {
                toast.error("Failed to load companies");
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
            toast.error("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, searchTerm, unitTypeFilter, workTypeFilter, locationFilter]);

    // Client-side sorting
    const sortedCompanies = useMemo(() => {
        const sorted = [...companies];
        if (sortBy === "name") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "date") {
            sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
        return sorted;
    }, [companies, sortBy]);

    const handleView = (id: string) => {
        router.push(`/dashboard/companies/${id}`);
    };

    const handleEdit = (id: string) => {
        router.push(`/dashboard/companies/${id}/edit`);
    };

    const handleDeleteClick = (company: Company) => {
        setCompanyToDelete(company);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!companyToDelete) return;

        setDeleting(true);
        try {
            const response = await fetch(`${BACKEND_SERVICE_URL}/companies/${companyToDelete.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(`Company "${companyToDelete.name}" deleted successfully`);
                fetchCompanies(); // Refresh the list
            } else {
                toast.error(data.message || "Failed to delete company");
            }
        } catch (error) {
            console.error("Error deleting company:", error);
            toast.error("Failed to delete company");
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setCompanyToDelete(null);
        }
    };

    const formatUnitType = (unitType: string) => {
        return unitType.replace(/_/g, " ");
    };

    const formatWorkType = (workType: string) => {
        return workType.replace(/_/g, " ");
    };

    const formatLocation = (location: LocationData) => {
        if (location.city && location.state) {
            return `${location.city}, ${location.state}`;
        }
        return `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
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
                        {/* Search by Name */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by company name..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPagination((prev) => ({ ...prev, page: 1 }));
                                }}
                                className="pl-10"
                            />
                        </div>

                        {/* Location Search */}
                        <div className="relative w-full md:w-[200px]">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Location..."
                                value={locationFilter}
                                onChange={(e) => {
                                    setLocationFilter(e.target.value);
                                    setPagination((prev) => ({ ...prev, page: 1 }));
                                }}
                                className="pl-10"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4">
                            <Select
                                value={unitTypeFilter}
                                onValueChange={(value) => {
                                    setUnitTypeFilter(value);
                                    setPagination((prev) => ({ ...prev, page: 1 }));
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Unit Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Unit Types</SelectItem>
                                    {unitTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {formatUnitType(type)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={workTypeFilter}
                                onValueChange={(value) => {
                                    setWorkTypeFilter(value);
                                    setPagination((prev) => ({ ...prev, page: 1 }));
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Work Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Work Types</SelectItem>
                                    {workTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {formatWorkType(type)}
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
                        Showing {sortedCompanies.length} of {pagination.total} companies
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="text-muted-foreground">Loading companies...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : sortedCompanies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        No companies found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedCompanies.map((company) => (
                                    <TableRow key={company.id} className="group hover:bg-accent/50 transition-colors">
                                        <TableCell>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={company.companyLogo} alt={company.name} />
                                                <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="font-semibold text-foreground">{company.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {formatUnitType(company.unitType)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {formatWorkType(company.workType)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                {formatLocation(company.location)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(company.updatedAt).toLocaleDateString()}
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
                                                    onClick={() => handleDeleteClick(company)}
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Company</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{companyToDelete?.name}</strong>? This action cannot
                            be undone and will also delete all associated machinery and services.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Companies;
