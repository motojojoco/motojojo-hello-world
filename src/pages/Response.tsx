import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProtectedRoute from "@/components/ProtectedRoute";

function toCSV(data, columns) {
  const header = columns.join(",");
  const rows = data.map(row => columns.map(col => JSON.stringify(row[col] ?? "")).join(","));
  return [header, ...rows].join("\n");
}

const Response = () => {
  const [memberResponses, setMemberResponses] = useState([]);
  const [gangResponses, setGangResponses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'member' or 'gang'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data: members, error: memberError } = await supabase
          .from("motojojo_members")
          .select("*")
          .order("created_at", { ascending: false });
        const { data: gangs, error: gangError } = await supabase
          .from("jojo_gang_members")
          .select("*")
          .order("created_at", { ascending: false });
        if (memberError || gangError) throw memberError || gangError;
        setMemberResponses(members || []);
        setGangResponses(gangs || []);
      } catch (err) {
        setError("Failed to fetch responses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real-time subscription for motojojo_members
  useEffect(() => {
    const memberSub = supabase
      .channel('realtime-motojojo_members')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'motojojo_members' }, (payload) => {
        setMemberResponses((prev) => [payload.new, ...prev]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(memberSub);
    };
  }, []);

  // Real-time subscription for jojo_gang_members
  useEffect(() => {
    const gangSub = supabase
      .channel('realtime-jojo_gang_members')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jojo_gang_members' }, (payload) => {
        setGangResponses((prev) => [payload.new, ...prev]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(gangSub);
    };
  }, []);

  const handleDownload = (type) => {
    let data, columns, filename;
    if (type === 'member') {
      data = memberResponses;
      columns = [
        "name","identify_as","identify_as_other","phone_number","birthday","city","area_and_pincode","social_handles","mood","mood_other","group_role","group_role_other","interests","art_inspiration","been_to_gathering","how_found_us","how_found_us_other","why_join_community","created_at"
      ];
      filename = "motojojo_members_responses.csv";
    } else {
      data = gangResponses;
      columns = [
        "name","email","phone_number","age","city","area_pincode","instagram_link","attended_gathering","position","additional_info","created_at"
      ];
      filename = "jojo_gang_members_responses.csv";
    }
    const csv = toCSV(data, columns);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading responses...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-raspberry p-8"> {/* Changed to solid red background */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow mb-8 text-center">All Community Responses</h1> {/* Yellow heading */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-yellow flex items-center justify-between"> {/* Yellow title */}
                Motojojo Member Names
                <Button size="sm" className="bg-yellow text-black ml-4" onClick={() => handleDownload('member')}>Download CSV</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {memberResponses.length === 0 ? (
                <div className="text-gray-500">No responses yet.</div>
              ) : (
                <ul className="space-y-2">
                  {memberResponses.map((r: any, i: number) => (
                    <li key={r.id || i}>
                      <button className="text-left text-yellow font-semibold hover:underline" onClick={() => { setSelected(r); setDialogType('member'); }}>{r.name}</button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-yellow flex items-center justify-between"> {/* Yellow title */}
                JoJo Gang Names
                <Button size="sm" className="bg-yellow text-black ml-4" onClick={() => handleDownload('gang')}>Download CSV</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gangResponses.length === 0 ? (
                <div className="text-gray-500">No responses yet.</div>
              ) : (
                <ul className="space-y-2">
                  {gangResponses.map((r: any, i: number) => (
                    <li key={r.id || i}>
                      <button className="text-left text-yellow font-semibold hover:underline" onClick={() => { setSelected(r); setDialogType('gang'); }}>{r.name}</button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Dialog for details */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            {selected && dialogType === 'member' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-yellow">{selected.name}</DialogTitle>
                  <DialogDescription className="text-yellow">Motojojo Member Details</DialogDescription>
                </DialogHeader>
                <div className="space-y-1 mt-2">
                  <div><b>Phone:</b> {selected.phone_number}</div>
                  <div><b>Birthday:</b> {selected.birthday}</div>
                  <div><b>City:</b> {selected.city}</div>
                  <div><b>Area & Pincode:</b> {selected.area_and_pincode}</div>
                  <div><b>Social Handles:</b> {selected.social_handles}</div>
                  <div><b>Identify As:</b> {selected.identify_as} {selected.identify_as_other && `(${selected.identify_as_other})`}</div>
                  <div><b>Mood:</b> {selected.mood} {selected.mood_other && `(${selected.mood_other})`}</div>
                  <div><b>Group Role:</b> {selected.group_role} {selected.group_role_other && `(${selected.group_role_other})`}</div>
                  <div><b>Interests:</b> {selected.interests}</div>
                  <div><b>Art Inspiration:</b> {selected.art_inspiration}</div>
                  <div><b>Been to Gathering:</b> {selected.been_to_gathering}</div>
                  <div><b>How Found Us:</b> {selected.how_found_us} {selected.how_found_us_other && `(${selected.how_found_us_other})`}</div>
                  <div><b>Why Join:</b> {selected.why_join_community}</div>
                  <div className="text-xs text-gray-400 mt-1"><b>Submitted:</b> {new Date(selected.created_at).toLocaleString()}</div>
                </div>
              </>
            )}
            {selected && dialogType === 'gang' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-yellow">{selected.name}</DialogTitle>
                  <DialogDescription className="text-yellow">JoJo Gang Details</DialogDescription>
                </DialogHeader>
                <div className="space-y-1 mt-2">
                  <div><b>Email:</b> {selected.email}</div>
                  <div><b>Phone:</b> {selected.phone_number}</div>
                  <div><b>Age:</b> {selected.age}</div>
                  <div><b>City:</b> {selected.city}</div>
                  <div><b>Area Pincode:</b> {selected.area_pincode}</div>
                  <div><b>Instagram:</b> {selected.instagram_link}</div>
                  <div><b>Attended Gathering:</b> {selected.attended_gathering}</div>
                  <div><b>Position:</b> {selected.position}</div>
                  <div><b>Additional Info:</b> {selected.additional_info}</div>
                  <div className="text-xs text-gray-400 mt-1"><b>Submitted:</b> {new Date(selected.created_at).toLocaleString()}</div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default function ResponseProtected() {
  return (
    <ProtectedRoute adminOnly>
      <Response />
    </ProtectedRoute>
  );
} 