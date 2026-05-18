import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  type: "single" | "bundle" | "sea-moss-shot";
  quantity: number;
  unitPrice: number;
  addSeaMoss: boolean;
  bundleBottles?: number;
  selectedDrinks?: string[];
  seaMossCount?: number; // for bundles
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("nj_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("nj_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Check for existing same item (same id, same addSeaMoss)
      const key = `${item.id}-${item.addSeaMoss}-${item.selectedDrinks?.join(",") || ""}`;
      const existingIndex = prev.findIndex((i) => {
        const existingKey = `${i.id}-${i.addSeaMoss}-${i.selectedDrinks?.join(",") || ""}`;
        return existingKey === key;
      });
      if (existingIndex >= 0 && item.type === "single") {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, { ...item, id: `${item.id}-${Date.now()}` }];
    });
    setDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = items.reduce((sum, i) => {
    let price = i.unitPrice * i.quantity;
    if (i.addSeaMoss && i.type === "single") price += 1.0 * i.quantity;
    if (i.seaMossCount) price += 1.0 * i.seaMossCount;
    return sum + price;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, isDrawerOpen, setDrawerOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};
