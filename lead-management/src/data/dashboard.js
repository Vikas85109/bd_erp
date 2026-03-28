export const stats = [
  {
    title: 'Total Leads',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    gradient: 'from-blue-500 to-blue-700',
    icon: 'Users',
  },
  {
    title: 'Converted',
    value: '643',
    change: '+8.2%',
    changeType: 'positive',
    gradient: 'from-emerald-500 to-emerald-700',
    icon: 'CheckCircle',
  },
  {
    title: 'Pending',
    value: '1,204',
    change: '-3.1%',
    changeType: 'negative',
    gradient: 'from-amber-500 to-orange-600',
    icon: 'Clock',
  },
  {
    title: 'Revenue',
    value: '₹48.5L',
    change: '+18.7%',
    changeType: 'positive',
    gradient: 'from-purple-500 to-indigo-700',
    icon: 'IndianRupee',
  },
];

export const recentActivity = [
  {
    id: 1,
    action: 'New lead added',
    description: 'Sneha Iyer from CloudOps Technologies',
    time: '2 minutes ago',
    type: 'lead',
  },
  {
    id: 2,
    action: 'Quotation sent',
    description: 'Proposal #Q-2847 sent to Meera Nair',
    time: '1 hour ago',
    type: 'quotation',
  },
  {
    id: 3,
    action: 'Lead converted',
    description: 'Suresh Reddy signed monthly subscription',
    time: '3 hours ago',
    type: 'conversion',
  },
  {
    id: 4,
    action: 'Follow-up completed',
    description: 'Call with Vikram Singh - Demo scheduled',
    time: '5 hours ago',
    type: 'followup',
  },
  {
    id: 5,
    action: 'AI suggestion accepted',
    description: 'Auto follow-up email sent to Arjun Mehta',
    time: '6 hours ago',
    type: 'ai',
  },
  {
    id: 6,
    action: 'Pipeline updated',
    description: 'Rohit Gupta moved to Qualified stage',
    time: '8 hours ago',
    type: 'pipeline',
  },
  {
    id: 7,
    action: 'New lead added',
    description: 'Deepika Joshi from EduLearn Academy',
    time: 'Yesterday',
    type: 'lead',
  },
  {
    id: 8,
    action: 'Quotation approved',
    description: 'Proposal #Q-2839 approved by management',
    time: 'Yesterday',
    type: 'quotation',
  },
];

export const chartData = {
  monthly: [
    { month: 'Oct', leads: 180, converted: 42 },
    { month: 'Nov', leads: 220, converted: 58 },
    { month: 'Dec', leads: 195, converted: 45 },
    { month: 'Jan', leads: 260, converted: 72 },
    { month: 'Feb', leads: 310, converted: 85 },
    { month: 'Mar', leads: 340, converted: 98 },
  ],
  sources: [
    { name: 'Website', value: 35, color: '#3B82F6' },
    { name: 'Email', value: 25, color: '#8B5CF6' },
    { name: 'WhatsApp', value: 20, color: '#10B981' },
    { name: 'Referral', value: 12, color: '#F59E0B' },
    { name: 'Social Media', value: 8, color: '#EC4899' },
  ],
};
