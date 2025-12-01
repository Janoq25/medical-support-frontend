// Simulated AI API calls with delay

export async function requestAIOpinion(indicators) {
    // Simulate 2-second API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const gptResponse = {
        model: 'GPT-4',
        diagnosis: `Basado en los indicadores proporcionados, el paciente presenta signos clínicos compatibles con Anorexia Nerviosa. El IMC de ${indicators.physical?.imc || 'N/A'} está significativamente por debajo del rango saludable. Se observa restricción alimentaria severa (${indicators.behavioral?.foodRestriction || 'N/A'}/10), distorsión de la imagen corporal (${indicators.psychological?.bodyImage || 'N/A'}/10) y ejercicio excesivo (${indicators.behavioral?.exercise || 'N/A'}/10). Los niveles de ansiedad y depresión son elevados, con baja autoestima. Se recomienda intervención multidisciplinaria inmediata incluyendo soporte nutricional, terapia cognitivo-conductual y evaluación psiquiátrica.`,
        confidence: 0.87,
        prompt: `Analiza los siguientes indicadores médicos y proporciona un diagnóstico preliminar para TCA:\n- IMC: ${indicators.physical?.imc}\n- Restricción alimentaria: ${indicators.behavioral?.foodRestriction}/10\n- Imagen corporal: ${indicators.psychological?.bodyImage}/10\n- Ansiedad: ${indicators.psychological?.anxiety}/10\n- Depresión: ${indicators.psychological?.depression}/10`,
    };

    const deepseekResponse = {
        model: 'DeepSeek',
        diagnosis: `El análisis de los indicadores clínicos sugiere un cuadro de Anorexia Nerviosa con criterios DSM-5 cumplidos. Destacan: peso corporal significativamente bajo (IMC ${indicators.physical?.imc || 'N/A'}), miedo intenso a ganar peso evidenciado por restricción alimentaria severa (${indicators.behavioral?.foodRestriction || 'N/A'}/10), y alteración en la percepción del peso corporal (${indicators.psychological?.bodyImage || 'N/A'}/10). La frecuencia cardíaca de ${indicators.physical?.heartRate || 'N/A'} lpm indica posible bradicardia. Comorbilidad con trastornos de ansiedad y depresión. Recomendación: hospitalización para estabilización médica, seguimiento nutricional intensivo y psicoterapia especializada.`,
        confidence: 0.92,
        prompt: `Evalúa estos indicadores clínicos para diagnóstico de TCA según DSM-5:\n- Peso: ${indicators.physical?.weight}kg, Altura: ${indicators.physical?.height}cm\n- FC: ${indicators.physical?.heartRate} lpm\n- Restricción: ${indicators.behavioral?.foodRestriction}/10\n- Atracones: ${indicators.behavioral?.bingeing}/10\n- Purgas: ${indicators.behavioral?.purging}/10`,
    };

    return {
        gpt: gptResponse,
        deepseek: deepseekResponse,
    };
}
