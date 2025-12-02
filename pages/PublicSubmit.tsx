import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Incident } from '../types';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { CheckCircle, MapPin, ShieldAlert, X, AlertTriangle } from 'lucide-react';

export const PublicSubmit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // SOS & Location State
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showSafetyTips, setShowSafetyTips] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    needs: ''
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const data = await storageService.getIncidentById(id);
      setIncident(data || null);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSOS = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const locString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy)}m) ${mapLink}`;
        
        setFormData(prev => ({
          ...prev,
          location: locString,
          // Only append SOS if it's not already there
          needs: prev.needs.includes('🚨 SOS') ? prev.needs : `🚨 SOS: I require immediate assistance!\n${prev.needs}`
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        let msg = 'Unable to retrieve location.';
        if (error.code === 1) msg = 'Location permission denied.';
        if (error.code === 2) msg = 'Position unavailable.';
        if (error.code === 3) msg = 'Request timed out.';
        
        setLocationError(msg + ' Please enter manually.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData.name || !formData.needs) return;

    // Check for duplicates (same contact within 1 hour)
    const existingResponses = await storageService.getResponses(id);
    const recentDuplicates = existingResponses.filter(r =>
      r.contact === formData.contact &&
      (Date.now() - r.submittedAt) < 3600000 // 1 hour = 3600000ms
    );

    if (recentDuplicates.length > 0 && !duplicateWarning) {
      const lastSubmission = new Date(recentDuplicates[0].submittedAt).toLocaleTimeString();
      setDuplicateWarning(`You submitted a request at ${lastSubmission}. Click submit again to update your information.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await storageService.submitResponse({
        incidentId: id,
        ...formData
      });
      setSubmitted(true);
      setDuplicateWarning(null);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading form...</div>;
  if (!incident) return <div className="p-8 text-center text-danger-500">Form not found or expired.</div>;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 text-center">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 mb-4">
               <CheckCircle className="h-6 w-6 text-success-600" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received</h2>
             <p className="text-gray-500 mb-6">
               Your information has been recorded. The response team will review it shortly.
             </p>
             <Button onClick={() => window.location.reload()} variant="secondary">
               Submit Another Response
             </Button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{incident.title}</h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          {incident.description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Emergency Actions Bar */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={handleSOS}
            disabled={isLocating}
            className="flex flex-col items-center justify-center p-4 bg-danger-50 border-2 border-danger-200 rounded-xl text-danger-700 hover:bg-danger-100 hover:border-danger-300 transition-all active:scale-95"
          >
            {isLocating ? (
              <span className="animate-spin h-6 w-6 border-2 border-danger-600 border-t-transparent rounded-full mb-1"></span>
            ) : (
              <MapPin className="h-6 w-6 mb-1" />
            )}
            <span className="font-bold text-sm">SOS Location</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSafetyTips(true)}
            className="flex flex-col items-center justify-center p-4 bg-primary-50 border-2 border-primary-200 rounded-xl text-primary-700 hover:bg-primary-100 hover:border-primary-300 transition-all active:scale-95"
          >
            <ShieldAlert className="h-6 w-6 mb-1" />
            <span className="font-bold text-sm">Self Rescue</span>
          </button>
        </div>

        {locationError && (
            <div className="mb-4 p-3 bg-warning-50 text-warning-800 text-sm rounded-lg flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {locationError}
            </div>
        )}

        {duplicateWarning && (
            <div className="mb-4 p-4 bg-orange-50 border-2 border-orange-300 text-orange-900 text-sm rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-orange-600" />
                <div>
                    <p className="font-semibold mb-1">Possible Duplicate Submission</p>
                    <p>{duplicateWarning}</p>
                </div>
            </div>
        )}

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-primary-600">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Your Name"
              placeholder="Full name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Input
              label="Contact Info"
              placeholder="Phone number or WhatsApp"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
              required
            />

            <div className="relative">
                <Input
                label="Current Location"
                placeholder="Address, Building, or use SOS button"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                required
                className={formData.location.includes('http') ? 'text-primary-600 font-medium' : ''}
                />
                 {/* Visual indicator if location is GPS locked */}
                 {formData.location.includes('Lat:') || formData.location.includes('http') ? (
                    <div className="absolute right-3 top-9 text-success-500">
                        <MapPin className="h-5 w-5" />
                    </div>
                 ) : null}
            </div>

            <TextArea
              label="What do you need?"
              placeholder="e.g. Water, Medical attention, Trapped..."
              value={formData.needs}
              onChange={e => setFormData({...formData, needs: e.target.value})}
              rows={4}
              required
              className={formData.needs.includes('SOS') ? 'border-danger-300 bg-danger-50' : ''}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Submit Request
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by CrisisKit Lite
        </p>
      </div>

      {/* Safety Tips Modal */}
      {showSafetyTips && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <ShieldAlert className="mr-2 w-5 h-5" />
                Safety & Self-Rescue
              </h3>
              <button 
                onClick={() => setShowSafetyTips(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">1</span>
                  <p><strong>Stay Calm:</strong> Panic wastes energy. Take deep breaths to think clearly.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">2</span>
                  <p><strong>Assess Safety:</strong> If you are in immediate danger (fire, rising water), move to a safer location immediately if possible.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">3</span>
                  <p><strong>Conserve Battery:</strong> Turn on "Low Power Mode". Lower screen brightness. Close unused apps.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">4</span>
                  <p><strong>Share Location:</strong> Use the SOS button on this form to attach your exact GPS coordinates.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">5</span>
                  <p><strong>Signal for Help:</strong> If trapped, bang on pipes or walls. Shout only as a last resort to save oxygen/energy.</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button onClick={() => setShowSafetyTips(false)} className="w-full">
                  I Understand
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};