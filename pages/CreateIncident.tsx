import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { ArrowLeft } from 'lucide-react';

export const CreateIncident: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);
    try {
      const newIncident = await storageService.createIncident(formData);
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