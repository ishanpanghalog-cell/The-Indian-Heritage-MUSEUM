import { KnowledgeCategory } from '../types/museum';

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'ancient-engineering',
    number: '01',
    title: 'Ancient Indian Engineering',
    summary: 'How monumental stone structures and subterranean works solved extreme loads without modern machines.',
    explanation:
      'Ancient Indian engineers treated force, gravity, and terrain as active design partners. Rather than fighting landscape forces with fragile adhesives, they shaped hollow stepped towers to lower crushing weight, cut monolithic temples top-down from bedrock so workers never depended on tall scaffolding, and forged wrought-iron beams to reinforce wide stone spans.',
    keyPrinciples: [
      'Hollow corbelled towers minimize compressive dead load at extreme heights (Brihadeeswarar Temple).',
      'Subtractive top-down excavation turns natural cliffs into seamless single-stone complexes (Kailasa, Ajanta).',
      'Dry-stone mortise-and-tenon interlocking lets monumental masonry flex subtly during earthquakes.',
    ],
    interestingFacts: [
      'Moving the ~80-ton granite Kumbam onto Brihadeeswarar’s 66m Vimana required meticulous ramp geometry and synchronized team mechanics.',
      'Kailasa Temple at Ellora required removing an estimated 150,000–200,000 tonnes of basalt with zero structural errors.',
    ],
    relatedExhibitIds: ['brihadeeswarar', 'kailasa-ellora', 'mysorean-rockets'],
    diagramType: 'engineering',
  },
  {
    id: 'architecture-geometry',
    number: '02',
    title: 'Architecture and Geometry',
    summary: 'Sacred proportions, intersecting pendentive arches, and spatial axial planning across climates.',
    explanation:
      'From the square-to-circle dome transitions of Vijayapura to the symmetric trefoil peristyles of Kashmir, Indian builders used strict geometric ratios (Vastu Purusha Mandala and proportional grids) to harmonize structural stability with visual clarity. Transforming a square base into a soaring circular dome or a steep snow-shedding pyramid demanded mastery of solid geometry.',
    keyPrinciples: [
      'Eight intersecting arches transform a square chamber into a self-supporting circular dome base (Gol Gumbaz).',
      'Double-tiered steep triangular gables shed Himalayan snowfall cleanly (Martand Sun Temple).',
      'Axial symmetry links entrance gateways, courtyards, and sanctums to cardinal directions.',
    ],
    interestingFacts: [
      'Gol Gumbaz’s external dome diameter of ~44 meters spans one of the largest single-chamber stone interiors on Earth.',
      'Stepwells repeat identical triangular stair modules across 13 storeys to keep wall compression uniform.',
    ],
    relatedExhibitIds: ['gol-gumbaz', 'martand-sun', 'brihadeeswarar'],
    diagramType: 'geometry',
  },
  {
    id: 'physics-acoustics',
    number: '03',
    title: 'Physics and Acoustics',
    summary: 'Wave reflection in curved masonry, ballistics, and pressure containment in soft-iron chambers.',
    explanation:
      'Classical Indian builders and metallurgists demonstrated extraordinary intuitive mastery of wave mechanics and Newton’s laws. In Gol Gumbaz, smooth concave dome geometry guides low-energy sound waves around a 37.9-meter circular gallery. In 18th-century Mysore, hammered soft-iron cylinders withstood fierce combustion pressure to transform fireworks into long-range ballistic rockets.',
    keyPrinciples: [
      'Whispering-gallery wave propagation occurs when curved masonry reflects grazing sound waves repeatedly without scattering.',
      'Higher chamber pressure inside soft-iron cylinders increases exhaust gas velocity and thrust (Newton’s Third Law).',
      'Vaulted basalt ribs inside Ajanta Chaitya halls focus chanting resonance toward the central Stupa.',
    ],
    interestingFacts: [
      'A single sharp clap inside Gol Gumbaz produces 7 to 10 distinct audible echoes.',
      'Mysorean rockets reached 1–2 km, roughly double the range of contemporary European pasteboard rockets.',
    ],
    relatedExhibitIds: ['gol-gumbaz', 'mysorean-rockets', 'ajanta-caves'],
    diagramType: 'acoustics',
  },
  {
    id: 'astronomy-timekeeping',
    number: '04',
    title: 'Astronomy and Timekeeping',
    summary: 'Architecture calibrated to solstices, sunrise axes, and carved stone sundials.',
    explanation:
      'Temples and monuments in ancient India frequently doubled as astronomical instruments. Designers aligned gateways to equinoxes and solstices, and at Konark Sun Temple translated the daily and annual motion of the Sun directly into 24 carved stone chariot wheels that serve as working sundials.',
    keyPrinciples: [
      'Protruding stone wheel hubs act as gnomons casting sharp solar shadows onto radial spokes.',
      '8 major spokes divide daylight into 3-hour prahars, while rim beads subdivide time down to minutes.',
      'East-west cardinal alignment channels sunrise light deep through temple portals.',
    ],
    interestingFacts: [
      'Konark’s 24 wheels symbolize the 24 hours of a day (or 12 bright and 12 dark fortnights of the lunar-solar year).',
      'Martand Sun Temple’s 84 courtyard niches align with traditional solar-calendrical numbers.',
    ],
    relatedExhibitIds: ['konark-sun', 'martand-sun'],
    diagramType: 'astronomy',
  },
  {
    id: 'water-conservation',
    number: '05',
    title: 'Water Conservation',
    summary: 'Decentralized monsoon harvesting, aquifer recharge, and evaporation control.',
    explanation:
      'Living with dramatic seasonal monsoons taught ancient Indian communities to capture every drop where it fell. Stepwells (Vavs and Baoris), stone Kunds, Ahar-Pyne flood channels, and interconnected Eri tank networks turned brief heavy downpours into reliable year-round water security.',
    keyPrinciples: [
      'Subsurface reservoirs shaded by stone colonnades cut wind and solar evaporation drastically.',
      'Settling forebays trap silt before rainwater enters deep storage shafts.',
      'Cascading overflow weirs link village tanks across entire river basins.',
    ],
    interestingFacts: [
      'Chand Baori descends roughly 30 meters with ~3,500 symmetrical steps, keeping lower gallery air noticeably cooler than surface heat.',
      'Many traditional stepwells also served as rest houses for travelers along ancient trade routes.',
    ],
    relatedExhibitIds: ['water-lab'],
    diagramType: 'water',
  },
  {
    id: 'sustainable-technology',
    number: '06',
    title: 'Sustainable Technology',
    summary: 'Zero-waste bio-engineering, living architecture, and climate-responsive passive design.',
    explanation:
      'Long before modern sustainability terminology existed, communities across India engineered solutions that harmonized with local ecosystems rather than depleting them. In rain-drenched Meghalaya, Khasi and Jaintia builders grew living suspension bridges from Ficus elastica roots—creating infrastructure that heals itself and stabilizes slopes.',
    keyPrinciples: [
      'Botanical inosculation fuses living aerial roots into a unified tensile bridge network.',
      'Repeated foot traffic stimulates thicker wood-fiber growth along primary stress paths.',
      'Passive subterranean cooling in stepwells and thick stone temple walls eliminates mechanical climate control.',
    ],
    interestingFacts: [
      'Living root bridges can remain structurally sound for 400–500 years in monsoon rainforests where steel rusts and timber rots within years.',
      'Local stone pavers laid into the living root deck improve traction during heavy rains.',
    ],
    relatedExhibitIds: ['living-root-bridges', 'water-lab', 'ajanta-caves'],
    diagramType: 'sustainability',
  },
  {
    id: 'ancient-materials',
    number: '07',
    title: 'Ancient Materials and Construction',
    summary: 'Granite quarrying, fibre-reinforced mud plasters, mineral pigments, and soft-iron metallurgy.',
    explanation:
      'Ancient Indian artisans matched every material precisely to its climate and structural job: dense granite in Tamil Nadu, volcanic basalt in Maharashtra, local limestone in Kashmir, Khondalite in Odisha, organic fibre-reinforced clay plasters in Ajanta, and low-carbon hammered iron in Mysore.',
    keyPrinciples: [
      'Mineral pigments (ochres, terre verte, carbon black, lapis lazuli) resist fading across millennia.',
      'Rice husks and plant fibres reinforce clay base coats against thermal shrinkage cracks.',
      'Forged wrought-iron clamps and soft-iron rocket cylinders showcase advanced high-purity ferrous metallurgy.',
    ],
    interestingFacts: [
      'Brihadeeswarar Temple used granite blocks hauled across plains where no granite outcrops existed locally.',
      'Iron beams inside Konark Sun Temple have survived coastal sea winds for nearly eight centuries.',
    ],
    relatedExhibitIds: ['ajanta-caves', 'brihadeeswarar', 'mysorean-rockets', 'konark-sun'],
    diagramType: 'materials',
  },
];
