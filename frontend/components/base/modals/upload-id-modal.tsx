import { useEffect, useRef, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { InfoIcon, Paperclip, UploadIcon } from 'lucide-react';

import { GeneResult } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/shadcn/dialog';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { Textarea } from '@/components/base/shadcn/textarea';
import { queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';
import { MERGE_VALUES_STRATEGIES } from '@/components/cores/sqon';
import { useI18n } from '@/components/hooks/i18n';
import { useDebounce } from '@/components/hooks/useDebounce';
import { thousandNumberFormat } from '@/components/lib/number-format';
import { genesApi } from '@/utils/api';

import CollapsibleCard from '../cards/collapsible-card';
import { TableColumnDef } from '../data-table/data-table';
import DisplayTable from '../data-table/display-table';
import { useFilterConfig } from '../query-filters/filter-list';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../shadcn/hover-card';

type UploadIdTableEntry = {
  entry: string;
  symbol: string;
  omim_gene_id: string;
};

const columnHelper = createColumnHelper<UploadIdTableEntry>();

const getMatchedColumns = (variant: string, t: any) =>
  [
    columnHelper.accessor('entry', {
      cell: info => info.getValue(),
      header: t(`common.upload_id.${variant}.submitted_identifier`),
    }),
    columnHelper.group({
      id: 'mapped_to',
      header: () => <span className="flex justify-center w-full">{t('common.upload_id.mapped_to')}</span>,
      columns: [
        columnHelper.accessor('omim_gene_id', {
          header: t(`common.upload_id.${variant}.omim_gene_id`),
          cell: info => info.getValue(),
        }),
        columnHelper.accessor('symbol', {
          header: t(`common.upload_id.${variant}.symbol`),
          cell: info => info.getValue(),
        }),
      ],
    }),
  ] as TableColumnDef<UploadIdTableEntry, any>[];

const getUnmatchedColumns = (variant: string, t: any) =>
  [
    columnHelper.accessor('entry', {
      cell: info => info.getValue(),
      header: t(`common.upload_id.${variant}.submitted_identifier`),
    }),
  ] as TableColumnDef<UploadIdTableEntry, any>[];

type UploadIdModalProps = {
  variant: string;
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

function UploadIdModal({ variant }: UploadIdModalProps) {
  const { t } = useI18n();
  const { appId } = useFilterConfig();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [matched, setMatched] = useState<UploadIdTableEntry[]>([]);
  const [unmatched, setUnmatched] = useState<UploadIdTableEntry[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const debouncedValue = useDebounce(value, 500);

  const getRawValueList = () => value.split(/[\n,\r ]/).filter(val => !!val);
  const getValueSet = () => new Set(getRawValueList());

  const getUnmatchList = (results: GeneResult[]): UploadIdTableEntry[] => {
    const rawList = getRawValueList();
    const matchedIds = new Set(
      results.flatMap(item => [item.symbol?.toLowerCase(), item.ensembl_gene_id?.toLowerCase()].filter(Boolean)),
    );
    const unmatchs = Array.from(getValueSet())
      .filter(id => !matchedIds.has(id.toLowerCase()))
      .map((id, index) => ({
        key: index,
        submittedId: id,
      }));

    return unmatchs.map(unmatch => {
      const submittedId = rawList.find(val => val.toLowerCase() === unmatch.submittedId?.toLowerCase());
      return {
        entry: submittedId ?? unmatch.submittedId,
        symbol: '',
        omim_gene_id: '',
      };
    });
  };

  const getMatchList = (results: GeneResult[]): UploadIdTableEntry[] => {
    const rawList = getRawValueList();
    return results.map(result => {
      const submittedId = rawList.find(
        val =>
          val.toLowerCase() === result.symbol?.toLowerCase() ||
          val.toLowerCase() === result.ensembl_gene_id?.toLowerCase(),
      );
      return {
        entry: submittedId ?? result.symbol ?? '',
        symbol: result.symbol ?? '',
        omim_gene_id: result.ensembl_gene_id ?? '',
      };
    });
  };

  const onClear = () => {
    setUnmatched([]);
    setMatched([]);
    setValue('');
    setFiles([]);
  };

  useEffect(() => {
    if (debouncedValue) {
      (async () => {
        setIsLoading(true);
        const results = await genesApi.geneSearch({ inputs: debouncedValue.split(/[\n,\r ]/).filter(val => !!val) });
        setMatched(getMatchList(results.data));
        setUnmatched(getUnmatchList(results.data));
        setIsLoading(false);
      })();
    } else {
      onClear();
    }
  }, [debouncedValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsLoading(true);
    const uploadedFiles = Array.from(e.target.files);

    try {
      const filesContent = await Promise.all(uploadedFiles.map(readFile));
      const result = filesContent
        .flatMap(
          content =>
            content
              .split(/[\n,]+/) // split on newlines and commas
              .map(entry => entry.trim()) // trim whitespace
              .map(entry => entry.replace(/^"+|"+$/g, '')), // remove surrounding quotes
        )
        .filter(entry => entry.length > 0); // remove empty strings

      setValue(result.join('\n'));
      setFiles(uploadedFiles);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onClear}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full mb-2">
          <UploadIcon />
          {t(`common.upload_id.${variant}.button`)}
        </Button>
      </DialogTrigger>
      <DialogContent size="lg" variant="stickyBoth">
        <DialogHeader>
          <DialogTitle>{t(`common.upload_id.${variant}.dialog_title`)}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
          <div className="flex gap-2">
            <Label>{t('common.upload_id.input_label')}</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon size={16} />
              </HoverCardTrigger>
              <HoverCardContent className="w-full">
                <h4 className="font-semibold mb-3">{t(`common.upload_id.popover_title`)}</h4>
                <div className="flex gap-2 items-center">
                  <Label className="font-semibold">{t(`common.upload_id.popover_identifiers`)}</Label>
                  <span className="text-sm text-muted-foreground">
                    {t(`common.upload_id.${variant}.popover_identifiers_values`)}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Label className="font-semibold">{t(`common.upload_id.popover_separators`)}</Label>
                  <span className="text-sm text-muted-foreground">
                    {t(`common.upload_id.popover_separators_values`)}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Label className="font-semibold">{t(`common.upload_id.popover_file_formats`)}</Label>
                  <span className="text-sm text-muted-foreground">
                    {t(`common.upload_id.popover_file_formats_values`)}
                  </span>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <Textarea
            id="upload-id-textarea"
            onChange={e => setValue(e.target.value)}
            placeholder={t(`common.upload_id.${variant}.input_placeholder`)}
            rows={5}
            value={value}
            className="flex-shrink-0"
          />
          <div className="flex gap-1">
            <>
              <Button
                loading={isLoading}
                variant="outline"
                onClick={() => fileInput?.current && fileInput.current.click()}
              >
                {t('common.upload_id.upload_a_file')}
              </Button>
              <Input
                id="file"
                type="file"
                ref={fileInput}
                accept=".txt,.csv,.tsv"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </>
            {(unmatched.length > 0 || matched.length > 0) && (
              <Button variant="ghost" onClick={onClear}>
                {t('common.upload_id.clear')}
              </Button>
            )}
          </div>
          {files.length > 0 && (
            <div className="flex flex-col gap-1">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Paperclip size={14} /> {file.name}
                </div>
              ))}
            </div>
          )}
          {(unmatched.length > 0 || matched.length > 0) && (
            <div className="mt-6">
              <CollapsibleCard
                title={t('common.upload_id.summary_table', {
                  matched: thousandNumberFormat(matched.length),
                  unmatched: thousandNumberFormat(unmatched.length),
                })}
                cardClassName="py-4"
                cardHeaderClassName="px-4 !gap-0"
              >
                <div className="flex flex-col gap-3 mt-3">
                  <span>
                    {t('common.upload_id.resume', {
                      total: thousandNumberFormat(getRawValueList().length),
                      unique: thousandNumberFormat(matched.length),
                    })}
                  </span>
                  <Tabs defaultValue="matched">
                    <TabsList>
                      <TabsTrigger value="matched">
                        {t('common.upload_id.matched', {
                          total: thousandNumberFormat(matched.length),
                        })}
                      </TabsTrigger>
                      <TabsTrigger value="unmatched">
                        {t('common.upload_id.unmatched', {
                          total: thousandNumberFormat(unmatched.length),
                        })}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="matched">
                      <DisplayTable data={matched} columns={getMatchedColumns(variant, t)} dataCy="matched-table" />
                    </TabsContent>
                    <TabsContent value="unmatched">
                      <DisplayTable
                        data={unmatched}
                        columns={getUnmatchedColumns(variant, t)}
                        dataCy="unmatched-table"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </CollapsibleCard>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('common.actions.cancel')}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={matched.length === 0}
              onClick={() => {
                // When we will add more variants, we will need to update field accordingly
                queryBuilderRemote.updateActiveQueryField(appId, {
                  field: 'symbol',
                  value: matched.map(item => item.symbol),
                  merge_strategy: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
                });
              }}
            >
              {t('common.actions.upload')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default UploadIdModal;
