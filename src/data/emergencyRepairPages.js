const commonRelated = [
  { title: "Emergency Plumber", href: "emergency-plumber.html", text: "Urgent plumbing help for active leaks, sewer backups, overflowing fixtures, and water damage risk.", link: "View emergency plumber" },
  { title: "Leak Detection", href: "leak-detection.html", text: "Hidden water leaks, ceiling stains, damp drywall, running meters, and pipe leak concerns.", link: "View leak detection" },
  { title: "Pipe Repair", href: "pipe-repair.html", text: "Pipe leak repair, burst pipes, damaged supply lines, frozen pipe concerns, and water pipe repair.", link: "View pipe repair" },
  { title: "Burst Pipe Repair", href: "burst-pipe-repair.html", text: "Burst pipe repair, frozen water pipe leaks, thaw-related leaks, and winter pipe damage.", link: "View burst pipe repair" },
  { title: "Water Service Upgrade", href: "water-service-upgrade.html", text: "Main water line upgrades, low pressure concerns, old service piping, and water supply planning.", link: "View water service upgrade" },
  { title: "Main Drain Backup", href: "main-drain-backup.html", text: "Main drain backing up, basement floor drain backups, sewer backups, and urgent drain service.", link: "View main drain backup" },
  { title: "Drain Cleaning", href: "drain-cleaning.html", text: "Clogged drains, slow drains, recurring blockages, floor drains, and emergency drain cleaning.", link: "View drain cleaning" },
  { title: "Sewer Line Repair", href: "sewer-line-repair.html", text: "Sewer line repair, sewer repair near me calls, sewer line replacement, and trenchless repair planning.", link: "View sewer repair" },
];

const baseTrust = [
  { title: "Urgency first", text: "We help identify whether the problem needs immediate attention or can be scheduled for the next service window." },
  { title: "Protect the property", text: "Active water, sewage, and unsafe conditions are handled with damage prevention in mind." },
  { title: "Clear repair path", text: "You get practical next steps for repair, inspection, replacement, or emergency service." },
];

const baseServiceArea = {
  eyebrow: "Service coverage",
  title: "Emergency plumber and repair help across Brampton and nearby GTA communities",
  text: "Fateh Plumbing & Electric helps with emergency plumber calls, leak detection, pipe repair, burst pipe repair, water service upgrade planning, and main drain backups from Brampton into nearby service areas when scheduling allows.",
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
    relatedEyebrow: "Related emergency and repair services",
    relatedTitle: "Emergency repair service paths",
    proofBand: config.proofBand,
    cta: config.cta,
    faqEyebrow: "Emergency plumber FAQ",
    faqTitle: config.faqTitle,
    faqs: config.faqs,
  };
}

export const emergencyRepairPages = {
  emergencyPlumbing: makePage({
    title: "Emergency Plumber Brampton | Same Day & 24 Hour Plumbing",
    description: "Emergency plumber in Brampton for active leaks, burst pipes, sewer backups, overflowing toilets, main drain backup, and urgent same day plumbing service.",
    canonical: "https://fatehplumelec.com/emergency-plumber.html",
    eyebrow: "Emergency plumber",
    h1: "Emergency Plumber Brampton",
    heroText: "Water moving fast, sewage backing up, a toilet overflowing, or a pipe leaking behind a wall? Fateh Plumbing & Electric helps with urgent plumbing problems in Brampton and nearby GTA communities.",
    heroAlt: "Emergency plumber checking urgent pipe repair",
    proof: ["Emergency plumber", "Same day plumber", "24 hour plumber"],
    intro: {
      eyebrow: "Urgent plumbing help",
      title: "Call an emergency plumber when the problem cannot safely wait",
      paragraphs: [
        "An emergency plumber is for active water, sewage, unsafe conditions, or a plumbing failure that can damage the property. Common urgent calls include burst pipes, frozen pipe leaks, sewer backups, main drain backup, overflowing toilets, leaking water heaters, and water leaks near finished areas.",
        "Fateh Plumbing & Electric helps customers searching for emergency plumber, emergency plumber near me, 24 hour plumber, 24/7 plumber, same day plumber, emergency plumbing services, emergency drain service, and urgent plumber service in Brampton.",
        "If water is spreading, shut off the nearest valve or main water supply if safe. If sewage is backing up, stop using fixtures. If water is near electrical equipment, stay clear and call for help.",
        "For general local water service information, customers can review <a href=\"https://www.peelregion.ca/water/\" target=\"_blank\" rel=\"noopener\">Peel Region water resources</a> while arranging urgent plumbing help."
      ],
    },
    quickCard: {
      eyebrow: "Need help now?",
      title: "Call an emergency plumber",
      text: "Tell us what is leaking, backing up, overflowing, or unsafe so we can guide the next step.",
      points: ["Burst pipe", "Sewer backup", "Active water leak"],
    },
    problems: {
      eyebrow: "Emergency plumber calls",
      title: "Common urgent plumbing problems",
      items: [
        { title: "Burst pipe or frozen pipe leak", text: "A split or thawing pipe can release water quickly and damage walls, floors, and ceilings.", href: "burst-pipe-repair.html", link: "Burst pipe repair" },
        { title: "Main drain or sewer backup", text: "Sewage or dirty water coming up from lower drains needs urgent attention.", href: "main-drain-backup.html", link: "Main drain backup" },
        { title: "Active hidden leak", text: "Water dripping through a ceiling or wall can spread fast and may need immediate shutoff.", href: "leak-detection.html", link: "Leak detection" },
        { title: "Water heater leaking", text: "A leaking tank or valve can become urgent when water is spreading or the shutoff does not hold.", href: "water-heater-repair.html", link: "Water heater repair" },
        { title: "Overflowing toilet", text: "A toilet that will not stop overflowing can damage floors and may connect to a drain problem.", href: "clogged-toilet.html", link: "Clogged toilet" },
        { title: "Water supply trouble", text: "Loss of water, low pressure, or main supply concerns may point to a larger service issue.", href: "water-service-upgrade.html", link: "Water service upgrade" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From urgent call to controlled repair",
      items: [
        { title: "Describe the emergency", text: "We ask what is happening, where it is located, and whether water or sewage is actively moving." },
        { title: "Reduce damage risk", text: "If safe, shutoff steps and immediate safety guidance can help protect the property." },
        { title: "Inspect the cause", text: "The technician checks the affected fixture, pipe, drain, valve, or water line." },
        { title: "Repair or stabilize", text: "The goal is to stop the immediate problem and explain any follow-up repair needed." },
      ],
    },
    compare: {
      eyebrow: "When to call",
      title: "Some plumbing issues can wait; active water usually cannot",
      paragraphs: [
        "A slow drip from a faucet can often be scheduled. Water spreading across a floor, sewage backing up, a burst pipe, or a ceiling leak should be treated as urgent because damage can grow quickly.",
        "An emergency plumber starts by controlling the immediate problem. After that, the permanent fix may involve leak detection, pipe repair, water service upgrade planning, drain cleaning, sewer line repair, or fixture replacement."
      ],
      cardTitle: "Helpful details to share",
      points: ["Is water actively moving?", "Can you shut it off?", "Is sewage involved?", "Is water near electrical equipment?"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Fast decisions matter during plumbing emergencies",
      text: "The right first steps can reduce damage while the repair path is being confirmed.",
      items: [
        { title: "Urgent triage", text: "We help sort leaks, backups, overflows, and no-water situations quickly." },
        { title: "Repair-minded service", text: "Emergency work focuses on stopping the problem and explaining the next repair step." },
        { title: "Local support", text: "Brampton-based service for homes, rentals, small businesses, and property managers." },
      ],
    },
    cta: { eyebrow: "Call now", title: "Need an emergency plumber in Brampton?", text: "Call Fateh Plumbing & Electric for active leaks, burst pipes, sewer backups, main drain backup, and urgent plumbing repair.", button: "Call 647-980-9211" },
    faqTitle: "Common emergency plumber questions",
    faqs: [
      { q: "When should I call an emergency plumber?", a: "Call an emergency plumber for active leaks, burst pipes, sewer backups, overflowing toilets, water near electrical areas, and plumbing problems causing property damage." },
      { q: "Should I shut off the water before calling?", a: "If it is safe, shut off the nearest fixture valve or the main water shutoff. If water is near electrical equipment, stay clear." },
      { q: "Do you help with same day plumbing service?", a: "Yes. Same day service depends on schedule and location, but urgent leaks and backups are treated as priority calls." },
      { q: "Can a main drain backup be an emergency?", a: "Yes. Sewage or dirty water backing up into a basement, floor drain, tub, or toilet should be treated as urgent." },
      { q: "Can a frozen pipe become an emergency?", a: "Yes. Frozen pipes can split and leak when pressure builds or when the pipe thaws." },
      { q: "Do you serve Brampton as an emergency plumber?", a: "Yes. Fateh Plumbing & Electric helps with emergency plumber calls in Brampton and nearby GTA communities when scheduling allows." },
    ],
  }),

  leakDetection: makePage({
    title: "Leak Detection Brampton | Water Leak Detection & Repair",
    description: "Leak detection in Brampton for hidden pipe leaks, water leak repair, ceiling stains, damp walls, running meters, and urgent plumbing leak service.",
    canonical: "https://fatehplumelec.com/leak-detection.html",
    eyebrow: "Leak detection",
    h1: "Leak Detection Brampton",
    heroText: "Water stain on the ceiling, damp drywall, a running meter, or water appearing where it should not? Fateh Plumbing & Electric helps find and repair plumbing leaks in Brampton.",
    heroAlt: "Plumber checking pipework for water leak detection",
    proof: ["Leak detection", "Water leak repair", "Pipe leak repair"],
    intro: {
      eyebrow: "Water leak detection",
      title: "Find the leak before the damage spreads",
      paragraphs: [
        "Some leaks are obvious. Others show up as ceiling stains, bubbling paint, damp flooring, cabinet damage, moldy smell, or a water meter moving when fixtures are off. Leak detection starts by narrowing down whether the source is a fixture, supply pipe, drain, water heater, valve, or hidden line.",
        "Fateh Plumbing & Electric helps with leak detection in Brampton, water leak repair, leak detection near me calls, water leak detection services, pipe leak repair, plumbing leak repair, and urgent leak concerns.",
        "For general household water guidance, customers can review <a href=\"https://www.peelregion.ca/water/\" target=\"_blank\" rel=\"noopener\">Peel Region water resources</a> while arranging plumbing service."
      ],
    },
    quickCard: {
      eyebrow: "Leak happening now?",
      title: "Call for leak detection",
      text: "Tell us where water is showing, whether it is spreading, and whether you can shut it off.",
      points: ["Hidden water leak", "Ceiling stains", "Running water meter"],
    },
    problems: {
      eyebrow: "Leak symptoms",
      title: "Common signs of a plumbing leak",
      items: [
        { title: "Ceiling stain or drip", text: "Water above finished rooms can come from bathroom plumbing, pipe leaks, drains, or a water heater area.", href: "emergency-plumber.html", link: "Emergency plumber" },
        { title: "Damp wall or soft flooring", text: "Moisture behind drywall or under flooring can point to a hidden supply or drain leak.", href: "pipe-repair.html", link: "Pipe repair" },
        { title: "Water meter keeps moving", text: "A meter that moves when fixtures are off can suggest a hidden leak in the plumbing system.", href: "contact.html", link: "Request leak check" },
        { title: "Cabinet or vanity damage", text: "Leaks under sinks can damage cabinets, floors, and nearby drywall before they become obvious.", href: "faucet-repair.html", link: "Faucet repair" },
        { title: "Basement water", text: "Basement water can come from plumbing, drains, sump pump trouble, or foundation water entry.", href: "basement-plumbing.html", link: "Basement plumbing" },
        { title: "Water heater area wet", text: "Moisture near the tank can come from valves, fittings, drain pan, tank condition, or nearby pipework.", href: "water-heater-repair.html", link: "Water heater repair" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From water stain to repair plan",
      items: [
        { title: "Share the symptoms", text: "Tell us where water appears, when it happens, and whether the leak is active." },
        { title: "Control the water", text: "If safe, shutoff steps can help reduce damage before inspection." },
        { title: "Trace the source", text: "The technician checks likely fixtures, pipes, drains, valves, and nearby plumbing." },
        { title: "Repair the cause", text: "The next step may be pipe repair, fixture repair, valve replacement, or drain service." },
      ],
    },
    compare: {
      eyebrow: "Leak source",
      title: "Not every water stain comes from the same place",
      paragraphs: [
        "A ceiling stain below a bathroom might be a toilet seal, tub drain, faucet supply, shower valve, water line, or drain pipe. A wet basement might be plumbing, a sump pump issue, sewer backup, or foundation water entry.",
        "Finding the correct source helps avoid opening the wrong area or replacing the wrong part. The repair should match the leak, not just the visible stain."
      ],
      cardTitle: "Helpful details to share",
      points: ["Where water appears", "Whether it is active now", "Any recent fixture use", "Photos of stains or wet areas"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Leak repair starts with finding the right source",
      text: "Hidden leaks can damage finished areas, so diagnosis and shutoff matter before the repair is planned.",
      items: [
        { title: "Symptom-based checks", text: "Ceilings, walls, cabinets, basements, and meters are reviewed differently." },
        { title: "Emergency awareness", text: "Active leaks are treated as priority when water is spreading." },
        { title: "Repair connection", text: "Leak detection can connect directly to pipe, fixture, valve, or drain repair." },
      ],
    },
    cta: { eyebrow: "Book leak service", title: "Need leak detection in Brampton?", text: "Call Fateh Plumbing & Electric for leak detection, water leak repair, hidden pipe leaks, and urgent plumbing leak service.", button: "Call 647-980-9211" },
    faqTitle: "Common leak detection questions",
    faqs: [
      { q: "What are signs of a hidden plumbing leak?", a: "Ceiling stains, damp drywall, soft flooring, moldy smell, a running meter, higher water bills, or unexplained water can point to a hidden leak." },
      { q: "Is water leak repair an emergency?", a: "It can be urgent if water is spreading, dripping through a ceiling, near electrical areas, or damaging finished spaces." },
      { q: "Can leak detection find a pipe leak behind a wall?", a: "Leak detection helps narrow down likely sources, but access may still be needed to confirm and repair the pipe." },
      { q: "Should I use fixtures before the leak is checked?", a: "If the leak appears after using a fixture, avoid using that fixture until it is inspected." },
      { q: "Can basement water be a plumbing leak?", a: "Yes. Basement water can come from plumbing, drains, sump pump problems, sewer backups, or foundation water entry." },
      { q: "Do you provide leak detection in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with leak detection and water leak repair in Brampton and nearby areas." },
    ],
  }),

  pipeRepair: makePage({
    title: "Pipe Repair Brampton | Water Pipe & Plumbing Leak Repair",
    description: "Pipe repair in Brampton for pipe leak repair, water pipe repair, plumbing leak repair, corroded lines, damaged supply piping, and urgent pipe problems.",
    canonical: "https://fatehplumelec.com/pipe-repair.html",
    eyebrow: "Pipe repair",
    h1: "Pipe Repair Brampton",
    heroText: "Leaking pipe, corroded supply line, wet cabinet, low pressure, or damaged plumbing pipe? Fateh Plumbing & Electric helps with pipe repair and water pipe repair in Brampton.",
    heroAlt: "Plumber repairing residential water pipe",
    proof: ["Pipe repair", "Water pipe repair", "Plumbing leak repair"],
    intro: {
      eyebrow: "Water pipe repair",
      title: "Repair leaking, damaged, or aging plumbing pipes",
      paragraphs: [
        "Pipe problems can start small and become expensive if water reaches cabinets, drywall, flooring, ceilings, or electrical areas. A pipe repair may involve a small exposed section, a hidden supply line, a corroded fitting, a frozen pipe split, or a larger water line concern.",
        "Fateh Plumbing & Electric helps with pipe repair in Brampton, water pipe repair, pipe leak repair, plumbing leak repair, burst pipe repair, frozen pipe damage, and water service upgrade planning.",
        "If the pipe is actively leaking, shut off the nearest valve or main water supply if safe and call for service.",
        "For broader home water damage preparation, customers can review <a href=\"https://www.canada.ca/en/campaign/flood-ready.html\" target=\"_blank\" rel=\"noopener\">Government of Canada flood readiness guidance</a> while scheduling repair."
      ],
    },
    quickCard: {
      eyebrow: "Pipe leaking?",
      title: "Call for pipe repair",
      text: "Tell us where the pipe is located, whether it is exposed, and whether water is still moving.",
      points: ["Pipe leak repair", "Water pipe repair", "Corroded pipe"],
    },
    problems: {
      eyebrow: "Pipe issues",
      title: "Common pipe repair problems",
      items: [
        { title: "Pipe leak under sink", text: "Cabinet leaks can come from supply lines, traps, valves, faucet connections, or drain fittings.", href: "faucet-repair.html", link: "Faucet repair" },
        { title: "Ceiling or wall pipe leak", text: "Hidden pipe leaks can show up as stains, bubbling paint, damp drywall, or dripping water.", href: "leak-detection.html", link: "Leak detection" },
        { title: "Burst or frozen pipe", text: "Winter pipe damage can split lines and release water when pressure changes or thawing begins.", href: "burst-pipe-repair.html", link: "Burst pipe repair" },
        { title: "Corroded supply pipe", text: "Older piping, pinhole leaks, or corrosion may need repair or partial replacement.", href: "water-service-upgrade.html", link: "Water service upgrade" },
        { title: "Low water pressure", text: "Pressure changes can come from valves, leaks, restricted lines, fixtures, or service line issues.", href: "water-service-upgrade.html", link: "Water service upgrade" },
        { title: "Emergency pipe leak", text: "Active leaks that cannot be stopped should be handled as urgent plumbing calls.", href: "emergency-plumber.html", link: "Emergency plumber" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From pipe leak to repaired line",
      items: [
        { title: "Confirm the leak", text: "We ask where water appears, whether the pipe is exposed, and if shutoff is possible." },
        { title: "Inspect the piping", text: "The technician checks the pipe type, fitting, valve, access, and surrounding damage risk." },
        { title: "Repair the section", text: "The repair may involve fittings, valves, exposed pipe sections, or partial replacement." },
        { title: "Test the system", text: "The repaired area is checked so you know what was done and what to watch for." },
      ],
    },
    compare: {
      eyebrow: "Repair or replace",
      title: "A single pipe repair may not solve every aging line",
      paragraphs: [
        "A small leak can often be repaired locally. Repeated leaks, corrosion, poor pressure, or old piping may need a broader water service upgrade or replacement conversation.",
        "The right decision depends on pipe material, location, access, leak history, water pressure, and whether the damage is isolated."
      ],
      cardTitle: "Helpful details to share",
      points: ["Pipe location", "Visible pipe material if known", "Active leak or old stain", "Any pressure changes"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Pipe leaks need careful repair choices",
      text: "A good repair stops the immediate leak and helps you understand whether a larger piping issue is developing.",
      items: [
        { title: "Leak-focused", text: "We check visible symptoms and likely hidden sources." },
        { title: "Repair planning", text: "Local repair or wider replacement can be discussed clearly." },
        { title: "Emergency ready", text: "Active leaks, burst pipes, and water damage risks are treated urgently." },
      ],
    },
    cta: { eyebrow: "Book pipe repair", title: "Need pipe repair in Brampton?", text: "Call Fateh Plumbing & Electric for pipe leak repair, water pipe repair, frozen pipe damage, and urgent plumbing leaks.", button: "Call 647-980-9211" },
    faqTitle: "Common pipe repair questions",
    faqs: [
      { q: "What are signs I need pipe repair?", a: "Visible leaks, ceiling stains, wet cabinets, damp walls, low pressure, corrosion, or water near a pipe can mean pipe repair is needed." },
      { q: "Can a pipe leak be repaired without replacing the whole line?", a: "Often yes, if the issue is isolated. Repeated leaks or corroded piping may need broader replacement planning." },
      { q: "Is a burst pipe an emergency?", a: "Yes. A burst pipe can release water quickly and should be treated as urgent." },
      { q: "Do frozen pipes always burst?", a: "No, but frozen pipes can split or leak when pressure builds or thawing begins." },
      { q: "Can low water pressure be caused by pipe problems?", a: "Yes. Pressure issues can come from leaks, valves, restrictions, old piping, or service line problems." },
      { q: "Do you provide pipe repair in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with pipe repair and water pipe repair in Brampton and nearby areas." },
    ],
  }),

  burstPipeRepair: makePage({
    title: "Burst Pipe Repair Brampton | Emergency Pipe Leak Repair",
    description: "Burst pipe repair in Brampton for split pipes, active pipe leaks, frozen pipe damage, emergency water leak repair, and urgent water pipe repair.",
    canonical: "https://fatehplumelec.com/burst-pipe-repair.html",
    eyebrow: "Burst pipe repair",
    h1: "Burst Pipe Repair Brampton",
    heroText: "A burst pipe can release water quickly into walls, floors, basements, and ceilings. Fateh Plumbing & Electric helps with urgent burst pipe repair, emergency pipe leaks, and frozen pipe damage in Brampton.",
    heroAlt: "Emergency plumber repairing burst frozen pipe",
    proof: ["Burst pipe repair", "Emergency pipe leak", "Frozen pipe damage"],
    intro: {
      eyebrow: "Emergency pipe leak repair",
      title: "Stop the water before a burst pipe damages the property",
      paragraphs: [
        "A burst pipe can release water behind walls, under floors, in basements, garages, crawl spaces, and ceiling spaces. Fast shutoff and repair helps reduce damage before water spreads into finished areas.",
        "Fateh Plumbing & Electric helps with burst pipe repair, emergency pipe leak repair, frozen pipe damage, frozen water pipes, emergency water leak repair, pipe leak repair, and urgent plumber calls in Brampton.",
        "For winter home preparation, customers can review <a href=\"https://www.canada.ca/en/campaign/flood-ready.html\" target=\"_blank\" rel=\"noopener\">Government of Canada flood readiness guidance</a> while arranging repair service."
      ],
    },
    quickCard: {
      eyebrow: "Pipe burst?",
      title: "Call for urgent pipe service",
      text: "Shut off the water if safe, then tell us where the pipe is located and whether water is spreading.",
      points: ["Burst pipe", "Active pipe leak", "Frozen pipe damage"],
    },
    problems: {
      eyebrow: "Burst pipe signs",
      title: "Common burst pipe repair situations",
      items: [
        { title: "Water spreading from a split pipe", text: "A cracked or split pipe can release water quickly and needs shutoff before repair.", href: "emergency-plumber.html", link: "Emergency plumber" },
        { title: "Water appears after thawing", text: "A frozen pipe may leak once ice melts and water pressure returns.", href: "emergency-plumber.html", link: "Emergency plumber" },
        { title: "Ceiling or wall leak", text: "Burst pipes above finished areas can drip through ceilings and walls quickly.", href: "leak-detection.html", link: "Leak detection" },
        { title: "Basement or garage pipe split", text: "Unheated spaces are common places for frozen pipe damage.", href: "pipe-repair.html", link: "Pipe repair" },
        { title: "Frozen outdoor line", text: "Exterior walls, hose bibs, and exposed lines may be vulnerable in cold weather.", href: "water-service-upgrade.html", link: "Water service upgrade" },
        { title: "Repeated winter problem", text: "Recurring freeze issues may need insulation, rerouting, or broader repair planning.", href: "contact.html", link: "Ask about prevention" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From burst pipe call to controlled repair",
      items: [
        { title: "Stop the water", text: "If safe, shut off the main or nearest valve to reduce damage." },
        { title: "Locate the damaged area", text: "The technician checks the frozen or leaking section and nearby vulnerable piping." },
        { title: "Repair the pipe", text: "Split or damaged pipe sections are repaired or replaced as needed." },
        { title: "Discuss prevention", text: "We explain simple steps to reduce future freeze risk where practical." },
      ],
    },
    compare: {
      eyebrow: "Frozen pipe damage",
      title: "Frozen pipes are one cause; the repair focus is the burst pipe",
      paragraphs: [
        "A frozen pipe may not leak right away, but it can split under pressure and release water later. A burst pipe needs immediate shutoff and repair because damage can spread quickly.",
        "After the immediate repair, prevention may include insulation, sealing cold air gaps, improving heat exposure, or rerouting vulnerable pipe sections."
      ],
      cardTitle: "Helpful details to share",
      points: ["No water or active leak", "Pipe location", "Heated or unheated space", "Can water be shut off?"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Burst pipes need quick control and practical repair",
      text: "The priority is stopping water, repairing the damaged section, and reducing repeat freeze risk where possible.",
      items: [
        { title: "Emergency response", text: "Active water from a burst pipe is treated as urgent." },
        { title: "Pipe repair", text: "Damaged sections can be repaired or replaced after inspection." },
        { title: "Winter awareness", text: "We look at exposed and vulnerable areas that may freeze again." },
      ],
    },
    cta: { eyebrow: "Call now", title: "Need burst pipe repair in Brampton?", text: "Call Fateh Plumbing & Electric for burst pipe repair, frozen pipe leaks, emergency water leaks, and urgent pipe service.", button: "Call 647-980-9211" },
    faqTitle: "Common burst pipe repair questions",
    faqs: [
      { q: "What should I do if a pipe bursts?", a: "Shut off the water if safe, move valuables away from the leak, avoid electrical hazards, and call for emergency plumbing service." },
      { q: "Can a frozen pipe leak after it thaws?", a: "Yes. A frozen pipe can split and begin leaking once the ice melts and water pressure returns." },
      { q: "Does no water from one tap mean a frozen pipe?", a: "It can. A single fixture losing water during cold weather may point to a frozen section." },
      { q: "Can you repair frozen pipe damage?", a: "Yes. Fateh Plumbing & Electric helps with frozen pipe damage and burst pipe repair in Brampton." },
      { q: "Should I heat a frozen pipe myself?", a: "Avoid open flames. If you are unsure or the pipe is hidden, call a plumber before the damage spreads." },
      { q: "How can frozen pipes be prevented?", a: "Insulation, sealing cold air gaps, keeping heat around vulnerable areas, and addressing exposed pipe locations can help reduce risk." },
    ],
  }),

  mainDrainBackup: makePage({
    title: "Main Drain Backup Brampton | Fateh",
    description: "Main drain backup Brampton service for sewer smell, basement backups, and slow whole-home drainage. 24/7 emergency help.",
    canonical: "https://fatehplumelec.com/main-drain-backup.html",
    eyebrow: "Main drain backup",
    h1: "Main Drain Backup Brampton",
    heroText: "Dirty water coming up from a basement floor drain, tub, toilet, or laundry drain can point to a main drain backup or sewer line concern that needs fast attention.",
    heroAlt: "Emergency plumber helping with main drain backup",
    proof: ["Main drain backup", "Basement drain backup", "Sewer backup help"],
    intro: {
      eyebrow: "Basement main drain backup",
      title: "When the main drain backs up, stop using water and call for help",
      paragraphs: [
        "A main drain backup can push dirty water or sewage into lower-level fixtures such as basement floor drains, tubs, showers, toilets, and laundry areas. It can come from a blockage, grease, roots, damaged sewer pipe, heavy use, or a sewer line issue.",
        "Fateh Plumbing & Electric helps with main drain backup, basement main drain backup, main drain backing up in basement, main sewer line backup, main plumbing line backed up, plumbing main line backup, and emergency drain service in Brampton.",
        "If sewage or dirty water is backing up, stop using toilets, sinks, showers, laundry, and dishwasher until the drain is checked.",
        "For municipal water and wastewater information, customers can also review <a href=\"https://www.peelregion.ca/water/\" target=\"_blank\" rel=\"noopener\">Peel Region water resources</a>."
      ],
    },
    quickCard: {
      eyebrow: "Drain backing up?",
      title: "Call before using more water",
      text: "Tell us which lower fixtures are backing up and whether sewage or standing water is present.",
      points: ["Main sewer line backup", "Basement floor drain", "Emergency drain service"],
    },
    problems: {
      eyebrow: "Backup signs",
      title: "Common main drain backup symptoms",
      items: [
        { title: "Basement floor drain backing up", text: "Water from a floor drain can point to main drain or sewer line trouble.", href: "basement-plumbing.html", link: "Basement plumbing" },
        { title: "Toilet bubbles or gurgles", text: "Gurgling fixtures can happen when the main line is restricted or air is trapped.", href: "clogged-toilet.html", link: "Clogged toilet" },
        { title: "Tub or shower fills with dirty water", text: "Lower fixtures may show the first signs of a main sewer line backup.", href: "drain-cleaning.html", link: "Drain cleaning" },
        { title: "Several drains slow at once", text: "Multiple slow drains can suggest a main plumbing line backup instead of one fixture clog.", href: "sewer-line-repair.html", link: "Sewer line repair" },
        { title: "Sewer odour", text: "Odour near drains or lower fixtures may be tied to backup, trap, vent, or sewer line issues.", href: "sewer-camera-inspection.html", link: "Camera inspection" },
        { title: "Backup keeps returning", text: "Recurring backups may need camera inspection or sewer line repair planning.", href: "sewer-camera-inspection.html", link: "Inspect the line" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From backed-up drain to a clear next step",
      items: [
        { title: "Stop water use", text: "Using more fixtures can push more water into the backed-up line." },
        { title: "Identify affected fixtures", text: "We ask which drains are backing up and whether sewage or dirty water is visible." },
        { title: "Clear or inspect", text: "The next step may be drain clearing, sewer camera inspection, or sewer line repair planning." },
        { title: "Prevent repeat backups", text: "Recurring problems may need deeper inspection, repair, or replacement options." },
      ],
    },
    compare: {
      eyebrow: "Drain vs sewer",
      title: "Main drain backup is different from one clogged sink",
      paragraphs: [
        "One clogged sink or toilet may be a fixture-level blockage. A main drain backup affects multiple fixtures or lower-level drains and can involve the sewer line.",
        "The repair path may start with emergency drain cleaning, but recurring backups can require sewer camera inspection or sewer line repair."
      ],
      cardTitle: "Helpful details to share",
      points: ["Which fixtures are backing up", "Dirty water or clear water", "Basement floor drain involved", "Has this happened before?"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Main drain backups need the right order of service",
      text: "A backup may need immediate clearing, but repeat backups should be checked for deeper sewer line causes.",
      items: [
        { title: "Urgent support", text: "Dirty water and sewage backups are treated as priority plumbing concerns." },
        { title: "Drain and sewer view", text: "We connect main drain symptoms with sewer line repair and camera inspection when needed." },
        { title: "Basement protection", text: "Lower fixtures, floor drains, and laundry areas are reviewed carefully." },
      ],
    },
    cta: { eyebrow: "Book main drain service", title: "Main drain backing up in Brampton?", text: "Call Fateh Plumbing & Electric for main drain backup, basement drain backup, sewer backup help, and emergency drain service.", button: "Call 647-980-9211" },
    faqTitle: "Common main drain backup questions",
    faqs: [
      { q: "What should I do if the main drain backs up?", a: "Stop using water, avoid flushing toilets or running laundry, keep away from sewage, and call for plumbing service." },
      { q: "Why is my basement floor drain backing up?", a: "It may be a main drain blockage, sewer line restriction, roots, grease buildup, or a damaged sewer line." },
      { q: "Is main drain backup an emergency?", a: "Yes, especially when sewage or dirty water is entering the basement or lower fixtures." },
      { q: "Can drain cleaning fix a main drain backup?", a: "Often it can restore flow, but recurring backups may need sewer camera inspection or sewer line repair." },
      { q: "Why do multiple drains back up at once?", a: "Multiple fixtures backing up together can point to a main plumbing line or sewer line issue." },
      { q: "Do you help with main drain backup in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with main drain backup and sewer backup concerns in Brampton and nearby areas." },
    ],
  }),
};
