import { useEffect, useState } from "react";
import { getAllUsers, User } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <FadeIn>
        <Card className="max-w-5xl mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-8 text-black">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full mb-4" />
            ) : (
              <div className="overflow-x-auto">
                <Table className="text-black border rounded-md">
                  <TableHeader className="text-black">
                    <TableRow className="text-black">
                      <TableHead className="text-black">Email</TableHead>
                      <TableHead className="text-black">Full Name</TableHead>
                      <TableHead className="text-black">City</TableHead>
                      <TableHead className="text-black">Phone</TableHead>
                      <TableHead className="text-black">Role</TableHead>
                      <TableHead className="text-black">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-black">
                    {users.map((user) => (
                      <TableRow key={user.id} className="text-black">
                        <TableCell className="text-black">{user.email}</TableCell>
                        <TableCell className="text-black">{user.full_name || "-"}</TableCell>
                        <TableCell className="text-black">{user.city || "-"}</TableCell>
                        <TableCell className="text-black">{user.phone || "-"}</TableCell>
                        <TableCell className="text-black">{user.role || "-"}</TableCell>
                        <TableCell className="text-black">{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <Button className="mt-6 bg-pink-600 text-white hover:bg-pink-700" variant="outline" onClick={() => navigate(-1)}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

export default AdminUsers; 