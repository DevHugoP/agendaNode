import * as React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

/**
 * Retourne une fonction permettant d'obtenir le badge de statut d'un événement calendrier.
 * @returns (status?: string, mode: "icon" | "full") => React.ReactNode
 */
import { ReactNode } from 'react';

const useBadgeStatus = (): ((status?: string, mode?: "icon" | "full") => ReactNode) => {
  return (status?: string, mode: "icon" | "full" = "icon"): React.ReactNode => {
    const size = mode === "icon" ? 20 : 16;
    const marginStyle: React.CSSProperties = { marginBottom: -1 };
    const textStyle: React.CSSProperties = { color: "#fff" };
    switch (status) {
      case "confirmed":
        return mode === "icon"
          ? <CheckCircle2 size={size} color="#22c55e" />
          : (
            <span>
              <CheckCircle2 size={size} color="#22c55e" style={marginStyle} />{' '}
              <span style={textStyle}>Confirmé</span>
            </span>
          );
      case "pending":
        return mode === "icon"
          ? <Clock size={size} color="#facc15" />
          : (
            <span>
              <Clock size={size} color="#facc15" style={marginStyle} />{' '}
              <span style={textStyle}>En attente</span>
            </span>
          );
      case "cancelled":
        return mode === "icon"
          ? <XCircle size={size} color="#ef4444" />
          : (
            <span>
              <XCircle size={size} color="#ef4444" style={marginStyle} />{' '}
              <span style={textStyle}>Annulé</span>
            </span>
          );
      default:
        return null;
    }
  };
};

export default useBadgeStatus;

