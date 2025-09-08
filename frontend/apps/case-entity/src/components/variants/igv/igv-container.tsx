import { IGVTrack } from './types';

import IGV from './igv';

interface OwnProps {
  locus: string;
  tracks: IGVTrack[];
}
const IgvContainer = ({ locus, tracks }: OwnProps) => {
  return (
    <IGV
      className="igvContainer"
      options={{
        palette: ['#00A0B0', '#6A4A3C', '#CC333F', '#EB6841'],
        reference: {
          id: 'hg38_1kg',
          ucscID: 'hg38',
          blatDB: 'hg38',
          name: 'Human (hg38 1kg/GATK)',
          fastaURL:
            'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome' +
            '/GRCh38_full_analysis_set_plus_decoy_hla.fa',
          indexURL:
            'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome' +
            '/GRCh38_full_analysis_set_plus_decoy_hla.fa.fai',
          cytobandURL: 'https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz',
          tracks: [
            {
              name: 'Refseq Genes',
              format: 'refgene',
              url: 'https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz',
              indexURL: 'https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz.tbi',
              order: 0,
              visibilityWindow: -1,
              displayMode: 'EXPANDED',
              autoHeight: true,
              maxHeight: 160,
            },
          ],
        },
        locus,
        tracks,
      }}
    />
  );
};
export default IgvContainer;
