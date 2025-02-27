import React from 'react';
import { useState } from 'react';

export default function Keyboard( {keyboardCount} ) {
    const numbers = ["1","2","3","4","5","6","7","8","9"];

    return (
        <>
        {numbers.map((num, index) => {
                let styleText = keyboardCount[index] == 9 ? "none" : "auto";
                //console.log("styleText", styleText);
                return (
                    <div key={num} number={num} display="normal" pointer={styleText} >
                        {num}
                    </div>
                );
            })
        }
        <button className="delete-button" number="X"> X </button>
        </>
    );
}