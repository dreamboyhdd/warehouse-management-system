import React, { useEffect, useState } from 'react';

const AudioFalseComp = ({
    playaudio = ""
}) => {

    const playAudio = () => {
        const audioEl = document.getElementsByClassName("audio-element1")[0]
        audioEl.play();
    }

    useEffect(() => {
        if (playaudio != false) {
            playAudio();
        }
    }, [playaudio]);

    return (
        <div>
            <audio className="audio-element1">
                <source src={"/assets/Audio/wrong2.mp3"}></source>
            </audio>
        </div>
    )
}
export const AudioFalse = React.memo(AudioFalseComp)