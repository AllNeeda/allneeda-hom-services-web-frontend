"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";  

type Order = {
  title: string;
  client: string;
  avatar?: string;
  status: "active" | "completed" | "cancelled" | "pending";
  deadline: string;
  amount: string;
};

const ORDERS: Order[] = [
  { title: "Landing Page Design", client: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces", status: "active", deadline: "2 days", amount: "$450" },
  { title: "E-commerce Website", client: "Mike Chen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces", status: "completed", deadline: "Delivered", amount: "$2,100" },
  { title: "Logo Refresh", client: "Emma Wilson", status: "pending", deadline: "5 days", amount: "$180" },
  { title: "Brand Guidelines", client: "Daniel Smith", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=80&h=80&fit=crop&crop=faces", status: "active", deadline: "1 week", amount: "$700" },
  { title: "Marketing Assets", client: "Olivia Brown", status: "cancelled", deadline: "-", amount: "$0" },
  { title: "Portfolio Revamp", client: "James Lee", status: "completed", deadline: "Delivered", amount: "$650" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const second = parts[1]?.charAt(0) ?? "";
  return (first + second).toUpperCase();
}

function getStatusBadge(status: Order["status"]) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/30">Completed</Badge>;
    case "active":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30">Active</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/30">Pending</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/30">Cancelled</Badge>;
    default:
      return <Badge variant="secondary" className="dark:bg-gray-800 dark:text-gray-200">{status}</Badge>;
  }
}

function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full h-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px] min-w-[140px]">Buyer</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="min-w-[120px]">Client</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Deadline</TableHead>
            <TableHead className="text-right min-w-[100px]">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={index} onClick={()=>router.push("/it-services/order/1/")}  className="cursor-pointer">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {order.avatar ? (
                      <AvatarImage src={order.avatar} alt={order.client} />
                    ) : null}
                    <AvatarFallback>{getInitials(order.client)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">{order.client}</div>
                </div>
              </TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 font-medium">{order.title}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{order.client}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{order.deadline}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 dark:text-gray-100">{order.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function OrdersPage() {
  const [tab, setTab] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    if (tab === "all") return ORDERS;
    if (tab === "active") return ORDERS.filter((o) => o.status === "active");
    if (tab === "completed") return ORDERS.filter((o) => o.status === "completed");
    if (tab === "cancelled") return ORDERS.filter((o) => o.status === "cancelled");
    if (tab === "pending") return ORDERS.filter((o) => o.status === "pending");
    return ORDERS;
  }, [tab]);

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-gray-100 mb-1">Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage all your client orders.</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">Export CSV</Button>
        </div>

        {/* Simple Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <TabsList className="bg-transparent p-0 h-auto min-w-max">
              <TabsTrigger 
                value="all" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                All ({ORDERS.length})
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Active ({ORDERS.filter(o => o.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Completed ({ORDERS.filter(o => o.status === 'completed').length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Pending ({ORDERS.filter(o => o.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Cancelled ({ORDERS.filter(o => o.status === 'cancelled').length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="all">
              <OrdersTable orders={filtered} />
            </TabsContent>
            <TabsContent value="active">
              <OrdersTable orders={filtered} />
            </TabsContent>
            <TabsContent value="completed">
              <OrdersTable orders={filtered} />
            </TabsContent>
            <TabsContent value="pending">
              <OrdersTable orders={filtered} />
            </TabsContent>
            <TabsContent value="cancelled">
              <OrdersTable orders={filtered} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}


