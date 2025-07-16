import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type InformationFieldProps = {
  label: string;
  children: React.ReactElement;
  tooltipsText?: string;
};
function InformationField({ label, children, tooltipsText }: InformationFieldProps) {
  return (
    <div className="inline-flex gap-2 justify-between text-sm">
      <span className="text-muted-foreground flex-1">{label}</span>
      <div className="flex-1">
        {tooltipsText ? (
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
        ) : (
          <span className="cursor-help">
            {children}
          </span>
        )}
      </div>
    </div>
  );
};
export default InformationField;
