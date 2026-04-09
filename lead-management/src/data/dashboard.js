import { leads } from './leads';
import { quotations } from './quotations';

const inr = (n) => `₹${(n / 1000).toFixed(0)}K`;

export const getDashboardStats = () => {
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === 'Won').length;
  const pipelineValue = leads.reduce((s, l) => s + l.value, 0);
  const acceptedQuotes = quotations.filter((q) => q.status === 'Accepted').length;

  return [
    { label: 'Total Leads',     value: totalLeads,           change: '+12%', trend: 'up'   },
    { label: 'Pipeline Value',  value: inr(pipelineValue),   change: '+8.4%',trend: 'up'   },
    { label: 'Won Deals',       value: wonLeads,             change: '+3',   trend: 'up'   },
    { label: 'Accepted Quotes', value: acceptedQuotes,       change: '-1',   trend: 'down' },
  ];
};

export const recentActivity = [
  { id: 1, text: 'New lead Aarav Mehta added from Website',     time: '2m ago' },
  { id: 2, text: 'Quotation Q-2847 sent to Orbit Logistics',    time: '1h ago' },
  { id: 3, text: 'Meera Nair moved to Proposal stage',          time: '3h ago' },
  { id: 4, text: 'Deal won — GreenLeaf Retail (₹1.75L)',        time: '5h ago' },
  { id: 5, text: 'Follow-up scheduled with Vikram Singh',       time: 'Yday'   },
];
