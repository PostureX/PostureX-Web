import { createContext, useContext, useState, ReactNode } from "react";

interface InferenceSettingsContextType {
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

const InferenceSettingsContext = createContext<InferenceSettingsContextType | undefined>(undefined);

export function InferenceSettingsProvider({ children }: { children: ReactNode }) {
    const [showFace, setShowFace] = useState(true);
    const [showLeftHand, setShowLeftHand] = useState(true);
    const [showRightHand, setShowRightHand] = useState(true);
    const [showUpperBody, setShowUpperBody] = useState(true);
    const [showLowerBody, setShowLowerBody] = useState(true);

    return (
        <InferenceSettingsContext.Provider value={{
            showFace, setShowFace,
            showLeftHand, setShowLeftHand,
            showRightHand, setShowRightHand,
            showUpperBody, setShowUpperBody,
            showLowerBody, setShowLowerBody,
        }}>
            {children}
        </InferenceSettingsContext.Provider>
    );
}

export function useInferenceSettings() {
    const ctx = useContext(InferenceSettingsContext);
    if (!ctx) throw new Error("useInferenceSettings must be used within an InferenceSettingsProvider");
    return ctx;
}