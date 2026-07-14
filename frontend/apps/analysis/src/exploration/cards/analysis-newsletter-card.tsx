import { FormEvent, useState } from 'react';

import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

import logo1 from './assets/newsletter-widget-1.svg';
import logo2 from './assets/newsletter-widget-2.svg';
import logo3 from './assets/newsletter-widget-3.svg';

function AnalysisNewsletterCard() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');

  // @TODO: need newletter api to work
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Card className="bg-blue/10 border-blue flex-1 self-stretch">
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 self-stretch">
        <div className="flex items-start justify-center gap-6 self-stretch">
          <img alt="Logo circles" src={logo1} />
          <img alt="Logo line chart" src={logo2} />
          <img alt="Logo bar chart" src={logo3} />
        </div>
        <div className="flex flex-col items-center justify-center self-stretch">
          <h5 className="text-base font-semibold">{t('analysis.newsletter.title')}</h5>
          <p className="text-center text-sm">{t('analysis.newsletter.description')}</p>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-row items-start gap-2">
            <Input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder={t('analysis.newsletter.form.placeholder')}
              className="flex-1"
            />
            <Button type="submit">{t('analysis.newsletter.form.button_label')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AnalysisNewsletterCard;
