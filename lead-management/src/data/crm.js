export const pipelineStages = [
  {
    id: 'new',
    title: 'New',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    leads: [
      { id: 1, name: 'Rajesh Kumar', company: 'TechCorp Solutions', value: 250000, daysInStage: 3 },
      { id: 6, name: 'Deepika Joshi', company: 'EduLearn Academy', value: 95000, daysInStage: 2 },
      { id: 10, name: 'Sneha Iyer', company: 'CloudOps Technologies', value: 420000, daysInStage: 1 },
    ],
  },
  {
    id: 'qualified',
    title: 'Qualified',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    leads: [
      { id: 3, name: 'Vikram Singh', company: 'BuildFast Construction', value: 450000, daysInStage: 5 },
      { id: 9, name: 'Rohit Gupta', company: 'Logistix Express', value: 370000, daysInStage: 3 },
    ],
  },
  {
    id: 'proposal',
    title: 'Proposal',
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
    leads: [
      { id: 4, name: 'Meera Nair', company: 'HealthPlus Clinics', value: 320000, daysInStage: 8 },
      { id: 7, name: 'Arjun Mehta', company: 'FinServe Capital', value: 580000, daysInStage: 4 },
    ],
  },
  {
    id: 'converted',
    title: 'Converted',
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    leads: [
      { id: 5, name: 'Suresh Reddy', company: 'AgriTech Farms', value: 150000, daysInStage: 12 },
    ],
  },
];

export const formatCurrency = (value) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
};
