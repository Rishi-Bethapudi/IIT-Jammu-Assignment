import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  formData: {
    name: string;
    email: string;
    address: string;
    confirmOrder: boolean;
  };
  errors: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function CheckoutForm({
  formData,
  errors,
  setFormData,
  isSubmitting,
}: Props) {
  return (
    <form className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, name: e.target.value }))
            }
            className={errors.name ? 'border-destructive' : ''}
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
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, email: e.target.value }))
            }
            className={errors.email ? 'border-destructive' : ''}
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
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, address: e.target.value }))
          }
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-start space-x-2 pt-4">
        <Checkbox
          id="confirm"
          checked={formData.confirmOrder}
          onCheckedChange={(checked) =>
            setFormData((prev: any) => ({
              ...prev,
              confirmOrder: checked === true,
            }))
          }
          className={errors.confirmOrder ? 'border-destructive' : ''}
          disabled={isSubmitting}
        />
        <Label htmlFor="confirm" className="text-sm leading-5 cursor-pointer">
          I confirm my order and authorize payment
        </Label>
      </div>
      {errors.confirmOrder && (
        <p className="text-sm text-destructive ml-6">{errors.confirmOrder}</p>
      )}
    </form>
  );
}
