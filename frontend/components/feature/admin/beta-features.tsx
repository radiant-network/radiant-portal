import { useCallback, useState } from 'react';
import { useConfig } from '@/components/model/applications-config';
import { Button } from '@/components/base/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { Switch } from '@/components/base/ui/switch';
import { useBetaFeatures } from '@/components/hooks/beta-feature-provider';

function BetaFeatures() {
  const { adminCode } = useConfig().admin;
  const [codeEntered, setCodeEntered] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const { features, setFeature, featureDefinitions } = useBetaFeatures();

  const handleCodeSubmit = () => {
    if (inputCode === adminCode) {
      setCodeEntered(true);
    } else {
      alert('Invalid code');
    }
  };

  const renderFeature = (key: string, definition: typeof featureDefinitions[string]) => {
    const value = features[key];
    
    if (definition.options) {
      return (
        <div key={key} className="mb-4">
          <label className="block mb-2">{definition.label}</label>
          {definition.description && (
            <p className="text-sm text-gray-500 mb-2">{definition.description}</p>
          )}
          <Select value={value as string} onValueChange={(newValue) => setFeature(key, newValue)}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder={`Select ${definition.label}`} />
            </SelectTrigger>
            <SelectContent>
              {definition.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    } else {
      return (
        <div key={key} className="mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={value as boolean}
              onCheckedChange={(checked) => setFeature(key, checked)}
            />
            <div>
              <label className="block">{definition.label}</label>
              {definition.description && (
                <p className="text-sm text-gray-500">{definition.description}</p>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  if (!codeEntered) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Enter Admin Code</h1>
        <input
          type="password"
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          className="border p-2 mb-4"
        />
        <Button onClick={handleCodeSubmit}>Submit</Button>
      </div>
    );
  }

  return (
    <section className="mt-6">
      {Object.entries(featureDefinitions).map(([key, definition]) => 
        renderFeature(key, definition)
      )}
    </section>
  );
}

export default BetaFeatures;
