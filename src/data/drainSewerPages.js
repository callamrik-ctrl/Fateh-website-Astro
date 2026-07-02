const commonRelated = [
  { title: "Drain Cleaning", href: "drain-cleaning.html", text: "Slow drains, recurring clogs, floor drains, main drain backups, and urgent drain clearing.", link: "View drain cleaning" },
  { title: "Sewer Line Repair", href: "sewer-line-repair.html", text: "Main sewer backups, damaged sewer pipes, sewer odour, roots, and repair or replacement planning.", link: "View sewer line repair" },
  { title: "Sewer Camera Inspection", href: "sewer-camera-inspection.html", text: "Camera inspection for recurring backups, pipe condition checks, drain camera review, and repair planning.", link: "View camera inspection" },
  { title: "Backwater Valve", href: "backwater-valve.html", text: "Backwater valve installation, service, and sewer backup prevention planning for lower-level fixtures.", link: "View backwater valve" },
  { title: "Basement Plumbing", href: "basement-plumbing.html", text: "Basement bathroom plumbing, rough-ins, floor drains, laundry drains, sump pump tie-ins, and leak concerns.", link: "View basement plumbing" },
  { title: "Sump Pump Repair", href: "sump-pump-repair.html", text: "Sump pump repair, float switch concerns, backup pump planning, discharge issues, and basement flood risk.", link: "View sump pump repair" },
  { title: "Leak Detection", href: "leak-detection.html", text: "Hidden leaks, damp walls, ceiling stains, running meters, and unclear water sources.", link: "View leak detection" },
  { title: "Pipe Repair", href: "pipe-repair.html", text: "Burst pipes, frozen pipes, water line leaks, corroded piping, and urgent pipe repairs.", link: "View pipe repair" },
];

const baseTrust = [
  { title: "Clear diagnosis", text: "We start with the symptom, then check the most likely plumbing causes before recommending the next step." },
  { title: "Repair planning", text: "Drain and sewer problems often need the right order: clear the blockage, inspect the line, then plan repair if needed." },
  { title: "Brampton-based help", text: "Fateh Plumbing & Electric helps homeowners, landlords, condos, restaurants, and small businesses." },
];

const baseServiceArea = {
  eyebrow: "Service coverage",
  title: "Drain and sewer plumbing help across Brampton and nearby GTA communities",
  text: "Fateh Plumbing & Electric helps with sewer lines, drain cameras, backwater valves, basement plumbing, sump pumps, and main drain concerns from Brampton into nearby service areas when scheduling allows.",
  points: ["Brampton", "Mississauga", "Vaughan", "Caledon", "Etobicoke"],
};

function makePage(config) {
  return {
    title: config.title,
    description: config.description,
    canonical: config.canonical,
    eyebrow: config.eyebrow,
    h1: config.h1,
    heroText: config.heroText,
    heroImage: config.heroImage || "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1400&q=80",
    heroAlt: config.heroAlt || config.h1,
    proof: config.proof,
    trust: config.trust || baseTrust,
    intro: config.intro,
    quickCard: config.quickCard,
    problems: config.problems,
    process: config.process,
    compare: config.compare,
    serviceArea: config.serviceArea || baseServiceArea,
    related: config.related || commonRelated,
    relatedEyebrow: "Related drain and sewer services",
    relatedTitle: "Drain and sewer service paths",
    proofBand: config.proofBand,
    cta: config.cta,
    faqEyebrow: "Drain and sewer FAQ",
    faqTitle: config.faqTitle,
    faqs: config.faqs,
  };
}

export const drainSewerPages = {
  sewerLineRepair: makePage({
    title: "Sewer Line Repair Brampton | Fateh",
    description: "Sewer line repair Brampton and GTA for backups, sewer smell, roots, and damaged lines. Licensed and insured drain service.",
    canonical: "https://fatehplumelec.com/sewer-line-repair.html",
    eyebrow: "Sewer line repair",
    h1: "Sewer Line Repair Brampton",
    heroText: "Recurring sewer backups, multiple slow drains, sewage odour, gurgling fixtures, or a damaged main sewer line can point to a deeper problem. Fateh Plumbing & Electric helps Brampton customers diagnose sewer line concerns and plan the right repair path.",
    heroAlt: "Plumber checking sewer line and drain pipe repair options",
    proof: ["Main sewer line help", "Repair and replacement planning", "Brampton plumbing service"],
    intro: {
      eyebrow: "Main sewer line service",
      title: "Help when the problem is deeper than one clogged drain",
      paragraphs: [
        "A single slow sink may be a fixture issue, but repeated backups across several fixtures can point to the main sewer line. Sewer line repair may be needed when old pipe, roots, shifting soil, grease buildup, bellied pipe, or damaged sections keep causing problems.",
        "Fateh Plumbing & Electric helps with sewer line repair in Brampton, sewer repair near me calls, sewer line replacement planning, trenchless sewer line repair questions, main drain backups, and sewer pipe replacement concerns.",
        "If sewage is backing up, avoid using more fixtures and call for help. Customers can also review <a href=\"https://www.peelregion.ca/water/\" target=\"_blank\" rel=\"noopener\">Peel Region water and wastewater information</a> for local water service resources."
      ],
    },
    quickCard: {
      eyebrow: "Need sewer help?",
      title: "Call before the backup spreads",
      text: "Tell us which fixtures are backing up, whether sewage is visible, and if the issue has happened before.",
      points: ["Sewer line repair", "Sewer backup service", "Repair or replacement advice"],
    },
    problems: {
      eyebrow: "Sewer line problems",
      title: "Signs your sewer line may need repair",
      items: [
        { title: "Several fixtures backing up", text: "Toilets, tubs, floor drains, and sinks backing up together can point toward a main sewer concern.", href: "drain-cleaning.html", link: "Compare drain cleaning" },
        { title: "Sewage smell indoors", text: "Persistent sewer odour can come from traps, vents, drains, or sewer line issues that need checking.", href: "contact.html", link: "Request service" },
        { title: "Recurring main drain clog", text: "If the same main drain keeps blocking after cleaning, the pipe condition may need review.", href: "sewer-camera-inspection.html", link: "Camera inspection" },
        { title: "Wet or soft yard area", text: "Moist soil, sunken patches, or unusual odour outside can be signs of underground pipe trouble.", href: "contact.html", link: "Book inspection" },
        { title: "Older pipe or tree roots", text: "Roots and aging pipe materials can create repeated restrictions or damaged sections.", href: "sewer-camera-inspection.html", link: "Check the line" },
        { title: "Repair or replacement question", text: "Some sewer problems can be repaired; others need replacement planning or trenchless options.", href: "contact.html", link: "Ask for options" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From backup call to sewer repair plan",
      items: [
        { title: "Describe the backup", text: "We ask which fixtures are affected, how often it happens, and whether sewage or standing water is present." },
        { title: "Protect the property", text: "Active backups are treated carefully so the source can be checked without making the mess worse." },
        { title: "Confirm the likely cause", text: "Drain clearing, sewer camera inspection, or pipe review may be needed before repair is planned." },
        { title: "Choose the repair path", text: "You get a clear explanation of repair, replacement, or trenchless sewer line repair options where suitable." },
      ],
    },
    compare: {
      eyebrow: "Repair choices",
      title: "Sewer line repair starts with the right diagnosis",
      paragraphs: [
        "Drain cleaning can restore flow when the line is blocked, but it may not solve damaged pipe, root intrusion, collapsed sections, or recurring main line problems. Sewer camera inspection can help show what is happening inside the pipe before bigger work is planned.",
        "The best sewer repair path depends on pipe condition, access, age, depth, property layout, and whether trenchless pipe repair is suitable. Fateh explains the practical options so you can decide with confidence."
      ],
      cardTitle: "Helpful details to share",
      points: ["Which fixtures are backing up", "How often the backup returns", "Any sewer odour or yard wet spots", "Previous drain cleaning or camera inspection"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Sewer problems need calm, clear decisions",
      text: "A sewer backup can feel urgent and stressful. Fateh helps separate a simple blockage from a pipe problem so you know what has to happen next.",
      items: [
        { title: "Main line experience", text: "We look at whole-home symptoms, not just one drain." },
        { title: "Camera-ready planning", text: "Recurring issues can be checked with inspection before major repair decisions." },
        { title: "Repair clarity", text: "You get practical guidance on repair, replacement, or trenchless options where appropriate." },
      ],
    },
    cta: { eyebrow: "Book sewer line service", title: "Need sewer line repair in Brampton?", text: "Call Fateh Plumbing & Electric for sewer backups, sewer line repair, sewer camera inspection, and main drain concerns in Brampton and nearby GTA communities.", button: "Call 647-980-9211" },
    faqTitle: "Common sewer line repair questions",
    faqs: [
      { q: "What are signs I need sewer line repair?", a: "Several fixtures backing up together, recurring main drain clogs, sewage odour, gurgling toilets, or wet areas outside can point to a sewer line problem." },
      { q: "Do I need drain cleaning or sewer line repair?", a: "Drain cleaning may clear a blockage. Sewer line repair may be needed when the pipe is damaged, collapsed, root-filled, or keeps backing up after cleaning." },
      { q: "Can a sewer camera inspection help before repair?", a: "Yes. A camera inspection can help show roots, broken pipe, belly sections, buildup, or other pipe concerns before repair planning." },
      { q: "Do you help with sewer line replacement?", a: "Yes. Fateh Plumbing & Electric helps with sewer line replacement planning when repair is not the strongest long-term option." },
      { q: "Is trenchless sewer line repair always possible?", a: "No. Trenchless sewer line repair depends on pipe condition, access, depth, layout, and the type of damage." },
      { q: "Should I keep using water during a sewer backup?", a: "If sewage is backing up, avoid using toilets, sinks, showers, laundry, or dishwasher until the issue is checked." },
    ],
  }),

  sewerCameraInspection: makePage({
    title: "Sewer Camera Inspection Brampton | Fateh",
    description: "Sewer camera inspection Brampton for recurring clogs, sewer smell, roots, and main line diagnosis. Licensed and insured service.",
    canonical: "https://fatehplumelec.com/sewer-camera-inspection.html",
    eyebrow: "Sewer camera inspection",
    h1: "Sewer Camera Inspection Brampton",
    heroText: "A sewer camera inspection helps locate recurring drain problems, pipe damage, root intrusion, low spots, and hidden sewer line issues before repair decisions are made.",
    heroAlt: "Technician using a sewer camera for drain inspection",
    proof: ["Drain camera inspection", "Sewer line inspection", "Pipe condition review"],
    intro: {
      eyebrow: "Drain camera service",
      title: "See what is happening inside the drain line",
      paragraphs: [
        "Recurring backups are frustrating because the drain may seem fine for a short time, then slow down or back up again. A sewer camera inspection gives a better look at the pipe path, restrictions, roots, cracked sections, bellies, heavy buildup, and connection points.",
        "Fateh Plumbing & Electric helps with sewer camera inspection in Brampton, sewer camera service, drain camera checks, plumbing camera inspection, sewer line inspection, sewer scope inspection, and pipe camera review for homes, rentals, restaurants, and small businesses.",
        "Camera inspection is especially useful before sewer line repair, property renovations, recurring drain cleaning, or commercial drain planning. General drain and wastewater details can be compared with <a href=\"https://www.peelregion.ca/water/\" target=\"_blank\" rel=\"noopener\">Peel Region water resources</a>."
      ],
    },
    quickCard: {
      eyebrow: "Need a pipe check?",
      title: "Request a sewer camera inspection",
      text: "Tell us what keeps backing up, how often it returns, and whether the line has been cleaned before.",
      points: ["Sewer camera", "Drain camera", "Sewer line inspection"],
    },
    problems: {
      eyebrow: "When a camera helps",
      title: "Common reasons to inspect the sewer line",
      items: [
        { title: "Repeated clogs after cleaning", text: "If the same line keeps blocking, camera inspection can help show why the clog returns.", href: "drain-cleaning.html", link: "Drain cleaning" },
        { title: "Sewer line repair planning", text: "Before repair or replacement, a pipe camera can help identify the affected section.", href: "sewer-line-repair.html", link: "Sewer repair" },
        { title: "Tree root concerns", text: "Roots can enter older pipe joints and create repeated restrictions or damaged areas.", href: "contact.html", link: "Request inspection" },
        { title: "Commercial drain backups", text: "Restaurants, retail units, and shared lines may need clearer drain condition information.", href: "commercial.html", link: "Commercial service" },
        { title: "Renovation or basement work", text: "A camera check can help plan basement plumbing, floor drains, or rough-in work.", href: "basement-plumbing.html", link: "Basement plumbing" },
        { title: "Unknown pipe route", text: "A pipe camera can help understand line direction, restrictions, and accessible cleanouts.", href: "contact.html", link: "Ask about camera service" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From recurring clog to clearer answers",
      items: [
        { title: "Confirm access", text: "We ask where the cleanout or affected drain is and what fixture keeps backing up." },
        { title: "Run the camera", text: "The camera is guided through the accessible line to look for buildup, roots, damage, or low sections." },
        { title: "Explain the finding", text: "You get a practical explanation of what the camera shows and how serious it appears." },
        { title: "Plan the next step", text: "The next step may be cleaning, repair, replacement planning, or monitoring depending on the condition." },
      ],
    },
    compare: {
      eyebrow: "Inspection limits",
      title: "A camera inspection diagnoses; it does not repair the pipe by itself",
      paragraphs: [
        "A sewer camera inspection can show the condition of the line, but cleaning or repair may still be needed after the inspection. The value is that the next step is based on what is visible inside the pipe, not guesswork.",
        "For recurring backups, a drain camera can help decide whether the issue is buildup, roots, a sagging pipe, a break, or a connection problem."
      ],
      cardTitle: "Helpful details to share",
      points: ["Where the clog starts", "Any previous drain cleaning", "Cleanout location if known", "Photos or videos of the backup"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Better information before bigger sewer work",
      text: "Camera inspection helps customers understand whether a drain issue is simple, recurring, or tied to pipe condition.",
      items: [
        { title: "Less guessing", text: "Camera review can show roots, buildup, pipe damage, and low spots." },
        { title: "Repair planning", text: "The inspection can support sewer line repair or replacement decisions." },
        { title: "Useful for properties", text: "Homes, rentals, restaurants, and commercial spaces can all benefit from clearer pipe information." },
      ],
    },
    cta: { eyebrow: "Book camera inspection", title: "Need sewer camera inspection in Brampton?", text: "Call Fateh Plumbing & Electric for drain camera service, sewer line inspection, recurring backup checks, and repair planning.", button: "Call 647-980-9211" },
    faqTitle: "Common sewer camera inspection questions",
    faqs: [
      { q: "What does a sewer camera inspection show?", a: "It can show roots, buildup, pipe breaks, low sections, restrictions, connection points, and some causes of recurring backups." },
      { q: "Does a sewer camera clear the clog?", a: "No. The camera is used to inspect the pipe. Drain cleaning or repair may still be needed depending on what is found." },
      { q: "When should I request a drain camera?", a: "A drain camera is useful when clogs keep returning, the main line backs up, sewer odour appears, or repair planning is needed." },
      { q: "Can sewer camera inspection help with sewer line repair?", a: "Yes. It can help identify the damaged or restricted section before repair or replacement planning." },
      { q: "Do businesses need sewer camera inspection?", a: "Restaurants, plazas, retail units, and properties with repeat drain problems may benefit from inspection before major service decisions." },
      { q: "Do you provide sewer camera inspection in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with sewer camera inspection in Brampton and nearby service areas when scheduling allows." },
    ],
  }),

  backwaterValve: makePage({
    title: "Backwater Valve Brampton | Fateh",
    description: "Backwater valve Brampton service for sewer backup prevention, basement flood risk, and storm protection. Free on-site assessment.",
    canonical: "https://fatehplumelec.com/backwater-valve.html",
    eyebrow: "Backwater valve",
    h1: "Backwater Valve Brampton",
    heroText: "A backwater valve can help reduce the risk of sewage backing up into lower-level fixtures during sewer surcharges, heavy rain, or municipal sewer pressure events.",
    heroAlt: "Backwater valve and basement plumbing service",
    proof: ["Backwater valve installation", "Sewer backup prevention", "Basement flood planning"],
    intro: {
      eyebrow: "Sewer backup protection",
      title: "A practical plumbing upgrade for vulnerable basements",
      paragraphs: [
        "Basement bathrooms, floor drains, laundry rooms, and low fixtures can be at risk when the sewer system surcharges. A properly installed backwater valve is designed to close when sewage tries to flow backward into the home.",
        "Fateh Plumbing & Electric helps with backwater valve installation in Brampton, backwater valve service, sewer backup prevention, basement flood prevention planning, and maintenance questions for homeowners, landlords, and property managers.",
        "Backwater valves are one part of basement flood protection. Customers can also review <a href=\"https://www.canada.ca/en/campaign/flood-ready.html\" target=\"_blank\" rel=\"noopener\">Government of Canada flood readiness guidance</a> when planning broader property protection."
      ],
    },
    quickCard: {
      eyebrow: "Protect the basement",
      title: "Ask about backwater valve service",
      text: "Tell us if you have had a sewer backup, have basement fixtures, or are planning a renovation.",
      points: ["Backwater valve", "Sewer backup prevention", "Basement flood planning"],
    },
    problems: {
      eyebrow: "When to consider it",
      title: "Backwater valve situations we help with",
      items: [
        { title: "Past sewer backup", text: "A previous basement backup is one of the strongest reasons to review protection options.", href: "sewer-line-repair.html", link: "Sewer repair" },
        { title: "Basement bathroom", text: "Lower-level toilets, showers, laundry, and floor drains can be vulnerable during sewer surcharge events.", href: "basement-plumbing.html", link: "Basement plumbing" },
        { title: "Heavy rain concerns", text: "Storm conditions can increase pressure on drainage systems and expose weak points.", href: "sump-pump-repair.html", link: "Sump pump help" },
        { title: "Insurance or renovation request", text: "Some customers review backwater valves during basement finishing, permit planning, or insurance updates.", href: "contact.html", link: "Request service" },
        { title: "Valve maintenance", text: "Existing valves should be accessible and checked so debris does not stop the gate from moving.", href: "contact.html", link: "Ask about service" },
        { title: "Sewer smell or backup signs", text: "Odour, gurgling, or backup symptoms may need drain and sewer inspection before installation planning.", href: "sewer-camera-inspection.html", link: "Camera inspection" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From backup risk to valve planning",
      items: [
        { title: "Review the property", text: "We ask about basement fixtures, previous backups, floor drains, and the main sewer path." },
        { title: "Check access", text: "Valve planning depends on pipe location, cleanout access, flooring, and the basement layout." },
        { title: "Explain the option", text: "You get a clear explanation of what a backwater valve does and what it does not do." },
        { title: "Install or service", text: "The work is planned around access, valve type, maintenance needs, and practical property protection." },
      ],
    },
    compare: {
      eyebrow: "Protection planning",
      title: "Backwater valve, sump pump, and drain cleaning solve different problems",
      paragraphs: [
        "A backwater valve helps reduce sewage backup risk from the sewer side. A sump pump handles groundwater entering a sump pit. Drain cleaning clears restrictions inside the drain line. Many basements need more than one protection measure.",
        "The right plan depends on whether the risk is sewer backup, groundwater, fixture blockage, a damaged sewer line, or a combination of issues."
      ],
      cardTitle: "Helpful details to share",
      points: ["Previous backup history", "Basement bathroom or floor drain", "Sump pump location", "Main sewer cleanout access"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Basement protection should be explained clearly",
      text: "A backwater valve is a useful upgrade when it is suitable for the property and maintained properly.",
      items: [
        { title: "Risk review", text: "We look at the basement layout, fixtures, previous backups, and sewer path." },
        { title: "Clear limits", text: "We explain what the valve helps with and when other flood protection is needed." },
        { title: "Maintenance aware", text: "Valve access and future cleaning matter for long-term reliability." },
      ],
    },
    cta: { eyebrow: "Book backwater valve service", title: "Need a backwater valve in Brampton?", text: "Call Fateh Plumbing & Electric for backwater valve installation, service, and sewer backup prevention planning.", button: "Call 647-980-9211" },
    faqTitle: "Common backwater valve questions",
    faqs: [
      { q: "What does a backwater valve do?", a: "A backwater valve is designed to help stop sewage from flowing backward into lower-level fixtures during a sewer backup event." },
      { q: "Do all basements need a backwater valve?", a: "Not every basement needs one, but homes with lower-level fixtures or past sewer backups should review the option." },
      { q: "Does a backwater valve stop groundwater?", a: "No. Groundwater is usually handled by drainage and sump pump systems. A backwater valve is for sewer backup risk." },
      { q: "Can a backwater valve be installed in an existing home?", a: "Often yes, but the pipe location, access, floor condition, and layout need to be checked first." },
      { q: "Does a backwater valve need maintenance?", a: "Yes. It should remain accessible and be checked so debris does not interfere with the gate." },
      { q: "Do you install backwater valves in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with backwater valve installation and service in Brampton and nearby areas." },
    ],
  }),

  basementPlumbing: makePage({
    title: "Basement Plumbing Brampton | Fateh",
    description: "Basement plumbing Brampton service for drains, rough-ins, sump pumps, leaks, and lower-level fixtures. Licensed and insured help.",
    canonical: "https://fatehplumelec.com/basement-plumbing.html",
    eyebrow: "Basement plumbing",
    h1: "Basement Plumbing Brampton",
    heroText: "Basement plumbing needs careful planning because bathrooms, floor drains, laundry, sump pumps, backwater valves, and leak risks all connect below the main living space.",
    heroAlt: "Basement bathroom plumbing rough-in and drain service",
    proof: ["Basement bathroom plumbing", "Rough-in planning", "Drain and leak help"],
    intro: {
      eyebrow: "Lower-level plumbing",
      title: "Basement plumbing needs a different level of planning",
      paragraphs: [
        "Basement plumbing is not just another sink or toilet. Lower-level fixtures need the right drainage path, venting, pump planning, floor drain condition, backwater protection, and leak awareness before the work feels reliable.",
        "Fateh Plumbing & Electric helps with basement plumbing in Brampton, basement bathroom plumbing, rough-in plumbing, basement water leak repair calls, floor drain problems, laundry drain concerns, sump pump coordination, and backwater valve planning.",
        "For broader flood preparation, customers can review <a href=\"https://www.canada.ca/en/campaign/flood-ready.html\" target=\"_blank\" rel=\"noopener\">Government of Canada flood readiness guidance</a> while planning plumbing and basement protection upgrades."
      ],
    },
    quickCard: {
      eyebrow: "Planning basement work?",
      title: "Call before opening floors or walls",
      text: "Tell us if the basement is finished, unfinished, leaking, backing up, or being renovated.",
      points: ["Basement bathroom", "Rough-in plumbing", "Drain and leak concerns"],
    },
    problems: {
      eyebrow: "Basement plumbing needs",
      title: "Common basement plumbing work we help plan",
      items: [
        { title: "Basement bathroom rough-in", text: "Toilet, sink, shower, and tub locations need proper drain, vent, and fixture planning.", href: "bathroom-plumbing.html", link: "Bathroom plumbing" },
        { title: "Floor drain smell or backup", text: "Odour or water from a floor drain can point to trap, blockage, sewer, or vent concerns.", href: "drain-cleaning.html", link: "Drain cleaning" },
        { title: "Basement water leak", text: "Water on basement floors can come from plumbing, appliances, drains, or foundation sources.", href: "leak-detection.html", link: "Leak detection" },
        { title: "Sump pump planning", text: "Basements with water risk may need sump pump repair, discharge review, or backup pump options.", href: "sump-pump-repair.html", link: "Sump pump repair" },
        { title: "Backwater valve review", text: "Lower-level fixtures may benefit from sewer backup protection planning.", href: "backwater-valve.html", link: "Backwater valve" },
        { title: "Laundry or kitchenette drains", text: "Basement laundry sinks, washers, and kitchenettes need proper drainage and water supply planning.", href: "contact.html", link: "Request service" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From basement idea to a practical plumbing path",
      items: [
        { title: "Share the basement goal", text: "Tell us if you need repair, renovation plumbing, a bathroom rough-in, drain service, or leak help." },
        { title: "Check the layout", text: "Fixture location, drains, ceiling height, access, and finished surfaces affect the service plan." },
        { title: "Review protection needs", text: "Sump pump, floor drain, backwater valve, and sewer line conditions may need to be considered." },
        { title: "Plan the work", text: "You get a clear service path for repair, installation, or next-step inspection." },
      ],
    },
    compare: {
      eyebrow: "Basement decisions",
      title: "Basement plumbing and waterproofing are not the same service",
      paragraphs: [
        "Fateh Plumbing & Electric helps with plumbing sources: drains, water lines, fixtures, sump pump concerns, sewer backups, and visible plumbing leaks. Foundation waterproofing or structural repair may require a separate specialist if the water source is outside the plumbing system.",
        "The first step is finding whether the issue is a drain backup, supply leak, appliance leak, sewer concern, sump pump problem, or foundation water entry."
      ],
      cardTitle: "Helpful details to share",
      points: ["Finished or unfinished basement", "Where water or odour appears", "Bathroom, laundry, or floor drain location", "Sump pump or backwater valve status"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Basement plumbing needs careful sequencing",
      text: "Lower-level work is easier to plan before flooring, walls, cabinets, and fixtures are finished.",
      items: [
        { title: "Rough-in planning", text: "Bathroom, laundry, and kitchenette drains need the right service path." },
        { title: "Water risk review", text: "Basement plumbing should consider sump pump and sewer backup risks." },
        { title: "Repair clarity", text: "We help separate plumbing leaks from foundation or exterior water problems." },
      ],
    },
    cta: { eyebrow: "Book basement plumbing", title: "Need basement plumbing help in Brampton?", text: "Call Fateh Plumbing & Electric for basement bathroom plumbing, drain concerns, leak checks, sump pump coordination, and rough-in planning.", button: "Call 647-980-9211" },
    faqTitle: "Common basement plumbing questions",
    faqs: [
      { q: "Do you help with basement bathroom plumbing?", a: "Yes. Fateh Plumbing & Electric helps with basement bathroom plumbing, rough-in planning, fixture connections, and drain concerns." },
      { q: "Why does my basement floor drain smell?", a: "Odour can come from a dry trap, blockage, vent issue, sewer gas, or a drain problem that needs checking." },
      { q: "Can basement water come from plumbing?", a: "Yes. Basement water can come from pipes, drains, fixtures, appliances, sump pump issues, or sewer backups. It can also come from foundation water entry." },
      { q: "Should I add a backwater valve for a basement bathroom?", a: "It may be worth reviewing if the basement has lower-level fixtures or past sewer backup concerns." },
      { q: "Do basement kitchens or laundry rooms need special plumbing?", a: "They need proper drain, vent, water supply, shutoff, and sometimes pump planning depending on location." },
      { q: "Can you help before a basement renovation?", a: "Yes. Calling before walls and floors are closed can make drain, vent, fixture, and protection planning easier." },
    ],
  }),
};
