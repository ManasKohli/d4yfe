// The seven Dental Pathway Program modules.
// Public content (summary, outcomes, parts) comes from the D4Y program development proposal.
// The chapter structure (videos, materials, module-wide items) comes from D4Y's portal prototype.
//
// Shape:
//   parts      -> public module page: each part has `sections` rendered as lesson cards
//   chapters   -> portal module page: { title, track?, videos: [{ title, minutes }], materials: [{ type, title }] }
//   moduleWide -> portal items that belong to the whole module, not one chapter
// Material types are labelled in `materialTypes` (src/data/portal.js).

const video = (title, minutes) => ({ title, minutes });
const item = (type, title) => ({ type, title });

export const modules = [
  {
    slug: 'applicant-strategy',
    number: '01',
    title: 'Applicant Strategy & Prerequisites',
    tag: 'Workshop + checklist',
    track: 'Canada and US tracks',
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
    chapters: [
      { title: 'Big picture: two systems', videos: [video('US vs Canada overview', 8)], materials: [item('visual', 'US and Canada timeline infographic'), item('download', 'Key dates sheet for this cycle')] },
      { title: 'Building your school list', videos: [video('Choosing schools', 8)], materials: [item('template', 'School list worksheet'), item('spreadsheet', 'Application cost calculator'), item('link', 'School requirements hub')] },
      {
        title: 'AADSAS walkthrough',
        track: 'US',
        videos: [video('Personal information', 4), video('Academic history and transcripts', 6), video('Tests and letters', 5), video('Experiences and achievements', 6), video('Statement and program materials', 4), video('Submit and verification', 4)],
        materials: [item('visual', 'Annotated AADSAS screenshots'), item('download', 'AADSAS section checklist'), item('download', 'Limits cheat sheet')],
      },
      { title: 'Canadian walkthroughs', track: 'Canada', videos: [video('Toronto', 5), video('Alberta', 5), video('McGill', 5)], materials: [item('link', 'School-by-school pages'), item('download', 'Canadian application checklist')] },
      { title: 'Build your timeline', videos: [video('Working backward from deadlines', 5)], materials: [item('template', 'Timeline template'), item('assignment', 'Planning checklist and timeline')] },
      { title: 'Common mistakes', videos: [video('Mistakes to avoid', 5)], materials: [item('quiz', '5-question check')] },
    ],
    moduleWide: [item('assignment', 'Planning checklist and timeline, mentor reviewed'), item('booking', 'Optional strategy session'), item('live', 'AADSAS overview workshop'), item('survey', 'Wrap-up survey')],
  },
  {
    slug: 'dat',
    number: '02',
    title: 'DAT Preparation',
    tag: 'Study plan + practice',
    track: 'Canada and US tracks',
    summary: 'Choose the right DAT, follow a personal study plan, practice weekly, and get mentor support from diagnostic to test day.',
    tags: ['US and Canadian DAT', 'Study plan', 'Section strategies', 'Full-length practice'],
    outcomes: [
      'Know the difference between the US and Canadian DAT',
      'Pick a test date that fits your application timeline',
      'Follow a study plan built from your diagnostic scores',
      'Review full-length practice tests and prepare for test day',
    ],
    parts: [
      {
        label: 'Workshop',
        title: 'Planning for the DAT',
        sections: [
          {
            heading: 'Before you study',
            bullets: [
              'The US and Canadian DAT explained',
              'Timing your DAT',
              'Taking and recording a diagnostic test',
              'Building an 8, 12, or 16-week study plan',
            ],
          },
          {
            heading: 'Section strategies',
            bullets: [
              'Biology',
              'General chemistry',
              'Organic chemistry (US only)',
              'Perceptual ability (PAT)',
              'Reading comprehension',
              'Quantitative reasoning (US only)',
            ],
          },
        ],
      },
      {
        label: 'Practice',
        title: 'Practice and support',
        sections: [
          {
            heading: 'Weekly practice',
            body: 'Weekly drills by section, high-yield topic sheets, and full-length practice tests with a review log.',
          },
          {
            heading: 'Mentor support',
            body: 'A mentor reviews your study plan and diagnostic, with check-ins along the way and a score review after the test. Weekly office hours by section and biweekly accountability groups keep you on track.',
          },
        ],
      },
    ],
    chapters: [
      { title: 'DAT 101', videos: [video('US and Canadian DAT explained', 8)], materials: [item('visual', 'DAT comparison chart'), item('quiz', 'DAT basics quiz')] },
      { title: 'Picking your test date', videos: [video('Timing your DAT', 5)], materials: [item('template', 'Test date planner')] },
      { title: 'Diagnostic test', videos: [video('Taking and recording a diagnostic', 3)], materials: [item('link', 'Free full-length test'), item('spreadsheet', 'Score tracker'), item('practice', 'Record diagnostic scores')] },
      { title: 'Building your study plan', videos: [video('Building your plan', 8)], materials: [item('template', '8, 12, and 16-week plans'), item('assignment', 'Study plan submission'), item('booking', 'DAT mentor plan review')] },
      {
        title: 'Section strategies',
        videos: [video('Biology', 10), video('General chemistry', 10), video('Organic chemistry, US only', 10), video('PAT overview', 8), video('PAT question types', 12), video('Reading comprehension', 8), video('Quantitative reasoning, US only', 10)],
        materials: [item('quiz', 'Weekly drills by section'), item('download', 'High-yield topic sheets')],
      },
      { title: 'Full-length practice', videos: [video('Reviewing full-lengths', 6)], materials: [item('template', 'Practice test review log'), item('link', 'Partner platforms and codes')] },
      { title: 'Test day and next steps', videos: [video('Test day and retakes', 5)], materials: [item('download', 'Test day checklist'), item('booking', 'Score review session')] },
    ],
    moduleWide: [item('assignment', 'Study plan and diagnostic, mentor reviewed'), item('booking', '2 check-ins plus score review'), item('live', 'Weekly office hours by section'), item('live', 'Biweekly accountability groups'), item('survey', 'Wrap-up survey')],
  },
  {
    slug: 'casper',
    number: '03',
    title: 'CASPer Preparation',
    tag: 'Workshop + practice',
    track: 'Canada emphasis',
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
    chapters: [
      { title: 'What CASPer is', videos: [video('What CASPer is and who requires it', 6)], materials: [item('link', 'Schools requiring CASPer'), item('download', 'Test booking checklist')] },
      { title: 'The format', videos: [video('Sections and timing', 5)], materials: [item('visual', 'Format infographic')] },
      { title: 'What raters look for', videos: [video('Qualities raters assess', 6)], materials: [item('download', 'Qualities cheat sheet')] },
      { title: 'D4Y response framework', videos: [video('The 5-step framework', 10)], materials: [item('download', 'Framework card'), item('download', 'Two worked examples')] },
      { title: 'Scenario types', videos: [video('Ethical dilemmas', 4), video('Interpersonal conflict', 4), video('Policy and opinion', 4), video('Tell us about a time', 4), video('Healthcare scenarios', 4)], materials: [item('practice', 'Scenario bank by type')] },
      { title: 'Video responses', videos: [video('Answering on camera in 60 seconds', 6)], materials: [item('download', 'Camera setup checklist'), item('practice', 'Record 2 practice answers')] },
      { title: 'Typed responses', videos: [video('Answering 2 questions in 3.5 minutes', 6)], materials: [item('quiz', 'Timed typing drill'), item('practice', 'Typed practice set')] },
      { title: 'Test day', videos: [video('Logistics and booking', 4)], materials: [item('practice', 'Full 11-scenario timed mock'), item('download', 'Test day checklist')] },
    ],
    moduleWide: [item('assignment', '2 video and 3 typed responses, mentor reviewed'), item('live', 'Group practice sessions'), item('survey', 'Wrap-up survey')],
  },
  {
    slug: 'personal-statement',
    number: '04',
    title: 'Personal Statement Lab',
    tag: 'Workshop + review',
    track: 'Canada and US tracks',
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
    chapters: [
      { title: 'What committees want', videos: [video('What committees look for', 8)], materials: [item('visual', 'Prompt and limit box'), item('download', 'Annotated sample excerpts')] },
      { title: 'Brainstorming', videos: [video('Finding your story', 6)], materials: [item('template', 'Brainstorm workbook')] },
      { title: 'Structure', videos: [video('Three ways to structure', 8)], materials: [item('template', 'Three outline templates')] },
      { title: 'Showing reflection', videos: [video('Show, don’t tell', 8)], materials: [item('download', 'Weak vs strong examples')] },
      { title: 'Openings and endings', videos: [video('Strong openings and endings', 5)], materials: [item('template', 'Opening practice worksheet')] },
      { title: 'Revising', videos: [video('Self-editing', 6)], materials: [item('download', 'Self-edit checklist'), item('link', 'Peer circle sign-up')] },
      { title: 'Formatting for AADSAS', track: 'US', videos: [video('Plain text and character counts', 3)], materials: [item('download', 'Paste-in guide'), item('tool', 'Character counter')] },
      { title: 'Canadian essays', track: 'Canada', videos: [video('Personal statements', 5), video('Accomplishment essays', 5)], materials: [item('download', 'School-by-school essay guide')] },
    ],
    moduleWide: [item('assignment', 'Draft 1 for content review'), item('assignment', 'Final draft for proofread'), item('live', 'Peer review circles'), item('survey', 'Wrap-up survey')],
  },
  {
    slug: 'application-entries',
    number: '05',
    title: 'Experiences & Application Entries',
    tag: 'Workshop + review',
    track: 'Canada and US tracks',
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
    chapters: [
      { title: 'Experience log', videos: [video('Building your log', 6)], materials: [item('spreadsheet', 'Experience log spreadsheet')] },
      { title: 'Choosing categories', track: 'US', videos: [video('Picking the right category', 5)], materials: [item('download', 'Category decision guide')] },
      { title: '600-character entries', videos: [video('Context, action, impact, reflection', 8)], materials: [item('download', 'Weak vs strong entries'), item('template', 'Entry template'), item('tool', 'Character counter')] },
      { title: 'Your top six', track: 'US', videos: [video('Choosing your most important six', 5)], materials: [item('template', 'Top six worksheet')] },
      { title: 'Achievements', videos: [video('Awards, honors, scholarships', 4)], materials: [item('template', 'Achievement sorter')] },
      { title: 'Canadian formats', track: 'Canada', videos: [video('Alberta personal experiences', 5), video('McGill CV and verifiers', 5)], materials: [item('template', 'CV template')] },
      { title: 'Documenting hours', videos: [video('Keeping records now', 4)], materials: [item('spreadsheet', 'Hours and verifier tracker')] },
    ],
    moduleWide: [item('assignment', 'Experience log and 3 entries, mentor reviewed'), item('survey', 'Wrap-up survey')],
  },
  {
    slug: 'interview',
    number: '06',
    title: 'Interview Preparation',
    tag: 'Practice + mock interview',
    track: 'Canada and US tracks',
    summary: 'Know each school’s interview format, practice on camera and live, and get feedback before interview season.',
    tags: ['MMI', 'Panel interviews', 'Video assessments', 'Ethics'],
    outcomes: [
      'Know the interview format at each school you apply to',
      'Prepare answers to core questions such as why dentistry',
      'Work through MMI stations and ethics scenarios',
      'Practice on camera and in a mock interview with a mentor',
    ],
    parts: [
      {
        label: 'Workshop',
        title: 'Interview formats and questions',
        sections: [
          {
            heading: 'What the lessons cover',
            bullets: [
              'MMI, panel, traditional, and video interviews',
              'Why dentistry, and why this school',
              'MMI station types',
              'A framework for ethics questions',
              'Recorded video assessments',
              'Camera, sound, and professionalism for virtual interviews',
              'Thank-you notes and update letters',
            ],
          },
        ],
      },
      {
        label: 'Practice',
        title: 'Practice with a mentor',
        sections: [
          {
            heading: 'Recorded and live practice',
            body: 'Record practice answers for review, work through an MMI station practice set, and book a mock interview with a mentor.',
          },
        ],
      },
    ],
    chapters: [
      { title: 'Interview formats', videos: [video('MMI, panel, traditional, and video', 8)], materials: [item('visual', 'Format comparison chart'), item('link', 'Formats in school hub')] },
      { title: 'Core questions', videos: [video('Why dentistry and why us', 10)], materials: [item('download', 'Question bank'), item('template', 'Answer prep worksheet')] },
      { title: 'Ethics and MMI', videos: [video('MMI station types', 6), video('Ethics framework', 6)], materials: [item('practice', 'MMI station practice set')] },
      { title: 'Recorded video assessments', videos: [video('Kira-style practice', 6)], materials: [item('practice', 'Record 3 practice answers')] },
      { title: 'Virtual setup', videos: [video('Camera, sound, professionalism', 4)], materials: [item('download', 'Virtual setup checklist')] },
      { title: 'After the interview', videos: [video('Thank-you notes and updates', 4)], materials: [item('template', 'Thank-you and update letter templates')] },
    ],
    moduleWide: [item('booking', 'Mock interview with a mentor'), item('assignment', 'Recorded practice answers'), item('survey', 'Wrap-up survey')],
  },
  {
    slug: 'final-check-in',
    number: '07',
    title: 'Final Application Check-In',
    tag: 'One-on-one session',
    track: 'Canada and US tracks',
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
            body: 'A 45-minute session with someone who has navigated the process, ending with a written action plan. It offers guidance and a second perspective.',
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
    chapters: [
      { title: 'Pre-session questionnaire', videos: [video('How to prepare', 3)], materials: [item('template', 'Pre-session questionnaire'), item('download', 'Session prep sheet')] },
      { title: 'Book your session', videos: [video('What to expect', 2)], materials: [item('booking', 'Booking calendar'), item('visual', '45-minute agenda')] },
      { title: 'Your action plan', videos: [], materials: [item('download', 'Mentor notes, in the Feedback tab'), item('template', 'Next-steps checklist')] },
    ],
    moduleWide: [item('booking', '1 final check-in session'), item('survey', 'Wrap-up survey')],
  },
];

export const findModule = (slug) => modules.find(module => module.slug === slug);

/** "2.4" style code used for chapters and video file names. */
export const chapterCode = (module, chapterIndex) => `${Number(module.number)}.${chapterIndex + 1}`;

/** "Module 2" style short label for a slug. */
export const moduleLabel = (slug) => `Module ${Number(findModule(slug)?.number)}`;
