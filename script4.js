const diseaseData = [
  {
    name: "Malaria",
    overview: "Malaria is a life-threatening disease caused by Plasmodium parasites transmitted through the bite of infected female Anopheles mosquitoes.",
    causes: "Plasmodium falciparum (most common in Ghana) spread through mosquito bites.",
    symptoms: "High fever, chills, vomiting, headache, sweating, fatigue.",
    prevention: "Use of insecticide-treated nets, insect sprays, clearing stagnant water, prophylactic drugs.",
    treatment: "ACTs (artemisinin-based combination therapies), blood testing or RDT for diagnosis."
  },
  {
    name: "Typhoid Fever",
    overview: "A bacterial infection caused by Salmonella typhi, usually spread through contaminated food or water.",
    causes: "Poor sanitation, contaminated drinking water or food.",
    symptoms: "Persistent fever, weakness, abdominal pain, headache, diarrhea or constipation.",
    prevention: "Drink safe water, cook food properly, wash hands regularly, and get vaccinated.",
    treatment: "Antibiotics like ciprofloxacin or ceftriaxone and rehydration therapy."
  },
  {
    name: "Cholera",
    overview: "A serious diarrheal disease caused by Vibrio cholerae, leading to severe dehydration.",
    causes: "Consuming contaminated water or food, especially in unsanitary environments.",
    symptoms: "Watery diarrhea, vomiting, dehydration, sunken eyes, muscle cramps.",
    prevention: "Drink treated water, practice hygiene, use oral cholera vaccine in outbreaks.",
    treatment: "ORS (oral rehydration salts), IV fluids, and antibiotics in severe cases."
  },
  {
    name: "Hepatitis B",
    overview: "A viral liver infection that can become chronic and lead to serious liver damage or cancer.",
    causes: "Transmitted through infected blood, unprotected sex, shared needles, or childbirth.",
    symptoms: "Jaundice, fatigue, dark urine, abdominal pain, nausea.",
    prevention: "Vaccination at birth and for adults, avoid sharing needles or razors, screen blood before transfusion.",
    treatment: "Antivirals (like tenofovir), regular liver monitoring, liver transplant in extreme cases."
  },
  {
    name: "Tuberculosis (TB)",
    overview: "A highly contagious bacterial disease that primarily affects the lungs.",
    causes: "Spread through airborne droplets from coughing, sneezing, or speaking.",
    symptoms: "Chronic cough (2+ weeks), blood-stained sputum, night sweats, weight loss, chest pain.",
    prevention: "BCG vaccine at birth, avoid exposure to infected individuals, improve ventilation.",
    treatment: "6-month antibiotic regimen (isoniazid, rifampicin, etc.). Drug resistance is possible if not completed."
  },
  {
    name: "HIV/AIDS",
    overview: "A viral infection that weakens the immune system, making the body prone to infections and diseases.",
    causes: "Transmission through unprotected sex, blood transfusion, sharing of needles, or from mother to child.",
    symptoms: "Fever, weight loss, night sweats, fatigue, recurrent infections, skin rashes.",
    prevention: "Safe sex practices, regular testing, ART during pregnancy, using sterile equipment.",
    treatment: "Antiretroviral therapy (ART) to suppress the virus and strengthen immunity."
  },
  {
    name: "Anemia",
    overview: "A condition where the body lacks enough healthy red blood cells to carry oxygen to tissues.",
    causes: "Iron deficiency, malaria, sickle cell disease, poor nutrition, chronic diseases.",
    symptoms: "Fatigue, pale skin, dizziness, rapid heartbeat, shortness of breath.",
    prevention: "Eat iron-rich foods (e.g., green vegetables, red meat), prevent malaria, deworm regularly.",
    treatment: "Iron supplements, dietary changes, treatment of underlying causes, and blood transfusions in severe cases."
  },
  {
    name: "Hypertension",
    overview: "Also called high blood pressure, it increases the risk of heart disease, stroke, and kidney failure.",
    causes: "Poor diet, lack of exercise, stress, genetics, high salt intake, obesity.",
    symptoms: "Often silent; but may include headaches, chest pain, vision problems, dizziness.",
    prevention: "Reduce salt intake, regular exercise, healthy diet, avoid alcohol and tobacco.",
    treatment: "Lifestyle changes and antihypertensive medications like amlodipine, lisinopril, or beta blockers."
  },
  {
    name: "Diabetes",
    overview: "A metabolic disorder where the body cannot regulate blood sugar properly due to lack of insulin or insulin resistance.",
    causes: "Genetics, obesity, sedentary lifestyle, poor diet, insulin dysfunction.",
    symptoms: "Frequent urination, increased thirst, weight loss, fatigue, blurred vision.",
    prevention: "Healthy eating, active lifestyle, regular health check-ups.",
    treatment: "Insulin therapy (Type 1), oral medications (Type 2), diet and lifestyle management."
  },
  {
    name: "Sickle Cell Disease",
    overview: "An inherited blood disorder that affects hemoglobin, causing red blood cells to become sickle-shaped and block blood flow.",
    causes: "Genetic mutation passed from parents to children (common in West Africa).",
    symptoms: "Pain crises, anemia, fatigue, swelling of hands and feet, delayed growth, infections.",
    prevention: "Carrier screening, genetic counseling before childbirth.",
    treatment: "Pain relief, blood transfusions, hydroxyurea, folic acid supplements, bone marrow transplant (in rare cases)."
  }
];

// Function to create disease cards
function displayDiseases(diseases) {
  const container = document.getElementById("diseaseContainer");
  container.innerHTML = "";

  if (diseases.length === 0) {
    container.innerHTML = "<p>No matching diseases found.</p>";
    return;
  }

  diseases.forEach(disease => {
    const card = document.createElement("div");
    card.className = "disease-card";

    card.innerHTML = `
      <h2>${disease.name}</h2>
      ${disease.image ? `<img src="${disease.image}" alt="${disease.name}">` : ""}
      <p><strong>Overview:</strong> ${disease.overview}</p>
      <p><strong>Causes:</strong> ${disease.causes}</p>
      <p><strong>Symptoms:</strong> ${disease.symptoms}</p>
      <p><strong>Prevention:</strong> ${disease.prevention}</p>
      <p><strong>Treatment:</strong> ${disease.treatment}</p>
    `;
    container.appendChild(card);
  });
}

// Initial display
displayDiseases(diseaseData);

// Search functionality
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = diseaseData.filter(disease =>
    disease.name.toLowerCase().includes(query)
  );
  displayDiseases(filtered);
});

// Symptom keyword filter
document.getElementById("symptomFilter").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const filtered = diseaseData.filter(disease =>
    disease.symptoms.toLowerCase().includes(keyword)
  );
  displayDiseases(filtered);
});