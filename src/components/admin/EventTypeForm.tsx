import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  image_url: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().min(0, "Sort order must be non-negative"),
  deletable: z.boolean().default(true),
});

type EventTypeFormData = z.infer<typeof formSchema>;

interface EventTypeFormProps {
  initialData?: Partial<EventTypeFormData>;
  onSubmit: (data: EventTypeFormData) => Promise<void>;
  isEditing?: boolean;
}

export default function EventTypeForm({ initialData, onSubmit, isEditing = false }: EventTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      icon: initialData?.icon || "",
      image_url: initialData?.image_url || "",
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
      sort_order: initialData?.sort_order || 0,
      deletable: initialData?.deletable ?? true,
    },
  });

  const handleImageUrlChange = (url: string) => {
    form.setValue("image_url", url);
    setImagePreview(url);
  };

  const handleSubmit = async (data: EventTypeFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: `Event Type ${isEditing ? "updated" : "created"} successfully!`,
        description: `The event type "${data.name}" has been ${isEditing ? "updated" : "created"}.`,
      });
      if (!isEditing) {
        form.reset();
        setImagePreview(null);
      }
    } catch (error: any) {
      console.error("Error submitting event type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit the event type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event type name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Emoji)</FormLabel>
                    <FormControl>
                      <Input placeholder="🎵" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
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
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show this event type to users
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter event type description" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            form.setValue("image_url", "");
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Event type preview"
                            className="w-full h-48 object-cover rounded-lg border"
                            onError={() => {
                              toast({
                                title: "Image Error",
                                description: "Failed to load the image. Please check the URL.",
                                variant: "destructive",
                              });
                            }}
                          />
                        </div>
                      )}
                      
                      {!imagePreview && (
                        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No image preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : isEditing ? "Update Event Type" : "Create Event Type"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 