"use client";

import { useEffect, useState, use } from "react";
import Card, { CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import OptionsGroup from "@/components/ui/OptionsGroup";
import {
  ChevronRight,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Save,
} from "lucide-react";
import { generateConsultationPrompt } from "@/services/utils/promptGenerator";
import { getIndicators } from "@/services/indicatorsApi";
import { requestAIOpinion } from "@/services/aiSimulation";
import { getPatient } from "@/services/patientApi";
import { createInquiry } from "@/services/inquiriesApi";
import { emitToast } from "@/services/utils/toast";
import { fetchAIResponse } from "@/services/aiApi";

export default function ConsultaPage({ params }) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.patientId;

  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState(null);

  const [indicators, setIndicators] = useState([]);
  const [indicatorValues, setIndicatorValues] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [aiResponses, setAiResponses] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [feedback, setFeedback] = useState("");
  const [patientState, setPatientState] = useState("stable"); // stable | in_treatment | critical
  const [selectedModel, setSelectedModel] = useState(null);
  const [showPrompt, setShowPrompt] = useState({ gpt: false, deepseek: false });
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [calcInputs, setCalcInputs] = useState({
    heightM: "",
    weightKg: "",
    initialWeightKg: "",
  });
  const [physicalInputsDisabled, setPhysicalInputsDisabled] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoadingPatient(true);
        const data = await getPatient(patientId);
        setPatient(data);
        setPatientError(null);
      } catch (err) {
        console.error("Error fetching patient:", err);
        setPatientError(err.message || "No se pudo cargar el paciente");
      } finally {
        setLoadingPatient(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoadingIndicators(true);
        const data = await getIndicators();
        console.log("Fetched indicators:", data);
        setIndicators(data);
        // Initialize indicator values
        const initialValues = {};
        data.forEach((indicator) => {
          initialValues[indicator.id] = indicator.minRegularValue || 0;
        });
        setIndicatorValues(initialValues);
      } catch (err) {
        console.error("Error fetching indicators:", err);
      } finally {
        setLoadingIndicators(false);
      }
    };

    fetchIndicators();
  }, []);

  const handleRequestAI = async () => {
     if (physicalInputsDisabled) {
       showFeedbackToast("Por favor, calcule y aplique los indicadores físicos primero.");
       return;
     }

    setLoadingAI(true);
    setAiResponses(null);
    setSelectedModel(null);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const prompt = generateConsultationPrompt(patient, indicators, indicatorValues);
      console.log("Generated Prompt:", prompt);

      // Parallel requests (optimized)
      const [openaiResponse, deepseekResponse] = await Promise.all([
        fetchAIResponse("openai/gpt-oss-120b:free", prompt),
        fetchAIResponse("nex-agi/deepseek-v3.1-nex-n1:free", prompt)
      ]);

      const responses = {
        gpt: { ...openaiResponse, prompt }, // Inject prompt into response object for display
        deepseek: { ...deepseekResponse, prompt } // Inject prompt into response object for display
      };

      console.log("Received AI responses:", responses);
      setAiResponses(responses);
    } catch (error) {
      console.error("Error soliciting AI opinion:", error);
      emitToast({ message: "Error al consultar a la IA. Intente nuevamente.", type: "error" });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSelectDiagnosis = (model, diagnosisText) => {
    setDiagnosis(diagnosisText);
    setSelectedModel(model);
  };

  const updateIndicatorValue = (indicatorId, value) => {
    setIndicatorValues((prev) => ({
      ...prev,
      [indicatorId]: parseFloat(value) || 0,
    }));
  };

  const computeBMI = () => {
    const h = parseFloat(calcInputs.heightM);
    const w = parseFloat(calcInputs.weightKg);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return w / (h * h);
  };

  const computeWeightVariation = () => {
    const w = parseFloat(calcInputs.weightKg);
    const i = parseFloat(calcInputs.initialWeightKg);
    if (!w || !i || i <= 0) return null;
    return ((w - i) / i) * 100;
  };

  const applyCalculatedIndicators = () => {
    const bmi = computeBMI();
    const variation = computeWeightVariation();

    const nextValues = { ...indicatorValues };
    let applied = 0;

    const findByName = (substr) =>
      indicators.find((ind) => ind.name === substr);
    const bmiIndicator =
      findByName("Índice de Masa Corporal (IMC)") || indicators.find((ind) => ind.id === "1");
    const variationIndicator =
      findByName("Variación peso") ||
      indicators.find((ind) => ind.id === "2");

    if (bmiIndicator && bmi !== null) {
      nextValues[bmiIndicator.id] = parseFloat(bmi.toFixed(2));
      applied += 1;
    }
    if (variationIndicator && variation !== null) {
      nextValues[variationIndicator.id] = parseFloat(variation.toFixed(2));
      applied += 1;
    }

    setIndicatorValues(nextValues);
    if (applied > 1) {
      emitToast({
        message: "Indicadores físicos calculados y aplicados.",
        type: "success",
      });
      setPhysicalInputsDisabled(false);
    } else {
      emitToast({
        message:
          "Complete los campos de la calculadora para aplicar los indicadores.",
        type: "warning",
      });
    }
  };

  const showFeedbackToast = (message) => {
    emitToast({ message, type: "info" });
  };

  const handleSaveInquiry = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      if (!diagnosis.trim()) {
        throw new Error("Ingrese un diagnóstico antes de guardar la consulta");
      }

      const type_diagnosis =
        selectedModel === "gpt"
          ? "chatgpt"
          : selectedModel === "deepseek"
            ? "deepseek"
            : "normal";

      const modelData =
        selectedModel && aiResponses ? aiResponses[selectedModel] : null;

      const payload = {
        patientId,
        diagnosis,
        patient_state: patientState,
        type_diagnosis,
        feedback,
        risk_level: null,
        ai_prompt: modelData?.prompt || null,
        ai_response: modelData?.diagnosis || null,
        ai_confidence: modelData?.confidence || null,
        indicators: [], // Sin indicadores reales en backend aún
      };

      await createInquiry(payload);
      setSaveSuccess(true);
    } catch (err) {
      console.error("Error saving inquiry:", err);
      setSaveError(err.message || "No se pudo guardar la consulta");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPatient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p className="text-sage-600 mt-4">Cargando paciente...</p>
        </div>
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-sage-900">Consulta</h1>
        <Card>
          <CardContent className="text-status-error">
            {patientError || "Paciente no encontrado"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-sage-500">
        <span>Nueva Consulta</span>
        <ChevronRight size={16} />
        <span className="text-sage-900 font-medium">
          {patient.name} {patient.lastname}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-sage-900 tracking-tight">
            Nueva Consulta
          </h1>
          <p className="text-sage-500 mt-1 font-medium">
            Paciente: {patient.name} {patient.lastname}
          </p>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT COLUMN - Inputs */}
        <div className="space-y-6">
          {/* Indicators Section */}
          <Card>
            <CardHeader>
              <CardTitle>Indicadores del Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingIndicators ? (
                <div className="text-center py-8 text-sage-500">
                  Cargando indicadores...
                </div>
              ) : (
                <>
                  {/* Calculadora de Indicadores Físicos */}
                  <div>
                    <h4 className="font-semibold text-sage-900 mb-3">
                      Calculadora de Indicadores Físicos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Estatura (m)"
                        type="number"
                        step="0.01"
                        value={calcInputs.heightM}
                        onChange={(e) =>
                          setCalcInputs((ci) => ({
                            ...ci,
                            heightM: e.target.value,
                          }))
                        }
                        placeholder="Ej: 1.75"
                      />
                      <Input
                        label="Peso actual (kg)"
                        type="number"
                        step="0.1"
                        value={calcInputs.weightKg}
                        onChange={(e) =>
                          setCalcInputs((ci) => ({
                            ...ci,
                            weightKg: e.target.value,
                          }))
                        }
                        placeholder="Ej: 68.5"
                      />
                      <Input
                        label="Peso inicial hace 3 meses (kg)"
                        type="number"
                        step="0.1"
                        value={calcInputs.initialWeightKg}
                        onChange={(e) =>
                          setCalcInputs((ci) => ({
                            ...ci,
                            initialWeightKg: e.target.value,
                          }))
                        }
                        placeholder="Ej: 72.0"
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-sage-50/50 rounded-2xl border border-sage-100">
                        <p className="text-sm text-sage-600 font-medium">
                          IMC (kg/m²)
                        </p>
                        <p className="text-xl font-bold text-sage-800">
                          {computeBMI() !== null
                            ? computeBMI().toFixed(2)
                            : "—"}
                        </p>
                      </div>
                      <div className="p-4 bg-sage-50/50 rounded-2xl border border-sage-100">
                        <p className="text-sm text-sage-600 font-medium">
                          Variación de peso (%)
                        </p>
                        <p className="text-xl font-bold text-sage-800">
                          {computeWeightVariation() !== null
                            ? computeWeightVariation().toFixed(2)
                            : "—"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={applyCalculatedIndicators}
                        >
                          Aplicar a indicadores
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Indicadores Físicos */}
                  <div>
                    <h4 className="font-semibold text-sage-900 mb-3">
                      Indicadores Físicos
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {indicators
                        .filter((ind) => ind.type === "Físico")
                        .map((indicator) => (
                          <div
                            key={indicator.id}
                            onClick={
                              physicalInputsDisabled
                                ? () =>
                                  showFeedbackToast(
                                    "Recuerda calcular los indicadores físicos primero."
                                  )
                                : null
                            }
                          >
                            <Input
                              label={indicator.name}
                              type="number"
                              step={
                                indicator.inputType === "percentage"
                                  ? "0.01"
                                  : "0.1"
                              }
                              value={indicatorValues[indicator.id] || 0}
                              onChange={(e) =>
                                updateIndicatorValue(
                                  indicator.id,
                                  e.target.value
                                )
                              }
                              readOnly={physicalInputsDisabled}
                              className={
                                physicalInputsDisabled
                                  ? "bg-sand-100 text-sand-500 cursor-not-allowed border-sand-200"
                                  : ""
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Indicadores Psicológicos */}
                  <div>
                    <h4 className="font-semibold text-sage-900 mb-3">
                      Indicadores Psicológicos
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {indicators
                        .filter((ind) => ind.type === "Psicológico")
                        .map((indicator) => (
                          <div key={indicator.id}>
                            <label className="text-sm font-bold text-sage-700 mb-2 block">
                              {indicator.name.replace(" (0–10)", "")}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              value={indicatorValues[indicator.id] || 0}
                              onChange={(e) =>
                                updateIndicatorValue(
                                  indicator.id,
                                  e.target.value
                                )
                              }
                              className="w-full h-3 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                            />
                            <div className="flex justify-between text-xs text-sage-500 mt-1 font-medium">
                              <span>0</span>
                              <span className="font-bold text-sage-700">
                                {(indicatorValues[indicator.id] || 0).toFixed(
                                  1
                                )}
                                /10
                              </span>
                              <span>10</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Indicadores Conductuales */}
                  <div>
                    <h4 className="font-semibold text-sage-900 mb-3">
                      Indicadores Conductuales
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {indicators
                        .filter((ind) => ind.type === "Conductual")
                        .map((indicator) => (
                          <div key={indicator.id}>
                            {indicator.inputType === "scale_0_10" ? (
                              <>
                                <label className="text-sm font-bold text-sage-700 mb-2 block">
                                  {indicator.name.replace(" (0–10)", "")}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={indicatorValues[indicator.id] || 0}
                                  onChange={(e) =>
                                    updateIndicatorValue(
                                      indicator.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-full h-3 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                                />
                                <div className="flex justify-between text-xs text-sage-500 mt-1 font-medium">
                                  <span>0</span>
                                  <span className="font-bold text-sage-700">
                                    {(
                                      indicatorValues[indicator.id] || 0
                                    ).toFixed(1)}
                                    /10
                                  </span>
                                  <span>10</span>
                                </div>
                              </>
                            ) : (
                              <Input
                                label={indicator.name}
                                type="number"
                                step="1"
                                placeholder={indicatorValues[indicator.id] || 0}
                                onChange={(e) =>
                                  updateIndicatorValue(
                                    indicator.id,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Request AI Button */}
          <Button
            variant="primary"
            className="w-full py-5 text-lg flex items-center justify-center gap-2 shadow-lg shadow-sage-200/50 hover:scale-[1.02]"
             onClick={() => {
               if (physicalInputsDisabled) {
                 showFeedbackToast("Por favor, calcule y aplique los indicadores físicos primero.");
               } else {
                 handleRequestAI();
               }
             }}
             disabled={loadingAI || physicalInputsDisabled}
          >
            {loadingAI ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Consultando IA...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Solicitar Segunda Opinión IA
              </>
            )}
          </Button>

          {/* Diagnosis Section */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico Final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Diagnóstico"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={8}
                placeholder="Escriba el diagnóstico final aquí o seleccione una respuesta de IA..."
              />

              <div className="space-y-2">
                <label className="text-sm font-bold text-sage-700">
                  Feedback / Notas
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Observaciones, plan de acción, motivos de la selección..."
                />
              </div>

              <div className="flex items-center gap-3">
                <OptionsGroup
                  options={[
                    { value: "stable", label: "Estable" },
                    { value: "in_treatment", label: "En tratamiento" },
                    { value: "critical", label: "Crítico" },
                  ]}
                  defaultValue={patientState}
                  onSelect={setPatientState}
                  label="Estado del paciente"
                />
              </div>

              {saveError && (
                <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-2xl text-sm font-medium">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="bg-status-success/10 border border-status-success/20 text-status-success px-4 py-3 rounded-2xl text-sm font-medium">
                  Consulta guardada correctamente.
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2 py-4"
                  onClick={handleSaveInquiry}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Guardar Consulta
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - AI Responses */}
        <div className="space-y-6">
          {loadingAI && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="py-6">
                    <div className="h-4 bg-sage-100 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-sage-50 rounded"></div>
                      <div className="h-3 bg-sage-50 rounded"></div>
                      <div className="h-3 bg-sage-50 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {aiResponses && !loadingAI && (
            <>
              {/* GPT Response - Sage/Green Theme */}
              <Card
                hover
                className={`group relative cursor-pointer transition-all duration-300 ${selectedModel === "gpt"
                  ? "ring-2 ring-sage-500 shadow-soft scale-[1.01]"
                  : "hover:scale-[1.01]"
                  }`}
              >
                <CardHeader className="bg-sage-50/80 border-b border-sage-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        GPT
                      </div>
                      <CardTitle className="text-sage-800">
                        Respuesta de GPT
                      </CardTitle>
                    </div>
                    <span className="text-xs font-bold text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
                      {(aiResponses.gpt.confidence)}% Confianza
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-sm text-sage-700 leading-relaxed">
                    {aiResponses.gpt.diagnosis}
                  </p>

                  <button
                    onClick={() =>
                      setShowPrompt((prev) => ({ ...prev, gpt: !prev.gpt }))
                    }
                    className="text-xs font-semibold text-sage-600 hover:text-sage-800 cursor-pointer underline decoration-sage-300 underline-offset-4"
                  >
                    {showPrompt.gpt ? "Ocultar" : "Ver"} prompt enviado
                  </button>

                  {showPrompt.gpt && (
                    <div className="bg-sand-50 p-4 rounded-2xl text-xs text-sage-600 font-mono border border-sand-200">
                      {aiResponses.gpt.prompt}
                    </div>
                  )}

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                    <Button
                      variant="success"
                      className="w-full flex items-center justify-center gap-2 bg-sage-600 hover:bg-sage-700"
                      onClick={() =>
                        handleSelectDiagnosis("gpt", aiResponses.gpt.diagnosis)
                      }
                    >
                      {selectedModel === "gpt" ? (
                        <>
                          <Check size={16} />
                          Diagnóstico Seleccionado
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Usar este diagnóstico como base
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* DeepSeek Response - Terracotta Theme */}
              <Card
                hover
                className={`group relative cursor-pointer transition-all duration-300 ${selectedModel === "deepseek"
                  ? "ring-2 ring-terracotta-400 shadow-soft scale-[1.01]"
                  : "hover:scale-[1.01]"
                  }`}
              >
                <CardHeader className="bg-terracotta-50/80 border-b border-terracotta-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        DS
                      </div>
                      <CardTitle className="text-terracotta-800">
                        Respuesta de DeepSeek
                      </CardTitle>
                    </div>
                    <span className="text-xs font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full">
                      {(aiResponses.deepseek.confidence)}% Confianza
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-sm text-sand-800 leading-relaxed">
                    {aiResponses.deepseek.diagnosis}
                  </p>

                  <button
                    onClick={() =>
                      setShowPrompt((prev) => ({
                        ...prev,
                        deepseek: !prev.deepseek,
                      }))
                    }
                    className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-800 cursor-pointer underline decoration-terracotta-300 underline-offset-4"
                  >
                    {showPrompt.deepseek ? "Ocultar" : "Ver"} prompt enviado
                  </button>

                  {showPrompt.deepseek && (
                    <div className="bg-sand-50 p-4 rounded-2xl text-xs text-sand-600 font-mono border border-sand-200">
                      {aiResponses.deepseek.prompt}
                    </div>
                  )}

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                    <Button
                      variant="primary"
                      className="w-full flex items-center justify-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 focus:ring-terracotta-300"
                      onClick={() =>
                        handleSelectDiagnosis(
                          "deepseek",
                          aiResponses.deepseek.diagnosis
                        )
                      }
                    >
                      {selectedModel === "deepseek" ? (
                        <>
                          <Check size={16} />
                          Diagnóstico Seleccionado
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Usar este diagnóstico como base
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}