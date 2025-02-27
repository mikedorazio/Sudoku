import React from 'react';
import { useState } from 'react';

export default function Keyboard( {keyboardCount} ) {
    const numbers = ["1","2","3","4","5","6","7","8","9"];

    console.log("Keyboard.keyboardCount", keyboardCount);
    
    return (
        <>
        {numbers.map((num, index) => {
                return (
                    <button key={num} number={num} display="normal"
                        disabled={keyboardCount[index] >= 9 ? "disabled" : null}>
                        {num}
                    </button>
                );
            })
        }
        <button className="delete-button" number="X"> X </button>
        </>
    );
}