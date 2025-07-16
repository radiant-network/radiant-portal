import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type InformationFieldProps = {
  label: string;
  children: React.ReactElement;
  tooltipsText?: string;
};
function InformationField({ label, children, tooltipsText }: InformationFieldProps) {
  if (!tooltipsText) {
    return (
      <>
        <div className="text-muted-foreground">{label}</div>
        <span className="cursor-help">
          {children}
        </span>
      </>
    )
  }

  return (
    <>
      <div className="text-muted-foreground">{label}</div>
      <span className="cursor-help">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">
              {children}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {tooltipsText}
          </TooltipContent>
        </Tooltip>
      </span>
    </>
  );
};
export default InformationField;
