import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Download, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OrderDetails {
  orderId: string;
  total: number;
  date: string;
  downloadUrl?: string;
}

interface Props {
  orderDetails: OrderDetails;
  customerEmail: string;
  onBack: () => void;
}

export default function CheckoutSuccess({
  orderDetails,
  customerEmail,
}: Props) {
  const navigate = useNavigate();

  const handleDownloadReceipt = async () => {
    if (!orderDetails?.downloadUrl) {
      toast.error('Receipt download not available');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = orderDetails.downloadUrl;
      link.download = `receipt-${orderDetails.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Receipt downloaded successfully');
    } catch {
      toast.error('Failed to download receipt');
    }
  };

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
              <span className="font-mono text-primary">
                #{orderDetails.orderId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Date:</span>
              <span>{orderDetails.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-bold">
                ${orderDetails.total.toFixed(2)}
              </span>
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
              onClick={() => navigate('/vegetables')}
              variant="outline"
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Back to Vegetables
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <Mail className="w-4 h-4 inline mr-2" />A confirmation email has
            been sent to {customerEmail}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
