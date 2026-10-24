/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScamLibraryItem } from '../../types';

export const SCAM_LIBRARY: ScamLibraryItem[] = [
  {
    id: 'digital-arrest',
    scenarioId: 'digital-arrest',
    title: {
      en: 'Digital Arrest: Fake Law Enforcement Coercion',
      gu: 'ડિજિટલ અરેસ્ટ: નકલી પોલીસ અને સીબીઆઈ ધરપકડ સ્કેમ',
      hi: 'डिजिटल अरेस्ट: फर्जी पुलिस एवं सीबीआई गिरफ्तारी स्कैम',
    },
    category: 'authority_impersonation',
    severity: 'critical',
    summary: {
      en: 'Criminals impersonate police, CBI, or ED officials via Skype/WhatsApp, alleging the victim’s Aadhaar was implicated in narcotics trafficking or terror funding, enforcing hours of virtual confinement.',
      gu: 'ગુનેગારો પોલીસ કે સીબીઆઈ અધિકારી બનીને વીડિયો કોલ પર પીડિતને કલાકો સુધી કેદ રાખે છે અને પૈસા પડાવે છે.',
      hi: 'अपराधी पुलिस या जांच एजेंसी के फर्जी अफसर बनकर वीडियो कॉल पर डिजिटल हिरासत का नाटक करते हैं और भारी वसूली करते हैं।',
    },
    howItBegins: {
      en: 'An IVR call or caller claims your phone number or Aadhaar has been blocked for illegal activities and transfers you to a "Duty Officer" sitting in front of a fake police backdrop.',
      gu: 'ફોન પર કહેવામાં આવે છે કે તમારા આધાર કાર્ડ પર ગેરકાયદે સિમકાર્ડ ચાલે છે અને તરત પોલીસ અધિકારી સાથે વાત કરાવાય છે.',
      hi: 'कॉल पर दावा किया जाता है कि आपके नाम पर अवैध सिम कार्ड या पार्सल पकड़ा गया है और तुरंत फर्जी थाने में कॉल ट्रांसफर की जाती है।',
    },
    manipulationTechniques: {
      en: [
        'Display of forged Supreme Court orders and stamped arrest warrants on camera',
        'Strict prohibition against disconnecting the call or consulting relatives',
        'Fabricated "Statutory Verification Audit" requiring immediate fund transfer to RBI "safety escrow"',
      ],
      gu: [
        'નકલી કોર્ટ ઓર્ડર અને ધરપકડ વોરંટ કેમેરા પર બતાવવા',
        'કોલ કાપવાની કે કોઈને જણાવવાની સખત મનાઈ',
        'રિઝર્વ બેંકના નામે નકલી સેફ એકાઉન્ટમાં પૈસા ટ્રાન્સફર કરાવવા',
      ],
      hi: [
        'कैमरे पर सुप्रीम कोर्ट के फर्जी आदेश और मुहर लगे वारंट दिखाना',
        'कॉल काटने या किसी रिश्तेदार से बात करने पर सख्त पाबंदी',
        'आरबीआई के नाम पर फर्जी सुरक्षा खाते में पैसे जमा करने का दबाव',
      ],
    },
    warningSigns: {
      en: [
        'Any mention of "Digital Arrest" — zero basis in Indian criminal procedure',
        'Demands to stay on continuous video call or locked inside a room',
        'Demands for money to clear your name or provide provisional bail',
      ],
      gu: [
        '"ડિજિટલ અરેસ્ટ" શબ્દનો ઉપયોગ — કાયદામાં આવી કોઈ વ્યવસ્થા નથી',
        'રૂમમાં બંધ રહીને વીડિયો કોલ ચાલુ રાખવાનો આગ્રહ',
        'નામ હટાવવા કે જામીન માટે પૈસાની માંગણી',
      ],
      hi: [
        '"डिजिटल अरेस्ट" का जिक्र — भारतीय कानून में ऐसा कोई प्रावधान नहीं है',
        'लगातार वीडियो कॉल पर कमरे में बंद रहने का आदेश',
        'केस से नाम हटाने के लिए पैसों की मांग',
      ],
    },
    fictionalDialogue: [
      {
        speaker: 'Scammer (Impersonator)',
        en: 'This is Sub-Inspector Rathore, Mumbai Cyber Crime Cell. Your Aadhaar is tagged in a 24-crore Hawala syndicate in Canara Bank.',
        gu: 'હું મુંબઈ સાયબર સેલમાંથી સબ-ઇન્સ્પેક્ટર રાઠોડ બોલું છું. તમારું આધાર ૨૪ કરોડના હવાલા કૌભાંડમાં સામેલ છે.',
        hi: 'मैं मुंबई साइबर सेल से सब-इंस्पेक्टर राठौड़ बोल रहा हूं। आपका आधार 24 करोड़ के हवाला मामले में शामिल पाया गया है।',
      },
      {
        speaker: 'Victim (Distressed)',
        en: 'Sir, I am an accountant, I never opened any account in Mumbai!',
        gu: 'સાહેબ, હું સામાન્ય નોકરી કરું છું, મેં મુંબઈમાં કોઈ ખાતું ખોલાવ્યું જ નથી!',
        hi: 'सर, मैं एक साधारण नौकरीपेशा हूं, मैंने मुंबई में कोई खाता नहीं खोला!',
      },
      {
        speaker: 'Scammer (Threat)',
        en: 'Maintain silence! Under Section 41A, we are placing you under Digital Custody. Show your room on video and transfer 4.5 lakhs verification clearance now.',
        gu: 'શાંત રહો! અમે તમને ડિજિટલ કસ્ટડીમાં લઈએ છીએ. રૂમ બતાવો અને ૪.૫ લાખ વેરિફિકેશન ક્લીયરન્સ તરત જમા કરો.',
        hi: 'चुप रहिए! धारा 41A के तहत आपको डिजिटल हिरासत में लिया जाता है। कमरा दिखाइए और 4.5 लाख की क्लीयरेंस राशि तुरंत भेजिए।',
      },
    ],
    safeResponse: {
      en: 'Hang up. Indian police never arrest people on WhatsApp or video calls. Call national cyber helpline 1930 immediately.',
      gu: 'તરત ફોન કાપી નાખો. પોલીસ ક્યારેય વ્હોટ્સએપ પર ધરપકડ કરતી નથી. ૧૯૩૦ પર ફોન કરો.',
      hi: 'तुरंत फोन काटें। पुलिस कभी व्हाट्सएप पर गिरफ्तारी नहीं करती। 1930 पर शिकायत दर्ज कराएं।',
    },
  },
  {
    id: 'fake-kyc-otp',
    scenarioId: 'fake-kyc-otp',
    title: {
      en: 'Bank KYC Expiry & Immediate Account Suspension',
      gu: 'બેંક કેવાયસી રિન્યુઅલ અને એટીએમ બ્લોક છેતરપિંડી',
      hi: 'बैंक केवाईसी एक्सपायरी और खाता सस्पेंशन धोखाधड़ी',
    },
    category: 'credential_requests',
    severity: 'critical',
    summary: {
      en: 'Phishing attack demanding immediate re-KYC verification over phone or malicious link, stealing banking passwords and two-factor SMS OTPs.',
      gu: 'કેવાયસી અપડેટના બહાને ઓટીપી અને બેંક પાસવર્ડ ચોરી કરી ખાલી કરી નાખતો સ્કેમ.',
      hi: 'केवाईसी अपडेट कराने का झांसा देकर फोन पर ओटीपी और पासवर्ड चुराने वाला स्कैम।',
    },
    howItBegins: {
      en: 'An urgent SMS arrives: "Dear customer, your SBI netbanking will be blocked today due to pending PAN KYC. Call 98XXXX immediately or update at link."',
      gu: 'એસએમએસ આવે છે: "તમારું બેંક એકાઉન્ટ કેવાયસી ન થવાથી આજે બંધ થઈ જશે."',
      hi: 'एसएमएस आता है: "प्रिय ग्राहक, पैन केवाईसी न होने के कारण आज आपकी नेटबैंकिंग बंद कर दी जाएगी।"',
    },
    manipulationTechniques: {
      en: [
        'Artificial ticking-clock urgency (15 to 30 minutes limit)',
        'Pretending to assist the customer to avoid branch queues',
        'Requesting screen sharing apps (AnyDesk, TeamViewer) to view incoming OTPs',
      ],
      gu: [
        '૧૫ થી ૩૦ મિનિટની ખોટી સમયમર્યાદા આપવી',
        'બેંકની લાઈનમાં ન ઊભા રહેવું પડે તેવી મદદનો ઢોંગ કરવો',
        'AnyDesk જેવી સ્ક્રીન શેરિંગ એપ્સ ડાઉનલોડ કરાવી ઓટીપી ચોરવો',
      ],
      hi: [
        '15 से 30 मिनट की झूठी समय सीमा तय करना',
        'शाखा के चक्कर न काटने की सुविधा का लालच देना',
        'AnyDesk या TeamViewer ऐप डाउनलोड कराकर स्क्रीन देखना',
      ],
    },
    warningSigns: {
      en: [
        'Asking to read out a 6-digit OTP received via SMS',
        'Asking to install remote-access software',
        'Calls originating from ordinary 10-digit mobile numbers rather than official bank shortcodes',
      ],
      gu: [
        'એસએમએસમાં આવેલો ૬ આંકડાનો ઓટીપી પૂછવો',
        'સ્ક્રીન શેરિંગ સોફ્ટવેર ઇન્સ્ટોલ કરાવવાનો આગ્રહ',
        'સામાન્ય ૧૦ આંકડાના મોબાઈલ નંબર પરથી બેંકના નામે કોલ આવવો',
      ],
      hi: [
        'एसएमएस में आए 6 अंकों के ओटीपी की मांग करना',
        'रिमोट एक्सेस सॉफ्टवेयर इंस्टॉल करने का दबाव',
        'सामान्य 10 अंकों के मोबाइल नंबर से बैंक प्रतिनिधि बनकर कॉल आना',
      ],
    },
    fictionalDialogue: [
      {
        speaker: 'Scammer',
        en: 'Sir, this is Ramesh from SBI Central KYC Department. Your ATM card will stop working at 4 PM.',
        gu: 'સાહેબ, હું એસબીઆઈ સેન્ટ્રલ કેવાયસીમાંથી રમેશ બોલું છું. સાંજે ૪ વાગ્યે તમારું એટીએમ બંધ થઈ જશે.',
        hi: 'सर, मैं एसबीआई सेंट्रल केवाईसी से रमेश बोल रहा हूं। शाम 4 बजे आपका एटीएम बंद हो जाएगा।',
      },
      {
        speaker: 'Scammer',
        en: 'I am sending a validation token to your phone. Read out those 6 digits right now to keep the card active.',
        gu: 'મેં તમારા ફોન પર વેરિફિકેશન ટોકન મોકલ્યો છે. કાર્ડ ચાલુ રાખવા તરત એ ૬ આંકડા બોલો.',
        hi: 'मैंने आपके फोन पर वेरिफिकेशन टोकन भेजा है। कार्ड चालू रखने के लिए तुरंत वो 6 अंक बताएं।',
      },
    ],
    safeResponse: {
      en: 'Never share OTP with anyone. Visit your home bank branch physically or use official banking application directly.',
      gu: 'ક્યારેય કોઈને ઓટીપી ન આપો. સીધા તમારી બેંક શાખાની મુલાકાત લો.',
      hi: 'किसी को भी ओटीपी न बताएं। सीधे बैंक की शाखा जाएं या आधिकारिक ऐप का उपयोग करें।',
    },
  },
  {
    id: 'courier-fraud',
    scenarioId: 'courier-fraud',
    title: {
      en: 'Customs Parcel & Contraband Interception Scam',
      gu: 'કુરિયર પાર્સલ અને કસ્ટમ્સ ડ્રગ જપ્તી સ્કેમ',
      hi: 'कूरियर पार्सल और कस्टम्स ड्रग जब्ती स्कैम',
    },
    category: 'suspicious_parcel_claims',
    severity: 'critical',
    summary: {
      en: 'Targeted call claiming an intercepted overseas courier containing illegal substances and passports in the victim’s name, demanding security extortion to avoid arrest.',
      gu: 'તમારા નામના પાર્સલમાં ડ્રગ્સ અને પાસપોર્ટ મળ્યાનો આરોપ લગાવી કસ્ટમ્સ ફીના નામે તોડબાજી.',
      hi: 'पार्सल में नशीले पदार्थ और पासपोर्ट मिलने का आरोप लगाकर गिरफ्तारी से बचने के लिए वसूली करना।',
    },
    howItBegins: {
      en: 'Automated robocall: "Press 9 to speak to customs regarding your returned parcel package #IN-8891."',
      gu: 'ઓટોમેટેડ કોલ: "તમારા અટકાયેલા પાર્સલ અંગે કસ્ટમ્સ અધિકારી સાથે વાત કરવા ૯ દબાવો."',
      hi: 'ऑटोमेटेड कॉल: "कस्टम्स द्वारा रोके गए पार्सल के लिए 9 दबाएं।"',
    },
    manipulationTechniques: {
      en: [
        'Fabricated air-waybills and counterfeit invoice paperwork',
        'Direct connection into a staged police dispatch desk',
        'High psychological intimidation regarding federal narcotic laws',
      ],
      gu: [
        'બનાવટી બિલ અને નકલી પાર્સલ રસીદ મોકલવી',
        'ફોન પર જ સીધો પોલીસ સ્ટેશનમાં કોલ ટ્રાન્સફર કરવો',
        'નાર્કોટિક્સ કાયદા હેઠળ આજીવન કેદનો ડર બતાવવો',
      ],
      hi: [
        'फर्जी एयरवे बिल और नकली दस्तावेज तैयार करना',
        'कॉल को सीधे फर्जी पुलिस स्टेशन ट्रांसफर करना',
        'कड़े नारकोटिक्स कानूनों का डर दिखाना',
      ],
    },
    warningSigns: {
      en: [
        'Logistics firm directly patching calls to police departments (technically impossible)',
        'Caller requesting payments into individual UPI IDs or private company accounts',
      ],
      gu: [
        'કુરિયર કંપની સીધો પોલીસ સાથે કોલ જોડી આપવાનો દાવો કરે',
        'વ્યક્તિગત યુપીઆઈ આઈડી પર પૈસા ભરવાનું કહેવામાં આવે',
      ],
      hi: [
        'कूरियर कंपनी द्वारा सीधे पुलिस से कॉल जोड़ने का दावा करना',
        'व्यक्तिगत यूपीआई आईडी पर पैसे भेजने का दबाव',
      ],
    },
    fictionalDialogue: [
      {
        speaker: 'Robocall',
        en: 'Notice from Customs: A consignment sent to Taiwan with 5 fake passports has been intercepted.',
        gu: 'કસ્ટમ્સ નોટિસ: તાઈવાન જઈ રહેલા ૫ નકલી પાસપોર્ટવાળા પાર્સલની અટકાયત કરવામાં આવી છે.',
        hi: 'कस्टम्स नोटिस: ताइवान भेजे जा रहे 5 नकली पासपोर्ट वाले पार्सल को जब्त किया गया है।',
      },
    ],
    safeResponse: {
      en: 'If you did not send an overseas parcel, disconnect. Genuine customs investigations do not negotiate settlements over telephone.',
      gu: 'જો તમે કોઈ પાર્સલ ન મોકલ્યું હોય તો તરત ફોન કાપી નાખો. કસ્ટમ્સ ક્યારેય ફોન પર સમાધાન કરતી નથી.',
      hi: 'अगर आपने पार्सल नहीं भेजा है तो तुरंत फोन काटें। कस्टम्स कभी फोन पर समझौता नहीं करती।',
    },
  },
  {
    id: 'aadhaar-sim-disconnection',
    title: {
      en: 'DoT / TRAI Aadhaar SIM Disconnection Scam',
      gu: 'ટેલિકોમ વિભાગ સિમ બ્લોક અને આધાર સ્કેમ',
      hi: 'दूरसंचार विभाग सिम ब्लॉक और आधार स्कैम',
    },
    category: 'threats',
    severity: 'high',
    summary: {
      en: 'Scammer claims to represent TRAI or the Department of Telecommunications (DoT), stating that 9 illegal SIM cards issued on your Aadhaar were used in harassment, and all your phone numbers will be cut off in 2 hours.',
      gu: 'ટેલિકોમ ઓથોરિટીના નામે કોલ કરીને કહે છે કે તમારા આધાર પર ૯ ગેરકાયદે સિમ ચાલે છે અને ૨ કલાકમાં તમારા બધા નંબર બંધ થશે.',
      hi: 'दूरसंचार विभाग के नाम पर कॉल करके दावा करते हैं कि आपके आधार से 9 फर्जी सिम चल रहे हैं और 2 घंटे में सभी नंबर बंद कर दिए जाएंगे।',
    },
    howItBegins: {
      en: 'Robocall warning: "This is Department of Telecommunications. All your mobile connections will be disconnected within 2 hours."',
      gu: 'ઓટોમેટેડ ચેતવણી: "ટેલિકોમ વિભાગમાંથી સૂચના: ૨ કલાકમાં તમારા તમામ સિમ કાર્ડ બ્લોક થશે."',
      hi: 'ऑटोमेटेड चेतावनी: "दूरसंचार विभाग: 2 घंटे के भीतर आपके सभी मोबाइल कनेक्शन काट दिए जाएंगे।"',
    },
    manipulationTechniques: {
      en: [
        'Using DoT / TRAI brand credibility to create legitimate panic',
        'Threat of cutting off all mobile communication and UPI access',
      ],
      gu: [
        'સરકારી વિભાગના નામે ડર ઊભો કરવો',
        'તમામ સંપર્ક અને યુપીઆઈ સેવાઓ બંધ કરવાની ધમકી',
      ],
      hi: [
        'सरकारी विभाग का नाम लेकर भय पैदा करना',
        'सभी मोबाइल और बैंकिंग सेवाएं बंद करने की धमकी',
      ],
    },
    warningSigns: {
      en: [
        'TRAI and DoT never make telephonic calls to disconnect individual subscriber lines',
        'Offers to "verify Aadhaar biometric credentials" via remote app',
      ],
      gu: [
        'TRAI કે DoT ક્યારેય કોઈ સામાન્ય નાગરિકને સિમ બંધ કરવા ફોન કરતા નથી',
        'ફોન પર આધાર નંબર કે બાયોમેટ્રિક વેરિફિકેશન માંગવું',
      ],
      hi: [
        'TRAI या DoT कभी सीधे उपभोक्ता को कनेक्शन काटने के लिए कॉल नहीं करते',
        'फोन पर आधार वेरिफिकेशन कराने का दबाव',
      ],
    },
    fictionalDialogue: [
      {
        speaker: 'Scammer',
        en: 'Your Aadhaar was used to buy 9 SIM cards in Assam sending extortion messages. File clearance now or face SIM blackout.',
        gu: 'તમારા આધાર પર આસામમાં ૯ સિમ ખરીદાયા છે. ક્લીયરન્સ ન લો તો તમારા બધા નંબર કાયમ માટે બંધ થશે.',
        hi: 'आपके आधार से असम में 9 सिम लेकर रंगदारी मांगी जा रही है। क्लीयरेंस कराएं वरना सभी नंबर तुरंत बंद होंगे।',
      },
    ],
    safeResponse: {
      en: 'Disconnect. Check your authentic registered SIM cards independently using the government portal: sancharsaathi.gov.in (TAFCOP).',
      gu: 'કોલ કાપો અને sancharsaathi.gov.in પોર્ટલ પર જઈને તમારા નામે કેટલા સિમ છે તે જાતે તપાસો.',
      hi: 'कॉल काटें। सरकार के आधिकारिक पोर्टल sancharsaathi.gov.in (TAFCOP) पर जाकर खुद जांचें।',
    },
  },
  {
    id: 'hospital-bail-emergency',
    title: {
      en: 'Coercive Family Emergency & Urgent Bail Scam',
      gu: 'તાત્કાલિક હોસ્પિટલ અકસ્માત અને જામીન સ્કેમ',
      hi: 'आपातकालीन अस्पताल दुर्घटना एवं जमानत स्कैम',
    },
    category: 'artificial_urgency',
    severity: 'critical',
    summary: {
      en: 'Preys on parental and elder emotions by falsely claiming their son, daughter, or grandchild has met with a severe road accident or been arrested in a college brawl, demanding instant hospital deposit.',
      gu: 'તમારા પુત્ર કે સંબંધીનો ગંભીર અકસ્માત થયો છે કે પોલીસ પકડ્યા છે તેવો ડર બતાવી તરત પૈસા માંગવા.',
      hi: 'बेटे या परिजन का गंभीर एक्सीडेंट होने या पुलिस हिरासत में होने का झूठा दावा कर तुरंत अस्पताल के नाम पर पैसे ऐंठना।',
    },
    howItBegins: {
      en: 'A frantic caller shouts: "Papa! Please save me, police have arrested me!" before another person takes over demanding 50,000 rupees.',
      gu: 'રડતા અવાજમાં: "પપ્પા મને બચાવો, મારો અકસ્માત થયો છે!" કહીને બીજો વ્યક્તિ તાત્કાલિક ૫૦,૦૦૦ માંગે છે.',
      hi: 'रोते हुए आवाज: "पापा मुझे बचा लो, पुलिस ने पकड़ लिया!" फिर दूसरा व्यक्ति 50,000 रुपये तुरंत ट्रांसफर करने को कहता है।',
    },
    manipulationTechniques: {
      en: [
        'Acoustic distress simulation (crying, background sirens, hospital beeps)',
        'Extremely aggressive countdown ("patient is bleeding in ICU")',
      ],
      gu: [
        'રડવાનો અને હોસ્પિટલના અવાજોનો ડ્રામા કરવો',
        'અત્યંત આક્રમક સમયમર્યાદા આપી વિચારવાનો સમય ન આપવો',
      ],
      hi: [
        'रोने और एंबुलेंस के सायरन जैसी आवाजों का नाटक',
        'सोचने का मौका दिए बिना तुरंत पैसे भेजने का अत्यधिक दबाव',
      ],
    },
    warningSigns: {
      en: [
        'Refusal to allow you to call your relative directly on their personal mobile number',
        'Insistence on instant UPI transfer to a random chemist or hospital ward boy account',
      ],
      gu: [
        'તમારા સંબંધીના અંગત નંબર પર સીધો કોલ કરવાની મનાઈ કરવી',
        'કોઈ અજાણ્યા વ્યક્તિના યુપીઆઈ આઈડી પર તાત્કાલિક પૈસા મોકલવા કહેવું',
      ],
      hi: [
        'परिजन के निजी नंबर पर कॉल करने से मना करना',
        'किसी अनजान व्यक्ति के यूपीआई पर तुरंत पैसे ट्रांसफर करने का दबाव',
      ],
    },
    fictionalDialogue: [
      {
        speaker: 'Scammer (Aggressive)',
        en: 'Your nephew has sustained critical skull fracture in highway collision. Doctor needs 75,000 rupees operation fee in next 10 minutes.',
        gu: 'તમારા ભત્રીજાનો હાઇવે પર ગંભીર અકસ્માત થયો છે. ડોક્ટરને ઓપરેશન માટે ૧૦ મિનિટમાં ૭૫,૦૦૦ રૂપિયા જોઈએ છે.',
        hi: 'आपके भतीजे का हाईवे पर गंभीर एक्सीडेंट हुआ है। डॉक्टर को ऑपरेशन के लिए 10 मिनट में 75,000 रुपये चाहिए।',
      },
    ],
    safeResponse: {
      en: 'Take a deep breath. Hang up and dial your family member directly on their known phone number or contact their workplace/college.',
      gu: 'શાંતિ રાખો. કોલ કાપીને સીધા તમારા પરિવારના સભ્યના અંગત નંબર પર ફોન લગાવો.',
      hi: 'धैर्य रखें। तुरंत फोन काटें और अपने परिजन के नंबर पर सीधे कॉल करके स्थिति जानें।',
    },
  },
  {
    id: 'electricity-bill-power-cut',
    title: {
      en: 'Imminent Electricity Power Cut & Meter Disconnection',
      gu: 'વીજળી બિલ બાકી અને તાત્કાલિક લાઈટ કાપવાનો સ્કેમ',
      hi: 'बिजली बिल बकाया एवं तुरंत कनेक्शन काटने की धोखाधड़ी',
    },
    category: 'coercive_money_demands',
    severity: 'high',
    summary: {
      en: 'Threatens that your home power supply will be cut off tonight at 9:30 PM due to unpaid previous month electricity bills unless paid immediately via a third-party app.',
      gu: 'ગત મહિનાનું વીજ બિલ બાકી હોવાથી રાત્રે ૯:૩૦ વાગ્યે પાવર સપ્લાય કાપી નાખવાની ધમકી આપી નાણાં પડાવવા.',
      hi: 'पिछले महीने का बिल न भरने का बहाना बनाकर रात 9:30 बजे बिजली काटने की धमकी देना और पैसे ऐंठना।',
    },
    howItBegins: {
      en: 'SMS: "Dear Consumer, your electricity power will be disconnected at 9:30 PM from the power station. Call Electricity Officer at 98XXXX."',
      gu: 'એસએમએસ: "પ્રિય ગ્રાહક, આજે રાત્રે ૯:૩૦ વાગ્યે તમારું વીજ કનેક્શન કાપી નાખવામાં આવશે."',
      hi: 'एसएमएस: "प्रिय उपभोक्ता, आज रात 9:30 बजे आपका बिजली कनेक्शन काट दिया जाएगा।"',
    },
    manipulationTechniques: {
      en: [
        'Evening timing chosen deliberately when official electricity board customer offices are closed',
        'Directing victim to download helper software to "clear meter arrears"',
      ],
      gu: [
        'રાતના સમયે જ મેસેજ કરવો જ્યારે સરકારી ઓફિસ બંધ હોય',
        'મીટર અપડેટ કરવાના નામે ફ્રોડ એપ ઇન્સ્ટોલ કરાવવી',
      ],
      hi: [
        'शाम या रात के समय संदेश भेजना जब बिजली बोर्ड के दफ्तर बंद हों',
        'बिल अपडेट करने के बहाने फर्जी ऐप डाउनलोड कराना',
      ],
    },
    warningSigns: {
      en: [
        'Government electricity distribution companies never disconnect power without formal physical notice',
        'Demands payment to personal mobile numbers or UPI handles',
      ],
      gu: [
        'વીજ કંપનીઓ ક્યારેય લેખિત નોટિસ વિના અચાનક પાવર કાપતી નથી',
        'અંગત મોબાઈલ નંબર કે અજાણી લિંક પર પૈસા ચૂકવવાનું કહેવું',
      ],
      hi: [
        'बिजली कंपनियां बिना लिखित नोटिस के कभी अचानक बिजली नहीं काटतीं',
        'निजी मोबाइल नंबर या फर्जी लिंक पर भुगतान की मांग करना',
      ],
    },
    fictionalDialogue: [
      {
        speaker: 'Scammer',
        en: 'This is Torrent / Gujarat Vidyut. Last month bill update failed. Send 15 rupees test recharge through this APK link or light is gone.',
        gu: 'હું વીજળી બોર્ડમાંથી બોલું છું. ગયા મહિનાનું બિલ જમા નથી થયું. આ લિંક પર ૧૫ રૂપિયા ટેસ્ટ કરો નહીંતર લાઈટ કાપી નાખીશું.',
        hi: 'बिजली बोर्ड से बोल रहा हूं। पिछले महीने का बिल अपडेट नहीं हुआ है। इस लिंक पर 15 रुपये भेजिए वरना बिजली कट जाएगी।',
      },
    ],
    safeResponse: {
      en: 'Do not pay on personal numbers or install APK links. Check your electricity bill status on the official utility website or electricity bill receipt.',
      gu: 'કોઈ અજાણી લિંક પર ક્લિક ન કરો. તમારી વીજ કંપનીની સત્તાવાર વેબસાઇટ પર જઈને બિલ ચકાસો.',
      hi: 'किसी अनजान लिंक पर भुगतान न करें। अपनी बिजली कंपनी की आधिकारिक वेबसाइट या बिल पर देखें।',
    },
  },
];
