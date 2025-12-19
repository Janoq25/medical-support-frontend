/**
 * Generates a structured prompt for the AI based on patient data and indicators.
 * @param {Object} patient - The patient object containing personal details.
 * @param {Array} indicators - List of all available indicators with their metadata.
 * @param {Object} indicatorValues - Key-value pair of indicator IDs and their current values.
 * @returns {string} The formatted prompt to be sent to the AI.
 */
export function generateConsultationPrompt(patient, indicators, indicatorValues) {
    // 1. Patient Context
    let prompt = `Actúa como un médico experto en Trastornos de la Conducta Alimentaria (TCA). Analiza el siguiente caso clínico y proporciona un diagnóstico preliminar.\n\n`;

    prompt += `### DATOS DEL PACIENTE:\n`;
    prompt += `- Nombre: ${patient.name} ${patient.lastname}\n`;
    prompt += `- Edad: ${calculateAge(patient.birthdate)} años\n`;
    prompt += `- Género: ${patient.gender ? "Masculino" : "Femenino"}\n`;

    // 2. Indicators Analysis
    prompt += `### INDICADORES CLÍNICOS REGISTRADOS:\n`;

    const categories = {
        Físico: "Indicadores Físicos",
        Psicológico: "Indicadores Psicológicos",
        Conductual: "Indicadores Conductuales",
    };

    for (const [type, label] of Object.entries(categories)) {
        const typeIndicators = indicators.filter((ind) => ind.type === type);

        if (typeIndicators.length > 0) {
            prompt += `\n**${label}:**\n`;
            typeIndicators.forEach((ind) => {
                const val = indicatorValues[ind.id];
                // Only include if value is defined and not empty string (allow 0)
                if (val !== undefined && val !== "" && val !== null) {
                    const unit = ind.unit ? ` ${ind.unit}` : "";
                    const scale = ind.inputType === "scale_0_10" || ind.name.includes("(0–10)") ? " (Escala 0-10)" : "";
                    prompt += `- ${ind.name}: ${val}${unit}${scale}\n`;
                }
            });
        }
    }

    // 3. Output Format Instruction
    prompt += `\n### Tu tarea es:\n`;
    prompt += `Por favor, proporciona el diagnóstico en un formato estructurado, claro y directo. Incluye:\n`;
    prompt += `1. Analizar los datos proporcionados, desglosando los aspectos físicos, psicológicos y conductuales.\n`;
    prompt += `2. Basado en los criterios del DSM-5, indicar si este perfil sugiere la presencia de un TCA.\n`;
    prompt += `3. Si sugieres un TCA, especifica cuál o cuáles podrían ser los diagnósticos probables.\n`;
    prompt += `4. Si el perfil es atípico o contradictorio, explica por qué.\n\n`;
    prompt += `### FORMATO DE RESPUESTA:\n`;
    prompt += `- Utiliza ÚNICAMENTE texto plano, sin formato markdown, sin negritas, sin asteriscos.\n`;
    prompt += `- NO uses tablas, listas con viñetas ni numeración especial.\n`;
    prompt += `- Máximo 150 palabras.\n`;
    prompt += `- Respuesta clara, directa y legible.\n`;

    return prompt;
}

function calculateAge(birthdate) {
    if (!birthdate) return "Desconocida";
    const birth = new Date(birthdate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}
