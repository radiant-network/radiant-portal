import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardFooter } from '@/components/base/shadcn/card';
import { Separator } from '@/components/base/shadcn/separator';
import { useI18n } from '@/components/hooks/i18n';

import logo from './assets/newsletter-widget-1.svg';

function SetOperationsCard() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate(`/analysis/set-operations`);
  };

  return (
    <Card className="flex-1">
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <img alt="Logo" src={logo} height={75} width={75} />
          <div className="flex flex-col gap-1">
            <h5 className="text-base font-semibold">{t('analysis.set_operations.title')}</h5>
            <p className="text-sm">{t('analysis.set_operations.description')}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="amber">{t('analysis.set_operations.tags.clinical')}</Badge>
            <Badge variant="blue">{t('analysis.set_operations.tags.genomics')}</Badge>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={handleLaunch}>
          <BarChart3 />
          {t('analysis.set_operations.launch')}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SetOperationsCard;
