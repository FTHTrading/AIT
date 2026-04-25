import { AITDisclaimerBlock } from '@/components/ait-biofield';

export default function AITDisclaimerPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">AIT Disclaimer</h1>
        <p className="text-sm text-gray-300 mt-2">Reference-only statement set for legal, clinical, regulatory, and financing boundaries.</p>
      </section>
      <AITDisclaimerBlock />
    </div>
  );
}
