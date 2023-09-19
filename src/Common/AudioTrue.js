import React, { useEffect, useState } from 'react';

const AudioTrueComp = ({
    playaudio = ""
}) => {
   
    const playAudio = () => {
        const audioEl = document.getElementsByClassName("audio-element")[0]
        audioEl.play();
    }

    useEffect(() => {
        if (playaudio != false) {
            playAudio();
        }
    }, [playaudio]);

    return (
        <div>
            <audio className="audio-element">
                <source src={"/assets/Audio/laser.mp3"}></source>
            </audio>
        </div>
    )
}
export const AudioTrue = React.memo(AudioTrueComp)