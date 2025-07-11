import VariantsFilter from './variants-filter';

function VariantTab() {
  return (
    <div className='bg-background flex flex-col gap-4'>
      <VariantsFilter />
      <div className='bg-muted/40 px-6 w-full'>
        content
      </div>
    </div>
  );
}

export default VariantTab;
