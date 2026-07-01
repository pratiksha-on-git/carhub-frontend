import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, MessageCircle, Search, RefreshCw, Heart } from "lucide-react";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { useState } from "react";
import { formatDate } from "@/utils/helpers";
import { useCustomerWishlist } from "@/hooks/dealer/useCustomerWishlist";

export default function CustomerWishlist() {
    const { user } = useDealerAuth();
    const dealerId = user?.id?.toString() || "";

    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: wishlistItems = [],
        isLoading: fetching,
        refetch,
        isRefetching,
    } = useCustomerWishlist(dealerId);

    const filteredItems = wishlistItems.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            item.customerName?.toLowerCase().includes(searchLower) ||
            item.customerEmail?.toLowerCase().includes(searchLower) ||
            item.customerPhone?.toLowerCase().includes(searchLower) ||
            item.vehicleName?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">

                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Customer Wishlists
                        </h2>
                    </div>
                    <p className="text-base text-slate-500 mt-1">
                        {filteredItems.length} wishlisted vehicles
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-[280px] sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search wishlists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-white rounded-xl w-full"
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={fetching || isRefetching}
                        className="h-10 w-10 bg-white rounded-xl shrink-0"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${fetching || isRefetching ? "animate-spin" : ""}`}
                        />
                    </Button>
                </div>
            </div>

            <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-0 overflow-x-auto">
                    <Table className="min-w-[900px]">
                        <TableHeader className="bg-black border-b border-black">
                            <TableRow className="bg-black hover:bg-black border-none">
                                <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                                    Sr No
                                </TableHead>
                                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                                    Customer
                                </TableHead>
                                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                                    Email
                                </TableHead>
                                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                                    Phone
                                </TableHead>
                                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                                    Vehicle
                                </TableHead>
                                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                                    Saved Date
                                </TableHead>
                                <TableHead className="text-right text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">
                                    Contact
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fetching ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <TableRow
                                        key={`skeleton-${idx}`}
                                        className="border-b border-slate-100/80 last:border-none"
                                    >
                                        <TableCell className="w-16 text-center py-4">
                                            <Skeleton className="h-4 w-4 mx-auto" />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Skeleton className="h-4 w-28" />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Skeleton className="h-4 w-32" />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Skeleton className="h-4 w-36" />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell className="text-right py-4 pr-6">
                                            <div className="flex gap-1.5 justify-end">
                                                <Skeleton className="h-8 w-8 rounded-lg" />
                                                <Skeleton className="h-8 w-8 rounded-lg" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center py-12 text-muted-foreground font-medium"
                                    >
                                        {searchQuery
                                            ? "No matching wishlisted vehicles found."
                                            : "No wishlisted vehicles found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredItems.map((item, idx) => (
                                    <TableRow
                                        key={`${item.customerId}-${item.vehicleId}-${idx}`}
                                        className="hover:bg-slate-100 transition-colors border-b border-slate-200 last:border-none"
                                    >
                                        <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell className="font-semibold capitalize text-slate-900 text-left text-sm py-4">
                                            {item.customerName}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500 text-left py-4">
                                            {item.customerEmail}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500 text-left py-4">
                                            {item.customerPhone}
                                        </TableCell>
                                        <TableCell className="text-sm  capitalize font-medium text-slate-600 truncate max-w-[240px] text-left py-4">
                                            {item.vehicleName}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-400 text-left py-4">
                                            {formatDate(item.addedAt)}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-400 text-left py-4">
                                            {item.customerPhone}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
