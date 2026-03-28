export const chatMessages = [
  {
    id: 1,
    sender: 'lead',
    name: 'Vikram Singh',
    message: 'Hi, I saw your enterprise pricing page. Can you tell me more about the team features?',
    time: '10:30 AM',
    date: '2026-03-25',
  },
  {
    id: 2,
    sender: 'agent',
    name: 'Priya Sharma',
    message: 'Hello Vikram! Thank you for your interest. Our enterprise plan includes unlimited team members, role-based access, and dedicated support.',
    time: '10:32 AM',
    date: '2026-03-25',
  },
  {
    id: 3,
    sender: 'lead',
    name: 'Vikram Singh',
    message: 'That sounds great. We have about 50 team members who would be using this. Is there a volume discount?',
    time: '10:35 AM',
    date: '2026-03-25',
  },
  {
    id: 4,
    sender: 'agent',
    name: 'Priya Sharma',
    message: 'Absolutely! For 50+ seats, we offer a 20% volume discount on the enterprise plan. I can prepare a custom quotation for you.',
    time: '10:38 AM',
    date: '2026-03-25',
  },
  {
    id: 5,
    sender: 'lead',
    name: 'Vikram Singh',
    message: 'Yes please, that would be helpful. Also, can we schedule a demo for our management team?',
    time: '10:40 AM',
    date: '2026-03-25',
  },
  {
    id: 6,
    sender: 'agent',
    name: 'Priya Sharma',
    message: 'Of course! I will send over the quotation today and we can set up a demo. Would Thursday at 3 PM work for your team?',
    time: '10:42 AM',
    date: '2026-03-25',
  },
];

export const aiMessages = [
  {
    id: 1,
    sender: 'user',
    message: 'Show me leads that haven\'t been contacted in the last 7 days',
    time: '09:15 AM',
  },
  {
    id: 2,
    sender: 'ai',
    message: 'I found 12 leads that haven\'t been contacted in the last 7 days. Here are the top priority ones:\n\n1. **Kavita Bhat** (MediaHub Studios) - Last contact: 15 days ago\n2. **Arjun Mehta** (FinServe Capital) - Last contact: 2 days ago\n3. **Deepika Joshi** (EduLearn Academy) - Last contact: 1 day ago\n\nWould you like me to draft follow-up messages for any of these?',
    time: '09:15 AM',
  },
  {
    id: 3,
    sender: 'user',
    message: 'Draft a follow-up for Kavita Bhat',
    time: '09:17 AM',
  },
  {
    id: 4,
    sender: 'ai',
    message: 'Here\'s a suggested follow-up email for Kavita Bhat:\n\n**Subject:** Checking in - Any updates on your CRM decision?\n\n**Body:**\nHi Kavita,\n\nI hope you\'re doing well! I wanted to touch base regarding your CRM evaluation. I understand you were exploring other options as well.\n\nWe\'ve recently launched some exciting new features in our media & entertainment module that I think would be particularly relevant for MediaHub Studios.\n\nWould you be open to a quick 15-minute call this week to discuss?\n\nBest regards,\nAmit Patel\n\nShall I send this, or would you like to modify it?',
    time: '09:17 AM',
  },
];

export const aiSuggestions = [
  'Send follow-up email',
  'Share pricing details',
  'Schedule a demo',
  'Generate report',
  'Show pipeline summary',
  'Draft proposal',
];
