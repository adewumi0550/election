
import ManifestoForm from './manifesto-form';
import { getOffices } from '@/lib/actions';

export default async function ManifestoWriterPage() {
    const offices = await getOffices();
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">AI Manifesto Writer</h1>
                    <p className="text-muted-foreground mt-2">
                        Generate a compelling manifesto for a candidate using AI.
                        Provide the candidate&apos;s name and the office they are running for.
                    </p>
                </div>
                <ManifestoForm offices={offices} />
            </div>
        </div>
    );
}
