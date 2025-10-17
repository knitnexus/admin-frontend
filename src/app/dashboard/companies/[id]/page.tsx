"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
    Building2,
    MapPin,
    Phone,
    FileText,
    Calendar,
    ArrowLeft,
    Pencil,
    Trash2,
    Loader2,
    Factory,
    Briefcase,
    Award,
    Image as ImageIcon,
    Settings,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { toast } from "sonner";

const BACKEND_SERVICE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL || "";

interface LocationData {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
}

interface Machinery {
    id: string;
    unitType: string;
    quantity: number;
    machineData: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

interface Service {
    id: string;
    title: string;
    description: string;
}

interface Company {
    id: string;
    name: string;
    companyLogo?: string;
    contactNumber: string;
    gstNumber?: string;
    aboutCompany?: string;
    unitType: string;
    workType: string;
    unitSqFeet: number;
    location: LocationData;
    certifications: string[];
    unitImages: string[];
    machinery: Machinery[];
    services: Service[];
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    data: Company;
}

const CompanyDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const companyId = params?.id as string;

    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (companyId) {
            fetchCompany();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId]);

    const fetchCompany = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_SERVICE_URL}/companies/${companyId}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch company");
            }

            const data: ApiResponse = await response.json();

            if (data.success) {
                setCompany(data.data);
            } else {
                toast.error("Failed to load company details");
                router.push("/dashboard/companies");
            }
        } catch (error) {
            console.error("Error fetching company:", error);
            toast.error("Failed to load company details");
            router.push("/dashboard/companies");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!company) return;

        setDeleting(true);
        try {
            const response = await fetch(`${BACKEND_SERVICE_URL}/companies/${company.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(`Company "${company.name}" deleted successfully`);
                router.push("/dashboard/companies");
            } else {
                toast.error(data.message || "Failed to delete company");
            }
        } catch (error) {
            console.error("Error deleting company:", error);
            toast.error("Failed to delete company");
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const formatUnitType = (unitType: string) => {
        return unitType.replace(/_/g, " ");
    };

    const formatWorkType = (workType: string) => {
        return workType.replace(/_/g, " ");
    };

    const formatLocation = (location: LocationData) => {
        const parts = [];
        if (location.address) return location.address;
        if (location.city) parts.push(location.city);
        if (location.state) parts.push(location.state);
        if (location.pincode) parts.push(location.pincode);
        if (parts.length > 0) return parts.join(", ");
        return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    };

    const renderMachineryData = (machineData: Record<string, any>) => {
        const excludeKeys = ["noOfMachines"];
        return Object.entries(machineData)
            .filter(([key]) => !excludeKeys.includes(key))
            .map(([key, value]) => {
                const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                let formattedValue = value;

                if (Array.isArray(value)) {
                    formattedValue = value.join(", ");
                } else if (typeof value === "object") {
                    formattedValue = JSON.stringify(value);
                }

                return (
                    <div key={key} className="flex justify-between py-1">
                        <span className="text-sm text-muted-foreground">{formattedKey}:</span>
                        <span className="text-sm font-medium">{String(formattedValue)}</span>
                    </div>
                );
            });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading company details...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/companies")}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={company.companyLogo} alt={company.name} />
                                    <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
                                    <p className="text-sm text-muted-foreground">Company Details</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/dashboard/companies/${company.id}/edit`)}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Contact Number</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {company.contactNumber}
                                        </p>
                                    </div>
                                    {company.gstNumber && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">GST Number</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {company.gstNumber}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {company.aboutCompany && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">About Company</p>
                                        <p className="text-sm">{company.aboutCompany}</p>
                                    </div>
                                )}
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Created</p>
                                        <p className="text-sm flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(company.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Last Updated</p>
                                        <p className="text-sm flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(company.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-2">{formatLocation(company.location)}</p>
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Latitude</p>
                                        <p className="font-medium">{company.location.latitude}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Longitude</p>
                                        <p className="font-medium">{company.location.longitude}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Machinery */}
                        {company.machinery.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-5 w-5" />
                                        Machinery
                                    </CardTitle>
                                    <CardDescription>
                                        {company.machinery.length} machine{company.machinery.length !== 1 ? "s" : ""}{" "}
                                        registered
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {company.machinery.map((machine, index) => (
                                            <Card key={machine.id} className="border-l-4 border-l-primary">
                                                <CardHeader>
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-base">
                                                            Machine #{index + 1}
                                                        </CardTitle>
                                                        <Badge variant="secondary">
                                                            Qty: {machine.quantity || machine.machineData.noOfMachines}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-1">
                                                        {renderMachineryData(machine.machineData)}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Services */}
                        {company.services.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        Services
                                    </CardTitle>
                                    <CardDescription>
                                        {company.services.length} service{company.services.length !== 1 ? "s" : ""}{" "}
                                        offered
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {company.services.map((service) => (
                                            <div key={service.id} className="border-l-4 border-l-blue-500 pl-4">
                                                <h4 className="font-semibold">{service.title}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {service.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Unit Images */}
                        {company.unitImages.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        Unit Images
                                    </CardTitle>
                                    <CardDescription>{company.unitImages.length} images</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {company.unitImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer"
                                                onClick={() => window.open(image, "_blank")}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`Unit ${index + 1}`}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Stats & Details */}
                    <div className="space-y-6">
                        {/* Unit Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Factory className="h-5 w-5" />
                                    Unit Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Unit Type</p>
                                    <Badge variant="secondary" className="text-sm">
                                        {formatUnitType(company.unitType)}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Work Type</p>
                                    <Badge variant="outline" className="text-sm">
                                        {formatWorkType(company.workType)}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Unit Area</p>
                                    <p className="font-semibold text-lg">{company.unitSqFeet.toLocaleString()} sq ft</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certifications */}
                        {company.certifications.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Certifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {company.certifications.map((cert, index) => (
                                            <Badge key={index} variant="secondary">
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Machines</span>
                                    <span className="font-bold text-lg">{company.machinery.length}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Services Offered</span>
                                    <span className="font-bold text-lg">{company.services.length}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Certifications</span>
                                    <span className="font-bold text-lg">{company.certifications.length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Company</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{company.name}</strong>? This action cannot be undone
                            and will also delete:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>{company.machinery.length} machinery records</li>
                                <li>{company.services.length} service records</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
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

export default CompanyDetailPage;