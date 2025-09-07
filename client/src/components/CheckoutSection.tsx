"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ReceiptText, 
  Package, 
  CreditCard, 
  ShoppingCart, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle, 
  Clock, 
  MailWarning,
  Check,
  Download,
  MailCheck
} from "lucide-react";
import { clearCart } from "@/store/cartSlice";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  confirmOrder: boolean;
}

interface OrderResponse {
  success: boolean;
  orderId: string;
  downloadUrl?: string;
  downloadToken?: string;
  error?: string;
}

export default function CheckoutSection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart.items);
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    confirmOrder: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    total: number;
    date: string;
    downloadUrl?: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const delivery = subtotal > 50 ? 0 : 5.99; // Free delivery over $50
  const total = subtotal + tax + delivery;

  useEffect(() => {
    // Redirect if cart is empty
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    // Redirect if not authenticated
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
  }, [cart, token, router]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Dispatch Redux action to update cart
    // This would typically be handled by a updateCartItem action
    // For now, we'll show it's read-only by default as mentioned in requirements
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.confirmOrder) {
      newErrors.confirmOrder = "Please confirm your order to proceed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id,
        items: cart.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totals: {
          subtotal,
          tax,
          delivery,
          total,
        },
        contactInfo: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
        },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const result: OrderResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      if (result.success) {
        // Clear cart and show success
        dispatch(clearCart());
        
        setOrderDetails({
          orderId: result.orderId,
          total,
          date: new Date().toLocaleDateString(),
          downloadUrl: result.downloadUrl,
        });

        setOrderComplete(true);
        toast.success("Order placed successfully!");
      } else {
        throw new Error(result.error || "Order placement failed");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes("unauthorized") || error.message.includes("token")) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
        } else if (error.message.includes("email")) {
          toast.error("Failed to send receipt email. Order was saved, but please contact support.");
        } else if (error.message.includes("pdf")) {
          toast.error("Failed to generate receipt. Order was saved, but receipt may be delayed.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!orderDetails?.downloadUrl) {
      toast.error("Receipt download not available");
      return;
    }

    try {
      // Create a temporary link to download the PDF
      const link = document.createElement("a");
      link.href = orderDetails.downloadUrl;
      link.download = `receipt-${orderDetails.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      toast.error("Failed to download receipt");
    }
  };

  const handleRetry = () => {
    setIsSubmitting(false);
    setErrors({});
  };

  if (orderComplete && orderDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-card border border-border">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Order Confirmed!
            </CardTitle>
            <p className="text-muted-foreground">
              Thank you for your order. Your receipt has been sent to your email.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Number:</span>
                <span className="font-mono text-primary">#{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Date:</span>
                <span>{orderDetails.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {orderDetails.downloadUrl && (
                <Button
                  onClick={handleDownloadReceipt}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Receipt
                </Button>
              )}
              
              <Button
                onClick={() => router.push("/vegetables")}
                variant="outline"
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Back to Vegetables
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 inline mr-2" />
              A confirmation email has been sent to {formData.email}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-card border border-border">
          <CardContent className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing your order...</h3>
            <p className="text-muted-foreground">
              Sending receipt and confirming your order
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Order Review */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5" />
            Order Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Qty:</span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Information Form */}
        <Card className="lg:col-span-2 bg-card border border-border">
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address (Optional)</Label>
                <Input
                  id="address"
                  placeholder="Street address for delivery"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="confirm"
                  checked={formData.confirmOrder}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, confirmOrder: checked === true }))
                  }
                  className={errors.confirmOrder ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                <Label 
                  htmlFor="confirm" 
                  className="text-sm leading-5 cursor-pointer"
                >
                  I confirm my order and authorize payment
                </Label>
              </div>
              {errors.confirmOrder && (
                <p className="text-sm text-destructive ml-6">{errors.confirmOrder}</p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-card border border-border h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}</span>
              </div>
              {delivery === 0 && (
                <p className="text-xs text-green-600">Free delivery on orders over $50!</p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Place Order
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.push("/cart")}
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2">
              <Mail className="w-3 h-3 inline mr-1" />
              Receipt will be emailed after payment
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}