import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/base/shadcn/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Switch } from '@/components/base/shadcn/switch';
import { useConfig } from '@/components/cores/applications-config';
import { useBetaFeatures } from '@/components/hooks/beta-feature-provider';

function BetaFeatures() {
  const { admin_code } = useConfig().admin;
  const [codeEntered, setCodeEntered] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const { features, setFeature, featureDefinitions } = useBetaFeatures();

  const handleCodeSubmit = () => {
    if (inputCode === admin_code) {
      setCodeEntered(true);
    } else {
      alert('Invalid code');
    }
  };

  const renderFeature = (key: string, definition: (typeof featureDefinitions)[string]) => {
    const value = features[key];

    if (definition.type === 'select') {
      return (
        <div key={key} className="mb-4">
          <label className="block mb-2">{definition.label}</label>
          {definition.description && <p className="text-sm text-gray-500 mb-2">{definition.description}</p>}
          <Select value={value as string} onValueChange={newValue => setFeature(key, newValue)}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder={`Select ${definition.label}`} />
            </SelectTrigger>
            <SelectContent>
              {definition.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    } else if (definition.type === 'link') {
      return (
        <div key={key} className="mb-4">
          <div className="flex items-center space-x-2">
            <div>
              <Link className="block" to={definition.link}>
                <Button>{definition.label}</Button>
              </Link>
              {definition.description && <p className="text-sm text-gray-500">{definition.description}</p>}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={key} className="mb-4">
          <div className="flex items-center space-x-2">
            <Switch checked={value as boolean} onCheckedChange={checked => setFeature(key, checked)} />
            <div>
              <label className="block">{definition.label}</label>
              {definition.description && <p className="text-sm text-gray-500">{definition.description}</p>}
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
      {Object.entries(featureDefinitions).map(([key, definition]) => renderFeature(key, definition))}
    </section>
  );
}

export default BetaFeatures;
