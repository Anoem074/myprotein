import { useState, useEffect } from 'react';
import { CogIcon, SaveIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { Switch } from '@headlessui/react';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
}

interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
}

interface Features {
  enableBlog: boolean;
  enableNewsletter: boolean;
  enableReviews: boolean;
}

interface Settings {
  siteName: string;
  description: string;
  contactEmail: string;
  theme: ThemeSettings;
  socialMedia: SocialMedia;
  features: Features;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    description: '',
    contactEmail: '',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#000000'
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    features: {
      enableBlog: true,
      enableNewsletter: true,
      enableReviews: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put('/api/settings', settings);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings');
    }
    setIsSaving(false);
  };

  const handleChange = (field: string, value: any) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      setSettings({ ...settings, [field]: value });
    } else {
      setSettings({
        ...settings,
        [fields[0]]: {
          ...settings[fields[0] as keyof Settings],
          [fields[1]]: value
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-orange-500">Settings</h1>
                <p className="text-gray-500 mt-1">Configure your website settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={settings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Theme Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme.primaryColor}
                    onChange={(e) => handleChange('theme.primaryColor', e.target.value)}
                    className="h-10 w-20 rounded-lg border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.theme.primaryColor}
                    onChange={(e) => handleChange('theme.primaryColor', e.target.value)}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme.secondaryColor}
                    onChange={(e) => handleChange('theme.secondaryColor', e.target.value)}
                    className="h-10 w-20 rounded-lg border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.theme.secondaryColor}
                    onChange={(e) => handleChange('theme.secondaryColor', e.target.value)}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                <input
                  type="url"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => handleChange('socialMedia.facebook', e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
                <input
                  type="url"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => handleChange('socialMedia.twitter', e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                <input
                  type="url"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => handleChange('socialMedia.instagram', e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Enable Blog</h3>
                  <p className="text-sm text-gray-500">Show blog posts on your website</p>
                </div>
                <Switch
                  checked={settings.features.enableBlog}
                  onChange={(checked) => handleChange('features.enableBlog', checked)}
                  className={`${
                    settings.features.enableBlog ? 'bg-orange-500' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.features.enableBlog ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Enable Newsletter</h3>
                  <p className="text-sm text-gray-500">Show newsletter subscription form</p>
                </div>
                <Switch
                  checked={settings.features.enableNewsletter}
                  onChange={(checked) => handleChange('features.enableNewsletter', checked)}
                  className={`${
                    settings.features.enableNewsletter ? 'bg-orange-500' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.features.enableNewsletter ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Enable Reviews</h3>
                  <p className="text-sm text-gray-500">Allow customers to leave reviews</p>
                </div>
                <Switch
                  checked={settings.features.enableReviews}
                  onChange={(checked) => handleChange('features.enableReviews', checked)}
                  className={`${
                    settings.features.enableReviews ? 'bg-orange-500' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.features.enableReviews ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end space-x-4">
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {saveMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-2xl hover:bg-orange-600 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
