import { useState } from "react";
import "./slider.css";

export default function Slider({ className }: { className?: string }) {
    
    const [activeButton, setActiveButton] = useState("Front")

    const buttons = ["Front", "Side", "Grip"];

    return(
        // <div className={`slider-box flex justify-around shadow-lg ${className}`}>
        //     <p>Front</p>
        //     <p>Side</p>
        //     <p>Grip</p>
        // </div>

        <div className={`slider-box flex justify-around shadow-lg ${className}`}>
            {buttons.map((button) => (
                <button
                    key={button}
                    className={`px-4 py-2 rounded-lg ${
                        activeButton === button ? "slider-box-active" : "slider-box-deactive"
                    }`}
                    onClick={() => setActiveButton(button)} // Update active button on click
                >
                    {button}
                </button>
            ))}
        </div>
    )
}