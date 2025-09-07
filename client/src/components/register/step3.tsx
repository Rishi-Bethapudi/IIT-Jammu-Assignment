import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Step3Props {
  formData: any;
  errors: any;
  isLoading: boolean;
  handleInputChange: (field: string, value: boolean) => void;
}

const Step3: React.FC<Step3Props> = ({
  formData,
  errors,
  isLoading,
  handleInputChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Terms */}
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={formData.agreesToTerms}
          onCheckedChange={(checked) =>
            handleInputChange('agreesToTerms', checked as boolean)
          }
          disabled={isLoading}
        />
        <div className="grid gap-1.5 leading-none">
          <Label>I agree to the Terms and Conditions</Label>
          <p className="text-xs text-muted-foreground">
            By checking this box, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            ,{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            , and{' '}
            <Link to="/refund" className="text-primary hover:underline">
              Refund Policy
            </Link>
            .
          </p>
          {errors.agreesToTerms && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" />
              {errors.agreesToTerms}
            </p>
          )}
        </div>
      </div>

      {/* Marketing */}
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={formData.agreesToMarketing}
          onCheckedChange={(checked) =>
            handleInputChange('agreesToMarketing', checked as boolean)
          }
          disabled={isLoading}
        />
        <div className="grid gap-1.5 leading-none">
          <Label>Marketing Communications (Optional)</Label>
          <p className="text-xs text-muted-foreground">
            I would like to receive emails about special offers, new products,
            and seasonal vegetables. You can unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Account Summary</h4>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            <strong>Name:</strong> {formData.firstName} {formData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>
          <p>
            <strong>City:</strong> {formData.city}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3;
