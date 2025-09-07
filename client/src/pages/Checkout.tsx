import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { clearCart } from '@/store/cartSlice';

import CheckoutReview from '../components/checkout/CheckoutReview';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import CheckoutSuccess from '../components/checkout/CheckoutSuccess';
import CheckoutLoading from '../components/checkout/CheckoutLoading';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart.items);
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
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
  const subtotal = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const delivery = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + delivery;

  useEffect(() => {
    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
  }, [cart, token, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.confirmOrder) {
      newErrors.confirmOrder = 'Please confirm your order to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors below');
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
        totals: { subtotal, tax, delivery, total },
        contactInfo: formData,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const result: OrderResponse = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Failed to place order');

      if (result.success) {
        dispatch(clearCart());
        setOrderDetails({
          orderId: result.orderId,
          total,
          date: new Date().toLocaleDateString(),
          downloadUrl: result.downloadUrl,
        });
        setOrderComplete(true);
        toast.success('Order placed successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Order submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete && orderDetails) {
    return (
      <CheckoutSuccess
        orderDetails={orderDetails}
        customerEmail={formData.email}
        onBack={() => navigate('/vegetables')}
      />
    );
  }

  if (isSubmitting) {
    return <CheckoutLoading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <CheckoutReview cart={cart} />
      <div className="grid lg:grid-cols-3 gap-6">
        <CheckoutForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
        <CheckoutSummary
          subtotal={subtotal}
          tax={tax}
          delivery={delivery}
          total={total}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onBack={() => navigate('/cart')}
        />
      </div>
    </div>
  );
}
