import React from 'react';
import * as hourGlass from '../../hourglass.json';
import * as bubbleCheck from '../../checkmark-bubbles.json';
import FadeIn from 'react-fade-in';
import Lottie from 'react-lottie';

export default function Loading(props) {
   return (
      <FadeIn>
         {props.loading ? (
            <Lottie options={loadingOptions} height={120} width={120} />
         ) : (
            <Lottie options={doneOptions} height={120} width={120} />
         )}
      </FadeIn>
   );
}

const loadingOptions = {
   loop: true,
   autoplay: true,
   animationData: hourGlass.default,
   rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
   },
};

const doneOptions = {
   loop: true,
   autoplay: true,
   animationData: bubbleCheck.default,
   rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
   },
};
