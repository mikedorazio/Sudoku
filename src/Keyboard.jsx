import React from 'react';

export default function Keyboard( {keyboardCount} ) {
    const numbers = ["1","2","3","4","5","6","7","8","9"];

    return (
        <>
        <div className="normal-keyboard" id="normal-keyboard">
            {numbers.map((num, index) => {
                    let styleText = keyboardCount[index] == 9 ? "none" : "auto";
                        return (
                            <div key={num} pointer={styleText} normal-number={num}>
                                <span className={`button-${index+1}`}> {num} </span>
                            </div>
                        );
                })
            }
            <button className="delete-button" number="X"> x </button>
        </div>
        <div className="candidate-keyboard" id="candidate-keyboard">
            {numbers.map((num, index) => {
                    let styleText = keyboardCount[index] == 9 ? "none" : "auto";
                        return (
                            <div key={num} pointer={styleText} candidate-number={num}>
                                <span className={`button-${index+1}`}>{num}</span>
                            </div>
                        );
                })
            }
            <button className="delete-button" number="X"> x </button>
        </div>
    </>
    );
}