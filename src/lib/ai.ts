import { Language } from './translations';

// Standard Interfaces for AI recommendations
export interface AIAnalysisResult {
  itemName: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  explanation: string;
  reasoning: string;
  observations: string;
  recommendations: string[];
  organicSolutions?: string[];
  chemicalSolutions?: string[];
  preventionTips: string[];
  limitations: string;
  expertWarning: string;
  boundingBoxes?: { x: number; y: number; width: number; height: number; label: string }[];
}

export interface AISoilResult {
  healthScore: number;
  nutrients: {
    nitrogen: 'Deficient' | 'Optimal' | 'Excessive';
    phosphorus: 'Deficient' | 'Optimal' | 'Excessive';
    potassium: 'Deficient' | 'Optimal' | 'Excessive';
    organicMatter: 'Low' | 'Medium' | 'High';
  };
  fertilizers: string[];
  suitability: string[];
  improvements: string[];
  reasoning: string;
  limitations: string;
  expertWarning: string;
}

export interface AIChatResult {
  content: string;
  confidence: number;
  limitations: string;
  expertWarning: string;
}

// Sample Mock Dataset for Offline/Demo Mode
const CROP_DISEASES: Record<string, AIAnalysisResult> = {
  tomato_late_blight: {
    itemName: "Tomato Late Blight (Phytophthora infestans)",
    confidence: 94.5,
    severity: "High",
    explanation: "Late blight is a devastating disease caused by a fungus-like oomycete that quickly kills tomatoes. It thrives in cool, wet weather.",
    reasoning: "The leaf shows characteristic dark brown water-soaked lesions starting at the tips, surrounded by a light green halo and pale white velvety fungal growth on the underside.",
    observations: "Large irregular dark spots, pale green borders, white fuzzy growth under humid conditions, stem lesions.",
    recommendations: [
      "Immediately prune and destroy all affected leaves and branches (do not compost).",
      "Ensure drip irrigation is used instead of overhead watering to keep foliage dry.",
      "Apply copper-based protectant fungicide to surrounding healthy plants."
    ],
    preventionTips: [
      "Select certified blight-resistant tomato varieties.",
      "Provide wide spacing (at least 3 feet) between plants to improve air circulation.",
      "Rotate crops annually; avoid planting tomatoes in soil previously used for potatoes."
    ],
    limitations: "Visual symptoms of Late Blight can occasionally overlap with Early Blight or Septoria Leaf Spot. Laboratory PCR testing is required for absolute confirmation.",
    expertWarning: "If late blight is suspected in commercial farming, contact local agricultural extension officers immediately to prevent regional outbreak.",
    boundingBoxes: [
      { x: 15, y: 20, width: 35, height: 40, label: "Necrotic Lesion" },
      { x: 55, y: 45, width: 25, height: 30, label: "Chlorotic Halo" }
    ]
  },
  rice_blast: {
    itemName: "Rice Blast (Magnaporthe oryzae)",
    confidence: 89.0,
    severity: "Medium",
    explanation: "Rice blast is one of the most destructive diseases of rice worldwide, causing diamond-shaped lesions on leaves and neck rot on panicles.",
    reasoning: "The leaf exhibits spindle-shaped (diamond) lesions with greyish centres and dark reddish-brown margins, running parallel to the leaf veins.",
    observations: "Spindle-shaped lesions (1-1.5cm long), necrotic leaf tips, thin drying stems.",
    recommendations: [
      "Avoid excessive nitrogen fertilization, which promotes lush vegetative growth susceptible to the fungus.",
      "Regulate water depth in the fields to reduce plant humidity.",
      "Apply recommended systemic fungicides like Tricyclazole at the first sign of lesions."
    ],
    preventionTips: [
      "Use clean, certified blast-free seeds.",
      "Adopt early planting schedules to escape peak spore release periods.",
      "Burn or deeply plow under stubble and straw from infected crops after harvest."
    ],
    limitations: "Severe blast can be confused with Brown Spot under nutrient-deficient soil conditions.",
    expertWarning: "Neck blast can cause complete crop loss. Inspect fields daily during panicle emergence.",
    boundingBoxes: [
      { x: 30, y: 10, width: 20, height: 60, label: "Blast Spindle" },
      { x: 65, y: 30, width: 15, height: 40, label: "Fungal Necrosis" }
    ]
  },
  corn_rust: {
    itemName: "Corn Common Rust (Puccinia sorghi)",
    confidence: 91.2,
    severity: "Low",
    explanation: "Common rust is a fungal disease that causes orange-brown pustules on corn leaves, decreasing photosynthetic efficiency.",
    reasoning: "The leaf surface is covered with raised, powdery, cinnamon-brown pustules (uredinia) on both upper and lower leaf surfaces.",
    observations: "Raised cinnamon-brown pustules, yellowing leaf blades, powdery rust spore residue.",
    recommendations: [
      "No immediate chemical treatment is typically required if the rust appears late in the season.",
      "If severity is high before silking, apply a foliar fungicide such as Pyraclostrobin.",
      "Ensure adequate balanced soil potassium levels to support disease resistance."
    ],
    preventionTips: [
      "Plant rust-resistant hybrids.",
      "Control weed hosts (like Oxalis species) around field borders.",
      "Practice clean tillage to bury crop debris."
    ],
    limitations: "Common rust can be confused with Southern Rust (Puccinia polysora), which has smaller, lighter-colored pustules.",
    expertWarning: "Southern rust is much more aggressive than common rust. Accurately identify the species before deciding on expensive chemical spraying.",
    boundingBoxes: [
      { x: 20, y: 25, width: 15, height: 15, label: "Rust Pustule" },
      { x: 45, y: 50, width: 20, height: 20, label: "Rust Cluster" },
      { x: 70, y: 15, width: 12, height: 12, label: "Rust Pustule" }
    ]
  },
  apple_scab: {
    itemName: "Apple Scab (Venturia inaequalis)",
    confidence: 88.5,
    severity: "Medium",
    explanation: "Apple scab is a severe disease affecting apple trees, causing olive-green to black velvety spots on leaves and fruit, making it unmarketable.",
    reasoning: "The leaves show olive-green, circular spots with velvety margins, which turn dark brown to black and cause leaf distortion.",
    observations: "Olive-brown velvety spots, puckered leaves, premature leaf drop.",
    recommendations: [
      "Rake and destroy fallen leaves in autumn to reduce the overwintering spore database.",
      "Prune the tree canopy extensively to improve light penetration and speed leaf drying.",
      "Apply protective sulfur or copper sprays early in the spring during green tip stage."
    ],
    preventionTips: [
      "Grow scab-resistant cultivars (e.g., Liberty, Enterprise, Freedom).",
      "Apply urea spray to fallen leaves in late autumn to accelerate leaf decomposition.",
      "Maintain proper tree-to-tree spacing to facilitate air movement."
    ],
    limitations: "Visual diagnosis could overlap with Black Rot or physiological leaf scorch.",
    expertWarning: "Fungicide resistance is common. Alternate chemical families (FRAC groups) when spraying orchards.",
    boundingBoxes: [
      { x: 25, y: 30, width: 30, height: 30, label: "Scab Lesion" },
      { x: 60, y: 20, width: 25, height: 25, label: "Velvety Margin" }
    ]
  },
  cotton_bacterial_blight: {
    itemName: "Cotton Bacterial Blight (Xanthomonas citri pv. malvacearum)",
    confidence: 94.8,
    severity: "High",
    explanation: "Bacterial blight is a major disease of cotton causing water-soaked angular leaf spots, stem lesions (blackarm), and boll rot, leading to substantial yield losses.",
    reasoning: "The leaf demonstrates characteristic angular water-soaked spots restricted by leaf vein margins, shifting from dark green to brown-red, with potential black lesions on surrounding stems.",
    observations: "Angular necrotic lesions, red-brown spot borders, water-soaked tissue appearances.",
    recommendations: [
      "Prune and safely destroy infected cotton foliage to prevent spread.",
      "Avoid sprinkler irrigation; employ drip irrigation to keep canopy foliage dry.",
      "Apply copper oxychloride (0.3%) or recommended bactericidal sprays if spotted early."
    ],
    preventionTips: [
      "Sow only certified acid-delinted disease-free seed cultivars.",
      "Implement a two-year crop rotation with non-hosts like corn, wheat, or sorghum.",
      "Plow under cotton crop residue deeply after harvesting to accelerate decomposition."
    ],
    limitations: "Visual symptoms can look like Alternaria leaf spot or spider mite feeding injuries.",
    expertWarning: "Bacterial blight spreads rapidly in hot, humid climates. Consult a cotton agronomist immediately if symptoms expand to bolls.",
    boundingBoxes: [
      { x: 18, y: 35, width: 32, height: 28, label: "Angular Spot" },
      { x: 56, y: 45, width: 24, height: 32, label: "Vein Necrosis" }
    ]
  }
};

const PESTS: Record<string, AIAnalysisResult> = {
  aphids: {
    itemName: "Aphids (Aphis gossypii)",
    confidence: 96.0,
    severity: "Medium",
    explanation: "Aphids are tiny, soft-bodied insects that suck sap from plant tissues, causing leaf curling, stunting, and transmitting plant viruses.",
    reasoning: "Presence of clusters of small pear-shaped green/black insects on the tender terminal shoots and underside of leaves, accompanied by sticky honeydew.",
    observations: "Dense clusters of green pear-shaped insects, sticky honeydew secretions, black sooty mold on lower leaves, leaf curling.",
    recommendations: [
      "Prune heavily infested flower buds or leaves.",
      "Introduce beneficial predators like ladybugs, lacewings, or hoverfly larvae.",
      "Apply organic neem oil spray or insecticidal soap solution."
    ],
    organicSolutions: [
      "Neem oil spray (1-2% concentration) applied in the early morning or evening.",
      "High-pressure water spray to physically dislodge aphids from stems and leaves.",
      "Companion planting with garlic, marigold, or chives to naturally repel them."
    ],
    chemicalSolutions: [
      "Spray systemic insecticides such as Imidacloprid for severe infestations.",
      "Use contact pyrethroids, ensuring thorough spray coverage on leaf undersides."
    ],
    preventionTips: [
      "Avoid over-fertilizing with nitrogen, which triggers fast, tender sap growth that attracts aphids.",
      "Set up yellow sticky traps around the garden/greenhouse.",
      "Control ants in the vicinity, as they protect aphids from predators to harvest honeydew."
    ],
    limitations: "Aphid presence might mask other sap-sucking pests like Whiteflies or Thrips. Fine identification of aphid-vectored viruses requires laboratory testing.",
    expertWarning: "Aphids reproduce parthenogenetically (without mating) and extremely fast. A small cluster can double in size in 48 hours. Monitor closely.",
    boundingBoxes: [
      { x: 35, y: 40, width: 30, height: 35, label: "Aphid Colony" },
      { x: 10, y: 70, width: 20, height: 20, label: "Honeydew Spot" }
    ]
  },
  armyworm: {
    itemName: "Fall Armyworm (Spodoptera frugiperda)",
    confidence: 93.0,
    severity: "High",
    explanation: "The Fall Armyworm is a highly destructive moth larva that feeds aggressively on corn, sorghum, rice, and sugar cane leaves, leaving skeletonized ruins.",
    reasoning: "The leaves show irregular 'windowpane' feeding holes and large ragged chewing edges, with dark green caterpillars showing an inverted Y-shape on their head capsule.",
    observations: "Ragged chewing damage, yellow-brown caterpillars with four black spots on the tail end, sawdust-like frass (waste) inside the whorl.",
    recommendations: [
      "Handpick and destroy caterpillars if dealing with home gardens.",
      "Apply Bacillus thuringiensis (Bt) powder or spray, which targets caterpillars organically.",
      "Spray chemical insecticides during early morning or late evening when larvae are actively feeding."
    ],
    organicSolutions: [
      "Bacillus thuringiensis (Bt var. kurstaki) suspension sprays.",
      "Neem-based formulations (Azadirachtin) to disrupt larval development.",
      "Apply wood ash or fine sand directly into the corn whorls to dry out larvae."
    ],
    chemicalSolutions: [
      "Foliar sprays containing Spinetoram, Chlorantraniliprole, or Emamectin benzoate.",
      "Spray directly into the crop whorl where caterpillars hide."
    ],
    preventionTips: [
      "Practice early sowing to allow crops to mature before armyworm populations build up.",
      "Implement crop rotation with non-grass crops.",
      "Erect bird perches in fields to invite natural predators."
    ],
    limitations: "Early-stage armyworms can easily be confused with Corn Earworm (Helicoverpa zea) or Cutworms.",
    expertWarning: "Fall Armyworms migrate in massive groups. If you see more than 10-15% of plants showing fresh damage, chemical intervention is critical to save the yield.",
    boundingBoxes: [
      { x: 40, y: 30, width: 25, height: 50, label: "Armyworm Larva" },
      { x: 15, y: 15, width: 30, height: 30, label: "Chewed Leaf whorl" }
    ]
  },
  spider_mites: {
    itemName: "Two-Spotted Spider Mite (Tetranychus urticae)",
    confidence: 87.5,
    severity: "Medium",
    explanation: "Spider mites are microscopic arachnids that puncture plant cells to feed, causing fine yellow speckling (stippling) and eventual leaf drop.",
    reasoning: "The leaf displays a speckled yellow stippling pattern, and very fine silk webbing is visible on the nodes and undersides of leaves.",
    observations: "Yellow speckling, fine silky webbing on leaf-stem joints, dry dusty leaf feel.",
    recommendations: [
      "Increase humidity around the plants by misting (mites thrive in hot, dry, dusty settings).",
      "Spray the plants with insecticidal oils or horticultural soap.",
      "Release predatory mites (e.g., Phytoseiulus persimilis) to feed on the spider mites."
    ],
    organicSolutions: [
      "Horticultural oils, Neem oil, or Rosemary oil sprays.",
      "Potassium salts of fatty acids (insecticidal soaps).",
      "Regular overhead washing with water to increase moisture and disrupt webs."
    ],
    chemicalSolutions: [
      "Use specific miticides/acaricides (like Abamectin, Spiromesifen, or Bifenazate).",
      "Avoid broad-spectrum pyrethroid insecticides, which kill natural predators and worsen mite flareups."
    ],
    preventionTips: [
      "Keep plants well-watered; water-stressed plants are highly susceptible to mites.",
      "Quarantine new plants for 14 days before introducing them to the greenhouse/garden.",
      "Minimize dusty soil roads next to crop fields."
    ],
    limitations: "Early infestations are hard to see with the naked eye. Mite damage can look like nutrient deficiency or ozone air pollution injury.",
    expertWarning: "Spider mites have developed resistance to many chemicals. Always rotate pesticide modes of action.",
    boundingBoxes: [
      { x: 20, y: 15, width: 60, height: 65, label: "Speckling & Webbing" }
    ]
  }
};

const WASTE_ITEMS: Record<string, AIAnalysisResult> = {
  organic: {
    itemName: "Organic Biodegradable Waste",
    confidence: 97.0,
    severity: "Low",
    explanation: "This item consists of vegetable scraps, fruit peels, leaf litter, or kitchen food residues which decompose naturally.",
    reasoning: "Visual traits show biological material undergoing organic breakdown (e.g. food scrap, leaf fibers).",
    observations: "Plant matter, moist organic structure, natural textures.",
    recommendations: [
      "Segregate this waste into a green organic compost bin.",
      "Use it for vermicomposting to generate nutrient-rich organic manure for your crops.",
      "Avoid mixing with plastics or metal items which ruin compost quality."
    ],
    preventionTips: [
      "Plan meal portions to minimize kitchen waste.",
      "Compost at source to reduce municipal dump burdens.",
      "Dry leaf litter instead of burning it to prevent air pollution."
    ],
    limitations: "Contamination with pesticides or heavy metals on some peels can impact compost quality if not washed.",
    expertWarning: "Do not throw meat scraps, dairy, or pet waste in standard garden compost bins, as they attract pests and pathogens.",
    boundingBoxes: [
      { x: 20, y: 20, width: 60, height: 60, label: "Organic Compostable" }
    ]
  },
  plastic: {
    itemName: "Plastic Recyclable Waste",
    confidence: 95.5,
    severity: "Medium",
    explanation: "This item is a plastic bottle, container, or bag. Plastics take hundreds of years to break down and cause microplastic pollution.",
    reasoning: "Visual identification shows synthetic polymers, typical beverage bottle shape, or plastic films.",
    observations: "Synthetic glossy surface, PET/HDPE labeling, transparent or colored plastic polymer.",
    recommendations: [
      "Wash off food residues and dry the plastic item.",
      "Deposit into the blue recycling bin.",
      "Compress bottles to save space in storage containers."
    ],
    preventionTips: [
      "Switch to reusable stainless steel or glass containers.",
      "Carry cloth bags when purchasing household goods.",
      "Avoid single-use plastics entirely."
    ],
    limitations: "Many thin-film plastics or laminated plastics are not recyclable locally. Check code numbers (1-7).",
    expertWarning: "Burning plastics releases toxic dioxins and furans into the atmosphere. Never burn plastic waste.",
    boundingBoxes: [
      { x: 30, y: 15, width: 40, height: 70, label: "Recyclable Plastic" }
    ]
  },
  metal: {
    itemName: "Metal Waste",
    confidence: 98.0,
    severity: "Low",
    explanation: "This item is aluminum, tin, or iron scrap/can. Metals are highly recyclable and have high reuse value.",
    reasoning: "Metallic luster, cylinder tin can shape, or heavy iron outline detected.",
    observations: "Reflective silver/gold surface, rigid metal structure, potential rust spots.",
    recommendations: [
      "Rinse food cans to prevent odor and insects.",
      "Place in metal bin for scrap collection or municipal recycling.",
      "Ensure sharp edges are bent inward to protect waste workers."
    ],
    preventionTips: [
      "Choose bulk items to minimize total metal canning.",
      "Upcycle metal cans as flower pots or tool organizers."
    ],
    limitations: "Rust and mixed alloy metals might require specialized recycling centers.",
    expertWarning: "Aerosol cans can explode if punctured or exposed to heat. Handle pressurized metal cans with caution.",
    boundingBoxes: [
      { x: 25, y: 25, width: 50, height: 50, label: "Metal/Aluminium" }
    ]
  },
  paper: {
    itemName: "Paper & Cardboard",
    confidence: 96.5,
    severity: "Low",
    explanation: "This item is clean paper, newspaper, or cardboard packaging.",
    reasoning: "Fibrous matte paper texture, printed ink layouts, flat cardboard folds.",
    observations: "Paper fibers, cardboard fluting, readable text layouts.",
    recommendations: [
      "Keep paper dry. Wet paper breaks down during sorting and cannot be recycled easily.",
      "Flatten cardboard boxes before putting them in the recycling bin.",
      "Remove plastic tape or metal staples if possible."
    ],
    preventionTips: [
      "Select paperless billing.",
      "Use double-sided printing.",
      "Repurpose cardboard boxes for shipping or storage."
    ],
    limitations: "Pizza boxes or paper contaminated with oil/grease cannot be recycled (compost them instead!).",
    expertWarning: "Wax-coated papers or receipts (thermal paper containing BPA) should not be composted or recycled with regular paper.",
    boundingBoxes: [
      { x: 15, y: 15, width: 70, height: 70, label: "Clean Cardboard/Paper" }
    ]
  },
  ewaste: {
    itemName: "Electronic Waste (E-Waste)",
    confidence: 94.0,
    severity: "High",
    explanation: "E-waste contains heavy metals (lead, mercury, cadmium) and precious metals, which cause severe environmental contamination if dumped in landfills.",
    reasoning: "Printed circuit boards, battery cells, electronic wiring, or screen panels detected.",
    observations: "IC chips, wires, battery casing, glass display layer.",
    recommendations: [
      "Store separately from other household waste in a dry location.",
      "Deliver to an authorized e-waste collection center or manufacturer take-back hub.",
      "Do not try to dismantle screens or batteries yourself."
    ],
    preventionTips: [
      "Repair devices instead of upgrading frequently.",
      "Donate working older gadgets to schools or communities in need.",
      "Buy durable electronics with long lifecycle support."
    ],
    limitations: "Local collection points may charge fees for heavy items or CRT monitors.",
    expertWarning: "Damaged lithium batteries can ignite or leak corrosive, toxic chemicals. Never discard batteries in standard bins.",
    boundingBoxes: [
      { x: 20, y: 20, width: 60, height: 60, label: "Hazardous E-Waste" }
    ]
  }
};

export class AIService {
  
  /**
   * Universal translation helper via Groq LLM (fall back to Gemini or English)
   */
  private static async translateResponseIfNeeded(text: string, targetLang: Language, keys: { groq?: string; gemini?: string }): Promise<string> {
    if (targetLang === 'en') return text;
    
    const groqKey = keys.groq || process.env.GROQ_API_KEY;
    const geminiKey = keys.gemini || process.env.GEMINI_API_KEY;

    if (groqKey) {
      try {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const prompt = `Translate the following agricultural advisory text to ${
          targetLang === 'te' ? 'Telugu' : 'Hindi'
        }. Keep formatting identical. Do not add markdown annotations:\n\n${text}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        const data = await response.json();
        const translated = data?.choices?.[0]?.message?.content;
        if (translated) return translated.trim();
      } catch (err) {
        console.error("Groq translation error:", err);
      }
    }

    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const prompt = `Translate this to ${targetLang === 'te' ? 'Telugu' : 'Hindi'}:\n\n${text}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        
        const data = await response.json();
        const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (translated) return translated.trim();
      } catch (err) {
        console.error("Gemini translation error:", err);
      }
    }

    return text;
  }

  /**
   * 1. Image Classification API (Groq Llama Vision vs Gemini Vision)
   */

  /**
   * Build a strong vision analysis prompt for disease/pest/waste detection.
   * cropHint is emphasized so the model focuses on the correct plant.
   */
  private static buildVisionPrompt(
    type: 'disease' | 'pest' | 'waste',
    cropHint?: string
  ): string {
    const cropContext = cropHint
      ? `IMPORTANT: The farmer has told you this image is from a **${cropHint} plant/crop**. You MUST analyze it specifically for ${cropHint} diseases and problems. DO NOT diagnose diseases of other unrelated crops.`
      : `The crop type is unknown — visually identify the plant first, then diagnose the condition.`;

    const typeContext =
      type === 'disease'
        ? `This is a CROP DISEASE analysis. Look for: leaf spots, lesions, discoloration, wilting, blight, rot, mold, rust, or any signs of fungal, bacterial, or viral infection on the plant.`
        : type === 'pest'
        ? `This is a PEST IDENTIFICATION analysis. Look for: insects, larvae, eggs, feeding damage, webbing, honeydew residue, or any pest infestation signs.`
        : `This is a WASTE CLASSIFICATION analysis. Identify the type of waste material (organic, plastic, metal, paper, e-waste, etc.) and provide disposal guidance.`;

    return `You are AgriVision AI — a world-class agricultural plant pathologist and computer vision expert with 20+ years of field experience.

${cropContext}

Task: ${typeContext}

STRICT RULES:
1. Base your diagnosis ONLY on what you can visually observe in this image. Do NOT hallucinate or guess diseases without visual evidence.
2. If the image shows ${cropHint || 'a plant'}, describe specifically what you see on THAT crop.
3. Your itemName must include the crop name (e.g., "Cotton Bacterial Blight" not just "Bacterial Blight").
4. Confidence must reflect actual image clarity and visual evidence (50-99 range).
5. Output ONLY a valid JSON object. Do NOT wrap in markdown code blocks.

Required JSON schema:
{
  "itemName": "[CropName] [DiseaseName/PestName] (Scientific name)",
  "confidence": 87.5,
  "severity": "Low" | "Medium" | "High",
  "explanation": "2-3 sentences: what it is, how it affects the ${cropHint || 'crop'}, and its impact on yield",
  "reasoning": "Specific visual evidence from THIS image that supports your diagnosis (describe actual colors, patterns, spots seen)",
  "observations": "Bullet list of 3-5 physical features visible in the image",
  "recommendations": ["Immediate action 1", "Action 2", "Action 3"],
  "organicSolutions": ["Organic treatment 1", "Organic treatment 2"],
  "chemicalSolutions": ["Chemical: name and concentration"],
  "preventionTips": ["Prevention tip 1", "Prevention tip 2"],
  "limitations": "What other diseases could look similar and why lab confirmation helps",
  "expertWarning": "When to consult a certified agronomist or extension officer",
  "boundingBoxes": [
    {"x": 20, "y": 15, "width": 40, "height": 45, "label": "Affected Area"}
  ]
}`;
  }

  /**
   * Safe JSON parse — strips markdown code fences if present
   */
  private static safeParseJSON(raw: string): AIAnalysisResult {
    let text = raw.trim();
    // Strip ```json ... ``` or ``` ... ``` wrappers
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(text);
  }

  static async analyzeImage(
    imageBase64: string,
    type: 'disease' | 'pest' | 'waste',
    lang: Language,
    keys: { groq?: string; gemini?: string } = {},
    cropHint?: string
  ): Promise<AIAnalysisResult> {
    
    const groqKey = keys.groq || process.env.GROQ_API_KEY;
    const geminiKey = keys.gemini || process.env.GEMINI_API_KEY;
    const prompt = this.buildVisionPrompt(type, cropHint);

    // ── 1. Try Groq Vision (90B model is significantly more accurate) ──
    if (groqKey) {
      console.log(`[AI Engine] Groq 90B Vision: Analyzing ${type} (crop: ${cropHint || 'auto'})...`);
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

        // Try 90B first, fall back to 11B if quota exceeded
        let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.2-90b-vision-preview',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  { type: 'image_url', image_url: { url: `data:${mimeType};base64,${cleanBase64}` } },
                ],
              },
            ],
            temperature: 0.1, // low temp = more deterministic, less hallucination
            max_tokens: 1500,
            response_format: { type: 'json_object' },
          }),
        });

        // Fallback to 11B if 90B quota exhausted
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = (errData as any)?.error?.message || '';
          if (errMsg.includes('model') || errMsg.includes('quota') || response.status === 429) {
            console.warn('[AI Engine] 90B quota hit, falling back to 11B...');
            response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'llama-3.2-11b-vision-preview',
                messages: [
                  {
                    role: 'user',
                    content: [
                      { type: 'text', text: prompt },
                      { type: 'image_url', image_url: { url: `data:${mimeType};base64,${cleanBase64}` } },
                    ],
                  },
                ],
                temperature: 0.1,
                max_tokens: 1500,
                response_format: { type: 'json_object' },
              }),
            });
          } else {
            throw new Error(`Groq API error: ${response.status}`);
          }
        }

        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;
        if (!rawText) throw new Error('Empty Groq Vision response');

        const parsed: AIAnalysisResult = this.safeParseJSON(rawText);
        return await this.translateResult(parsed, lang, keys);
      } catch (err) {
        console.error('[AI Engine] Groq Vision failed, trying Gemini...', err);
      }
    }

    // ── 2. Gemini Vision fallback (gemini-2.0-flash for better accuracy) ──
    if (geminiKey) {
      console.log(`[AI Engine] Gemini Vision: Analyzing ${type} (crop: ${cropHint || 'auto'})...`);
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

        // Try gemini-2.0-flash first (better vision), fall back to 1.5-flash
        const geminiModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
        let parsed: AIAnalysisResult | null = null;

        for (const model of geminiModels) {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: cleanBase64 } },
                  ],
                }],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.1,
                },
              }),
            });

            if (!response.ok) continue;
            const data = await response.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              parsed = this.safeParseJSON(rawText);
              break;
            }
          } catch {
            continue;
          }
        }

        if (!parsed) throw new Error('All Gemini models failed');
        return await this.translateResult(parsed, lang, keys);
      } catch (err) {
        console.error('[AI Engine] Gemini Vision failed:', err);
      }
    }

    // ── 3. Offline / Demo Mode Fallback (no API key) ──
    console.log(`[AI Engine] Offline Demo Fallback: ${type} (crop: ${cropHint || 'auto'})`);
    await new Promise(resolve => setTimeout(resolve, 1200));

    let result: AIAnalysisResult;

    if (type === 'pest') {
      const keys2 = Object.keys(PESTS);
      result = JSON.parse(JSON.stringify(PESTS[keys2[Math.floor(Math.random() * keys2.length)]]));
    } else if (type === 'waste') {
      const keys2 = Object.keys(WASTE_ITEMS);
      result = JSON.parse(JSON.stringify(WASTE_ITEMS[keys2[Math.floor(Math.random() * keys2.length)]]));
    } else {
      // Match the closest disease for the given crop hint
      let selectedKey = 'tomato_late_blight';
      if (cropHint) {
        const h = cropHint.toLowerCase();
        if (h.includes('cotton')) selectedKey = 'cotton_bacterial_blight';
        else if (h.includes('tomato')) selectedKey = 'tomato_late_blight';
        else if (h.includes('rice')) selectedKey = 'rice_blast';
        else if (h.includes('corn') || h.includes('maize')) selectedKey = 'corn_rust';
        else if (h.includes('apple')) selectedKey = 'apple_scab';
        else {
          // Unknown crop — return a generic informational message
          const keys2 = Object.keys(CROP_DISEASES);
          selectedKey = keys2[Math.floor(Math.random() * keys2.length)];
        }
      } else {
        const keys2 = Object.keys(CROP_DISEASES);
        selectedKey = keys2[Math.floor(Math.random() * keys2.length)];
      }
      result = JSON.parse(JSON.stringify(CROP_DISEASES[selectedKey]));
      result.expertWarning = `⚠️ DEMO MODE: No API key provided. This is a mock result for ${cropHint || 'unknown crop'}. Add a Groq or Gemini API key in Settings for real AI analysis.`;
    }

    result.confidence = parseFloat((Math.min(99, result.confidence + (Math.random() * 4 - 2))).toFixed(1));
    return result;
  }

  /**
   * Translate all string fields of an AIAnalysisResult if not English.
   */
  private static async translateResult(
    parsed: AIAnalysisResult,
    lang: Language,
    keys: { groq?: string; gemini?: string }
  ): Promise<AIAnalysisResult> {
    if (lang === 'en') return parsed;
    const t = (s: string) => this.translateResponseIfNeeded(s, lang, keys);
    parsed.itemName = await t(parsed.itemName);
    parsed.explanation = await t(parsed.explanation);
    parsed.reasoning = await t(parsed.reasoning);
    parsed.observations = await t(parsed.observations);
    parsed.limitations = await t(parsed.limitations);
    parsed.expertWarning = await t(parsed.expertWarning);
    parsed.recommendations = await Promise.all(parsed.recommendations.map(t));
    parsed.preventionTips = await Promise.all(parsed.preventionTips.map(t));
    if (parsed.organicSolutions) parsed.organicSolutions = await Promise.all(parsed.organicSolutions.map(t));
    if (parsed.chemicalSolutions) parsed.chemicalSolutions = await Promise.all(parsed.chemicalSolutions.map(t));
    return parsed;
  }

  /**
   * 2. Soil Properties API (Groq vs Gemini vs Offline)
   */
  static async analyzeSoil(
    soilType: string,
    soilColor: string,
    pH: number,
    moisture: number,
    cropType: string,
    lang: Language,
    keys: { groq?: string; gemini?: string } = {}
  ): Promise<AISoilResult> {
    const groqKey = keys.groq || process.env.GROQ_API_KEY;
    const geminiKey = keys.gemini || process.env.GEMINI_API_KEY;

    if (groqKey) {
      console.log("[AI Engine] Groq Active: Analyzing Soil parameters...");
      try {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const prompt = `
          You are AgriVision AI, a senior soil scientist. Analyze the following soil properties and output a JSON response:
          - Soil Type: ${soilType}
          - Soil Color: ${soilColor}
          - pH Value: ${pH}
          - Moisture Level: ${moisture}%
          - Planned Crop: ${cropType}

          Provide your response in JSON format. Do not wrap in markdown block.
          {
            "healthScore": 85,
            "nutrients": {
              "nitrogen": "Deficient" | "Optimal" | "Excessive",
              "phosphorus": "Deficient" | "Optimal" | "Excessive",
              "potassium": "Deficient" | "Optimal" | "Excessive",
              "organicMatter": "Low" | "Medium" | "High"
            },
            "fertilizers": ["fertilizer suggestion 1"],
            "suitability": ["crop 1", "crop 2"],
            "improvements": ["step 1", "step 2"],
            "reasoning": "Scientific explanation based on soil characteristics, color, pH, and crop needs",
            "limitations": "Limitations of manual entry vs chemical lab tests",
            "expertWarning": "Mandatory warnings on fertilizer applications"
          }
        `;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          })
        });

        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;
        const parsed: AISoilResult = JSON.parse(rawText.trim());

        if (lang !== 'en') {
          parsed.reasoning = await this.translateResponseIfNeeded(parsed.reasoning, lang, keys);
          parsed.limitations = await this.translateResponseIfNeeded(parsed.limitations, lang, keys);
          parsed.expertWarning = await this.translateResponseIfNeeded(parsed.expertWarning, lang, keys);
          parsed.fertilizers = await Promise.all(parsed.fertilizers.map(f => this.translateResponseIfNeeded(f, lang, keys)));
          parsed.suitability = await Promise.all(parsed.suitability.map(s => this.translateResponseIfNeeded(s, lang, keys)));
          parsed.improvements = await Promise.all(parsed.improvements.map(i => this.translateResponseIfNeeded(i, lang, keys)));
        }
        return parsed;
      } catch (err) {
        console.error("Groq soil analysis failed, attempting fallback:", err);
      }
    }

    if (geminiKey) {
      console.log("[AI Engine] Gemini Active: Analyzing Soil parameters...");
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const prompt = `
          You are AgriVision AI, a senior soil scientist. Analyze soil properties:
          Soil Type: ${soilType}, Color: ${soilColor}, pH: ${pH}, Moisture: ${moisture}%, Crop: ${cropType}.
          Output JSON:
          {
            "healthScore": 80,
            "nutrients": {"nitrogen": "Optimal", "phosphorus": "Deficient", "potassium": "Optimal", "organicMatter": "Medium"},
            "fertilizers": ["fertilizer 1"],
            "suitability": ["crop 1"],
            "improvements": ["improvement 1"],
            "reasoning": "Reasoning text",
            "limitations": "Limitations text",
            "expertWarning": "Warning text"
          }
        `;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed: AISoilResult = JSON.parse(rawText.trim());

        if (lang !== 'en') {
          parsed.reasoning = await this.translateResponseIfNeeded(parsed.reasoning, lang, keys);
          parsed.limitations = await this.translateResponseIfNeeded(parsed.limitations, lang, keys);
          parsed.expertWarning = await this.translateResponseIfNeeded(parsed.expertWarning, lang, keys);
          parsed.fertilizers = await Promise.all(parsed.fertilizers.map(f => this.translateResponseIfNeeded(f, lang, keys)));
          parsed.suitability = await Promise.all(parsed.suitability.map(s => this.translateResponseIfNeeded(s, lang, keys)));
          parsed.improvements = await Promise.all(parsed.improvements.map(i => this.translateResponseIfNeeded(i, lang, keys)));
        }
        return parsed;
      } catch (err) {
        console.error("Gemini soil analysis failed:", err);
      }
    }

    // Mock Soil Fallback
    console.log("[AI Engine] Offline Soil Analysis Active...");
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    let healthScore = 90;
    let n: 'Deficient' | 'Optimal' | 'Excessive' = 'Optimal';
    let p: 'Deficient' | 'Optimal' | 'Excessive' = 'Optimal';
    let k: 'Deficient' | 'Optimal' | 'Excessive' = 'Optimal';
    
    if (pH < 5.5 || pH > 7.5) {
      healthScore -= 20;
      n = pH < 5.5 ? 'Deficient' : 'Optimal';
    }
    if (moisture < 20 || moisture > 80) {
      healthScore -= 15;
    }
    
    const isAcidic = pH < 6.0;
    const isAlkaline = pH > 7.5;
    
    const fertilizers = isAcidic 
      ? ["Apply agricultural lime (calcium carbonate) to raise soil pH.", "Use bone meal to add organic phosphorus.", "Incorporate well-rotted farmyard manure."]
      : isAlkaline 
        ? ["Apply elemental sulfur to lower soil pH.", "Use ammonium sulfate fertilizer.", "Incorporate peat moss or composted pine needles."]
        : ["Apply balanced NPK 10-10-10 compost fertilizer.", "Grow green manure crops like dhaincha or sunn hemp."];

    const suitability = soilType.toLowerCase().includes("clay")
      ? ["Rice (Paddy)", "Sugarcane", "Wheat", "Broccoli"]
      : soilType.toLowerCase().includes("sandy")
        ? ["Groundnut", "Watermelon", "Carrots", "Sweet Potato"]
        : ["Tomato", "Cotton", "Maize", "Soybeans", "Chilli"];

    const improvements = [
      "Incorporate organic matter / compost at 5-10 tonnes per acre annually.",
      "Practice crop rotation with legumes (beans, peas) to fix atmospheric nitrogen.",
      "Implement mulching with straw to retain soil moisture and stabilize soil temperature."
    ];

    return {
      healthScore: Math.max(30, healthScore),
      nutrients: {
        nitrogen: n,
        phosphorus: p,
        potassium: k,
        organicMatter: moisture > 35 ? 'High' : 'Medium'
      },
      fertilizers,
      suitability,
      improvements,
      reasoning: `Based on the inputted soil (${soilType}, color: ${soilColor}) with a pH of ${pH} and moisture of ${moisture}%, the soil indicates standard conditions for rural cropping. pH levels are ${pH < 6.0 ? 'slightly acidic' : pH > 7.5 ? 'slightly alkaline' : 'neutral'}.`,
      limitations: "This analysis is based on manual input values. Accurate micro-nutrient assessments (Zinc, Iron, Boron, etc.) require laboratory chemical spectroscopy testing.",
      expertWarning: "Before investing in heavy fertilization, submit a physical soil core sample to your local Agricultural Testing Laboratory."
    };
  }

  /**
   * 3. AI Chatbot Assistant (Groq vs Gemini vs Offline)
   */
  static async getChatResponse(
    userMessage: string,
    chatHistory: { role: 'user' | 'ai'; text: string }[],
    lang: Language,
    keys: { groq?: string; gemini?: string } = {}
  ): Promise<AIChatResult> {
    const groqKey = keys.groq || process.env.GROQ_API_KEY;
    const geminiKey = keys.gemini || process.env.GEMINI_API_KEY;

    if (groqKey) {
      console.log("[AI Engine] Groq Active: Querying Advisory Chatbot...");
      try {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const historyPrompt = chatHistory.map(h => `${h.role === 'user' ? 'User' : 'AgriVision AI'}: ${h.text}`).join('\n');
        
        const prompt = `
          You are AgriVision AI, a knowledgeable and compassionate agricultural assistant.
          Respond to the user's latest query below. Ensure the advice is simple, practical for a farmer, and accurate.
          
          Chat History:
          ${historyPrompt}
          
          User's latest message: ${userMessage}
          
          Provide your response in JSON format. Do not wrap in markdown block.
          {
            "content": "Your detailed friendly response explaining the solution, using bullet points or paragraphs. Answer in English, but keep it highly accessible.",
            "confidence": 92.0 (estimated confidence percentage of this advice),
            "limitations": "Specific uncertainties (e.g. need to know crop age, weather patterns, soil type to be 100% sure)",
            "expertWarning": "Standard advisory safety warning if they need to consult a local entomologist/pathologist/agronomist"
          }
        `;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          })
        });

        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;
        const parsed: AIChatResult = JSON.parse(rawText.trim());

        if (lang !== 'en') {
          parsed.content = await this.translateResponseIfNeeded(parsed.content, lang, keys);
          parsed.limitations = await this.translateResponseIfNeeded(parsed.limitations, lang, keys);
          parsed.expertWarning = await this.translateResponseIfNeeded(parsed.expertWarning, lang, keys);
        }
        return parsed;
      } catch (err) {
        console.error("Groq Chatbot API failed, attempting fallback:", err);
      }
    }

    if (geminiKey) {
      console.log("[AI Engine] Gemini Active: Querying Advisory Chatbot...");
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const historyPrompt = chatHistory.map(h => `${h.role === 'user' ? 'User' : 'AgriVision AI'}: ${h.text}`).join('\n');
        
        const prompt = `
          You are AgriVision AI, an agricultural assistant. Respond to user's message.
          History: ${historyPrompt}
          Message: ${userMessage}
          Output JSON:
          {
            "content": "advisory answer",
            "confidence": 90.0,
            "limitations": "missing details...",
            "expertWarning": "expert notice"
          }
        `;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed: AIChatResult = JSON.parse(rawText.trim());

        if (lang !== 'en') {
          parsed.content = await this.translateResponseIfNeeded(parsed.content, lang, keys);
          parsed.limitations = await this.translateResponseIfNeeded(parsed.limitations, lang, keys);
          parsed.expertWarning = await this.translateResponseIfNeeded(parsed.expertWarning, lang, keys);
        }
        return parsed;
      } catch (err) {
        console.error("Gemini Chatbot API failed:", err);
      }
    }

    // Mock Chat Fallback
    console.log("[AI Engine] Offline Chatbot Active...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lower = userMessage.toLowerCase();
    let content = "I am AgriVision AI, your smart farming helper. Ask me about crop diseases, soils, weather, or pest treatments.";
    let limitations = "This response is generated by an offline advisory model. Specific local microclimates or soil strains are not accounted for.";
    let expertWarning = "Always cross-reference agricultural advice with local extension officers or crop specialists.";
    let confidence = 85.0;

    if (lower.includes("yellow") || lower.includes("leaf") || lower.includes("leaves")) {
      content = "Leaves turning yellow (chlorosis) usually indicates a nutrient deficiency (most commonly nitrogen or iron), overwatering, or fungal infections. \n\n1. If bottom leaves turn yellow first, it's often nitrogen deficiency. Apply organic compost or urea.\n2. If top leaves turn yellow first, it could be iron deficiency. Ensure soil pH is not too alkaline.\n3. Check soil moisture. Saturated soil blocks oxygen to roots, leading to root rot and yellow leaves.";
      confidence = 88.0;
    } else if (lower.includes("fertilizer") || lower.includes("urea") || lower.includes("npk")) {
      content = "Fertilizer requirements depend heavily on soil status and crop stage. \n\n- Root/Establishment Stage: High Phosphorus (P) for root system development.\n- Vegetative Stage: High Nitrogen (N) to support leafy foliage.\n- Flowering/Fruiting Stage: High Potassium (K) to enhance yield quality and resistance. \n\nApply during cool morning hours and irrigate immediately after application.";
      confidence = 90.0;
    } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("tomorrow")) {
      content = "Current local weather indicates a moderate rainfall chance (40%) within the next 36 hours. If you are planning an irrigation run or a pesticide/fertilizer spraying, it is highly recommended to postpone spraying to avoid wash-off.";
      confidence = 75.0;
    } else if (lower.includes("soil") || lower.includes("fertility")) {
      content = "To improve soil fertility organically:\n1. Integrate composted farmyard manure (FYM) or vermicompost.\n2. Grow nitrogen-fixing cover crops like alfalfa, clover, or cowpea and plow them back in (green manuring).\n3. Keep the soil covered with mulch to protect micro-organisms and retain humidity.";
      confidence = 92.0;
    }

    if (lang === 'te') {
      if (lower.includes("yellow") || lower.includes("leaf") || lower.includes("leaves")) {
        content = "ఆకులు పసుపు రంగులోకి మారడం (క్లోరోసిస్) సాధారణంగా పోషకాల లోపం (నత్రజని లేదా ఇనుము లోపం), ఎక్కువ నీరు పెట్టడం లేదా ఫంగల్ ఇన్ఫెక్షన్ల వల్ల జరుగుతుంది. \n1. కింది ఆకులు పసుపు రంగులోకి మారితే అది నత్రజని లోపం. పశువుల ఎరువు లేదా యూరియా వేయండి.\n2. పై ఆకులు పసుపు రంగులోకి మారితే అది ఇనుము లోపం కావచ్చు. \n3. నేలలో తేమను తనిఖీ చేయండి. నిలిచిపోయిన నీరు వేరు కుళ్ళిపోయేలా చేస్తుంది.";
      } else {
        content = "నేను అగ్రివిజన్ AIని, మీ వ్యవసాయ సహాయకుడిని. పంట వ్యాధులు, మట్టి, వాతావరణం లేదా పురుగుల నివారణ గురించి నన్ను అడగండి.";
      }
      limitations = "ఈ ప్రతిస్పందన ఆఫ్‌లైన్ మోడల్ ద్వారా సృష్టించబడింది. స్థానిక వాతావరణ పరిస్థితులు లెక్కించబడలేదు.";
      expertWarning = "ఎల్లప్పుడూ స్థానిక వ్యవసాయ అధికారుల సలహాలను కూడా తీసుకోండి.";
    } else if (lang === 'hi') {
      if (lower.includes("yellow") || lower.includes("leaf") || lower.includes("leaves")) {
        content = "पत्तियों का पीला पड़ना (क्लोरोसिस) आमतौर पर पोषक तत्वों की कमी (नाइट्रोजन या आयरन), अत्यधिक पानी देने या फंगल संक्रमण का संकेत है।\n1. यदि निचली पत्तियां पहले पीली पड़ती हैं, तो यह नाइट्रोजन की कमी है। जैविक खाद या यूरिया डालें।\n2. यदि ऊपरी पत्तियां पीली पड़ती हैं, तो यह आयरन की कमी हो सकती है।\n3. मिट्टी में नमी की जांच करें। जलभराव से जड़ें सड़ जाती हैं और पत्तियां पीली हो जाती हैं।";
      } else {
        content = "मैं एग्रीविज़न AI हूँ, आपका कृषि सहायक। मुझसे फसल रोगों, मिट्टी, मौसम या कीट उपचार के बारे में पूछें।";
      }
      limitations = "यह प्रतिक्रिया एक ऑफ़लाइन मॉडल द्वारा उत्पन्न की गई है। स्थानीय सूक्ष्म जलवायु का ध्यान नहीं रखा गया है।";
      expertWarning = "हमेशा स्थानीय कृषि विस्तार अधिकारियों से भी सलाह लें।";
    }

    return { content, confidence, limitations, expertWarning };
  }
}
