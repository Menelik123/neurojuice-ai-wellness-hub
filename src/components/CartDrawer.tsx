import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, subtotal, isDrawerOpen, setDrawerOpen, clearCart } = useCart();

  const getItemTotal = (item: typeof items[0]) => {
    let price = item.unitPrice * item.quantity;
    if (item.addSeaMoss && item.type === "single") price += 1.0 * item.quantity;
    if (item.seaMossCount) price += 1.0 * item.seaMossCount;
    return price;
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center">Your cart is empty.<br />Add some juices to get started!</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{item.name}</h4>
                    {item.type === "bundle" && item.selectedDrinks && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.selectedDrinks.join(", ")}
                      </p>
                    )}
                    {item.addSeaMoss && item.type === "single" && (
                      <p className="text-xs text-primary">+ Sea Moss Shot</p>
                    )}
                    {item.type === "bundle" && item.seaMossCount && item.seaMossCount > 0 && (
                      <p className="text-xs text-primary">+ {item.seaMossCount} Sea Moss Shot{item.seaMossCount > 1 ? "s" : ""}</p>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {item.type === "single" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                  )}
                  <span className="font-semibold text-foreground">${getItemTotal(item).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-3 border-t border-border pt-4">
            <div className="flex justify-between w-full text-lg font-heading font-bold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full h-12 font-semibold" size="lg" disabled>
              Checkout — ${subtotal.toFixed(2)}
            </Button>
            <p className="text-xs text-muted-foreground text-center">Stripe checkout coming soon</p>
            <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition-colors underline">
              Clear Cart
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
