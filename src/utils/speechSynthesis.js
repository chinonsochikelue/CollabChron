let currentUtterance = null;

export const speakText = (text) => {
  return new Promise((resolve, reject) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        window.speechSynthesis.cancel();
      }

      // Create a new utterance
      currentUtterance = new SpeechSynthesisUtterance(text);

      // Set utterance properties
      currentUtterance.pitch = 1;
      currentUtterance.rate = 1;
      currentUtterance.volume = 1;

      // Resolve promise when speech ends
      currentUtterance.onend = () => {
        resolve();
      };

      // Reject promise on error
      currentUtterance.onerror = (error) => {
        reject(error);
      };

      // Start speaking
      window.speechSynthesis.speak(currentUtterance);
    } else {
      console.error('Speech Synthesis not supported in this browser.');
      reject('Speech Synthesis not supported in this browser.');
    }
  });
};

export const pauseSpeech = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = () => {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
};

export const stopSpeech = () => {
  if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
    window.speechSynthesis.cancel();
  }
};

