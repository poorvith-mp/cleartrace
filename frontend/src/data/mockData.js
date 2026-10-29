// Fictional data and broker definitions for ClearTrace audit demo
// Under DPDP Act 2023 Section 12 & 13

export const DEMO_PERSONAS = [
  {
    id: "persona-1",
    name: "Pooja Sharma",
    phone: "+91 98450 12345",
    address: "Koramangala 4th Block, Bengaluru, Karnataka 560034",
    workplace: "Senior Software Engineer, Swiggy",
    threatContext: "Unsolicited cold calls and stalker messages received after address surfaced online."
  },
  {
    id: "persona-2",
    name: "Rajesh Iyer",
    phone: "098410 98765",
    address: "T. Nagar, Chennai, Tamil Nadu 600017",
    workplace: "Operations Director, Zoho Corp",
    threatContext: "Targeted executive impersonation scams targeting family members."
  },
  {
    id: "persona-3",
    name: "Sunita Verma",
    phone: "+91 98101 23456",
    address: "Sector 62, Noida, Uttar Pradesh 201301",
    workplace: "Risk Analyst, HDFC Bank",
    threatContext: "Exposed financial data and KYC record leaks across unverified directories."
  }
];

export const BROKER_SITES = [
  {
    id: "broker-1",
    name: "IndiaLookup",
    domain: "indialookup.mock.in",
    format: "HTML Table Record",
    optOutRoute: "Web Form POST",
    slaHours: 24,
    legalRoute: "Standard Section 12 Erasure Form",
    statusBadge: "Active Connector"
  },
  {
    id: "broker-2",
    name: "BharatPeopleDirectory",
    domain: "bharatdirectory.mock.in",
    format: "REST JSON API",
    optOutRoute: "Email Notice",
    slaHours: 48,
    legalRoute: "Section 12 Legal Grievance Dispatch",
    statusBadge: "Active Connector"
  },
  {
    id: "broker-3",
    name: "CityRecordsIN",
    domain: "cityrecords.mock.in",
    format: "Unstructured HTML Divs",
    optOutRoute: "None (Dead End)",
    slaHours: 72,
    legalRoute: "Section 13 DPDP Board Escalation Notice",
    statusBadge: "Escalation Required"
  },
  {
    id: "broker-4",
    name: "ContactFinderIndia",
    domain: "contactfinder.mock.in",
    format: "Mobile-First Grid",
    optOutRoute: "Verified Form",
    slaHours: 12,
    legalRoute: "Automated Opt-Out API Hook",
    statusBadge: "Active Connector"
  },
  {
    id: "broker-5",
    name: "TrueCitizenRegistry",
    domain: "truecitizen.mock.in",
    format: "Workplace Profile View",
    optOutRoute: "Compliance Officer Email",
    slaHours: 36,
    legalRoute: "Corporate PII Erasure Notice",
    statusBadge: "Active Connector"
  }
];

// Seeded broker findings for demo execution
export const INITIAL_FINDINGS = [
  {
    id: "finding-1",
    brokerId: "broker-1",
    brokerName: "IndiaLookup",
    personaId: "persona-1",
    exposedName: "Pooja Sharma",
    exposedPhone: "+91 98450-12345",
    exposedAddress: "Flat 12/4, 3rd Cross, near Sony Signal, Koramangala Stage 4, Bangalore 560034",
    exposedWorkplace: "Software Engg, Swiggy Bangalore",
    rawHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    matchDetails: {
      nameScore: 100,
      phoneScore: 100,
      addressSemanticScore: 94,
      workplaceSemanticScore: 91,
      solutionAScore: 58, // Solution A fails due to string distance ("Stage 4 vs 4th Block", "Bangalore vs Bengaluru")
      solutionBScore: 96,
      isSolutionADivergence: true,
      divergenceReason: "Solution A failed because token set ratio dropped below threshold on landmark descriptors ('near Sony Signal') and city alias ('Bangalore' vs 'Bengaluru'). Solution B dense vector cosine similarity caught it with 94% confidence."
    },
    state: "Found",
    isAuthorized: false,
    evidenceTimestamp: "2026-10-29T10:45:00Z"
  },
  {
    id: "finding-2",
    brokerId: "broker-2",
    brokerName: "BharatPeopleDirectory",
    personaId: "persona-1",
    exposedName: "Pooja Sharma",
    exposedPhone: "09845012345",
    exposedAddress: "Koramangala 4th Block, Bengaluru, KA",
    exposedWorkplace: "Senior Software Engineer - Bundl Technologies",
    rawHash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    matchDetails: {
      nameScore: 100,
      phoneScore: 100,
      addressSemanticScore: 98,
      workplaceSemanticScore: 92, // "Bundl Technologies" is Swiggy's parent company
      solutionAScore: 61,
      solutionBScore: 97,
      isSolutionADivergence: true,
      divergenceReason: "Solution A missed workplace affiliation ('Bundl Technologies' vs 'Swiggy'). Solution B embedding model captured corporate entity mapping."
    },
    state: "Found",
    isAuthorized: false,
    evidenceTimestamp: "2026-10-29T10:45:12Z"
  },
  {
    id: "finding-3",
    brokerId: "broker-3",
    brokerName: "CityRecordsIN",
    personaId: "persona-1",
    exposedName: "Pooja Sharma",
    exposedPhone: "+91 98450 12345",
    exposedAddress: "Plot 88, 4th Block Koramangala, Bangalore Urban",
    exposedWorkplace: "Technology Department",
    rawHash: "3f79bb7b435b05321651daefd374cd681b61935c13e0e77ec3b2477c143a7249",
    matchDetails: {
      nameScore: 100,
      phoneScore: 100,
      addressSemanticScore: 89,
      workplaceSemanticScore: 75,
      solutionAScore: 64,
      solutionBScore: 91,
      isSolutionADivergence: true,
      divergenceReason: "Unstructured div parsing with city alias. Solution B embedding vector matched Bangalore Urban to Karnataka district taxonomy."
    },
    state: "Found",
    isAuthorized: false,
    evidenceTimestamp: "2026-10-29T10:45:18Z"
  },
  {
    id: "finding-4",
    brokerId: "broker-4",
    brokerName: "ContactFinderIndia",
    personaId: "persona-1",
    exposedName: "Pooja S",
    exposedPhone: "9845012345",
    exposedAddress: "Koramangala, Bangalore",
    exposedWorkplace: "Software Eng",
    rawHash: "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
    matchDetails: {
      nameScore: 85,
      phoneScore: 100,
      addressSemanticScore: 82,
      workplaceSemanticScore: 88,
      solutionAScore: 78,
      solutionBScore: 88,
      isSolutionADivergence: false,
      divergenceReason: "Both engines flagged as match, but Solution B provided higher confidence via phone normalization and semantic workplace scoring."
    },
    state: "Found",
    isAuthorized: false,
    evidenceTimestamp: "2026-10-29T10:45:25Z"
  },
  {
    id: "finding-5",
    brokerId: "broker-5",
    brokerName: "TrueCitizenRegistry",
    personaId: "persona-1",
    exposedName: "Pooja Sharma",
    exposedPhone: "Exposed (Hidden in free tier)",
    exposedAddress: "Bengaluru South, Karnataka",
    exposedWorkplace: "Swiggy Pvt Ltd",
    rawHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    matchDetails: {
      nameScore: 100,
      phoneScore: 50,
      addressSemanticScore: 78,
      workplaceSemanticScore: 96,
      solutionAScore: 59,
      solutionBScore: 82, // Borderline! Requires user confirmation!
      isSolutionADivergence: true,
      isBorderline: true,
      divergenceReason: "Phone masked by broker. Solution A dropped score to 59% (false negative). Solution B achieved 82% via workplace entity embedding, correctly routing to human-in-the-loop borderline triage."
    },
    state: "Found",
    isAuthorized: false,
    evidenceTimestamp: "2026-10-29T10:45:30Z"
  }
];

// Distractor records to verify zero false positives on same-name strangers
export const DISTRACTOR_RECORDS = [
  {
    id: "distractor-1",
    brokerName: "IndiaLookup",
    exposedName: "Pooja Sharma",
    exposedPhone: "+91 91234 56789",
    exposedAddress: "Civil Lines, Jaipur, Rajasthan 302006",
    exposedWorkplace: "Teacher, Modern School",
    score: 38,
    status: "Auto-Discarded (Same-name stranger)"
  },
  {
    id: "distractor-2",
    brokerName: "ContactFinderIndia",
    exposedName: "Pooja Sharma",
    exposedPhone: "+91 99887 76655",
    exposedAddress: "Park Street, Kolkata, West Bengal 700016",
    exposedWorkplace: "Interior Designer",
    score: 34,
    status: "Auto-Discarded (Same-name stranger)"
  }
];
