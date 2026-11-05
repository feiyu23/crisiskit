import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { offlineQueue } from '../services/offlineQueue';
import { DEFAULT_PUBLIC_EMERGENCY_INCIDENT } from '../services/InMemoryRepo';
import { Incident } from '../types';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { ImageUpload } from '../components/ImageUpload';
import { CheckCircle, MapPin, ShieldAlert, X, AlertTriangle, Wifi, WifiOff, MessageSquare, QrCode, ArrowLeft } from 'lucide-react';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { QRCodeModal } from '../components/QRCodeModal';
import { EmergencyBroadcastModal } from '../components/EmergencyBroadcastModal';
import { SafetyCheckinModal } from '../components/SafetyCheckinModal';
import { EmergencyBeaconModal } from '../components/EmergencyBeaconModal';
import { DisasterFieldGuideModal } from '../components/DisasterFieldGuideModal';
import { BeaconOfHopeModal } from '../components/BeaconOfHopeModal';
import { Radio, HeartHandshake, AlertOctagon, BookOpen, Heart } from 'lucide-react';

export const PublicSubmit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const effectiveId = id || DEFAULT_PUBLIC_EMERGENCY_INCIDENT.id;
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<any>(null);

  // High-altitude mudslide & survival modals
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showHopeModal, setShowHopeModal] = useState(false);

  // SOS & Location State
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showSafetyTips, setShowSafetyTips] = useState(false);

  // Offline State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedOffline, setSavedOffline] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    region: '',
    district: '',
    location: '',
    needs: '',
    images: [] as string[]
  });

  // Get available districts based on selected region
  const availableDistricts = formData.region && incident?.regions
    ? incident.regions.find(r => r.name === formData.region)?.districts || []
    : [];

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setIncident(DEFAULT_PUBLIC_EMERGENCY_INCIDENT);
        setLoading(false);
        return;
      }
      const data = await storageService.getIncidentById(id);
      setIncident(data || DEFAULT_PUBLIC_EMERGENCY_INCIDENT);
      setLoading(false);
    };
    load();
  }, [id]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    if (!formData.name || !formData.needs) return;

    const submissionData = {
      incidentId: effectiveId,
      name: formData.name,
      contact: formData.contact,
      needs: formData.needs,
      location: formData.location,
      ...(formData.region && { region: formData.region }),
      ...(formData.district && { district: formData.district }),
      ...(formData.images.length > 0 && { images: formData.images })
    };

    // If offline, save to queue immediately
    if (!isOnline) {
      setIsSubmitting(true);
      try {
        await offlineQueue.add(submissionData);
        setSavedOffline(true);
        setSubmitted(true);
        setDuplicateWarning(null);
        window.scrollTo(0, 0);
        console.log('✅ Saved to offline queue');
      } catch (error) {
        console.error('Failed to save offline:', error);
        alert('Failed to save offline. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Online: Check for duplicates
    try {
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
    } catch (error) {
      console.warn('Could not check duplicates:', error);
    }

    // Online: Submit directly
    setIsSubmitting(true);
    try {
      await storageService.submitResponse(submissionData);
      setSubmittedPayload(submissionData);
      setSubmitted(true);
      setDuplicateWarning(null);
      window.scrollTo(0, 0);
      console.log('✅ Submitted successfully');
    } catch (error) {
      console.error('Submission failed:', error);

      // If online submission fails, save to offline queue as fallback
      try {
        await offlineQueue.add(submissionData);
        setSubmittedPayload(submissionData);
        setSavedOffline(true);
        setSubmitted(true);
        console.log('✅ Saved to offline queue as fallback');
      } catch (offlineError) {
        console.error('Failed to save offline:', offlineError);
        alert('Failed to submit. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmergencySMS = () => {
    const payload = submittedPayload || formData;
    const bodyText = `🚨SOS crisis request:\nName: ${payload.name}\nContact: ${payload.contact}\nNeeds: ${payload.needs}\nLoc: ${payload.location}`;
    window.location.href = `sms:?body=${encodeURIComponent(bodyText)}`;
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading form...</div>;
  if (!incident) return <div className="p-8 text-center text-danger-500">Form not found or expired.</div>;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 text-center">
             {savedOffline ? (
               <>
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                   <WifiOff className="h-6 w-6 text-blue-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Offline</h2>
                 <p className="text-gray-500 mb-6">
                   Your submission has been saved locally and will be automatically uploaded when you're back online.
                 </p>
               </>
             ) : (
               <>
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 mb-4">
                   <CheckCircle className="h-6 w-6 text-success-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received</h2>
                 <p className="text-gray-500 mb-6">
                   Your information has been recorded. The response team will review it shortly.
                 </p>
               </>
             )}

             {/* Offline Zero-Network Transfer Options */}
             <div className="space-y-3 mb-6 pt-2">
               <button
                 onClick={() => setShowQRModal(true)}
                 className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-xl font-bold text-sm shadow hover:bg-black transition"
               >
                 <QrCode className="w-5 h-5 text-yellow-400" />
                 Show SOS QR Code to Responders
               </button>

               <button
                 onClick={handleSendEmergencySMS}
                 className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-sm shadow hover:bg-red-700 transition"
               >
                 <MessageSquare className="w-5 h-5" />
                 Send Emergency SMS (Data Offline Fallback)
               </button>
             </div>

             <Button onClick={() => window.location.reload()} variant="secondary" className="w-full">
               Submit Another Response
             </Button>
           </div>
        </div>

        {showQRModal && submittedPayload && (
          <QRCodeModal
            data={submittedPayload}
            title="SOS Response QR Payload"
            onClose={() => setShowQRModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white px-4 py-2 text-center text-sm font-semibold z-50 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          Offline Mode - Submissions will be saved locally
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-4 text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
            返回星火信标主页 (Home)
          </Link>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{incident.title}</h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          {incident.description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Emergency & Survival Actions Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4 animate-pulse" />
              孤岛防灾与紧急联络工具箱
            </span>
            <span className="text-[10px] text-gray-400">零网络/卫星适配</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 hover:bg-red-100 transition-all text-left"
            >
              <Radio className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <div className="font-bold text-xs">紧急联络亲友</div>
                <div className="text-[10px] text-red-600/70 dark:text-red-300/70">一键短信/卫星发坐标</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowCheckinModal(true)}
              className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 hover:bg-green-100 transition-all text-left"
            >
              <HeartHandshake className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
              <div>
                <div className="font-bold text-xs">离线报平安/寻人</div>
                <div className="text-[10px] text-green-600/70 dark:text-green-300/70">安置点名册登记查询</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowBeaconModal(true)}
              className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-xl text-orange-700 dark:text-orange-300 hover:bg-orange-100 transition-all text-left"
            >
              <AlertOctagon className="w-5 h-5 shrink-0 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="font-bold text-xs">声光救援信标</div>
                <div className="text-[10px] text-orange-600/70 dark:text-orange-300/70">SOS频闪与穿透高频哨</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-all text-left"
            >
              <BookOpen className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="font-bold text-xs">泥石流自救手册</div>
                <div className="text-[10px] text-amber-600/70 dark:text-amber-300/70">垂直逃生与高原防失温</div>
              </div>
            </button>
          </div>

          {/* Hope banner button */}
          <button
            type="button"
            onClick={() => setShowHopeModal(true)}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border border-pink-200/80 dark:border-pink-900/40 rounded-xl text-left hover:opacity-95 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                <Heart className="w-4 h-4 fill-pink-500/20" />
              </div>
              <div>
                <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                  微光与希望 · 心理平复与互助站
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-serif">བཀྲ་ཤིས་བདེ་ལེགས</span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">4-7-8呼吸平复、72h搜救节奏、爱的时空胶囊</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-100/60 dark:bg-pink-950/60 px-2 py-1 rounded-lg">
              开启
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-gray-700/50">
            <button
              type="button"
              onClick={handleSOS}
              disabled={isLocating}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {isLocating ? '正在获取GPS...' : '填入当前GPS'}
            </button>

            <button
              type="button"
              onClick={() => setShowSafetyTips(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
              通用避难常识
            </button>
          </div>
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

            {/* Region/District Selection (if configured) */}
            {incident?.regions && incident.regions.length > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.region}
                    onChange={e => setFormData({...formData, region: e.target.value, district: ''})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">-- Select Region --</option>
                    {incident.regions.map(region => (
                      <option key={region.name} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.region && availableDistricts.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={e => setFormData({...formData, district: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">-- Select District --</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="relative">
                <Input
                label="Detailed Address/Building"
                placeholder="Room number, Building name, Street, or use SOS button"
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">What do you need? <span className="text-red-500">*</span></label>
                <VoiceRecorder
                  onTranscription={(spokenText) => {
                    setFormData(prev => ({
                      ...prev,
                      needs: prev.needs ? `${prev.needs}\n🎙️ ${spokenText}` : `🎙️ ${spokenText}`
                    }));
                  }}
                />
              </div>
              <TextArea
                label=""
                placeholder="e.g. Water, Medical attention, Trapped... (or tap Voice SOS to speak)"
                value={formData.needs}
                onChange={e => setFormData({...formData, needs: e.target.value})}
                rows={4}
                required
                className={formData.needs.includes('SOS') ? 'border-danger-300 bg-danger-50' : ''}
              />
            </div>

            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({...formData, images})}
              maxImages={5}
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
      {/* High-altitude mudslide & survival modals */}
      <EmergencyBroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
      />
      <SafetyCheckinModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
      />
      <EmergencyBeaconModal
        isOpen={showBeaconModal}
        onClose={() => setShowBeaconModal(false)}
      />
      <DisasterFieldGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
      <BeaconOfHopeModal
        isOpen={showHopeModal}
        onClose={() => setShowHopeModal(false)}
      />
    </div>
  );
};