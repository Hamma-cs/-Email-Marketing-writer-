import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { EmailFormData, EmailSection } from '../types';

const emailSectionSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The English name of the section as specified in the instructions.' },
        content: { type: Type.STRING, description: 'The proposed text for the section.' },
        checklist: {
            type: Type.ARRAY,
            description: "A list of evaluation criteria for this section.",
            items: {
                type: Type.OBJECT,
                properties: {
                    criterion: { type: Type.STRING, description: "The English criterion (the key)." },
                    met: { type: Type.BOOLEAN, description: "Whether the criterion was met." },
                    description: { type: Type.STRING, description: "The description of the criterion in the target language." }
                },
                required: ['criterion', 'met', 'description']
            }
        },
        summary: { type: Type.STRING, description: 'A short summary (optional). Return an empty string if no summary.' },
        error: { type: Type.STRING, description: 'A description of the error if one exists, or an empty string if there is no error.' }
    },
    required: ['name', 'content', 'checklist', 'summary', 'error']
};

const fullEmailSchema = {
    type: Type.OBJECT,
    properties: {
        pre_generation_checklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A brief checklist (3-7 points) outlining the main steps for creating and evaluating the email."
        },
        email_data: {
            type: Type.OBJECT,
            properties: {
                sections: {
                    type: Type.ARRAY,
                    items: emailSectionSchema
                },
                final_review: {
                    type: Type.OBJECT,
                    properties: {
                        mobile_preview: { type: Type.BOOLEAN },
                        links_checked: { type: Type.BOOLEAN },
                        grammar_verified: { type: Type.BOOLEAN },
                        spam_score_ok: { type: Type.BOOLEAN },
                        send_time_suggested: { type: Type.STRING },
                        error: { type: Type.STRING, description: 'Error description, or empty string.' }
                    },
                    required: ['mobile_preview', 'links_checked', 'grammar_verified', 'spam_score_ok', 'send_time_suggested', 'error']
                },
                full_email_text: { type: Type.STRING }
            },
            required: ['sections', 'final_review', 'full_email_text']
        }
    },
    required: ['pre_generation_checklist', 'email_data']
};

const createGenerationPrompt = (formData: EmailFormData, lang: 'ar' | 'en'): string => {
    const isArabic = lang === 'ar';
    const contentLang = isArabic ? "اللغة العربية" : "English";

    const basePrompt = `
You are an expert marketing email copywriter. Your task is to create a complete marketing email based on user inputs. You must follow all steps precisely and your output must be in the specified JSON format.
The content for each section must be written in ${contentLang}.

Step 1: Always start by creating a brief pre-generation checklist (3-5 points) that outlines the key steps you will take to create this email.

Step 2: Generate the email content. For each of the 10 sections below, you must:
1. Write the content for the section in ${contentLang}.
2. Evaluate the content you wrote against **every** specified criterion in its checklist. The 'checklist' result must be an **array of objects**. Each object in the array must contain three fields: 'criterion' (the English key for the criterion from the list below), 'met' (a boolean value you determine based on the content you generated), and 'description' (the ${contentLang} description of the criterion from the list below).

User Inputs:
- Product/Service: ${formData.productName}
- Target Audience: ${formData.audience}
- Main Goal/CTA: ${formData.mainGoal}
- Main Pain Point: ${formData.painPoint}
- Unique Value Proposition: ${formData.valueProp}
- Social Proof: ${formData.socialProof}
- Brand Name: ${formData.brandName}
- Sender Name: ${formData.senderName}
- Sender Title: ${formData.senderTitle}

---

Email Sections and their Checklist Criteria. For each section, use the listed criteria to create the 'checklist' array. Each item in the array must be an object with 'criterion', 'description', and 'met' (which you determine):
1.  **name**: "Preheader / Preview Text"
    -   **checklist_criteria**: [
            { "criterion": "is_40_130_chars", "description": "${isArabic ? "هل النص بين 40-130 حرفًا؟" : "Is the text between 40-130 characters?"}" },
            { "criterion": "complements_subject", "description": "${isArabic ? "هل يكمل سطر الموضوع دون تكراره؟" : "Does it complement the subject line without repeating it?"}" },
            { "criterion": "creates_curiosity", "description": "${isArabic ? "هل يثير الفضول؟" : "Does it create curiosity?"}" }
        ]
2.  **name**: "Subject Line (Hook-Based, Personalised, Curiosity Gap)"
    -   **checklist_criteria**: [
            { "criterion": "is_under_50_chars", "description": "${isArabic ? "هل هو أقل من 50 حرفًا؟" : "Is it under 50 characters?"}" },
            { "criterion": "is_hook_based", "description": "${isArabic ? "هل يعتمد على خطاف جذاب؟" : "Is it hook-based?"}" },
            { "criterion": "is_personalized", "description": "${isArabic ? "هل هو شخصي؟" : "Is it personalized?"}" },
            { "criterion": "creates_curiosity_gap", "description": "${isArabic ? "هل يخلق فجوة فضول؟" : "Does it create a curiosity gap?"}" }
        ]
3.  **name**: "Header Image or Clean Hero Section"
    -   **checklist_criteria**: [
            { "criterion": "is_visually_appealing", "description": "${isArabic ? "هل الوصف جذاب بصريًا؟" : "Is the description visually appealing?"}" },
            { "criterion": "is_brand_consistent", "description": "${isArabic ? "هل يتوافق مع العلامة التجارية؟" : "Is it brand consistent?"}" }
        ]
4.  **name**: "Opening Line (Pattern Interrupt / Rapport Builder)"
    -   **checklist_criteria**: [
            { "criterion": "is_pattern_interrupt", "description": "${isArabic ? "هل يكسر النمط المعتاد؟" : "Is it a pattern interrupt?"}" },
            { "criterion": "builds_rapport", "description": "${isArabic ? "هل يبني علاقة؟" : "Does it build rapport?"}" }
        ]
5.  **name**: "Body Copy (Value Proposition + Pain-Agitate-Solve)"
    -   **checklist_criteria**: [
            { "criterion": "uses_pas_framework", "description": "${isArabic ? "هل يستخدم إطار الألم-الإثارة-الحل؟" : "Does it use the Pain-Agitate-Solve framework?"}" },
            { "criterion": "has_clear_value_prop", "description": "${isArabic ? "هل عرض القيمة واضح؟" : "Is the value proposition clear?"}" },
            { "criterion": "is_benefit_focused", "description": "${isArabic ? "هل يركز على الفوائد؟" : "Is it benefit-focused?"}" }
        ]
6.  **name**: "Social Proof / Micro-Story / Case Snippet"
    -   **checklist_criteria**: [
            { "criterion": "includes_social_proof", "description": "${isArabic ? "هل يتضمن دليلاً اجتماعيًا؟" : "Does it include social proof?"}" },
            { "criterion": "is_believable", "description": "${isArabic ? "هل هو قابل للتصديق؟" : "Is it believable?"}" }
        ]
7.  **name**: "Call-to-Action (Primary CTA – One Clear Goal)"
    -   **checklist_criteria**: [
            { "criterion": "is_single_clear_goal", "description": "${isArabic ? "هل الهدف واحد وواضح؟" : "Is it a single, clear goal?"}" },
            { "criterion": "is_action_oriented", "description": "${isArabic ? "هل النص موجه نحو العمل؟" : "Is it action-oriented?"}" },
            { "criterion": "is_high_contrast", "description": "${isArabic ? "هل وصف التصميم عالي التباين؟" : "Is the design description high-contrast?"}" }
        ]
8.  **name**: "Secondary CTA (Soft Offer / PS-CTA)"
    -   **checklist_criteria**: [
            { "criterion": "is_soft_offer", "description": "${isArabic ? "هل هو عرض بسيط أو بديل؟" : "Is it a soft offer?"}" },
            { "criterion": "is_low_pressure", "description": "${isArabic ? "هل هو منخفض الضغط؟" : "Is it low-pressure?"}" }
        ]
9.  **name**: "Signature Block (Humanised – Name + Brand + Title)"
    -   **checklist_criteria**: [
            { "criterion": "is_humanized", "description": "${isArabic ? "هل التوقيع شخصي؟" : "Is it humanized?"}" },
            { "criterion": "includes_name_brand_title", "description": "${isArabic ? "هل يتضمن الاسم والعلامة التجارية والمنصب؟" : "Does it include Name, Brand, and Title?"}" }
        ]
10. **name**: "Footer (Compliance + Unsubscribe + Legal Info)"
    -   **checklist_criteria**: [
            { "criterion": "has_unsubscribe_link", "description": "${isArabic ? "هل يحتوي على رابط إلغاء اشتراك واضح؟" : "Does it have a clear unsubscribe link?"}" },
            { "criterion": "has_legal_info", "description": "${isArabic ? "هل يتضمن المعلومات القانونية ومعلومات الاتصال؟" : "Does it include legal and contact info?"}" }
        ]

---

Step 3: After creating all sections, conduct a "Final Review Before Sending" and evaluate the following points as boolean values. Also suggest an ideal send time.
- mobile_preview: Is the email structure simple enough for a good mobile view?
- links_checked: (Simulated) Do all links appear ready and correct?
- grammar_verified: Is the grammar and spelling correct?
- spam_score_ok: (Simulated) Is the email likely to have a low spam score (avoids spammy words)?
- send_time_suggested: Suggest an ideal day and time to send this email for the target audience.

---

Step 4: Combine all the generated text content (from Preheader to Footer) into a single string for the 'full_email_text' field.

**Very Important: Your entire response must be a single valid JSON object that strictly adheres to the provided schema. Do not add any text or markdown before or after the JSON object.**
`;

    // A simple way to switch the initial instruction language
    return isArabic ? basePrompt.replace('You are an expert marketing email copywriter.', 'أنت كاتب إيميلات تسويقية خبير ومحترف.') : basePrompt;
};


const createImprovePrompt = (section: EmailSection, notes: string, lang: 'ar' | 'en'): string => {
    const isArabic = lang === 'ar';
    const contentLang = isArabic ? "اللغة العربية" : "English";
    const userFeedback = notes 
        ? (isArabic 
            ? `\n\nالمستخدم قدم الملاحظات التالية للتحسين. الرجاء أخذها في الاعتبار:\n"${notes}"` 
            : `\n\nThe user provided the following feedback for improvement. Please take it into consideration:\n"${notes}"`)
        : '';

    return `
You are an expert copywriter. Your task is to improve a specific section of a marketing email and re-evaluate its criteria. The improved content and checklist description must be in ${contentLang}.

Current Section:
- Name: "${section.name}"
- Current Content: "${section.content}"
- Evaluation Criteria:
${section.checklist.map(item => `- ${item.description} (criterion: ${item.criterion})`).join('\n')}
${userFeedback}

Required:
1. Rewrite the "Current Content" to make it more persuasive, effective, and impactful. If the user provided feedback, make it your priority.
2. After improving, re-evaluate the new content against **all** the evaluation criteria listed above.
3. Return the result as a single valid JSON object that matches the provided schema. The 'checklist' must be a complete array of objects, where each object contains 'criterion', 'met', and 'description' (in ${contentLang}).

**Very Important: Your entire response must be a single valid JSON object that strictly adheres to the provided schema. Do not add any text or markdown before or after the JSON object.**
`;
}

export const generateEmail = async (formData: EmailFormData, lang: 'ar' | 'en', apiKey: string): Promise<GenerateContentResponse> => {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = createGenerationPrompt(formData, lang);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: fullEmailSchema,
                temperature: 0.7,
            },
        });
        return response;
    } catch (error) {
        console.error("Gemini API Error (generateEmail):", error);
        throw new Error("Failed to generate email from Gemini API.");
    }
};

export const improveSection = async (section: EmailSection, notes: string, lang: 'ar' | 'en', apiKey: string): Promise<GenerateContentResponse> => {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = createImprovePrompt(section, notes, lang);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: emailSectionSchema,
                temperature: 0.6,
            },
        });
        return response;
    } catch (error) {
        console.error("Gemini API Error (improveSection):", error);
        throw new Error("Failed to improve section from Gemini API.");
    }
};