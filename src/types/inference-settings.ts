// Types for inference settings context

export interface InferenceSettingsContextType {
    showFace: boolean;
    setShowFace: (v: boolean) => void;
    showLeftHand: boolean;
    setShowLeftHand: (v: boolean) => void;
    showRightHand: boolean;
    setShowRightHand: (v: boolean) => void;
    showUpperBody: boolean;
    setShowUpperBody: (v: boolean) => void;
    showLowerBody: boolean;
    setShowLowerBody: (v: boolean) => void;
}
