
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const costEstimationSchema = z.object({
  estimatedCost: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    { message: "Please enter a valid cost amount" }
  ),
  currency: z.string().min(1, { message: "Please select a currency" }),
  details: z.string().optional(),
});

type CostEstimationValues = z.infer<typeof costEstimationSchema>;

interface LeadCostEstimationProps {
  initialCost?: string;
  onUpdate?: (data: CostEstimationValues) => void;
  readOnly?: boolean;
}

export function LeadCostEstimation({ 
  initialCost = "", 
  onUpdate,
  readOnly = false 
}: LeadCostEstimationProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const defaultValues: Partial<CostEstimationValues> = {
    estimatedCost: initialCost,
    currency: "USD",
    details: "",
  };

  const form = useForm<CostEstimationValues>({
    resolver: zodResolver(costEstimationSchema),
    defaultValues,
  });

  function onSubmit(data: CostEstimationValues) {
    if (readOnly) return;
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Cost estimation updated:", data);
      setIsUpdating(false);
      
      if (onUpdate) {
        onUpdate(data);
      }
    }, 1000);
  }

  const formatCurrency = (value: string, currency: string) => {
    if (!value) return "";
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  const displayCost = formatCurrency(
    form.watch("estimatedCost") || "0", 
    form.watch("currency") || "USD"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimated Cost</CardTitle>
        <CardDescription>
          {readOnly 
            ? "Current estimated cost for this lead's requirements" 
            : "Provide an estimated cost for this lead's requirements"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {readOnly && initialCost ? (
          <div className="space-y-4">
            <div className="text-2xl font-bold">{displayCost}</div>
            <p className="text-sm text-gray-500">
              This estimation is based on the current understanding of the lead's requirements.
              The estimation can be updated as more information becomes available.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estimatedCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Cost</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="5000" 
                          {...field}
                          disabled={readOnly} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="USD" 
                          {...field} 
                          disabled={readOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about this cost estimation..."
                        className="resize-none"
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!readOnly && (
                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Estimation"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
