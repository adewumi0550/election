import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Voter } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface VoterManagementProps {
    voters: Voter[];
    addVoterAction: (formData: FormData) => Promise<void>;
    deleteVoterAction: (formData: FormData) => Promise<void>;
}

export default function VoterManagement({ voters, addVoterAction, deleteVoterAction }: VoterManagementProps) {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Voter Roll</CardTitle>
                <CardDescription>
                    Manage the list of eligible voters for this election.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">Add New Voter</h3>
                    <form action={addVoterAction} className="flex items-end gap-4">
                        <div className="flex-1">
                            <Label htmlFor="name">Voter Name</Label>
                            <Input id="name" name="name" required />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="email">Voter Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                        <Button type="submit">Add Voter</Button>
                    </form>
                </div>

                <div>
                     <h3 className="text-lg font-medium mb-2">Registered Voters ({voters.length})</h3>
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {voters.length > 0 ? voters.map(voter => (
                                    <TableRow key={voter.id}>
                                        <TableCell>{voter.name}</TableCell>
                                        <TableCell>{voter.email}</TableCell>
                                        <TableCell className="text-right">
                                            <form action={deleteVoterAction}>
                                                <input type="hidden" name="id" value={voter.id} />
                                                <Button type="submit" variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No voters added yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
