import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const DesignNotes: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to App
        </Link>

        <article className="prose prose-blue max-w-none text-gray-700">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              CrisisKit Lite – Design Notes
            </h1>
            <p className="text-xl text-gray-500 font-light">
              How a real-world disaster inspired a tiny but resilient crisis-information tool.
            </p>
          </header>

          <div className="border-t border-gray-200 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Background: Grassroots Tech in Real Emergencies</h2>
            <p>
              In late 2025, during a major residential fire in Taipo (Hong Kong), thousands of people scrambled for information, safety updates, and help. While official channels were slow, <strong>ordinary citizens self-organized</strong> using:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Google Forms</li>
              <li>Google Sheets</li>
              <li>WhatsApp broadcasts</li>
              <li>Telegram groups</li>
              <li>Crowdsourced location notes</li>
              <li>Volunteers manually verifying each submission</li>
            </ul>
            <p>
              The tools were fragmented, improvised, and often messy—but they worked far better than expected.
            </p>
            <blockquote className="border-l-4 border-primary-500 pl-4 italic bg-gray-50 py-2 pr-4 rounded-r my-6">
              Because in a crisis, <strong>speed beats perfection</strong>.
            </blockquote>
            <p>
              What stood out was not the sophistication of the tools, but the <strong>incredible resilience of low-tech, human-centered systems</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>They required no installation</li>
              <li>They worked across all devices</li>
              <li>Everyone already knew how to use them</li>
              <li>Updates synchronized instantly</li>
              <li>Sheets naturally supported collaboration</li>
              <li>Volunteers could step in without training</li>
            </ul>
            <p>
              This grassroots “stack” became the lifeline for hundreds of people.
            </p>
            <p>
              CrisisKit Lite is a tribute to that spirit. It’s not trying to replace official emergency platforms. It’s trying to <strong>amplify what communities are already doing</strong>.
            </p>
          </div>

          <div className="border-t border-gray-200 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Crisis UX: What People Need When the World is Burning</h2>
            <p>
              Disaster UX is fundamentally different from normal UX. When people are stressed, scared, or managing chaos, <strong>cognitive load skyrockets</strong> and the brain shifts to survival mode. This changes how humans interact with systems:
            </p>
            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 flex items-center mb-2"><span className="mr-2">🧨</span> 1. No clutter</h3>
                    <p className="text-sm">Crisis users have almost no working memory available. Every extra button, color, or icon becomes noise.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 flex items-center mb-2"><span className="mr-2">⏱</span> 2. Time-to-action &lt; 5s</h3>
                    <p className="text-sm">If someone can’t create a form immediately, they’ll abandon the process entirely.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 flex items-center mb-2"><span className="mr-2">📱</span> 3. Mobile-first</h3>
                    <p className="text-sm">Most crisis communication happens on phones — on stairs, in streets, in shelters.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 flex items-center mb-2"><span className="mr-2">🔊</span> 4. Broadcast-friendly</h3>
                    <p className="text-sm">Links will be shared through WhatsApp groups, voice notes, and screenshot chains.</p>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 flex items-center mb-2"><span className="mr-2">🧩</span> 5. Minimal inputs</h3>
                    <p className="text-sm">Complex forms fail. Short, descriptive fields succeed. Inputs must be minimal and unambiguous.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 flex items-center mb-2"><span className="mr-2">🧭</span> 6. Structure, not complexity</h3>
                    <p className="text-sm">Volunteers don’t need an enterprise dashboard. They need a list, urgency levels, and clear next steps.</p>
                </div>
            </div>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-900 flex items-center mb-2"><span className="mr-2">🧘</span> 7. Emotional safety matters</h3>
                <p className="text-sm text-blue-800">A “Thank you, we’ve received your situation” message reduces panic. It’s small but vital.</p>
            </div>
            <p className="mt-4">CrisisKit Lite follows these principles by design.</p>
          </div>

          <div className="border-t border-gray-200 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Why Google Sheets? (The Case for Low-Tech Resilience)</h2>
            <p>
              Most engineers default to databases like Supabase, PostgreSQL, or Firebase. But real-world crisis systems often need something very different:
            </p>
            <ul className="list-disc pl-5 space-y-4 mb-6">
              <li>
                <strong>People already know Sheets.</strong> No training. No onboarding. Every neighborhood volunteer understands sorting, filtering, copying, exporting, and simple formulas.
              </li>
              <li>
                <strong>Sheets are collaborative by default.</strong> Multiple volunteers can work in the same spreadsheet without configuration.
              </li>
              <li>
                <strong>Zero infrastructure.</strong> In a disaster, you cannot assume reliable servers, expensive cloud DBs, or domain expertise. Sheets are robust and require none of these.
              </li>
              <li>
                <strong>Instant data visibility.</strong> Organizers can see new submissions, urgent cases, and counts immediately. No custom dashboard required.
              </li>
              <li>
                <strong>Crisis-proof simplicity.</strong> Sheets do not go down because one backend crashed. This makes them ideal for community response and decentralized coordination.
              </li>
            </ul>
            <p>
              CrisisKit Lite uses Google Sheets not as a gimmick, but because <strong>it is the most crisis-resilient backend available to ordinary people</strong>.
            </p>
          </div>

          <div className="border-t border-gray-200 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Product Philosophy</h2>
            <p>
              CrisisKit Lite is intentionally not a full incident management system, a volunteer dispatching platform, or a data-heavy emergency engine. Those systems exist — and they often fail in grassroots contexts.
            </p>
            <p>Instead, CrisisKit Lite asks a different question:</p>
            <blockquote className="border-l-4 border-primary-500 pl-4 italic bg-gray-50 py-4 pr-4 rounded-r my-6 text-lg font-medium text-gray-800">
              What is the minimum structure needed for ordinary people to help each other when they are scared, confused, and in danger?
            </blockquote>
            <p>From that question come these design commitments:</p>
            <ul className="space-y-4 mt-4">
                <li className="flex items-start">
                    <span className="text-xl mr-2">🌱</span>
                    <div><strong>Ultra-fast creation:</strong> “Generate crisis form” must work in 1 click. No dragging fields. No accounts.</div>
                </li>
                <li className="flex items-start">
                    <span className="text-xl mr-2">🌱</span>
                    <div><strong>Template, not customization:</strong> In crisis mode, 95% of needed fields are universal (contact, location, people, needs). Templates reduce decision fatigue.</div>
                </li>
                 <li className="flex items-start">
                    <span className="text-xl mr-2">🌱</span>
                    <div><strong>Public form must feel safe:</strong> No branding. No ads. No distractions.</div>
                </li>
                 <li className="flex items-start">
                    <span className="text-xl mr-2">🌱</span>
                    <div><strong>Simple urgency classification:</strong> A keyword-based heuristic (or AI) is enough initially. The goal is triage, not diagnosis.</div>
                </li>
                 <li className="flex items-start">
                    <span className="text-xl mr-2">🌱</span>
                    <div><strong>Graceful degradation:</strong> If AI fails → use heuristics. If backend fails → use Sheets. If Sheets fail → export CSV. Resilience by design.</div>
                </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 py-8">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Future Directions</h2>
             <p>This project is an MVP, but it opens doors for meaningful extensions:</p>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <li className="flex items-center space-x-2"><span className="text-primary-500">🔧</span> <span>Form customizer</span></li>
                <li className="flex items-center space-x-2"><span className="text-primary-500">🤖</span> <span>AI-assisted urgency analysis</span></li>
                <li className="flex items-center space-x-2"><span className="text-primary-500">🗺</span> <span>Volunteer coordination tools</span></li>
                <li className="flex items-center space-x-2"><span className="text-primary-500">📊</span> <span>Incident-level analytics</span></li>
                <li className="flex items-center space-x-2"><span className="text-primary-500">🌍</span> <span>Multi-language support</span></li>
                <li className="flex items-center space-x-2"><span className="text-primary-500">🔐</span> <span>Lightweight authentication</span></li>
             </ul>
          </div>

          <div className="border-t border-gray-200 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Closing Thoughts</h2>
            <div className="bg-primary-50 p-6 rounded-xl text-center">
                <p className="text-xl font-serif italic text-primary-900 mb-4">
                  “People don’t wait for perfect systems. In a crisis, they build the systems they need with the tools they have.”
                </p>
                <p className="text-primary-800">
                  This project stands with that philosophy. It embraces low-tech, speed, human intuition, and community resilience.
                </p>
            </div>
            <p className="mt-6 text-center text-gray-500">
                If it helps even one community organize faster in the next emergency, the project will have fulfilled its purpose.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};