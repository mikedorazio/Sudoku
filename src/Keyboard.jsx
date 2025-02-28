import React from 'react';
import { useState } from 'react';

export default function Keyboard( {keyboardCount, isNormalButton} ) {
    const numbers = ["1","2","3","4","5","6","7","8","9"];

    return (
        <>
        <div className="normal-keyboard" id="normal-keyboard">
            {numbers.map((num, index) => {
                    let styleText = keyboardCount[index] == 9 ? "none" : "auto";
                    //let buttonType = isNormalButton ? "normal" : "candidate";
                        return (
                            <div key={num} pointer={styleText} normal-number={num}>
                                {/* <div key={num} className={`button-${index+1}`} display="normal" > */}
                                    <span className={`button-${index+1}`}> {num} </span>
                                {/* </div> */}
                            </div>
                        );
                })
            }
            <button className="delete-button" number="X"> X </button>
        </div>
        <div className="candidate-keyboard" id="candidate-keyboard">
            {numbers.map((num, index) => {
                    let styleText = keyboardCount[index] == 9 ? "none" : "auto";
                    //let buttonType = isNormalButton ? "normal" : "candidate";
                        return (
                            <div key={num} pointer={styleText} candidate-number={num}>
                                {/* <div key={num} className={`button-${index+1}`} display="candidate" > */}
                                    <span className={`button-${index+1}`}>{num}</span>
                                {/* </div> */}
                            </div>
                        );
                })
            }
            <button className="delete-button" number="X"> X </button>
        </div>
    </>
    );
}