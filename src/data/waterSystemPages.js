const commonRelated = [
  { title: "Water Heater Repair", href: "water-heater-repair.html", text: "No hot water, leaking tanks, rusty water, noisy tanks, and repair-or-replace planning.", link: "View water heater repair" },
  { title: "Tankless Water Heater", href: "tankless-water-heater.html", text: "On-demand hot water systems, tankless upgrades, maintenance concerns, and capacity planning.", link: "View tankless water heater" },
  { title: "RO System Installation", href: "reverse-osmosis-system.html", text: "Under-sink reverse osmosis drinking water systems for kitchens, offices, and small businesses.", link: "View RO installation" },
  { title: "Sump Pump Repair", href: "sump-pump-repair.html", text: "Failed pumps, float switch issues, battery backup planning, discharge concerns, and basement flood risk.", link: "View sump pump repair" },
  { title: "Water Softener", href: "water-softener.html", text: "Hard water, scale buildup, softener system installation, water conditioning, and fixture protection.", link: "View water softener" },
  { title: "Water Service Upgrade", href: "water-service-upgrade.html", text: "Main water line upgrades, low pressure concerns, old service piping, and bigger plumbing projects.", link: "View water service upgrade" },
  { title: "Leak Detection", href: "leak-detection.html", text: "Hidden water leaks, wet walls, ceiling stains, running meters, and unclear water sources.", link: "View leak detection" },
  { title: "Pipe Repair", href: "pipe-repair.html", text: "Burst pipes, frozen lines, corroded piping, water line leaks, and urgent pipe repairs.", link: "View pipe repair" },
];

const baseTrust = [
  { title: "Clear diagnosis", text: "We start with the symptom, then check the practical plumbing causes before recommending the next step." },
  { title: "Repair or upgrade", text: "Some problems can be repaired; others need replacement or upgrade planning for long-term reliability." },
  { title: "Brampton-based help", text: "Fateh Plumbing & Electric helps local homeowners, landlords, condos, and small businesses." },
];

const baseServiceArea = {
  eyebrow: "Service coverage",
  title: "Water system plumbing help across Brampton and nearby GTA communities",
  text: "Fateh Plumbing & Electric helps with water heaters, tankless systems, softeners, RO filters, sump pumps, and water line concerns from Brampton into nearby service areas when scheduling allows.",
  points: ["Brampton", "Mississauga", "Vaughan", "Caledon", "Etobicoke"],
};

function pageSchema(title, description, canonical) {
  return { title, description, canonical };
}

function makePage(config) {
  return {
    ...pageSchema(config.title, config.description, config.canonical),
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
    relatedEyebrow: "Related water system services",
    relatedTitle: "Water system service paths",
    proofBand: config.proofBand,
    cta: config.cta,
    faqEyebrow: "Water system FAQ",
    faqTitle: config.faqTitle,
    faqs: config.faqs,
  };
}

export const waterSystemPages = {
  waterHeaterRepair: makePage({
    title: "Water Heater Repair Brampton | No Hot Water & Leaking Tank",
    description: "Water heater repair in Brampton for no hot water, leaking tanks, hot water heater repair, rusty water, noisy tanks, and repair-or-replace planning.",
    canonical: "https://fatehplumelec.com/water-heater-repair.html",
    eyebrow: "Water heater repair",
    h1: "Water Heater Repair Brampton",
    heroText: "No hot water, a leaking tank, rusty water, strange noises, or a water heater that keeps failing? Fateh Plumbing & Electric helps with water heater repair and replacement planning in Brampton.",
    heroAlt: "Plumber working near a residential water heater",
    proof: ["Water heater repair", "No hot water help", "Leaking tank checks"],
    intro: {
      eyebrow: "Hot water plumber",
      title: "Fast help when the hot water stops working",
      paragraphs: [
        "A water heater problem can affect showers, laundry, dishes, tenants, restaurants, and daily routines. Some issues are repairable, while others become urgent when water is leaking from the tank, valve, pipe connection, or drain pan.",
        "Fateh Plumbing & Electric helps Brampton customers with water heater repair, hot water heater repair, no-hot-water calls, leaking tanks, rusty or discoloured hot water, pilot or ignition problems, valve concerns, and replacement planning.",
        "If water is actively leaking, shut off the water supply if it is safe and call for help. For local water information, customers can also review <a href=\"https://www.peelregion.ca/water/\" target=\"_blank\" rel=\"noopener\">Peel Region water resources</a>."
      ],
    },
    quickCard: {
      eyebrow: "Need hot water help?",
      title: "Call for water heater service",
      text: "Tell us if the tank is leaking, producing no hot water, making noise, or showing rusty water.",
      points: ["No hot water", "Leaking water heater", "Repair or replacement planning"],
    },
    problems: {
      eyebrow: "Water heater problems",
      title: "Choose the issue closest to yours",
      items: [
        { title: "No hot water", text: "Loss of hot water can come from ignition, power, thermostat, element, gas, or tank issues.", href: "contact.html", link: "Request service" },
        { title: "Water heater is leaking", text: "Leaks from the tank, valve, pipe connection, or drain pan should be checked quickly.", href: "emergency-plumber.html", link: "Emergency plumbing" },
        { title: "Hot water runs out fast", text: "An undersized, aging, or sediment-filled tank may struggle to meet household demand.", href: "tankless-water-heater.html", link: "Compare tankless options" },
        { title: "Rusty or smelly water", text: "Discoloured or odorous hot water can point to tank, anode rod, sediment, or piping concerns.", href: "pipe-repair.html", link: "Pipe repair" },
        { title: "Popping or rumbling noise", text: "Noise can come from sediment, pressure, heating cycles, or an aging tank.", href: "contact.html", link: "Book inspection" },
        { title: "Pilot or ignition trouble", text: "If the heater will not stay lit or keeps shutting down, it needs careful diagnosis.", href: "contact.html", link: "Request service" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From no hot water to a clear repair path",
      items: [
        { title: "Describe the symptom", text: "Tell us if there is no hot water, a leak, noise, rusty water, or unreliable temperature." },
        { title: "Confirm urgency", text: "Active leaks, spreading water, or unsafe conditions are treated as priority plumbing calls." },
        { title: "Inspect the system", text: "The technician checks visible plumbing connections, age, shutoffs, and repair indicators." },
        { title: "Repair or plan replacement", text: "You get a clear explanation of whether repair or replacement is the stronger option." },
      ],
    },
    compare: {
      eyebrow: "Repair or replace",
      title: "Not every water heater problem means a new tank",
      paragraphs: [
        "Repair may be practical when the issue is a valve, connection, control, power, ignition, or smaller part. Replacement may be the better route when the tank itself is leaking, corrosion is visible, or breakdowns keep returning.",
        "If hot water demand is changing, a tankless water heater may also be worth comparing. The right choice depends on usage, space, budget, venting, and long-term reliability."
      ],
      cardTitle: "Helpful details to share",
      points: ["Tank or tankless system", "Approximate age if known", "Leak location or no-hot-water symptom", "Gas or electric if known"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Clear answers for hot water problems",
      text: "Water heater problems can be confusing because the cause may be plumbing, power, ignition, age, or tank condition. Fateh helps sort the symptoms and explain the practical next step.",
      items: [
        { title: "Symptom-based checks", text: "No hot water, leaks, noise, rusty water, and short hot water runs are handled differently." },
        { title: "Emergency guidance", text: "Active leaks, spreading water, or unsafe conditions are treated as urgent plumbing concerns." },
        { title: "Repair or replace advice", text: "We help compare the likely repair path against age, tank condition, and reliability." },
      ],
    },
    cta: { eyebrow: "Book water heater service", title: "Tell us if the issue is no hot water, leaking water, or unreliable hot water", text: "Call Fateh Plumbing & Electric for water heater repair, leaking tank checks, no-hot-water calls, and replacement planning in Brampton and nearby GTA communities.", button: "Call 647-980-9211" },
    faqTitle: "Common questions before calling for water heater repair",
    faqs: [
      { q: "Do you repair water heaters in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with water heater repair in Brampton, including no hot water, leaking tanks, inconsistent temperature, pilot or ignition issues, and replacement planning." },
      { q: "Is a leaking water heater an emergency?", a: "A leaking water heater can be urgent if water is spreading, the tank is actively leaking, or the shutoff valve does not stop the water." },
      { q: "Why do I have no hot water?", a: "No hot water can be caused by ignition, power, thermostat, element, gas supply, breaker, or tank condition problems." },
      { q: "Should I repair or replace my water heater?", a: "Repair may make sense for smaller part or connection issues. Replacement may be better when the tank is leaking, old, corroded, unreliable, or undersized." },
      { q: "Can rusty hot water come from the water heater?", a: "Yes. Rusty or discoloured hot water can come from the tank, sediment, anode rod, or nearby piping." },
      { q: "Do you also install tankless water heaters?", a: "Tankless water heater work is handled separately because capacity, venting, gas, electrical, and installation requirements are different from standard tank repair." },
    ],
  }),

  tanklessWaterHeater: makePage({
    title: "Tankless Water Heater Brampton | Fateh",
    description: "Tankless water heater Brampton service for installs, repairs, flow issues, and hot water planning. Licensed and insured support.",
    canonical: "https://fatehplumelec.com/tankless-water-heater.html",
    eyebrow: "Tankless water heater",
    h1: "Tankless Water Heater Brampton",
    heroText: "Thinking about a tankless water heater or having trouble with an on-demand hot water system? Fateh Plumbing & Electric helps Brampton customers compare, install, repair, and service tankless water heater systems.",
    heroAlt: "Tankless water heater installed on a wall",
    proof: ["Tankless water heater", "On-demand hot water", "Installation and service"],
    intro: {
      eyebrow: "On-demand hot water",
      title: "Tankless systems are popular because they save space and heat water when needed",
      paragraphs: [
        "A tankless water heater, also called an on-demand water heater, heats water as it passes through the unit instead of storing hot water in a tank. That makes it a strong option for homeowners who want space savings, steady hot water, and a modern hot water setup.",
        "Fateh Plumbing & Electric helps with tankless water heater installation, tankless water heater repair, maintenance concerns, flow problems, error symptoms, temperature swings, and upgrade planning in Brampton.",
        "Tankless systems need the right capacity, venting, gas or electrical supply, water quality, and maintenance plan. For general energy information, customers can review <a href=\"https://natural-resources.canada.ca/energy-efficiency/products/water-heaters\" target=\"_blank\" rel=\"noopener\">Natural Resources Canada water heater guidance</a>."
      ],
    },
    quickCard: {
      eyebrow: "Book tankless service",
      title: "Tell us the brand and symptom",
      text: "Share whether you need installation, repair, maintenance, error code help, or a tank-to-tankless upgrade.",
      points: ["Tankless water heater", "On-demand hot water", "Repair, install or maintenance"],
    },
    problems: {
      eyebrow: "Tankless calls",
      title: "Common tankless water heater service needs",
      items: [
        { title: "Tankless installation", text: "Planning an upgrade from a tank requires proper capacity, venting, utility, and plumbing review.", href: "contact.html", link: "Request installation" },
        { title: "No hot water", text: "No hot water can come from flow, ignition, power, gas, scale, or system error issues.", href: "water-heater-repair.html", link: "Compare water heater repair" },
        { title: "Temperature swings", text: "Hot-cold changes may point to flow rate, maintenance, sizing, or control problems.", href: "contact.html", link: "Book service" },
        { title: "Error code showing", text: "An error code should be matched with the unit model before parts or service are planned.", href: "contact.html", link: "Ask about error code" },
        { title: "Mineral scale buildup", text: "Hard water can affect tankless performance and may connect to water softener planning.", href: "water-softener.html", link: "View water softener" },
        { title: "Tankless maintenance", text: "Flushing and service intervals depend on water quality, usage, and manufacturer guidance.", href: "contact.html", link: "Request maintenance" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From tankless question to clear next step",
      items: [
        { title: "Confirm system type", text: "We ask whether the unit is gas, electric, existing, new, or a tank-to-tankless upgrade." },
        { title: "Review hot water needs", text: "Bathrooms, fixtures, laundry, and daily use help decide capacity and service path." },
        { title: "Inspect requirements", text: "Venting, water piping, drain, power, gas, and space are reviewed where relevant." },
        { title: "Service or quote", text: "You get a clear next step for repair, maintenance, replacement, or installation." },
      ],
    },
    compare: {
      eyebrow: "Tank vs tankless",
      title: "A tankless water heater is not the right answer for every property",
      paragraphs: [
        "Tankless systems can save space and provide steady hot water, but they need proper sizing and installation. A standard tank may still be practical for some homes, budgets, and usage patterns.",
        "The best decision comes from comparing hot water demand, installation requirements, water quality, maintenance expectations, and long-term cost."
      ],
      cardTitle: "Helpful details to share",
      points: ["Current tank size or tankless model", "How many bathrooms are in use", "Gas or electric setup", "Any error codes or hot-cold changes"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Tankless planning needs more than a quick swap",
      text: "A reliable on-demand water heater setup depends on sizing, water quality, venting, utilities, and clean plumbing connections.",
      items: [
        { title: "Space-saving upgrade", text: "A tankless system can save space and provide hot water on demand when it is sized correctly." },
        { title: "Repair and installation", text: "Tankless service looks at flow, venting, utilities, scale, and system condition before the next step." },
        { title: "Whole-system planning", text: "Water quality, household demand, gas or electrical supply, and maintenance needs all matter." },
      ],
    },
    cta: { eyebrow: "Tankless water heater service", title: "Need tankless hot water help in Brampton?", text: "Call Fateh Plumbing & Electric for tankless water heater installation, repair, maintenance, and upgrade planning.", button: "Call 647-980-9211" },
    faqTitle: "Common tankless water heater questions",
    faqs: [
      { q: "Do you install tankless water heaters in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with tankless water heater installation and upgrade planning in Brampton." },
      { q: "Is tankless water heater repair different from regular water heater repair?", a: "Yes. Tankless systems have different flow, venting, ignition, scale, and control requirements compared with a storage tank." },
      { q: "Why does my tankless water heater go hot and cold?", a: "Temperature swings can come from flow rate, scale buildup, undersizing, maintenance issues, or control problems." },
      { q: "Does hard water affect tankless water heaters?", a: "Yes. Hard water can create scale inside the unit, which is why water softener planning may be useful in some homes." },
      { q: "Can I replace my tank with a tankless system?", a: "Often yes, but the space, venting, gas or electrical supply, drainage, and hot water demand need to be reviewed first." },
      { q: "Do tankless water heaters need maintenance?", a: "Yes. Maintenance needs depend on water quality, system type, household use, and manufacturer recommendations." },
    ],
  }),

  reverseOsmosisSystem: makePage({
    title: "Reverse Osmosis System Brampton | Fateh",
    description: "Reverse osmosis system Brampton installation for under-sink drinking water and RO faucet setup. Free on-site assessment.",
    canonical: "https://fatehplumelec.com/reverse-osmosis-system.html",
    eyebrow: "RO system installation",
    h1: "RO System Installation Brampton",
    heroText: "Enjoy cleaner-tasting drinking water from your kitchen faucet. Fateh Plumbing & Electric installs under-sink reverse osmosis systems for Brampton homes, offices, rentals, and small businesses.",
    heroImage: "/assets/service-photos/reverse-osmosis-system-installation-brampton.jpg",
    heroAlt: "Reverse osmosis system installed under a kitchen sink in Brampton",
    proof: ["RO system installation", "Under-sink water filter", "Cleaner drinking water"],
    intro: {
      eyebrow: "Reverse osmosis water filter",
      title: "Cleaner-tasting water without carrying cases of bottles",
      paragraphs: [
        "An RO system gives your kitchen a dedicated drinking water faucet, so cleaner-tasting water is available for drinking, cooking, coffee, tea, and ice. It is a practical choice for homes, rental units, offices, salons, and small workplaces.",
        "Reverse osmosis systems can help reduce many common taste, odour, sediment, and dissolved-solids concerns depending on the system and incoming water. Fateh Plumbing & Electric installs under-sink RO systems, connects the faucet, tank, filters, drain line, and shutoff cleanly, and explains basic care.",
        "Customers comparing systems can review examples from <a href=\"https://www.kentwater.ca/products/water-filtration-reverse-osmosis.php\" target=\"_blank\" rel=\"noopener\">Kent RO water filtration products</a> and general drinking water information from <a href=\"https://www.canada.ca/en/health-canada/services/environmental-workplace-health/water-quality/drinking-water.html\" target=\"_blank\" rel=\"noopener\">Health Canada</a>."
      ],
    },
    quickCard: {
      eyebrow: "Book RO installation",
      title: "Install a kitchen drinking water system",
      text: "Call for RO system installation, filter replacement guidance, kitchen faucet setup, and under-sink water filtration service.",
      points: ["Reverse osmosis system", "Kitchen drinking water", "Homes and small businesses"],
    },
    problems: {
      eyebrow: "Why install RO?",
      title: "Common reasons customers choose reverse osmosis",
      items: [
        { title: "Cleaner taste", text: "RO filtration can improve water used for drinking, tea, coffee, cooking, and ice.", href: "contact.html", link: "Ask about RO water" },
        { title: "Less bottled water", text: "A dedicated filtered faucet can reduce the need to buy, store, and carry bottled water.", href: "contact.html", link: "Request installation" },
        { title: "Under-sink setup", text: "The system sits below the sink with a small faucet at the countertop or sink deck.", href: "kitchen-sink-installation.html", link: "Kitchen sink service" },
        { title: "Filter replacement", text: "Pre-filters, membrane, and post-filters have different replacement schedules.", href: "contact.html", link: "Ask about filters" },
        { title: "Mineral options", text: "Some RO systems add selected minerals back after filtration for taste preference.", href: "water-softener.html", link: "Compare water softener" },
        { title: "Small business water", text: "Offices and small workplaces often choose RO for staff drinking water and coffee stations.", href: "commercial.html", link: "Commercial service" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From water concern to installed RO system",
      items: [
        { title: "Tell us the goal", text: "Cleaner taste, less bottled water, cooking water, office drinking water, or a system replacement." },
        { title: "Choose the setup", text: "We discuss under-sink RO, mineral options, faucet style, capacity, and filter maintenance." },
        { title: "Install cleanly", text: "The system is connected to kitchen plumbing with attention to shutoff, drain, tank, and faucet placement." },
        { title: "Use and maintain", text: "You get clear guidance on filter changes, basic care, and when to call for service." },
      ],
    },
    compare: {
      eyebrow: "RO system or water softener?",
      title: "Different systems solve different water problems",
      paragraphs: [
        "Reverse osmosis is usually a drinking water solution at one faucet. A water softener is usually a whole-home system that reduces hardness scale for plumbing, fixtures, and appliances.",
        "Many Brampton homeowners start with an RO system because it gives an immediate everyday benefit: better drinking water from the kitchen. If you also see scale on fixtures, spots on glassware, or hard-water buildup, a water softener may also be worth discussing."
      ],
      cardTitle: "RO system is best for",
      points: ["Kitchen drinking water", "Coffee, tea, cooking, and ice", "Reducing bottled water use", "Under-sink filtration"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Clean installation for daily drinking water",
      text: "The system should be installed neatly so the faucet, storage tank, filters, drain saddle, shutoff, and water line are easy to use and service.",
      items: [
        { title: "Kitchen-focused", text: "RO is best for drinking water, cooking, coffee, tea, and ice at the kitchen sink." },
        { title: "Product-flexible", text: "The right system depends on space, capacity, filter needs, faucet style, and taste preference." },
        { title: "Kitchen plumbing support", text: "Faucet, drain, shutoff, tubing, storage tank, and filter connections are handled together." },
      ],
    },
    cta: { eyebrow: "Book RO installation", title: "Want cleaner-tasting kitchen drinking water?", text: "Call Fateh Plumbing & Electric for RO system installation, under-sink water filter setup, and water filtration service in Brampton.", button: "Call 647-980-9211" },
    faqTitle: "Common RO system installation questions",
    faqs: [
      { q: "Do you install RO systems in Brampton?", a: "Yes. Fateh Plumbing & Electric installs reverse osmosis drinking water systems for Brampton homes, rentals, offices, and small businesses." },
      { q: "What is an RO system used for?", a: "An RO system is commonly used to improve drinking and cooking water at the kitchen sink." },
      { q: "Is reverse osmosis the same as a water softener?", a: "No. RO is usually for drinking water at one faucet, while a water softener is typically a whole-home hardness solution." },
      { q: "How often do RO filters need replacement?", a: "Filter timing depends on the system, water quality, and usage. Pre-filters, membranes, and post-filters can have different schedules." },
      { q: "Can an RO system reduce bottled water use?", a: "Yes. Many customers install RO because filtered water is available at home without storing cases of bottled water." },
      { q: "Can RO be used in a small business?", a: "Yes. RO systems can be useful in offices, salons, small shops, and workplaces where staff or customers use drinking water." },
    ],
  }),

  sumpPumpRepair: makePage({
    title: "Sump Pump Repair Brampton | Fateh",
    description: "Sump pump repair Brampton for failed pumps, float switches, battery backup planning, and basement flood risk. Licensed and insured.",
    canonical: "https://fatehplumelec.com/sump-pump-repair.html",
    eyebrow: "Sump pump repair",
    h1: "Sump Pump Repair Brampton",
    heroText: "A failed sump pump can turn basement moisture into a serious flood risk. Fateh Plumbing & Electric helps with sump pump repair, replacement planning, discharge concerns, and backup pump options in Brampton.",
    heroAlt: "Basement sump pump and plumbing service",
    proof: ["Sump pump repair", "Basement flood prevention", "Battery backup planning"],
    intro: {
      eyebrow: "Basement water protection",
      title: "Sump pump problems should be checked before the next heavy rain",
      paragraphs: [
        "A sump pump is easy to forget until the basement needs it. If the pump is not turning on, runs constantly, makes unusual noise, smells hot, trips power, or cannot keep up during heavy rain, the system needs attention.",
        "Fateh Plumbing & Electric helps Brampton customers with sump pump repair, sump pump replacement, float switch problems, discharge line checks, pit concerns, battery backup planning, and basement flood prevention.",
        "For broader flood awareness, homeowners can review <a href=\"https://www.canada.ca/en/campaign/flood-ready.html\" target=\"_blank\" rel=\"noopener\">Government of Canada flood ready guidance</a> while arranging plumbing service for a pump that may fail."
      ],
    },
    quickCard: {
      eyebrow: "Book sump pump service",
      title: "Tell us what the pump is doing",
      text: "Mention if the pump is dead, cycling constantly, noisy, overflowing, or failing during rain.",
      points: ["Failed sump pump", "Float switch checks", "Backup pump planning"],
    },
    problems: {
      eyebrow: "Sump pump symptoms",
      title: "Signs your sump pump needs repair",
      items: [
        { title: "Pump will not turn on", text: "A dead pump may involve power, float switch, motor, or pump failure.", href: "contact.html", link: "Request service" },
        { title: "Pump runs constantly", text: "Constant cycling can point to water volume, switch, pit, discharge, or check valve concerns.", href: "contact.html", link: "Book inspection" },
        { title: "Basement water is rising", text: "Standing water around the pit or floor should be treated quickly to reduce damage risk.", href: "emergency-plumber.html", link: "Emergency plumbing" },
        { title: "Noisy or vibrating pump", text: "Grinding, rattling, or vibration can point to worn parts, debris, or installation concerns.", href: "contact.html", link: "Ask about repair" },
        { title: "Discharge line problem", text: "If water cannot leave properly, the pump may work but still fail to protect the basement.", href: "pipe-repair.html", link: "Pipe repair" },
        { title: "No battery backup", text: "Backup planning is useful when storms, power loss, or pump failure would create major risk.", href: "contact.html", link: "Ask about backup" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From pump concern to basement protection plan",
      items: [
        { title: "Describe the symptom", text: "Tell us if the pump is dead, noisy, cycling, overflowing, or failing during rain." },
        { title: "Confirm urgency", text: "Water rising in the pit or basement is more urgent than routine maintenance." },
        { title: "Check pump and discharge", text: "The pump, float, pit, check valve, and visible discharge path are reviewed." },
        { title: "Repair or replace", text: "You get a clear next step for repair, replacement, backup planning, or discharge correction." },
      ],
    },
    compare: {
      eyebrow: "Repair or replace",
      title: "A sump pump repair call may turn into replacement planning",
      paragraphs: [
        "Some sump pump issues are repairable, especially when the problem is a switch, power source, debris, or discharge restriction. Replacement becomes more practical when the pump is old, unreliable, undersized, or has already failed during storms.",
        "Battery backup is also worth discussing if the basement has finished space, stored inventory, rental units, or a history of power loss during heavy rain."
      ],
      cardTitle: "Helpful details to share",
      points: ["Is there water in the pit?", "Does the pump turn on?", "Any recent heavy rain?", "Do you have a backup pump?"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Basement water problems need practical timing",
      text: "Sump pump service works best before the next major storm, but active water around the pit should be handled quickly.",
      items: [
        { title: "Repair focus", text: "Float, power, pump, pit, discharge, and check valve symptoms are separated." },
        { title: "Flood prevention", text: "Sump service helps protect basements before heavy rain, snow melt, or pump failure creates damage." },
        { title: "Local service", text: "Brampton basements, rentals, and small businesses can call with urgent pump concerns." },
      ],
    },
    cta: { eyebrow: "Book sump pump repair", title: "Worried your sump pump will fail?", text: "Call Fateh Plumbing & Electric for sump pump repair, replacement planning, discharge checks, and backup pump options.", button: "Call 647-980-9211" },
    faqTitle: "Common sump pump repair questions",
    faqs: [
      { q: "Do you repair sump pumps in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with sump pump repair, replacement planning, float switch problems, and basement water concerns in Brampton." },
      { q: "Is a failed sump pump an emergency?", a: "It can be urgent if water is rising in the pit or basement, especially during rain or snow melt." },
      { q: "Why does my sump pump run all the time?", a: "Constant running can come from water volume, switch problems, pit conditions, check valve issues, or discharge restrictions." },
      { q: "Should I replace an old sump pump?", a: "Replacement may be safer when the pump is older, unreliable, noisy, underpowered, or has already failed during a storm." },
      { q: "Do I need a battery backup sump pump?", a: "A battery backup can help if power loss during storms would put the basement at risk." },
      { q: "Can discharge line issues affect the sump pump?", a: "Yes. If water cannot discharge properly, the pump may cycle poorly or fail to protect the basement." },
    ],
  }),

  waterSoftener: makePage({
    title: "Water Softener Brampton | Fateh",
    description: "Water softener Brampton service for hard water, plumbing connections, setup, and replacement planning. Licensed and insured help.",
    canonical: "https://fatehplumelec.com/water-softener.html",
    eyebrow: "Water softener",
    h1: "Water Softener Brampton",
    heroText: "Hard water can leave scale on fixtures, spots on glassware, and buildup in plumbing and appliances. Fateh Plumbing & Electric helps with water softener system planning and installation in Brampton.",
    heroAlt: "Water softener system installed in a residential utility room",
    proof: ["Water softener system", "Hard water help", "Water conditioning"],
    intro: {
      eyebrow: "Hard water and scale",
      title: "Water softeners help reduce hardness buildup throughout the home",
      paragraphs: [
        "A water softener is a whole-home water conditioning system that helps reduce hardness minerals before water moves through fixtures, appliances, and plumbing. Customers usually notice hard water through scale, spots, dry-feeling water, soap that does not lather well, or buildup around faucets and shower glass.",
        "Fateh Plumbing & Electric helps Brampton customers with water softener installation, softener system replacement planning, bypass and drain connection review, and related plumbing work around water conditioning systems.",
        "Hardness and treatment needs vary by property. For general drinking water and household water information, customers can review <a href=\"https://www.canada.ca/en/health-canada/services/environmental-workplace-health/water-quality/drinking-water.html\" target=\"_blank\" rel=\"noopener\">Health Canada drinking water information</a>."
      ],
    },
    quickCard: {
      eyebrow: "Book water softener service",
      title: "Tell us the hard water signs",
      text: "Mention scale, spotting, appliance concerns, old softener issues, or if you want a new water softener system.",
      points: ["Water softener installation", "Water conditioning system", "Hard water and scale concerns"],
    },
    problems: {
      eyebrow: "Hard water signs",
      title: "Reasons customers ask about a water softener",
      items: [
        { title: "Scale on fixtures", text: "White buildup around faucets, showerheads, glass, and sinks can point to hard water.", href: "faucet-repair.html", link: "Faucet repair" },
        { title: "Spots on dishes", text: "Spotting on glasses and dishes is a common household reason to compare water softener systems.", href: "contact.html", link: "Ask about softeners" },
        { title: "Old softener not working", text: "An existing system may need service, replacement planning, or plumbing connection review.", href: "contact.html", link: "Request service" },
        { title: "Tankless scale concern", text: "Hard water can affect tankless water heater performance over time.", href: "tankless-water-heater.html", link: "View tankless service" },
        { title: "RO vs softener confusion", text: "RO is usually for drinking water; a softener is usually for whole-home hardness reduction.", href: "reverse-osmosis-system.html", link: "Compare RO system" },
        { title: "Water conditioning upgrade", text: "A softener can be part of a wider plan for fixtures, appliances, and plumbing protection.", href: "contact.html", link: "Plan upgrade" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From hard water signs to a softener plan",
      items: [
        { title: "Confirm symptoms", text: "Scale, spotting, soap feel, appliance concerns, and existing system problems are reviewed." },
        { title: "Check plumbing needs", text: "Space, bypass, drain, water line, and location requirements are considered." },
        { title: "Discuss options", text: "System size, household use, maintenance, and budget help guide the choice." },
        { title: "Install and explain", text: "The system is connected cleanly and basic care is explained after installation." },
      ],
    },
    compare: {
      eyebrow: "Softener or RO?",
      title: "Water softeners and reverse osmosis systems do different jobs",
      paragraphs: [
        "A water softener is usually a whole-home system used to reduce hardness scale. Reverse osmosis is usually a kitchen drinking water system. Many homes use one or the other, and some use both.",
        "If your main concern is drinking water taste, an RO system may be the better first service to ask about. If your main concern is scale and hard-water buildup, a water softener is usually the better fit."
      ],
      cardTitle: "Water softener helps with",
      points: ["Hard water scale", "Fixture buildup", "Appliance protection planning", "Whole-home water conditioning"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Water softener planning should fit the whole home",
      text: "Water conditioning depends on water quality, household use, space, plumbing layout, and maintenance expectations.",
      items: [
        { title: "Hard-water solution", text: "A softener helps reduce scale across fixtures, appliances, and plumbing." },
        { title: "Right system for the job", text: "A softener, RO system, and tankless water heater solve different water problems." },
        { title: "Install planning", text: "Space, bypass, drain, water line, and maintenance needs are reviewed before installation." },
      ],
    },
    cta: { eyebrow: "Book water softener service", title: "Seeing scale, spots, or hard-water buildup?", text: "Call Fateh Plumbing & Electric for water softener system installation and water conditioning service in Brampton.", button: "Call 647-980-9211" },
    faqTitle: "Common water softener questions",
    faqs: [
      { q: "Do you install water softeners in Brampton?", a: "Yes. Fateh Plumbing & Electric helps with water softener system installation and related plumbing setup in Brampton." },
      { q: "What does a water softener do?", a: "A water softener helps reduce hardness minerals that can create scale buildup on fixtures, appliances, and plumbing." },
      { q: "Is a water softener the same as an RO system?", a: "No. A water softener usually treats hardness for the whole home, while RO usually filters drinking water at one kitchen faucet." },
      { q: "Can hard water affect a tankless water heater?", a: "Yes. Hard water can create scale that may affect tankless performance and maintenance needs." },
      { q: "What are signs of hard water?", a: "Common signs include fixture scale, spots on dishes or glass, dry-feeling water, and soap that does not lather well." },
      { q: "Can you replace an old water softener?", a: "Yes. Replacement planning can include the old system, bypass, drain, water line, and installation space." },
    ],
  }),

  waterServiceUpgrade: makePage({
    title: "Water Service Upgrade Brampton | Fateh",
    description: "Water service upgrade Brampton help for old supply lines, pressure issues, and home plumbing demand. Free on-site assessment.",
    canonical: "https://fatehplumelec.com/water-service-upgrade.html",
    eyebrow: "Water service upgrade",
    h1: "Water Service Upgrade Brampton",
    heroText: "Low water pressure, old service piping, renovation demand, or a larger plumbing system may require a water service upgrade. Fateh Plumbing & Electric helps Brampton customers plan the next step.",
    heroAlt: "Main water line and plumbing upgrade work",
    proof: ["Water service upgrade", "Low pressure concerns", "Main water line planning"],
    intro: {
      eyebrow: "Main water line planning",
      title: "Water service upgrades are for bigger supply problems, not small fixture repairs",
      paragraphs: [
        "A water service upgrade usually means improving the main water supply path into the property. Customers may ask about this when water pressure is weak, old service piping is suspected, renovations add demand, or a property needs a larger and more reliable water supply setup.",
        "Fateh Plumbing & Electric helps Brampton customers review low water pressure symptoms, main water line concerns, old piping, fixture demand, water meter area issues, and upgrade planning before larger plumbing work begins.",
        "Water service work may involve municipal requirements, property conditions, and code-aware planning. For local water information, customers can review <a href=\"https://www.peelregion.ca/water/\" target=\"_blank\" rel=\"noopener\">Peel Region water resources</a>."
      ],
    },
    quickCard: {
      eyebrow: "Plan a water service upgrade",
      title: "Tell us why you need more water supply",
      text: "Mention low pressure, old service piping, renovation plans, fixture demand, or water meter area concerns.",
      points: ["Low water pressure", "Old service line", "Renovation and fixture demand"],
    },
    problems: {
      eyebrow: "Upgrade triggers",
      title: "Reasons to ask about a water service upgrade",
      items: [
        { title: "Low water pressure", text: "Weak pressure across multiple fixtures may point to a larger supply concern.", href: "pipe-repair.html", link: "Compare pipe repair" },
        { title: "Old service piping", text: "Older incoming water lines may need review when reliability or capacity is a concern.", href: "contact.html", link: "Request review" },
        { title: "Renovation demand", text: "New bathrooms, kitchens, laundry, or business use can increase water demand.", href: "bathroom-plumbing.html", link: "Bathroom plumbing" },
        { title: "Water meter area concerns", text: "Visible issues near the meter, shutoff, or entry point should be inspected carefully.", href: "leak-detection.html", link: "Leak detection" },
        { title: "Commercial water demand", text: "Restaurants, salons, and commercial units may need stronger supply planning.", href: "commercial.html", link: "Commercial service" },
        { title: "Recurring supply problems", text: "Repeated repairs or inconsistent pressure may justify a broader water service discussion.", href: "contact.html", link: "Book assessment" },
      ],
    },
    process: {
      eyebrow: "How service works",
      title: "From pressure concern to upgrade plan",
      items: [
        { title: "Confirm symptoms", text: "We ask if pressure is low everywhere, only one fixture, or tied to certain usage times." },
        { title: "Review property needs", text: "Bathrooms, kitchens, laundry, commercial use, and renovation plans affect demand." },
        { title: "Check visible plumbing", text: "The meter area, shutoff, accessible piping, and related symptoms are reviewed." },
        { title: "Plan next step", text: "You get guidance on whether repair, investigation, or upgrade planning makes sense." },
      ],
    },
    compare: {
      eyebrow: "Repair or upgrade",
      title: "Low pressure does not always mean the main line needs replacement",
      paragraphs: [
        "Low pressure can come from a fixture, valve, pipe restriction, municipal supply, softener, filter, water heater, or main service concern. A full water service upgrade should be considered after smaller causes are separated from whole-property supply issues.",
        "When the problem is truly capacity, age, or service-line condition, a water service upgrade can become the right long-term plan."
      ],
      cardTitle: "Helpful details to share",
      points: ["Which fixtures have low pressure", "How long the issue has existed", "Any renovation or added fixtures", "Old pipe material if known"],
    },
    proofBand: {
      eyebrow: "Why call Fateh",
      title: "Bigger water supply work needs a careful plan",
      text: "Water service upgrades affect the whole property, so major supply work should be reviewed separately from ordinary faucet, filter, or small pipe repairs.",
      items: [
        { title: "Whole-property supply", text: "This service is for larger pressure, capacity, and main water line concerns." },
        { title: "Careful diagnosis", text: "Pressure symptoms should be reviewed before assuming a full upgrade is needed." },
        { title: "Local planning", text: "Municipal and property conditions can matter, so local Brampton context is included." },
      ],
    },
    cta: { eyebrow: "Book water service review", title: "Need a main water line or supply upgrade?", text: "Call Fateh Plumbing & Electric for water service upgrade planning, low pressure review, and main water line guidance in Brampton.", button: "Call 647-980-9211" },
    faqTitle: "Common water service upgrade questions",
    faqs: [
      { q: "What is a water service upgrade?", a: "A water service upgrade usually means improving the main water supply path into the property to support pressure, capacity, or reliability needs." },
      { q: "Does low water pressure always mean I need an upgrade?", a: "No. Low pressure can come from fixtures, valves, filters, softeners, piping, municipal supply, or main service issues." },
      { q: "When should I ask about a main water line upgrade?", a: "Ask when pressure is weak across the property, service piping is old, renovations add demand, or repeated supply problems keep returning." },
      { q: "Can commercial properties need a water service upgrade?", a: "Yes. Restaurants, salons, retail units, and other businesses may need higher water demand planning." },
      { q: "Is water service upgrade the same as pipe repair?", a: "No. Pipe repair is often localized. Water service upgrade is broader and usually relates to the main supply line or capacity." },
      { q: "Do municipal requirements matter?", a: "They can. Main water supply work may involve local rules, property conditions, permits, or coordination depending on the job." },
    ],
  }),
};
