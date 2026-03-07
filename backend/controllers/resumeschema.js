export const resumeSchema = {
  basicInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experience: [
    {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  education: [
    {
      institute: "",
      degree: "",
      startDate: "",
      endDate: "",
    },
  ],
  skills: [],
  projects: [
    {
      title: "",
      description: "",
      link: "",
    },
  ],
};
