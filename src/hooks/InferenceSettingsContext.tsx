import { createContext, useContext, useState, ReactNode } from "react";
import { InferenceSettingsContextType } from "@/types/inference-settings";

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