import React from 'react';
import { useState } from 'react';

export default function Keyboard() {
    const numbers = ["1","2","3","4","5","6","7","8","9"];
    
    return (
        <>
        {numbers.map((num) => {
                return (
                    <button key={num} id={num} >
                        {num}
                    </button>
                );
            })
        }
        <button className="delete-button" id="X"> X </button>
        </>
    );
}