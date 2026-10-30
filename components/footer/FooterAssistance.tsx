import React from "react";
import { ASSISTANCE_INFO } from "./constants";

/**
 * Shopping Assistance block displaying customer phone and live chat hours.
 */
export const FooterAssistance: React.FC = () => {
  return (
    <div className="mt-6 pt-5 border-t border-white/10">
      <h3 className="text-sm font-semibold text-white tracking-wide mb-3">
        Shopping Assistance
      </h3>

      {/* Phone Hours */}
      <div className="space-y-1 text-xs text-white/80">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          {ASSISTANCE_INFO.phoneHoursLabel}
        </p>
        <p>{ASSISTANCE_INFO.phoneHours}</p>
        <p>
          <a
            href={`tel:${ASSISTANCE_INFO.phoneNumber.replace(/[^0-9]/g, "")}`}
            className="text-white hover:text-accent font-medium tracking-wide transition-colors"
          >
            {ASSISTANCE_INFO.phoneNumber}
          </a>
        </p>
      </div>

      {/* Chat Hours */}
      <div className="mt-3.5 space-y-1 text-xs text-white/80">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          {ASSISTANCE_INFO.chatHoursLabel}
        </p>
        <p>{ASSISTANCE_INFO.chatWeekday}</p>
        <p>{ASSISTANCE_INFO.chatWeekend}</p>
      </div>
    </div>
  );
};

