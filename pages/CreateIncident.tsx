import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Region } from '../types';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { ArrowLeft, Plus, X, Sparkles } from 'lucide-react';
import { CRISIS_TEMPLATES, TEMPLATE_CATEGORIES, getTemplateById } from '../utils/crisisTemplates';

// Preset region templates
const REGION_PRESETS = {
  hongkong: [
    { name: "Hong Kong Island", districts: ["Central", "Wan Chai", "Eastern", "Southern"] },
    { name: "Kowloon", districts: ["Mong Kok", "Tsim Sha Tsui", "Sham Shui Po", "Kowloon City"] },
    { name: "New Territories", districts: ["Sha Tin", "Tai Po", "Yuen Long", "Tuen Mun"] }
  ],
  losangeles: [
    { name: "Los Angeles", districts: ["Downtown", "Hollywood", "Santa Monica", "Venice"] },
    { name: "Orange County", districts: ["Irvine", "Anaheim", "Santa Ana", "Huntington Beach"] }
  ],
  none: []
};

export const CreateIncident: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableRegions, setEnableRegions] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('none');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setFormData({
      title: template.name,
      description: template.formDescription
    });

    if (template.regions && template.regions.length > 0) {
      setRegions(template.regions);
      setEnableRegions(true);
    }

    setShowTemplates(false);
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== 'none' && REGION_PRESETS[preset as keyof typeof REGION_PRESETS]) {
      setRegions(REGION_PRESETS[preset as keyof typeof REGION_PRESETS]);
    } else {
      setRegions([]);
    }
  };

  const addCustomRegion = () => {
    setRegions([...regions, { name: '', districts: [] }]);
  };

  const removeRegion = (index: number) => {
    setRegions(regions.filter((_, i) => i !== index));
  };

  const updateRegionName = (index: number, name: string) => {
    const updated = [...regions];
    updated[index].name = name;
    setRegions(updated);
  };

  const updateRegionDistricts = (index: number, districtsStr: string) => {
    const updated = [...regions];
    updated[index].districts = districtsStr.split(',').map(d => d.trim()).filter(d => d);
    setRegions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);
    try {
      const incidentData = {
        ...formData,
        regions: enableRegions && regions.length > 0 ? regions : undefined
      };
      const newIncident = await storageService.createIncident(incidentData);
      navigate(`/incident/${newIncident.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Incident Form</h1>

        {/* Template Selection */}
        {showTemplates && (
          <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Quick Start with Template</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Choose a pre-configured template for common crisis scenarios, or start from scratch.
            </p>

            {TEMPLATE_CATEGORIES.map(category => {
              const templates = CRISIS_TEMPLATES.filter(t => t.category === category.id);
              return (
                <div key={category.id} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templates.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template.id)}
                        className="text-left p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{template.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => setShowTemplates(false)}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Skip templates and create from scratch →
              </button>
            </div>
          </div>
        )}

        {selectedTemplate && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="text-2xl">{getTemplateById(selectedTemplate)?.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">
                Template selected: {getTemplateById(selectedTemplate)?.name}
              </p>
              <p className="text-xs text-green-700 mt-1">
                You can still customize the form below before creating.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate('');
                setShowTemplates(true);
                setFormData({ title: '', description: '' });
                setRegions([]);
                setEnableRegions(false);
              }}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Incident Title" 
            placeholder="e.g. 2025 Taipo Fire - Building A"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            autoFocus
          />
          
          <TextArea
            label="Description & Instructions"
            placeholder="Describe the situation and what information is needed from affected individuals."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            required
          />

          {/* Region Configuration (Optional) */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Location Selection (Optional)
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Help people quickly select their region/district instead of typing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnableRegions(!enableRegions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableRegions ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableRegions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {enableRegions && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">
                    Use Preset Template
                  </label>
                  <select
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="none">-- No Preset (Custom) --</option>
                    <option value="hongkong">Hong Kong (3 Regions)</option>
                    <option value="losangeles">Los Angeles (2 Regions)</option>
                  </select>
                </div>

                {regions.length > 0 && (
                  <div className="space-y-3">
                    {regions.map((region, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border border-gray-200 relative">
                        <button
                          type="button"
                          onClick={() => removeRegion(idx)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Region name (e.g., Hong Kong Island)"
                          value={region.name}
                          onChange={(e) => updateRegionName(idx, e.target.value)}
                          className="w-full px-2 py-1 text-sm font-medium border-b border-gray-200 mb-2 focus:outline-none focus:border-primary-500"
                        />
                        <input
                          type="text"
                          placeholder="Districts (comma-separated: Central, Wan Chai, Eastern)"
                          value={region.districts.join(', ')}
                          onChange={(e) => updateRegionDistricts(idx, e.target.value)}
                          className="w-full px-2 py-1 text-xs text-gray-600 border-0 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addCustomRegion}
                  className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Custom Region
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={isSubmitting} size="lg">
              Create & Get Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};