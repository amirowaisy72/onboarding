// Recruitment conversation script — "Amanda" persona.
// Each step is one recruiter turn (one or more chat bubbles) followed by a
// candidate response area. Options are presented as tappable cards; free-text
// steps render a text input. The "telegram" step is the final reveal.

export const RECRUITER = {
  name: 'Amanda',
  role: 'Talent Acquisition · Remote Ops',
  avatarInitial: 'A',
};

export const STEPS = [
  {
    key: 'greeting',
    label: 'Greeting',
    messages: [
      "Hi! I'm Amanda 😊",
      'Nice to meet you.',
      "I understand you are interested in learning more about our remote opportunity.",
    ],
    prompt: 'Can I ask you one quick question first?',
    type: 'confirm',
    options: [
      { value: 'yes', label: 'Sure, go ahead' },
      { value: 'curious', label: "I'm a bit curious first" },
    ],
  },
  {
    key: 'preference',
    label: 'Work preference',
    messages: ['Thank you for sharing.'],
    prompt:
      'Are you mainly looking for full-time work, part-time work, or additional income alongside your current activities?',
    type: 'choice',
    options: [
      { value: 'full_time', label: 'Full-time work' },
      { value: 'part_time', label: 'Part-time work' },
      { value: 'extra_income', label: 'Additional income alongside current activities' },
    ],
  },
  {
    key: 'opportunity',
    label: 'The opportunity',
    messages: [
      'We are currently recruiting Remote Data Optimization Assistants for a mobile application improvement project.',
      'The role involves reviewing and optimizing app-related data through a simple online workflow.',
      'The position is remote, flexible, and includes guidance for new members.',
    ],
    prompt: 'Would you like me to explain how the process works?',
    type: 'confirm',
    options: [
      { value: 'yes', label: 'Yes, please explain' },
      { value: 'maybe', label: 'Tell me a little first' },
    ],
  },
  {
    key: 'work_explanation',
    label: 'How the work works',
    messages: [
      'The work mainly involves completing guided data optimization activities through a mobile platform.',
      'The process is designed to be simple and can be learned through the provided training.',
      'Most activities take only a few minutes to complete, depending on the workflow.',
    ],
    prompt: 'Does this type of remote work sound suitable for you?',
    type: 'confirm',
    options: [
      { value: 'yes', label: 'Yes, sounds suitable' },
      { value: 'need_more', label: 'I need a bit more detail' },
    ],
  },
  {
    key: 'training',
    label: 'Training & reward',
    messages: [
      'Before starting, new members complete an onboarding session to understand the platform and workflow.',
      'After successfully completing the initial training activity, eligible participants receive a $15 joining reward.',
      'The purpose of this onboarding process is to help you understand the system before moving forward.',
    ],
    prompt: 'Would you like me to explain the next step?',
    type: 'confirm',
    options: [
      { value: 'yes', label: 'Yes, what is next?' },
      { value: 'reward_q', label: 'Tell me more about the reward' },
    ],
    branches: {
      reward_q: {
        messages: [
          'Of course! The $15 joining reward is given to eligible participants who successfully complete the initial training activity.',
          'It is a one-time reward meant to welcome you and recognize the effort of finishing onboarding.',
          'Once your training activity is verified, the reward is processed and sent to you.',
        ],
        prompt: 'Would you like me to explain the next step now?',
        type: 'confirm',
        options: [{ value: 'yes', label: 'Yes, what is next?' }],
      },
    },
  },
  {
    key: 'practice',
    label: 'Practice workflow',
    messages: [
      'The next step is a short practice workflow.',
      'This allows you to see how the platform operates and understand the process before making any decisions.',
      'It usually takes only a few minutes.',
    ],
    prompt: 'Would you like to proceed?',
    type: 'confirm',
    options: [
      { value: 'yes', label: "Yes, let's proceed" },
    ],
  },
  {
    key: 'guide',
    label: 'Mentor assignment',
    messages: [
      'Great 👍',
      'You will be assigned a dedicated mentor very soon who will personally help you conduct your training session.',
      'Your mentor will guide you through each step and make sure you are comfortable with the workflow.',
    ],
    prompt: 'Ready to connect with our team to meet your mentor?',
    type: 'confirm',
    options: [
      { value: 'yes', label: 'Yes, connect me' },
    ],
  },
  {
    key: 'telegram',
    label: 'Telegram channel',
    messages: [
      'For daily communication, updates, and support, our team uses Telegram as the main communication channel.',
      'This helps members receive announcements and guidance in one place.',
    ],
    prompt: 'Tap below once you have installed Telegram to receive your Reception Manager contact.',
    type: 'confirm',
    options: [
      { value: 'yes', label: 'I have installed Telegram' },
    ],
    isTelegramStep: true,
  },
];
