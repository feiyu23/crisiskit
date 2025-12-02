import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Incident } from '../types';
import { Button } from '../components/Button';
import { AlertTriangle, Plus, ArrowRight, BookOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const data = await storageService.getIncidents();
    setIncidents(data);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="mx-auto h-12 w-12 text-primary-600 flex items-center justify-center rounded-full bg-primary-100 mb-4">
          <AlertTriangle size={24} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          CrisisKit Lite
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Rapidly deploy data collection forms for emergencies. 
          Analyze needs with AI. No complex setup required.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Active Incidents</h2>
        <Link to="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Incident
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300 mb-12">
          <p className="text-gray-500 mb-4">No active incidents found.</p>
          <Link to="/create">
            <Button variant="secondary">Create your first form</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 mb-16">
          {incidents.map((incident) => (
            <Link 
              key={incident.id} 
              to={`/incident/${incident.id}`}
              className="block group"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {incident.title}
                    </h3>
                    <p className="text-gray-500 mt-1 line-clamp-2">{incident.description}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      Created {new Date(incident.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* About / README Section */}
      <div className="border-t border-gray-200 pt-12">
        <div className="prose prose-blue max-w-none text-gray-600">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              About CrisisKit Lite <span className="ml-2 text-xl">🚨</span>
            </h2>
            <Link to="/design" className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Read Design Philosophy
            </Link>
          </div>
          
          <p className="text-lg leading-relaxed mb-6">
            A tiny open-source <strong>crisis form generator</strong> to help communities collect and triage information in emergencies — in seconds, not hours.
          </p>

          <div className="bg-gray-50 border-l-4 border-primary-500 p-4 rounded-r-lg mb-8">
            <p className="italic text-gray-700">
              When disaster hits, people don’t have time to design a form, set up a database, or learn a complex system.
              In reality, volunteers and neighbours often hack together <strong>Google Sheets + WhatsApp + screenshots</strong> to coordinate help. It’s messy, but it works — because it’s fast.
            </p>
          </div>

          <p className="mb-4">
            <strong>CrisisKit Lite</strong> is a minimal tool that sits exactly in this gap:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-8">
             <li>Let anyone create a crisis collection form in a few seconds</li>
             <li>Share a simple public link with affected people</li>
             <li>See incoming submissions with a basic urgency classification (Red / Yellow / Green)</li>
             <li>Optionally store everything in <strong>Google Sheets</strong>, so volunteers can keep using the tools they already know</li>
          </ul>

          <div className="text-center mt-8">
            <Link to="/design">
                <Button variant="secondary" className="w-full sm:w-auto">
                    Why we built this: The Story of Taipo Fire &rarr;
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};