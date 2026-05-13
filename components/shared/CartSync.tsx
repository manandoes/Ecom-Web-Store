"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { getServerCartAction } from "@/lib/actions/cart";

export function CartSync() {
  const { data: session, status } = useSession();
  const { items, clearCart, addItem } = useCartStore();

  useEffect(() => {
    if (status === "authenticated") {
      // Sync from server to client on initial load
      getServerCartAction().then((serverCart) => {
        if (serverCart && serverCart.items) {
          clearCart();
          serverCart.items.forEach((item: any) => {
            addItem({
              id: item.variant.id,
              variantId: item.variant.id,
              productName: item.variant.product.name,
              variantName: item.variant.name,
              unitPrice: item.variant.price,
              quantity: item.quantity,
              imageUrl: item.variant.product.images?.[0]?.url || "",
              stockQty: item.variant.stock,
              slug: item.variant.product.slug || "",
            });
          });
        }
      }).catch(console.error);
    } else if (status === "unauthenticated") {
      // User logged out, clear cart if we want strict security
      // clearCart();
    }
  }, [status]); // Only run on auth status change

  return null;
}
