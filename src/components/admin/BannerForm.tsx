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
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  image_url: z.string().min(1, "Image URL is required"),
  link_url: z.string().optional(),
  link_text: z.string().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().min(0, "Sort order must be non-negative"),
});

type BannerFormData = z.infer<typeof formSchema>;

interface BannerFormProps {
  initialData?: Partial<BannerFormData>;
  onSubmit: (data: BannerFormData) => Promise<void>;
  isEditing?: boolean;
}

export default function BannerForm({ initialData, onSubmit, isEditing = false }: BannerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      image_url: initialData?.image_url || "",
      link_url: initialData?.link_url || "",
      link_text: initialData?.link_text || "",
      is_active: initialData?.is_active ?? true,
      sort_order: initialData?.sort_order || 0,
    },
  });

  const handleImageUrlChange = (url: string) => {
    form.setValue("image_url", url);
    setImagePreview(url);
  };

  const handleSubmit = async (data: BannerFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: `Banner ${isEditing ? "updated" : "created"} successfully!`,
        description: `The banner "${data.title}" has been ${isEditing ? "updated" : "created"}.`,
      });
      if (!isEditing) {
        form.reset();
        setImagePreview(null);
      }
    } catch (error: any) {
      console.error("Error submitting banner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit the banner. Please try again.",
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner title" {...field} />
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
                name="link_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/events or https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Explore Events" {...field} />
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
                        Show this banner to users
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
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter banner subtitle" 
                      className="min-h-[80px]"
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
                          placeholder="https://example.com/banner-image.jpg" 
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
                            alt="Banner preview"
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
              {isSubmitting ? "Saving..." : isEditing ? "Update Banner" : "Create Banner"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 