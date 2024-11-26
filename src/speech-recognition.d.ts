declare global {
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    0: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;  // Adicionando 'readonly' para ser consistente
    transcript: string;
  }

  var webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };

  interface SpeechRecognition {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    start: () => void;
  }
}

export {};
