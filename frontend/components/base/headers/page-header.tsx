import { Link } from "react-router-dom";
import Container from "../container";
import { Skeleton } from "../ui/skeleton";
import BackLink from "../navigation/back-link";
import { Button, ButtonProps } from "../ui/button";
import { Badge, BadgeProps } from "../ui/badge";
import { cn } from "@/components/lib/utils";

type breadcrumbsProps = {
  to: string;
  text: string;
}

type EntityHeaderProps = {
  isLoading?: boolean;
  breadcrumbs?: breadcrumbsProps[];
  badges?: BadgeProps[];
  buttons?: ButtonProps[];
  title?: string;
  description?: string;
};
function PageHeader({
  title,
  badges,
  buttons,
  description,
  breadcrumbs,
  isLoading = true,
}: EntityHeaderProps) {
  if (isLoading) {
    return (
      <div className="bg-background">
        <Container>
          <div className="flex flex-col gap-4 pt-4 px-6">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-96 h-8" />
          </div>
        </Container >
      </div >
    );
  }

  return (
    <div className="bg-background">
      <Container>
        <div className="flex flex-col gap-4 pt-4 px-6">
          {(breadcrumbs ?? []).map(breadcrumb => (
            <Link to={breadcrumb.to}>
              <BackLink>{breadcrumb.text}</BackLink>
            </Link>
          ))}
          <div className="flex justify-between">
            <div className={cn("flex flex-col", { 'gap-3': !!description })}>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                {(badges ?? []).map((badgeProps) => (<Badge {...badgeProps} />))}
              </div>
              <h2 className="text-sm text-muted-foreground">{description}</h2>
            </div>
            <div className="flex items-center gap-2">
              {(buttons ?? []).map((buttonProps) => (<Button {...buttonProps} />))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default PageHeader;
