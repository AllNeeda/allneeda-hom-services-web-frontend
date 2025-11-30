import * as React from "react";
import OrderClient from "@/components/it-services/clients/order/order-client"

export async function generateStaticParams() {
  // Return sample order IDs for static generation
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'sample-order' }
  ];
}

export default async function OrderWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <OrderClient params={{ id }} />
  )
}