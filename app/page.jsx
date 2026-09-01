'use client';

import { useState } from 'react';
import StartScreen from '@/components/recruitment/StartScreen';
import RecruitmentFlow from '@/components/recruitment/RecruitmentFlow';

export default function Home() {
  const [phase, setPhase] = useState('start'); // 'start' | 'flow'
  const [intro, setIntro] = useState(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AuroraBackground />
      {phase === 'start' ? (
        <StartScreen
          onStart={(info) => {
            setIntro(info);
            setPhase('flow');
          }}
        />
      ) : (
        <RecruitmentFlow candidate={intro} />
      )}
    </div>
  );
}

function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div
        className="aurora-blob"
        style={{
          top: '-10%',
          left: '-5%',
          width: '45vw',
          height: '45vw',
          background: 'hsl(199 90% 60%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          top: '30%',
          right: '-10%',
          width: '40vw',
          height: '40vw',
          background: 'hsl(162 70% 55%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: '-15%',
          left: '20%',
          width: '50vw',
          height: '50vw',
          background: 'hsl(217 80% 65%)',
          animationDelay: '-12s',
        }}
      />
    </div>
  );
}
