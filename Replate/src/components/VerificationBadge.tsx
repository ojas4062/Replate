import type { VerificationStatus } from '../types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  showText?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, showText = true }) => {
  switch (status) {
    case 'verified':
      return (
        <span className="status-badge verified" title="Identity Verified (Green dot)">
          <span className="status-dot"></span>
          {showText && <span>Verified ✓</span>}
        </span>
      );
    case 'unverified':
      return (
        <span className="status-badge unverified" title="Unverified - Awaiting manual review (Amber dot)">
          <span className="status-dot"></span>
          {showText && <span>Unverified</span>}
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="status-badge pending" title="Verification Pending (Grey dot)">
          <span className="status-dot"></span>
          {showText && <span>Pending Review</span>}
        </span>
      );
  }
};
