import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VerifiedSellerBadgeProps {
  className?: string;
}

const VerifiedSellerBadge: React.FC<VerifiedSellerBadgeProps> = ({ className }) => {
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 flex items-center gap-1 py-0.5 px-2 text-[10px] font-black uppercase tracking-wider",
        className
      )}
    >
      <BadgeCheck className="h-3 w-3 fill-green-700 text-white" />
      Verified Seller
    </Badge>
  );
};

export default VerifiedSellerBadge;