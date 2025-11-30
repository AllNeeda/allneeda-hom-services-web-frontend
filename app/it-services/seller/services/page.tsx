"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Service = {
  title: string;
  category: string;
  status: "active" | "paused" | "draft" | "rejected";
  price: string;
  orders: number;
  created: string;
  image: string;
};

const SERVICES: Service[] = [
  { 
    title: "Professional Logo Design", 
    category: "Logo Design", 
    status: "active", 
    price: "$50", 
    orders: 24, 
    created: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center"
  },
  { 
    title: "E-commerce Website Development", 
    category: "Web Development", 
    status: "active", 
    price: "$500", 
    orders: 8, 
    created: "1 month ago",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&crop=center"
  },
  { 
    title: "Social Media Graphics Package", 
    category: "Graphic Design", 
    status: "paused", 
    price: "$25", 
    orders: 12, 
    created: "3 weeks ago",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center"
  },
  { 
    title: "Brand Identity Package", 
    category: "Branding", 
    status: "draft", 
    price: "$200", 
    orders: 0, 
    created: "1 week ago",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center"
  },
  { 
    title: "Mobile App UI/UX Design", 
    category: "UI/UX Design", 
    status: "rejected", 
    price: "$300", 
    orders: 0, 
    created: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop&crop=center"
  },
  { 
    title: "Business Card Design", 
    category: "Print Design", 
    status: "active", 
    price: "$15", 
    orders: 35, 
    created: "1 month ago",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center"
  },
];

function getStatusBadge(status: Service["status"]) {
  switch (status) {
    case "active":
      return <span className="text-green-700 dark:text-green-400">Active</span>;
    case "paused":
      return <span className="text-yellow-700 dark:text-yellow-400">Paused</span>;
    case "draft":
      return <span className="text-gray-700 dark:text-gray-400">Draft</span>;
    case "rejected":
      return <span className="text-red-700 dark:text-red-400">Rejected</span>;
    default:
      return <span className="text-gray-700 dark:text-gray-400">{status}</span>;
  }
}

function ServicesTable({ services }: { services: Service[] }) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="min-w-[120px]">Category</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[80px]">Price</TableHead>
            <TableHead className="min-w-[80px]">Orders</TableHead>
            <TableHead className="min-w-[100px]">Created</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service, idx) => (
            <TableRow key={idx} onClick={()=>router.push("/it-services/create-service/")} className="cursor-pointer">
              <TableCell>
                <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.add('flex');
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 font-medium">{service.title}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{service.category}</TableCell>
              <TableCell>{getStatusBadge(service.status)}</TableCell>
              <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{service.price}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{service.orders}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{service.created}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="Open actions">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ServicesPage() {
  const [tab, setTab] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    if (tab === "all") return SERVICES;
    if (tab === "active") return SERVICES.filter((s) => s.status === "active");
    if (tab === "paused") return SERVICES.filter((s) => s.status === "paused");
    if (tab === "draft") return SERVICES.filter((s) => s.status === "draft");
    if (tab === "rejected") return SERVICES.filter((s) => s.status === "rejected");
    return SERVICES;
  }, [tab]);

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto ">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-gray-100 mb-1">Services & Gigs</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your service offerings and track performance.</p>
          </div>
          <Link href={"/it-services/create-service/"}>
          <Button className="w-full sm:w-auto">Create New Service</Button>
          </Link>
        </div>

        {/* Simple Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <TabsList className="bg-transparent p-0 h-auto min-w-max">
              <TabsTrigger 
                value="all" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                All ({SERVICES.length})
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Active ({SERVICES.filter(s => s.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger 
                value="paused" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Paused ({SERVICES.filter(s => s.status === 'paused').length})
              </TabsTrigger>
              <TabsTrigger 
                value="draft" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Draft ({SERVICES.filter(s => s.status === 'draft').length})
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Rejected ({SERVICES.filter(s => s.status === 'rejected').length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="all">
              <ServicesTable services={filtered} />
            </TabsContent>
            <TabsContent value="active">
              <ServicesTable services={filtered} />
            </TabsContent>
            <TabsContent value="paused">
              <ServicesTable services={filtered} />
            </TabsContent>
            <TabsContent value="draft">
              <ServicesTable services={filtered} />
            </TabsContent>
            <TabsContent value="rejected">
              <ServicesTable services={filtered} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
