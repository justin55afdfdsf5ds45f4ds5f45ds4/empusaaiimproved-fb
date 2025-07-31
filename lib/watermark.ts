/**
 * Watermark utility functions for Empusa AI
 * Handles watermark display logic for free vs premium users
 */

export interface WatermarkConfig {
  text: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity: number;
  fontSize: string;
  color: string;
}

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  text: 'EmpusaAI',
  position: 'bottom-right',
  opacity: 0.7,
  fontSize: '14px',
  color: '#6B7280'
};

/**
 * Determines if watermark should be shown based on user plan
 * @param userPlan - The user's current plan (free, growth, etc.)
 * @returns true if watermark should be shown (free users), false otherwise
 */
export function shouldShowWatermark(userPlan: string | null | undefined): boolean {
  return !userPlan || userPlan === 'free';
}

/**
 * Adds watermark parameter to image URLs for free users
 * @param imageUrl - Original image URL
 * @param isPremium - Whether user has premium plan
 * @returns Modified image URL with watermark parameter if needed
 */
export function addWatermarkToImage(imageUrl: string, isPremium: boolean): string {
  if (isPremium || !imageUrl) return imageUrl;
  
  const separator = imageUrl.includes('?') ? '&' : '?';
  
  return `${imageUrl}${separator}watermark=empusaai&opacity=0.7&position=bottom-right`;
}

/**
 * Creates a click handler for watermark that shows upgrade modal
 * @param onUpgrade - Callback function to trigger upgrade modal
 * @returns Click handler function
 */
export function getWatermarkClickHandler(onUpgrade: () => void) {
  return () => {
    onUpgrade();
  };
}

/**
 * Generates watermark overlay component props
 * @param userPlan - User's current plan
 * @param onUpgrade - Upgrade modal trigger function
 * @returns Watermark component props or null if no watermark needed
 */
export function getWatermarkProps(
  userPlan: string | null | undefined,
  onUpgrade: () => void
): {
  show: boolean;
  config: WatermarkConfig;
  onClick: () => void;
} | null {
  if (!shouldShowWatermark(userPlan)) {
    return null;
  }

  return {
    show: true,
    config: DEFAULT_WATERMARK_CONFIG,
    onClick: getWatermarkClickHandler(onUpgrade)
  };
}

/**
 * CSS styles for watermark overlay
 */
export const watermarkStyles = {
  container: {
    position: 'absolute' as const,
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#6B7280',
    cursor: 'pointer',
    userSelect: 'none' as const,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(107, 114, 128, 0.2)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  hover: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.05)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
  },
  text: {
    fontWeight: '500' as const,
    fontSize: '11px'
  },
  icon: {
    width: '12px',
    height: '12px',
    color: '#EF4444' // Red color for X icon
  }
};

/**
 * React component for watermark overlay
 * Usage: <WatermarkOverlay userPlan={user.plan} onUpgrade={handleUpgrade} />
 */
export interface WatermarkOverlayProps {
  userPlan: string | null | undefined;
  onUpgrade: () => void;
  className?: string;
}

/**
 * Utility to check if image needs watermark processing
 * @param imageUrl - Image URL to check
 * @param userPlan - User's plan
 * @returns true if image should have watermark applied
 */
export function needsWatermark(imageUrl: string, userPlan: string | null | undefined): boolean {
  return !!imageUrl && shouldShowWatermark(userPlan);
}

/**
 * Removes watermark parameters from image URL
 * @param imageUrl - Image URL that may contain watermark parameters
 * @returns Clean image URL without watermark parameters
 */
export function removeWatermarkFromImage(imageUrl: string): string {
  if (!imageUrl) return imageUrl;
  
  try {
    const url = new URL(imageUrl);
    url.searchParams.delete('watermark');
    url.searchParams.delete('opacity');
    url.searchParams.delete('position');
    return url.toString();
  } catch {
    return imageUrl
      .replace(/[?&]watermark=[^&]*/g, '')
      .replace(/[?&]opacity=[^&]*/g, '')
      .replace(/[?&]position=[^&]*/g, '')
      .replace(/\?&/, '?') // Fix malformed query strings
      .replace(/\?$/, ''); // Remove trailing ?
  }
}
