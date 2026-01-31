interface PricingBadgeProps {
  price: number;
  period?: string;
  size?: "sm" | "md" | "lg";
  hasFreeTrial?: boolean;
}

const sizeStyles = {
  sm: "text-base font-bold",
  md: "text-lg font-bold",
  lg: "text-4xl font-bold",
};

const periodStyles = {
  sm: "text-xs font-normal text-muted-foreground",
  md: "text-sm font-normal text-muted-foreground",
  lg: "text-lg font-normal text-muted-foreground",
};

export default function PricingBadge({
  price,
  period = "/mo",
  size = "md",
  hasFreeTrial = false,
}: PricingBadgeProps) {
  return (
    <div className="flex flex-col">
      <span className={sizeStyles[size]}>
        &euro;{price}
        <span className={periodStyles[size]}>{period}</span>
      </span>
      {hasFreeTrial && (
        <span className="mt-0.5 text-xs font-medium text-green-600">
          Free trial available
        </span>
      )}
    </div>
  );
}
