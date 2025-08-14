import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import { uniqBy } from 'lodash';
import { Paperclip, UploadIcon } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';

import CollapsibleCard from '../cards/collapsible-card';
import { TableColumnDef } from '../data-table/data-table';
import DisplayTable from '../data-table/display-table';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Form, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

type UploadIdTableEntry = {
  entry: string;
  symbol: string;
  omim_gene_id: string;
};

const data = [{ entry: 'entry', symbol: 'symbol', omim_gene_id: 'omim_gene_id' }];

const columnHelper = createColumnHelper<UploadIdTableEntry>();

const columns = [
  columnHelper.accessor('entry', {
    cell: info => info.getValue(),
    header: 'Submitted Gene identifiers', // TODO: to translate
  }),
  columnHelper.group({
    id: 'mapped_to',
    header: () => <span>Mapped To</span>, // TODO: to translate
    columns: [
      columnHelper.accessor('symbol', {
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('omim_gene_id', {
        cell: info => info.getValue(),
      }),
    ],
  }),
] as TableColumnDef<UploadIdTableEntry, any>[];

const MOCK: UploadIdTableEntry[] = [1, 1, 2, 2, 5, 6, 7, 8, 9, 10].map(index => ({
  entry: `entry_${index}`,
  symbol: `symbol_${index}`,
  omim_gene_id: `symbol_${index}`,
}));

type UploadIdModalProps = {
  variant: 'gene';
};

/**
 * Async function to read .txt, .csv and .tsv file
 */
async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      if (!e.target || typeof e.target.result !== 'string') {
        reject(new Error('Failed to read file content.'));
        return;
      }
      resolve(e.target.result);
    };

    reader.onerror = error => {
      reject(error);
    };

    reader.readAsText(file);
  });
}

/**
 * @TODO:Wait for api to add
 * - Live api validation when a user write inside the textarea (with debounce)
 * - Api validation when uploading multiples files
 * - Update Matched and Unmachted
 * - Create table
 */
function UploadIdModal({ variant }: UploadIdModalProps) {
  const { t } = useI18n();
  const form = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<UploadIdTableEntry[]>([]);
  const [matched, setMatched] = useState<UploadIdTableEntry[]>([]);
  const [unmatched, setUnmatched] = useState<UploadIdTableEntry[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsLoading(true);
    const uploadedFiles = Array.from(e.target.files);

    Promise.all(uploadedFiles.map(readFile)).then(filesContent => {
      // @TODO: use result to get files content
      const result = filesContent
        .flatMap(
          content =>
            content
              .split(/[\n,]+/) // split on newlines and commas
              .map(entry => entry.trim()) // trim whitespace
              .map(entry => entry.replace(/^"+|"+$/g, '')), // remove surrounding quotes
        )
        .filter(entry => entry.length > 0); // remove empty strings
      setIsLoading(false);
      setFiles(uploadedFiles);

      // @TODO: To remove
      setItems(MOCK);
      setMatched(MOCK.slice(0, 4));
      setUnmatched(MOCK.slice(4));
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <UploadIcon />
          {t(`common.upload_id.${variant}.trigger`)}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t(`common.upload_id.${variant}.dialog_header`)}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <FormItem>
            <FormLabel
              infoCardContent={
                <div className="leading-6">
                  {t('common.upload_id.identifiers.tooltips.identifiers')}
                  {t('common.upload_id.identifiers.tooltips.separated_by')}
                  {t('common.upload_id.identifiers.tooltips.upload_file_format')}
                </div>
              }
            >
              {t('common.upload_id.identifiers.label')}
            </FormLabel>
            <Textarea rows={5} />
          </FormItem>
        </Form>
        <div className="flex flex-col gap-2">
          <div>
            <Button loading={isLoading} variant="outline">
              <Label className="cursor-pointer" htmlFor="file">
                {t('common.upload_id.upload_a_file')}
              </Label>
              <Input
                id="file"
                type="file"
                accept=".txt,.csv,.tsv"
                placeholder={t('common.upload_id.upload_a_file')}
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </Button>
            {files.length > 0 && (
              <Button variant="ghost" onClick={() => setFiles([])}>
                {t('common.actions.clear')}
              </Button>
            )}
          </div>
          {files.length > 0 && (
            <>
              <div className="flex flex-col gap-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Paperclip size={14} /> {file.name}
                  </div>
                ))}
              </div>
              <div>
                <CollapsibleCard
                  title={t('common.upload_id.summary_table', {
                    matched: matched.length,
                    unmatched: unmatched.length,
                  })}
                >
                  <div className="flex flex-col gap-3">
                    <span>
                      {t('common.upload_id.resume', {
                        total: items.length,
                        unique: uniqBy(items, 'entry').length,
                      })}
                    </span>
                    <Tabs defaultValue="matched">
                      <TabsList>
                        <TabsTrigger value="matched">
                          {t('common.upload_id.matched', {
                            total: matched.length,
                          })}
                        </TabsTrigger>
                        <TabsTrigger value="unmatched">
                          {t('common.upload_id.unmatched', {
                            total: matched.length,
                          })}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="matched">
                        <DisplayTable data={matched} columns={columns} />
                      </TabsContent>
                      <TabsContent value="unmatched">
                        <DisplayTable data={unmatched} columns={columns} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </CollapsibleCard>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{t('common.actions.cancel')}</Button>
          </DialogClose>
          <Button disabled={files.length === 0}>{t('common.actions.upload')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default UploadIdModal;
