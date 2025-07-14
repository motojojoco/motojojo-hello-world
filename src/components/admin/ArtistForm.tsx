
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";

interface ArtistFormProps {
  onCreated?: () => void;
}

const ArtistForm = ({ onCreated }: ArtistFormProps) => {
  // const { toast } = useToast();
  // const [name, setName] = useState("");
  // const [profile, setProfile] = useState("");
  // const [genre, setGenre] = useState("");
  // const [image, setImage] = useState("");
  // const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!name || !profile || !genre) {
  //     toast({
  //       title: "Missing Fields",
  //       description: "Please fill out all required fields.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
    
  //   setLoading(true);
    
  //   try {
  //     const { data, error } = await supabase
  //       .from("artists")
  //       .insert([{ 
  //         name, 
  //         profile, 
  //         genre, 
  //         image: image || null 
  //       }])
  //       .select();
        
  //     if (error) throw error;
      
  //     toast({
  //       title: "Artist Added",
  //       description: `${name} was added successfully to featured artists.`,
  //     });
      
  //     // Reset form
  //     setName("");
  //     setProfile("");
  //     setGenre("");
  //     setImage("");
      
  //     // Call callback if provided
  //     if (onCreated) onCreated();
      
  //   } catch (error: any) {
  //     console.error("Error creating artist:", error);
  //     toast({
  //       title: "Error",
  //       description: `Failed to create artist: ${error.message}`,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. AR Rahman"
            />
          </div>
          <div>
            <Label>Profile</Label>
            <Input
              value={profile}
              onChange={e => setProfile(e.target.value)}
              required
              placeholder="e.g. Oscar-winning music composer"
            />
          </div>
          <div>
            <Label>Type/Genre</Label>
            <Input
              value={genre}
              onChange={e => setGenre(e.target.value)}
              required
              placeholder="e.g. Playback Singer"
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={image}
              onChange={e => setImage(e.target.value)}
              type="url"
              placeholder="Image URL (optional)"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Artist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default ArtistForm;
