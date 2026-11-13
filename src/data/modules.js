// The five Dental Pathway Program modules, from the D4Y program development proposal.
// Each module has `parts` (workshop, practice, review, …); each part has `sections` rendered as lesson cards.

export const modules = [
  {
    slug: 'applicant-strategy',
    number: '01',
    title: 'Applicant Strategy & Prerequisites',
    tag: 'Workshop + checklist',
    icon: 'compass',
    summary: 'Understand the dental school application process from start to finish and build an individualized strategy.',
    tags: ['Application timeline', 'School selection', 'Prerequisites', 'Deadlines'],
    outcomes: [
      'Explain the dental school application timeline and key deadlines',
      'Identify schools that align with your goals',
      'Know which prerequisites you still need to complete',
      'Have a personal application checklist',
    ],
    parts: [
      {
        label: 'Workshop',
        title: 'The application process, beginning to end',
        sections: [
          {
            heading: 'A recorded introductory workshop',
            intro: 'Walks through the full application process and covers:',
            bullets: [
              'The dental school application timeline',
              'Identifying schools that align with your goals',
              'Comparing Canadian and American dental schools',
              'School-specific prerequisites',
              'Identifying missing or incomplete prerequisites',
              'Application deadlines',
              'Planning your DAT, CASPer, and application timelines',
            ],
          },
          {
            heading: 'Common application mistakes',
            body: 'What applicants most often get wrong, and how to avoid the same mistakes in your own application.',
          },
        ],
      },
      {
        label: 'Assignment',
        title: 'Your application plan',
        sections: [
          {
            heading: 'Personalized planning checklist',
            body: 'After the workshop, you complete a planning assignment that identifies everything you need to finish before applying, including prerequisites, tests, and deadlines.',
            note: 'The checklist also covers schools outside North America that accept the Canadian DAT, such as programs in Australia and Ireland.',
          },
        ],
      },
    ],
  },
  {
    slug: 'casper',
    number: '02',
    title: 'CASPer Preparation',
    tag: 'Workshop + practice',
    icon: 'spark',
    summary: 'Combine a structured workshop with timed practice scenarios and feedback on your responses.',
    tags: ['Question types', 'Time management', 'Ethical reasoning', 'Mock scenarios'],
    outcomes: [
      'Describe what CASPer is and the skills it evaluates',
      'Approach different question types with a clear structure',
      'Manage time across a timed response',
      'Reason through unfamiliar ethical and situational scenarios',
    ],
    parts: [
      {
        label: 'Workshop',
        title: 'How CASPer works',
        sections: [
          {
            heading: 'A recorded or live workshop',
            intro: 'Introduces:',
            bullets: [
              'What CASPer is',
              'What skills CASPer evaluates',
              'How to approach different question types',
              'Time management',
              'Structuring responses',
              'Ethical and situational reasoning',
              'Common mistakes',
              'Strategies for approaching unfamiliar scenarios',
            ],
          },
          {
            heading: 'Skills, not a formula',
            body: 'Rather than teaching a formula to memorize, the module focuses on the skills CASPer is designed to assess: critical thinking, communication, empathy, and decision-making.',
          },
        ],
      },
      {
        label: 'Practice',
        title: 'Practice with feedback',
        sections: [
          {
            heading: 'Hands-on practice',
            intro: 'Practice is the core of this module. Students receive:',
            bullets: [
              'Mock CASPer scenarios',
              'Timed practice questions',
              'Written-response practice',
              'Video-response practice, where applicable',
              'Feedback on responses',
              'Sample high-quality approaches',
            ],
          },
          {
            heading: 'Peer discussion',
            body: 'Discuss scenarios and approaches with other applicants to see how different people reason through the same situation.',
          },
        ],
      },
    ],
  },
  {
    slug: 'personal-statement',
    number: '03',
    title: 'Personal Statement Lab',
    tag: 'Workshop + review',
    icon: 'pen',
    summary: 'Communicate your experiences and motivations effectively, with peer discussion and optional individual review.',
    tags: ['Storytelling', 'Reflection', 'Narrative', 'Revision'],
    outcomes: [
      'Explain what admissions committees look for in a personal statement',
      'Tell a reflective story rather than list accomplishments',
      'Connect your experiences to dentistry',
      'Edit and revise your own draft',
    ],
    parts: [
      {
        label: 'Workshop',
        title: 'Writing a personal statement',
        sections: [
          {
            heading: 'What the workshop covers',
            bullets: [
              'The purpose of a personal statement',
              'What admissions committees are looking for',
              'Storytelling versus simply listing accomplishments',
              'Demonstrating reflection',
              'Connecting experiences to dentistry',
              'Creating a strong introduction',
              'Developing a cohesive narrative',
              'Common mistakes',
              'Editing and revision strategies',
            ],
          },
        ],
      },
      {
        label: 'Community',
        title: 'Learn from other applicants',
        sections: [
          {
            heading: 'Peer feedback',
            body: 'Discuss ideas with other applicants and receive general peer feedback. Seeing different perspectives and approaches helps you find your own.',
          },
        ],
      },
      {
        label: 'Review',
        title: 'Individual review',
        sections: [
          {
            heading: 'Feedback from the reviewer network',
            intro: 'Students who purchase an individual review submit their statement through the platform and receive individualized feedback from:',
            bullets: [
              'Current dental students',
              'Recent dental graduates',
              'Dentists',
              'Experienced D4Y members',
              'Dental admissions professionals or other qualified reviewers',
            ],
            note: 'Working with a reviewer network, rather than a single reviewer, lets students choose the type of feedback they want.',
          },
        ],
      },
    ],
  },
  {
    slug: 'application-entries',
    number: '04',
    title: 'Experiences & Application Entries',
    tag: 'Workshop + review',
    icon: 'layers',
    summary: 'Describe what you did, what you learned, and why it matters, within each application’s character limits.',
    tags: ['Selecting experiences', 'Showing impact', 'Character limits'],
    outcomes: [
      'Select and prioritize your most meaningful experiences',
      'Describe responsibilities in terms of impact, not duties',
      'Show transferable skills and personal growth',
      'Write within character and word limits',
    ],
    parts: [
      {
        label: 'Context',
        title: 'Why entries matter',
        sections: [
          {
            heading: 'Strong experiences are only part of it',
            intro: 'Students often have significant experience in:',
            chips: ['Research', 'Volunteering', 'Leadership', 'Employment', 'Community involvement', 'Shadowing', 'Awards', 'Clubs and organizations'],
            note: 'You also need to communicate what you did, what you learned, and why those experiences matter, within the application’s character and space limits.',
          },
        ],
      },
      {
        label: 'Workshop',
        title: 'Writing effective entries',
        sections: [
          {
            heading: 'What the workshop covers',
            bullets: [
              'How to select meaningful experiences',
              'How to prioritize experiences',
              'How to describe responsibilities effectively',
              'Showing impact rather than simply listing duties',
              'Demonstrating transferable skills',
              'Connecting experiences to personal growth',
              'Avoiding repetitive descriptions',
              'Working within character and word limits',
              'Common mistakes in application entries',
            ],
          },
        ],
      },
      {
        label: 'Review',
        title: 'Individual entry review',
        sections: [
          {
            heading: 'A higher-tier option',
            intro: 'Submit selected application entries for feedback. Reviewers assess whether each entry is:',
            bullets: ['Clear', 'Concise', 'Reflective', 'Specific', 'Impactful', 'Consistent with your overall application narrative'],
          },
        ],
      },
    ],
  },
  {
    slug: 'final-check-in',
    number: '05',
    title: 'Final Application Check-In',
    tag: 'One-on-one session',
    icon: 'check',
    summary: 'Bring everything together in an individual session with a current dental student, dentist, or qualified D4Y mentor.',
    tags: ['Strategy', 'School selection', 'Interview prep', 'Q&A'],
    outcomes: [
      'Review your overall application strategy with someone who has been through it',
      'Resolve outstanding concerns before you submit',
      'Get answers to your remaining questions about the dental school journey',
    ],
    parts: [
      {
        label: 'Session',
        title: 'An individual check-in',
        sections: [
          {
            heading: 'Possible discussion topics',
            bullets: [
              'Overall application strategy',
              'School selection',
              'Personal statement',
              'Experiences and application entries',
              'CASPer',
              'DAT',
              'Interview preparation',
              'Outstanding application concerns',
              'General questions about the dental school journey',
            ],
          },
          {
            heading: 'What the check-in is',
            body: 'The session is a final application check with someone who has navigated the process. It offers guidance and a second perspective.',
            note: 'It is not an admissions evaluation and does not guarantee admission.',
          },
        ],
      },
      {
        label: 'Feedback',
        title: 'After the session',
        sections: [
          {
            heading: 'Feedback survey',
            body: 'Students complete a short survey after their check-in. D4Y uses this feedback to improve the program for future applicants.',
          },
        ],
      },
    ],
  },
];

export const findModule = (slug) => modules.find(module => module.slug === slug);
