export interface Disease {
  id: string;
  name: string;
  slug: string;
  definition: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatment: string[];
  category: string;
}

export const diseases: Disease[] = [
  {
    id: "1",
    name: "Fever (Pyrexia)",
    slug: "fever",
    definition: "Fever is a temporary increase in your body temperature, often due to an illness. Having a fever is a sign that something out of the ordinary is going on in your body.",
    symptoms: ["Sweating", "Chills and shivering", "Headache", "Muscle aches", "Loss of appetite", "Irritability", "Dehydration", "General weakness"],
    causes: ["Viral infection", "Bacterial infection", "Heat exhaustion", "Certain inflammatory conditions", "Immunizations"],
    prevention: ["Wash your hands often", "Avoid touching your nose, mouth or eyes", "Cover your mouth when you cough", "Avoid sharing cups and utensils"],
    treatment: ["Rest and drink plenty of fluids", "Medications like acetaminophen or ibuprofen", "Stay cool", "Sponging with lukewarm water"],
    category: "General",
  },
  {
    id: "2",
    name: "Common Cold",
    slug: "common-cold",
    definition: "The common cold is a viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way.",
    symptoms: ["Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Slight body aches or a mild headache", "Sneezing", "Low-grade fever"],
    causes: ["Rhinoviruses", "Respiratory syncytial virus (RSV)", "Parainfluenza", "Adenovirus"],
    prevention: ["Wash your hands", "Disinfect your stuff", "Use tissues", "Don't share colds"],
    treatment: ["Stay hydrated", "Rest", "Soothe a sore throat", "Combat stuffiness", "Relieve pain"],
    category: "Respiratory",
  },
  {
    id: "3",
    name: "Migraine",
    slug: "migraine",
    definition: "A migraine can cause severe throbbing pain or a pulsing sensation, usually on one side of the head. It's often accompanied by nausea, vomiting, and extreme sensitivity to light and sound.",
    symptoms: ["Pain on one side or both sides of your head", "Pain that feels throbbing or pulsing", "Sensitivity to light, sound, and sometimes smell and touch", "Nausea and vomiting"],
    causes: ["Hormonal changes in women", "Drinks (alcohol, caffeine)", "Stress", "Sensory stimuli", "Sleep changes", "Physical factors"],
    prevention: ["Avoid triggers", "Establish a regular sleeping and eating routine", "Manage stress", "Exercise regularly"],
    treatment: ["Pain-relieving medications", "Preventive medications", "Lifestyle changes", "Alternative medicine"],
    category: "Neurological",
  },
  {
    id: "4",
    name: "Dengue",
    slug: "dengue",
    definition: "Dengue fever is a mosquito-borne tropical disease caused by the dengue virus.",
    symptoms: ["High fever", "Severe headache", "Pain behind the eyes", "Severe joint and muscle pain", "Fatigue", "Nausea", "Vomiting", "Skin rash"],
    causes: ["Dengue virus transmitted by female Aedes mosquitoes"],
    prevention: ["Use mosquito repellents", "Wear long-sleeved shirts", "Eliminate standing water", "Mosquito netting"],
    treatment: ["No specific medication", "Pain relievers (avoid aspirin)", "Drink plenty of fluids", "Rest"],
    category: "Infectious",
  },
  {
    id: "5",
    name: "Diabetes Type 2",
    slug: "diabetes-type-2",
    definition: "Type 2 diabetes is an impairment in the way the body regulates and uses sugar (glucose) as a fuel.",
    symptoms: ["Increased thirst", "Frequent urination", "Increased hunger", "Unintended weight loss", "Fatigue", "Blurred vision", "Slow-healing sores"],
    causes: ["Overweight", "Inactivity", "Fat distribution", "Family history", "Race and ethnicity", "Age", "Prediabetes"],
    prevention: ["Eat healthy foods", "Get active", "Lose weight", "Avoid inactivity"],
    treatment: ["Healthy eating", "Regular exercise", "Diabetes medication or insulin therapy", "Blood sugar monitoring"],
    category: "Chronic",
  }
];

export async function searchDiseases(query: string): Promise<Disease[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lowerQuery = query.toLowerCase();
  return diseases.filter(disease => 
    disease.name.toLowerCase().includes(lowerQuery) ||
    disease.symptoms.some(s => s.toLowerCase().includes(lowerQuery)) ||
    disease.definition.toLowerCase().includes(lowerQuery)
  );
}

export async function getDiseaseBySlug(slug: string): Promise<Disease | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return diseases.find(d => d.slug === slug);
}
