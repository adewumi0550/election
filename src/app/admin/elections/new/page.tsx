import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ElectionForm from '../election-form';
import { createElection } from '@/lib/data';

export default function NewElectionPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Election</CardTitle>
                        <CardDescription>
                            Define the details for a new election. You can add candidates and voters after creating it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ElectionForm action={createElection} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
