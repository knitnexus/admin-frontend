"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Building2,
    ArrowLeft,
    Loader2,
    Save,
    X,
    Plus,
    Trash2,
    Upload,
    MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MachineryForms } from "@/components/Forms";

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

const availableCertifications = [
    "Import Export Certificate",
    "ISO 9001",
    "GOTS",
    "Fair Trade",
    "OEKO-TEX",
    "SA8000",
    "RCS",
    "BCI Cotton",
    "Sedex",
    "OCS",
    "GRS",
];

const EditCompanyPage = () => {
    const router = useRouter();
    const params = useParams();
    const companyId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");

    // Form state
    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [aboutCompany, setAboutCompany] = useState("");
    const [unitType, setUnitType] = useState("");
    const [workType, setWorkType] = useState("");
    const [unitSqFeet, setUnitSqFeet] = useState("");
    const [certifications, setCertifications] = useState<string[]>([]);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [companyLogo, setCompanyLogo] = useState<File | null>(null);
    const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("");
    const [unitImages, setUnitImages] = useState<File[]>([]);
    const [existingUnitImages, setExistingUnitImages] = useState<string[]>([]);
    const [machinery, setMachinery] = useState<any[]>([]);
    const [services, setServices] = useState<{ title: string; description: string }[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (companyId) {
            fetchCompany();
        }
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

            const data = await response.json();

            if (data.success) {
                const company: Company = data.data;
                setName(company.name);
                setContactNumber(company.contactNumber);
                setGstNumber(company.gstNumber || "");
                setAboutCompany(company.aboutCompany || "");
                setUnitType(company.unitType);
                setWorkType(company.workType);
                setUnitSqFeet(company.unitSqFeet.toString());
                setCertifications(company.certifications);
                setLocation(company.location);
                setCompanyLogoPreview(company.companyLogo || "");
                setExistingUnitImages(company.unitImages);
                setMachinery(company.machinery.map((m) => m.machineData));
                setServices(company.services);
            } else {
                toast.error("Failed to load company");
                router.push("/dashboard/companies");
            }
        } catch (error) {
            console.error("Error fetching company:", error);
            toast.error("Failed to load company");
            router.push("/dashboard/companies");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCompanyLogo(file);
            setCompanyLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleUnitImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUnitImages((prev) => [...prev, ...files]);
    };

    const removeUnitImage = (index: number) => {
        setUnitImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingUnitImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCertificationToggle = (cert: string) => {
        setCertifications((prev) =>
            prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
        );
    };

    const handleUnitTypeChange = (newUnitType: string) => {
        if (newUnitType !== unitType && machinery.length > 0) {
            toast.warning("Changing unit type will reset all machinery data", {
                description: "Your current machinery data will be lost.",
            });
            setMachinery([]);
        }
        setUnitType(newUnitType);
    };

    const addMachinery = () => {
        setMachinery((prev) => [...prev, {}]);
    };

    const removeMachinery = (index: number) => {
        setMachinery((prev) => prev.filter((_, i) => i !== index));
    };

    const updateMachinery = (index: number, data: any) => {
        setMachinery((prev) => {
            const updated = [...prev];
            updated[index] = data;
            return updated;
        });
    };

    const addService = () => {
        setServices((prev) => [...prev, { title: "", description: "" }]);
    };

    const removeService = (index: number) => {
        setServices((prev) => prev.filter((_, i) => i !== index));
    };

    const updateService = (index: number, field: "title" | "description", value: string) => {
        setServices((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = "Company name is required";
        if (!contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
        if (!unitType) newErrors.unitType = "Unit type is required";
        if (!workType) newErrors.workType = "Work type is required";
        if (!unitSqFeet || parseInt(unitSqFeet) <= 0)
            newErrors.unitSqFeet = "Valid unit square feet is required";
        if (!location) newErrors.location = "Location is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();

            // Basic info
            formData.append("name", name.trim());
            formData.append("contactNumber", contactNumber.trim());
            if (gstNumber) formData.append("gstNumber", gstNumber.trim());
            if (aboutCompany) formData.append("aboutCompany", aboutCompany);
            formData.append("workType", workType);
            formData.append("unitType", unitType);
            formData.append("unitSqFeet", unitSqFeet);

            // Location
            if (location) {
                formData.append("location", JSON.stringify(location));
            }

            // Logo (only if new file selected)
            if (companyLogo) {
                formData.append("companyLogo", companyLogo);
            }

            // Unit images (only new ones)
            unitImages.forEach((file) => {
                formData.append("unitImages", file);
            });

            // Certifications
            certifications.forEach((cert) => {
                formData.append("certifications", cert);
            });

            // Machinery
            if (machinery.length > 0) {
                formData.append("machinery", JSON.stringify(machinery));
            }

            // Services
            if (services.length > 0) {
                const validServices = services.filter((s) => s.title.trim() || s.description.trim());
                formData.append("services", JSON.stringify(validServices));
            }

            const response = await fetch(`${BACKEND_SERVICE_URL}/companies/${companyId}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Company updated successfully!");
                router.push(`/dashboard/companies/${companyId}`);
            } else {
                toast.error(data.message || "Failed to update company");
                if (data.errors) {
                    console.error("Validation errors:", data.errors);
                }
            }
        } catch (error) {
            console.error("Error updating company:", error);
            toast.error("Failed to update company");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading company data...</p>
                </div>
            </div>
        );
    }

    const MachineForm = unitType ? MachineryForms[unitType] : null;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/dashboard/companies/${companyId}`)}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    <Building2 className="h-6 w-6" />
                                    Edit Company
                                </h1>
                                <p className="text-sm text-muted-foreground">{name}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/dashboard/companies/${companyId}`)}
                                disabled={submitting}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="unit">Unit Details</TabsTrigger>
                        <TabsTrigger value="location">Location</TabsTrigger>
                        <TabsTrigger value="machinery">Machinery</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                    </TabsList>

                    {/* Basic Info Tab */}
                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Update company basic details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Company Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter company name"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contactNumber">
                                            Contact Number <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="contactNumber"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            placeholder="Enter contact number"
                                        />
                                        {errors.contactNumber && (
                                            <p className="text-sm text-red-500">{errors.contactNumber}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gstNumber">GST Number</Label>
                                        <Input
                                            id="gstNumber"
                                            value={gstNumber}
                                            onChange={(e) => setGstNumber(e.target.value)}
                                            placeholder="Enter GST number (optional)"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Company Logo</Label>
                                        <div className="flex items-center gap-4">
                                            {companyLogoPreview && (
                                                <img
                                                    src={companyLogoPreview}
                                                    alt="Logo preview"
                                                    className="h-16 w-16 rounded-lg object-cover border"
                                                />
                                            )}
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="about">About Company</Label>
                                    <Textarea
                                        id="about"
                                        value={aboutCompany}
                                        onChange={(e) => setAboutCompany(e.target.value)}
                                        placeholder="Tell us about your company..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Unit Details Tab */}
                    <TabsContent value="unit">
                        <Card>
                            <CardHeader>
                                <CardTitle>Unit Details</CardTitle>
                                <CardDescription>Configure unit specifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="unitType">
                                            Unit Type <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={unitType} onValueChange={handleUnitTypeChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select unit type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {unitTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.replace(/_/g, " ")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.unitType && (
                                            <p className="text-sm text-red-500">{errors.unitType}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="workType">
                                            Work Type <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={workType} onValueChange={setWorkType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select work type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {workTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.replace(/_/g, " ")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.workType && (
                                            <p className="text-sm text-red-500">{errors.workType}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="unitSqFeet">
                                            Unit Area (sq ft) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="unitSqFeet"
                                            type="number"
                                            value={unitSqFeet}
                                            onChange={(e) => setUnitSqFeet(e.target.value)}
                                            placeholder="Enter area in square feet"
                                        />
                                        {errors.unitSqFeet && (
                                            <p className="text-sm text-red-500">{errors.unitSqFeet}</p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label>Certifications</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {availableCertifications.map((cert) => (
                                            <div key={cert} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={cert}
                                                    checked={certifications.includes(cert)}
                                                    onCheckedChange={() => handleCertificationToggle(cert)}
                                                />
                                                <label
                                                    htmlFor={cert}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {cert}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Location Tab */}
                    <TabsContent value="location">
                        <Card>
                            <CardHeader>
                                <CardTitle>Location <span className="text-red-500">*</span></CardTitle>
                                <CardDescription>Current company location information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Selected Location Display */}
                                {location ? (
                                    <div className="p-4 bg-muted rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span>Current Location</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            {location.city && (
                                                <div>
                                                    <span className="text-muted-foreground">City:</span>{" "}
                                                    <span className="font-medium">{location.city}</span>
                                                </div>
                                            )}
                                            {location.state && (
                                                <div>
                                                    <span className="text-muted-foreground">State:</span>{" "}
                                                    <span className="font-medium">{location.state}</span>
                                                </div>
                                            )}
                                            {location.pincode && (
                                                <div>
                                                    <span className="text-muted-foreground">Pincode:</span>{" "}
                                                    <span className="font-medium">{location.pincode}</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-muted-foreground">Coordinates:</span>{" "}
                                                <span className="font-medium">
                                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                                </span>
                                            </div>
                                        </div>
                                        {location.address && (
                                            <div className="text-sm pt-2 border-t">
                                                <span className="text-muted-foreground">Address:</span>{" "}
                                                <span className="font-medium">{location.address}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No location data available</p>
                                    </div>
                                )}

                                {/* Error Message */}
                                {errors.location && (
                                    <p className="text-sm text-destructive">{errors.location}</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Machinery Tab */}
                    <TabsContent value="machinery">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Machinery</CardTitle>
                                        <CardDescription>
                                            Manage machinery for {unitType.replace(/_/g, " ")}
                                        </CardDescription>
                                    </div>
                                    <Button onClick={addMachinery} disabled={!unitType}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Machine
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!unitType ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Please select a unit type first
                                    </p>
                                ) : machinery.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No machinery added yet. Click "Add Machine" to start.
                                    </p>
                                ) : (
                                    machinery.map((machine, index) => (
                                        <Card key={index} className="border-l-4 border-l-primary">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base">
                                                        Machine #{index + 1}
                                                    </CardTitle>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeMachinery(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {MachineForm ? (
                                                    <MachineForm
                                                        form={machine}
                                                        setForm={(data: any) => updateMachinery(index, data)}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        No form available for this unit type
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Services</CardTitle>
                                        <CardDescription>Services offered by your company</CardDescription>
                                    </div>
                                    <Button onClick={addService}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Service
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {services.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No services added yet. Click "Add Service" to start.
                                    </p>
                                ) : (
                                    services.map((service, index) => (
                                        <Card key={index} className="border-l-4 border-l-blue-500">
                                            <CardContent className="pt-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 space-y-4">
                                                            <div className="space-y-2">
                                                                <Label>Service Title</Label>
                                                                <Input
                                                                    value={service.title}
                                                                    onChange={(e) =>
                                                                        updateService(index, "title", e.target.value)
                                                                    }
                                                                    placeholder="e.g., Custom Embroidery"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Description</Label>
                                                                <Textarea
                                                                    value={service.description}
                                                                    onChange={(e) =>
                                                                        updateService(
                                                                            index,
                                                                            "description",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Describe the service..."
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeService(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Images Tab */}
                    <TabsContent value="images">
                        <Card>
                            <CardHeader>
                                <CardTitle>Unit Images</CardTitle>
                                <CardDescription>Upload images of your facility</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Existing Images */}
                                {existingUnitImages.length > 0 && (
                                    <div className="space-y-3">
                                        <Label>Current Images</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {existingUnitImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={image}
                                                        alt={`Unit ${index + 1}`}
                                                        className="w-full aspect-square object-cover rounded-lg border"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeExistingImage(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images */}
                                {unitImages.length > 0 && (
                                    <div className="space-y-3">
                                        <Label>New Images (to be uploaded)</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {unitImages.map((file, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`New ${index + 1}`}
                                                        className="w-full aspect-square object-cover rounded-lg border"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeUnitImage(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="space-y-2">
                                    <Label htmlFor="unitImages">Add More Images</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="unitImages"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleUnitImagesChange}
                                        />
                                        <Upload className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        You can select multiple images at once
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default EditCompanyPage;