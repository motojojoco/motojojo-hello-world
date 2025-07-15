import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardYellowContainer } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { getEventTypes, EventType } from "@/services/eventTypeService";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  long_description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  image: z.string().min(1, "Image URL is required"),
  category: z.string().min(1, "Category is required"),
  event_type: z.string().optional(),
  host: z.string().optional(),
  is_published: z.boolean().default(true),
  has_discount: z.boolean().default(false),
  real_price: z.number().nullable().optional(),
  discounted_price: z.number().nullable().optional(),
  base_price: z.number().min(0, "Base price must be non-negative"),
  gst: z.number().min(0, "GST must be non-negative"),
  convenience_fee: z.number().min(0, "Convenience fee must be non-negative"),
  subtotal: z.number().min(0, "Subtotal must be non-negative"),
  ticket_price: z.number().min(0, "Ticket price must be non-negative"),
});

type EventFormData = z.infer<typeof formSchema>;

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  isEditing?: boolean;
}

export default function EventForm({ initialData, onSubmit, isEditing = false }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: eventTypes = [] } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: getEventTypes
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      description: initialData?.description || "",
      long_description: initialData?.long_description || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      duration: initialData?.duration || "",
      venue: initialData?.venue || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      price: initialData?.price || 0,
      image: initialData?.image || "",
      category: initialData?.category || "",
      event_type: initialData?.event_type || "",
      host: initialData?.host || "",
      is_published: initialData?.is_published ?? true,
      has_discount: initialData?.has_discount ?? false,
      real_price: initialData?.real_price ?? null,
      discounted_price: initialData?.discounted_price ?? null,
      base_price: initialData?.base_price || 0,
      gst: initialData?.gst || 0,
      convenience_fee: initialData?.convenience_fee || 0,
      subtotal: initialData?.subtotal || 0,
      ticket_price: initialData?.ticket_price || 0,
    },
  });

  const handleSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: `Event ${isEditing ? "updated" : "created"} successfully!`,
        description: `The event "${data.title}" has been ${isEditing ? "updated" : "created"}.`,
      });
      if (!isEditing) {
        form.reset(); // Reset form after successful creation
      }
    } catch (error: any) {
      console.error("Error submitting event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardYellowContainer>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="long_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Image</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              // Upload to Supabase Storage
                              const fileExt = file.name.split('.').pop();
                              const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                              const { data, error } = await supabase.storage
                                .from('event-images')
                                .upload(fileName, file, {
                                  cacheControl: '3600',
                                  upsert: false
                                });
                              if (error) {
                                toast({
                                  title: 'Image Upload Failed',
                                  description: error.message,
                                  variant: 'destructive',
                                });
                                return;
                              }
                              // Get public URL
                              const { data: publicUrlData } = supabase.storage
                                .from('event-images')
                                .getPublicUrl(data.path);
                              if (publicUrlData?.publicUrl) {
                                field.onChange(publicUrlData.publicUrl);
                                toast({
                                  title: 'Image Uploaded',
                                  description: 'Image uploaded successfully!',
                                });
                              }
                            }}
                          />
                          {field.value && (
                            <img src={field.value} alt="Event" className="mt-2 max-h-32 rounded" />
                          )}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event type" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_discount"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Event has discount?</FormLabel>
                      <FormControl>
                        <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("has_discount") && (
                  <>
                    <FormField
                      control={form.control}
                      name="real_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Real Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discounted_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discounted Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={1} {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={1} {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convenience_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Convenience Fee</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={1} {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtotal</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={1} {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ticket_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Price</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={1} {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CardYellowContainer>
  );
}
