import { useState } from "react";
import "./slider.css";

export default function Slider({ className }: { className?: string }) {
    
    const [activeButton, setActiveButton] = useState("Front")

    const buttons = ["Front", "Side", "Grip"];

    return(
        <div className={`flex justify-around shadow-lg bg-muted border border-border rounded-lg p-1 min-w-[450px] max-w-[650px] ${className}`}>
            {buttons.map((button) => (
                <button
                    key={button}
                    className={`px-4 py-2 rounded-lg w-full text-center transition-all duration-300 text-lg ${
                        activeButton === button 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setActiveButton(button)}
                >
                    {button}
                </button>
            ))}
        </div>
    )
}