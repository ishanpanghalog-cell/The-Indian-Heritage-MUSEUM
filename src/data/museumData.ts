import { ExhibitData } from '../types/museum';

export const MUSEUM_ASSETS = {
  grandHall: '/src/assets/images/museum_grand_hall_1795023536541.jpg',
  sandstoneTile: '/src/assets/images/sandstone_carved_tile_1795023536896.jpg',
  stepwellStudy: '/src/assets/images/stepwell_geometry_study_1795023538788.jpg',
  konarkWheel: '/src/assets/images/konark_solar_wheel_1795023538314.jpg',
  brihadeeswarar: '/src/assets/images/brihadeeswarar_temple_thanjavur_1795024505080.jpg',
  ajantaCaves: '/src/assets/images/ajanta_caves_maharashtra_1795024505439.jpg',
  golGumbaz: '/src/assets/images/gol_gumbaz_vijayapura_1795024505131.jpg',
  martandSun: '/src/assets/images/martand_sun_temple_kashmir_1795024506497.jpg',
  kailasaEllora: '/src/assets/images/kailasa_temple_ellora_1795024506800.jpg',
  livingRootBridge: '/src/assets/images/living_root_bridges_meghalaya_1795024507007.jpg',
  mysoreanRocket: '/src/assets/images/mysorean_iron_rocket_1795024508430.jpg',
};

export const EXHIBITS: ExhibitData[] = [
  {
    id: 'water-lab',
    number: '01',
    title: 'Ancient Water Engineering Lab',
    shortTitle: 'Water Engineering Lab',
    subtitle: 'Stepwells, Reservoirs & Monsoon Hydrology',
    galleryWing: 'Gallery I · Hydrological Systems',
    location: 'Rajasthan, Gujarat, Maharashtra & South India',
    period: 'c. 300 BCE – 17th Century CE',
    dynastyOrCulture: 'Indus Tradition to Solanki & Vijayanagara Engineers',
    accessionNumber: 'IHM-HYD-001',
    accentColor: '#2B6E7D',
    archivalImage: MUSEUM_ASSETS.stepwellStudy,
    archivalCaption: 'Fig. 1 — Symmetrical descending staircases of a traditional Indian stone stepwell.',
    shortDescription:
      'Discover how ancient communities harvested brief monsoon rains using stepwells, channels, and underground reservoirs.',
    historicalIntro:
      'Across arid western India and the Deccan plateau, seasonal monsoons deliver an entire year’s rainfall in just a few weeks. Rather than letting water run off into the sea, ancient engineers built monumental subterranean stepwells (Vavs and Baoris), interconnected temple tanks (Kunds), and gravity-fed irrigation networks such as Ahar-Pyne systems in Bihar and Eri tank cascades in Tamil Nadu.',
    significance:
      'These water structures functioned simultaneously as groundwater recharge chambers, earthquake-resistant retaining structures, shaded community gathering spaces, and microclimate cooling wells.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Indian stepwells operate on coupled principles of geotechnical earth-retention, evaporative cooling, and hydrostatic equilibrium with the local water table.',
      principles: [
        {
          title: 'Stepped Retaining Geometry',
          detail:
            'Criss-crossing stone staircases brace inward soil pressure against deep vertical masonry walls, preventing collapse even during monsoon saturation.',
        },
        {
          title: 'Reduced Surface Evaporation',
          detail:
            'By sinking the reservoir 20 to 30 meters below ground and shading it with recessed colonnades, air temperature drops by 5–7°C and wind-driven evaporation is minimized.',
        },
        {
          title: 'Percolation & Aquifer Recharge',
          detail:
            'Unmortared lower masonry joints allow stored rainwater to slowly recharge surrounding alluvial aquifers, keeping village wells active through dry summers.',
        },
      ],
    },
    importantFeatures: [
      'Hundreds of symmetrical steps enabling access regardless of seasonal water-level fluctuations.',
      'Stone silt-traps and settling basins along feeder aqueduct channels to filter sediment before storage.',
      'Interconnected tank cascades where overflow from an upper village reservoir automatically feeds lower agricultural ponds.',
      'Subterranean pavilions offering passive thermal comfort without mechanical cooling.',
    ],
    interestingFacts: [
      'Chand Baori in Abhaneri, Rajasthan features roughly 3,500 narrow steps descending 13 storeys to a depth of about 30 meters.',
      'Rani ki Vav in Patan, Gujarat was constructed as an inverted temple honoring the sanctity of water, spanning seven levels of carved sandstone.',
      'In South India, interconnected Eri tank networks irrigated millions of acres while preventing seasonal flash floods.',
    ],
    modes: [
      {
        id: 'standard',
        label: '3D Stepwell View',
        description: 'Inspect the symmetrical sandstone steps, aqueduct channel, and deep water chamber.',
      },
      {
        id: 'cutaway',
        label: 'Subsurface Cutaway',
        description: 'Slice open the outer retaining wall to inspect the stepped foundation and water table.',
      },
      {
        id: 'animated',
        label: 'Simulate Monsoon Flow',
        description: 'Watch rainwater flow through the intake channel and raise the subterranean reservoir.',
      },
    ],
    hotspots: [
      {
        id: 'wl-channel',
        label: 'Intake Aqueduct & Silt Trap',
        description: 'Channels monsoon surface runoff into a settling basin before entering the deep well.',
        position: [-3.2, 1.55, 0],
      },
      {
        id: 'wl-steps',
        label: 'Criss-Cross Retaining Steps',
        description: 'Triangular flights brace the surrounding earth walls while granting access at any water level.',
        position: [0.3, 0.35, -1.65],
      },
      {
        id: 'wl-pool',
        label: 'Subterranean Aquifer Pool',
        description: 'Deep shaded reservoir that minimizes solar evaporation and recharges surrounding groundwater.',
        position: [0, -0.85, 0],
      },
    ],
    cameraPresets: {
      overview: [6.8, 5.4, 7.2],
      detail: [3.2, 2.2, 4.2],
      top: [0.1, 9.2, 0.4],
      target: [0, 0.1, 0],
    },
    quiz: [
      {
        id: 'wl-q1',
        exhibitId: 'water-lab',
        exhibitTitle: 'Ancient Water Engineering Lab',
        question: 'Why were Indian stepwells built deep underground with narrow shaded openings?',
        options: [
          'To hide water from neighbouring kingdoms',
          'To reach the water table and drastically reduce solar evaporation',
          'To generate hydroelectric power from falling rain',
          'Because stone could only be quarried underground',
        ],
        correctIndex: 1,
        explanation:
          'Sinking the reservoir deep below ground shields the water from direct sunlight and desert winds, lowering evaporation and tapping the natural aquifer.',
      },
      {
        id: 'wl-q2',
        exhibitId: 'water-lab',
        exhibitTitle: 'Ancient Water Engineering Lab',
        question: 'What structural role do the symmetrical zig-zag staircases inside a Baori serve besides walking access?',
        options: [
          'They act as braces resisting inward soil and water pressure on the walls',
          'They amplify echoes for ceremonial music',
          'They filter salt out of seawater',
          'They support wooden wind turbines',
        ],
        correctIndex: 0,
        explanation:
          'The stepped stone terraces distribute lateral earth pressure like internal buttresses, keeping deep excavation walls stable.',
      },
      {
        id: 'wl-q3',
        exhibitId: 'water-lab',
        exhibitTitle: 'Ancient Water Engineering Lab',
        question: 'In traditional cascade tank systems such as South Indian Eris, what happens when an upper tank overflows?',
        options: [
          'The excess water is pumped back uphill manually',
          'It channels automatically into the next downstream reservoir',
          'It is blocked permanently by clay seals',
          'It evaporates inside stone chimneys',
        ],
        correctIndex: 1,
        explanation:
          'Overflow weirs linked entire watersheds in chains so surplus monsoon water filled downstream tanks rather than causing floods.',
      },
      {
        id: 'wl-q4',
        exhibitId: 'water-lab',
        exhibitTitle: 'Ancient Water Engineering Lab',
        question: 'Why were settling basins (silt traps) built along feeder channels entering a reservoir?',
        options: [
          'To warm the water before bathing',
          'To slow water velocity so sand and mud settle before reaching the main storage',
          'To grow lotus roots for rope making',
          'To measure lunar tides',
        ],
        correctIndex: 1,
        explanation:
          'Slowing inflow in a forebay causes heavy silt to drop to the bottom, keeping the deep reservoir clear and easy to maintain.',
      },
    ],
  },
  {
    id: 'brihadeeswarar',
    number: '02',
    title: 'Brihadeeswarar Temple (Budheshwar), Tamil Nadu',
    shortTitle: 'Brihadeeswarar Temple',
    subtitle: 'Granite Dravidian Vimana & Chola Structural Mastery',
    galleryWing: 'Gallery II · Sacred Stone Mechanics',
    location: 'Thanjavur, Tamil Nadu',
    period: '1003 – 1010 CE',
    dynastyOrCulture: 'Imperial Chola Dynasty (Rajaraja Chola I)',
    accessionNumber: 'IHM-ARC-002',
    accentColor: '#9A6B16',
    archivalImage: MUSEUM_ASSETS.brihadeeswarar,
    archivalCaption: 'Fig. 2 — Towering 66-meter granite Vimana of Brihadeeswarar Temple at Thanjavur.',
    shortDescription:
      'Explore the towering 66-meter granite Vimana of Thanjavur, crowned by an 80-ton monolithic stone cupola.',
    historicalIntro:
      'Commissioned by Emperor Rajaraja Chola I and completed in 1010 CE under the name Rajarajeswaram, the Brihadeeswarar Temple (Peruvudaiyar Kovil) in Thanjavur stands as the pinnacle of Dravidian stone architecture. Built almost entirely of hard granite—quarried dozens of kilometers away and transported across the Cauvery delta—the temple has withstood earthquakes and tropical storms for over a millennium.',
    curatorialNote:
      'Historical Verification Note: Often searched by visitors as "Budheshwar Temple, Tamil Nadu," verified archaeological and epigraphic records establish that no major historical temple in Tamil Nadu carries the name Budheshwar (Budheshwar Mahadev Temple is located in Lucknow, Uttar Pradesh). This exhibit presents the verified Chola-era granite masterpiece in Tamil Nadu: the Brihadeeswarar Temple (Peruvudaiyar Kovil) at Thanjavur.',
    significance:
      'The temple’s 13-storey Vimana rises approximately 66 meters (216 feet) using precision-dressed interlocking granite blocks without mortar, relying purely on gravity, corbelled geometry, and load distribution.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Chola master builders combined hollow stepped tower engineering with dry-stone interlocking joints and inclined earth-ramp mechanics to lift massive granite weights safely.',
      principles: [
        {
          title: 'Dry-Stone Interlocking Masonry',
          detail:
            'Instead of lime mortar that degrades over centuries, carved granite blocks interlock via mortise-and-tenon notches, allowing tiny seismic flex without cracking.',
        },
        {
          title: 'Hollow Pyrimidal Vimana',
          detail:
            'The upper tiers of the 66-meter tower form a hollow stepped vault rather than a solid stone core, dramatically reducing downward crushing stress on the sanctum walls.',
        },
        {
          title: 'Inclined Ramp Hoisting Hypothesis',
          detail:
            'To raise the ~80-ton granite Kumbam (apex assembly) to 66 meters height, historical engineering studies describe an inclined earthen ramp extending several kilometers to maintain a manageable slope.',
        },
      ],
    },
    importantFeatures: [
      '216-foot (66 m) 13-storey square-plan granite Vimana tower.',
      'Monolithic Nandi bull sculpture measuring roughly 19.5 ft long and 12 ft high in the front pavilion.',
      '81 carved dance postures (Karanas) from the Natya Shastra along the upper inner wall.',
      'Extensive Tamil inscriptions etched across the granite plinth recording administration, music, and metallurgy.',
    ],
    interestingFacts: [
      'Granite is not naturally abundant in Thanjavur’s alluvial plain; tens of thousands of tons of stone were hauled from quarries tens of kilometers away.',
      'A double-walled ambulatory passage surrounds the inner sanctum, preserving Chola-period mineral frescoes.',
      'The temple is part of the UNESCO World Heritage "Great Living Chola Temples" ensemble.',
    ],
    modes: [
      {
        id: 'standard',
        label: '3D Temple Complex',
        description: 'Examine the 13-tier Vimana, pillared Mandapa, and Nandi pavilion.',
      },
      {
        id: 'cutaway',
        label: 'Sanctum Cutaway',
        description: 'Reveal the hollow double-walled tower structure and inner Mahalingam chamber.',
      },
      {
        id: 'animated',
        label: 'Capstone Ramp Mechanics',
        description: 'Visualize how an inclined earthen ramp enabled hoisting the 80-ton granite apex.',
      },
    ],
    hotspots: [
      {
        id: 'br-kumbam',
        label: '80-Ton Granite Apex (Kumbam)',
        description: 'Massive crowning granite cupola and brass-clad Kalasa sitting atop the 13th tier.',
        position: [0, 5.4, -1.6],
      },
      {
        id: 'br-vimana',
        label: '13-Tiered Hollow Vimana',
        description: 'Corbelled granite superstructure rising 66 meters with hollow interior weight reduction.',
        position: [0, 3.0, -1.6],
      },
      {
        id: 'br-nandi',
        label: 'Monolithic Nandi Pavilion',
        description: 'Colossal single-rock carved bull facing the main sanctum axis.',
        position: [0, 0.9, 3.0],
      },
    ],
    cameraPresets: {
      overview: [7.6, 5.0, 8.8],
      detail: [3.2, 4.4, 3.8],
      top: [0, 10.5, 0.5],
      target: [0, 2.2, 0],
    },
    quiz: [
      {
        id: 'br-q1',
        exhibitId: 'brihadeeswarar',
        exhibitTitle: 'Brihadeeswarar Temple (Thanjavur)',
        question: 'Which verified Chola temple in Thanjavur, Tamil Nadu is built entirely of granite and completed in 1010 CE?',
        options: [
          'Budheshwar Mahadev Temple of Lucknow',
          'Brihadeeswarar Temple (Peruvudaiyar Kovil)',
          'Martand Sun Temple',
          'Konark Sun Temple',
        ],
        correctIndex: 1,
        explanation:
          'Brihadeeswarar Temple (Rajarajeswaram / Peruvudaiyar Kovil) in Thanjavur was completed by Rajaraja Chola I in 1010 CE.',
      },
      {
        id: 'br-q2',
        exhibitId: 'brihadeeswarar',
        exhibitTitle: 'Brihadeeswarar Temple (Thanjavur)',
        question: 'How did Chola architects keep the 66-meter granite Vimana from crushing its own lower walls?',
        options: [
          'They built the upper superstructure with a hollow corbelled interior rather than solid stone',
          'They used hollow bamboo frames inside cement',
          'They floated the tower on underground springs',
          'They carved it downward from a natural mountain peak',
        ],
        correctIndex: 0,
        explanation:
          'The tapering stepped Vimana encloses a hollow internal shaft, dramatically cutting dead weight while maintaining compressive stability.',
      },
      {
        id: 'br-q3',
        exhibitId: 'brihadeeswarar',
        exhibitTitle: 'Brihadeeswarar Temple (Thanjavur)',
        question: 'Approximately how heavy is the massive granite capstone assembly at the top of the Vimana?',
        options: ['About 5 tons', 'About 80 tons', 'About 500 tons', 'About 2 tons'],
        correctIndex: 1,
        explanation:
          'The crowning granite block weighs an estimated 80 tons, topped by a 25-ton finial cupola.',
      },
      {
        id: 'br-q4',
        exhibitId: 'brihadeeswarar',
        exhibitTitle: 'Brihadeeswarar Temple (Thanjavur)',
        question: 'Why did dry-stone interlocking masonry resist earthquakes better than brittle mortar?',
        options: [
          'Granite melts and fuses during tremors',
          'Precision-cut interlocking stone joints allow tiny controlled micro-movements without mortar cracking',
          'Iron springs were hidden inside every brick',
          'The tower weighs less than timber',
        ],
        correctIndex: 1,
        explanation:
          'Dry-fitted granite blocks rely on gravity and interlocking notches, dissipating seismic vibrations without mortar joint failure.',
      },
    ],
  },
  {
    id: 'ajanta-caves',
    number: '03',
    title: 'Ajanta Caves',
    shortTitle: 'Ajanta Caves',
    subtitle: 'Basalt Rock-Cut Chaityas & Mineral Pigment Frescoes',
    galleryWing: 'Gallery III · Subtractive Rock Engineering',
    location: 'Chhatrapati Sambhajinagar District, Maharashtra',
    period: 'c. 2nd Century BCE – 5th Century CE',
    dynastyOrCulture: 'Satavahana & Vakataka Periods (Buddhist Monastic Complex)',
    accessionNumber: 'IHM-ROC-003',
    accentColor: '#8C3F23',
    archivalImage: MUSEUM_ASSETS.ajantaCaves,
    archivalCaption: 'Fig. 3 — Horseshoe basalt cliff gorge and rock-cut Chaitya facades at Ajanta.',
    shortDescription:
      'Step inside horseshoe basalt cliffs hollowed into vaulted Buddhist halls adorned with enduring natural mineral paintings.',
    historicalIntro:
      'Carved into a dramatic 75-meter horseshoe cliff overlooking the Waghora River gorge, the 30 rock-cut caves of Ajanta comprise Viharas (monasteries) and Chaitya-grihas (vaulted prayer halls). Excavated across two major phases—beginning around the 2nd century BCE under the Satavahanas and flourishing in the late 5th century CE under Vakataka patronage—artisans chiseled entire architectural interiors directly out of solid Deccan basalt.',
    significance:
      'Ajanta showcases both subtractive stone engineering—recreating wooden timber-ribbed vaults in solid volcanic rock—and sophisticated ancient chemistry in its multi-layered mud-plaster and mineral-pigment murals.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Ajanta’s survival over 1,500+ years stems from controlled basalt excavation geometry and multi-layer organic-mineral wall preparation.',
      principles: [
        {
          title: 'Top-Down Subtractive Excavation',
          detail:
            'Workers began at the upper ceiling arch and chiseled downward, removing rock layer by layer so scaffolding was never needed to carve the high vaulted ribs.',
        },
        {
          title: 'Fibre-Reinforced Mud Plaster',
          detail:
            'Rough basalt walls were coated in ferruginous clay mixed with rice husks, vegetable fibres, and stone dust to create a breathable, crack-resistant base, topped by a thin lime wash.',
        },
        {
          title: 'Stable Mineral Pigments',
          detail:
            'Colors came from inorganic earths and minerals—red and yellow ochre, green glauconite (terre verte), lampblack carbon, kaolin white, and imported lapis lazuli blue.',
        },
      ],
    },
    importantFeatures: [
      'Horseshoe-shaped Gavaksha sun-window channeling reflected daylight deep onto the central stone Stupa.',
      '26+ monolithic carved pillars ringing the Chaitya nave without any added mortar.',
      'Acoustically resonant vaulted stone ribs modeled after earlier wooden beam assemblies.',
      'Mural cycle illustrating Jataka tales with expressive shading and mineral color permanence.',
    ],
    interestingFacts: [
      'Artists used polished metal mirrors and white cloth reflectors outside the cave entrance to bounce sunlight into dark inner walls while painting.',
      'The Vakataka-era paintings use a tempera-like binding technique rather than true wet European fresco.',
      'Even the decorative "wooden ceiling ribs" in Cave 10 and Cave 26 are sculpted from solid volcanic basalt.',
    ],
    modes: [
      {
        id: 'standard',
        label: 'Cliff & Facade',
        description: 'Inspect the horseshoe basalt cliff face and carved Chaitya facade.',
      },
      {
        id: 'cutaway',
        label: 'Excavated Cave Section',
        description: 'Open the mountainside rock layer to reveal the pillared Chaitya hall and central Stupa.',
      },
      {
        id: 'animated',
        label: 'Solar Mirror Lighting',
        description: 'Observe how sunlight through the Gavaksha arch illuminates the Stupa and murals.',
      },
    ],
    hotspots: [
      {
        id: 'aj-gavaksha',
        label: 'Gavaksha Sun Window',
        description: 'Horseshoe arch engineered to direct natural daylight onto the inner Stupa.',
        position: [0, 2.3, 1.85],
      },
      {
        id: 'aj-stupa',
        label: 'Monolithic Rock-Cut Stupa',
        description: 'Carved from the living basalt floor at the apse of the vaulted hall.',
        position: [0, 0.85, -1.35],
      },
      {
        id: 'aj-murals',
        label: 'Mineral Pigment Plaster Wall',
        description: 'Clay-fibre base sealed with lime wash and painted using ochres and lapis lazuli.',
        position: [-2.1, 1.3, 0.1],
      },
    ],
    cameraPresets: {
      overview: [5.8, 3.8, 7.6],
      detail: [2.4, 2.0, 4.4],
      top: [0, 8.4, 2.5],
      target: [0, 1.2, 0],
    },
    quiz: [
      {
        id: 'aj-q1',
        exhibitId: 'ajanta-caves',
        exhibitTitle: 'Ajanta Caves',
        question: 'In what direction did ancient artisans excavate the basalt rock at Ajanta?',
        options: [
          'From the ceiling downward toward the floor',
          'From the floor upward using wooden cranes',
          'By melting basalt with charcoal furnaces',
          'By assembling precast concrete blocks inside natural caves',
        ],
        correctIndex: 0,
        explanation:
          'Starting from the top arch and chiseling downward allowed masons to stand on uncut rock rather than tall scaffolding.',
      },
      {
        id: 'aj-q2',
        exhibitId: 'ajanta-caves',
        exhibitTitle: 'Ajanta Caves',
        question: 'What was mixed into the rough basalt mud-plaster base at Ajanta to prevent cracking?',
        options: [
          'Molten lead and glass',
          'Rice husks, vegetable fibres, and stone dust',
          'Synthetic epoxy resins',
          'Sea salt and chalk',
        ],
        correctIndex: 1,
        explanation:
          'Organic fibres like rice husks reinforced the clay plaster, absorbing shrinkage stress before the smooth lime layer was applied.',
      },
      {
        id: 'aj-q3',
        exhibitId: 'ajanta-caves',
        exhibitTitle: 'Ajanta Caves',
        question: 'How did the horseshoe Gavaksha window assist the interior of a Chaitya prayer hall?',
        options: [
          'It vented smoke from steam engines',
          'It focused daylight softly onto the carved Stupa at the far apse',
          'It collected monsoon water for drinking',
          'It measured wind speed in the gorge',
        ],
        correctIndex: 1,
        explanation:
          'The upper arched window channeled high-angle sunlight directly toward the focal Stupa inside the dim rock-cut nave.',
      },
      {
        id: 'aj-q4',
        exhibitId: 'ajanta-caves',
        exhibitTitle: 'Ajanta Caves',
        question: 'Why have Ajanta’s blue, red, and green mural colors remained vivid for over 1,500 years?',
        options: [
          'They were repainted every 10 years with oil paint',
          'They used chemically stable natural mineral pigments such as ochres, terre verte, and lapis lazuli',
          'They were sealed behind glass windows',
          'The rock naturally glowed in the dark',
        ],
        correctIndex: 1,
        explanation:
          'Inorganic mineral pigments resist UV fading and chemical decay far longer than plant-based dyes.',
      },
    ],
  },
  {
    id: 'gol-gumbaz',
    number: '04',
    title: 'Gol Gumbaz',
    shortTitle: 'Gol Gumbaz',
    subtitle: 'Self-Supporting Dome & Whispering Gallery Acoustics',
    galleryWing: 'Gallery IV · Structural Geometry & Acoustics',
    location: 'Vijayapura (Bijapur), Karnataka',
    period: 'c. 1626 – 1656 CE',
    dynastyOrCulture: 'Adil Shahi Dynasty (Mohammed Adil Shah)',
    accessionNumber: 'IHM-ACO-004',
    accentColor: '#78552B',
    archivalImage: MUSEUM_ASSETS.golGumbaz,
    archivalCaption: 'Fig. 4 — Monumental basalt-and-lime dome and octagonal corner towers of Gol Gumbaz.',
    shortDescription:
      'Step inside one of the world’s largest unsupported masonry domes and experience the physics of its Whispering Gallery.',
    historicalIntro:
      'Constructed in Vijayapura as the mausoleum of Sultan Mohammed Adil Shah, Gol Gumbaz (literally "Circular Dome") is an architectural triumph of structural geometry. Built in dark basaltic trap stone and lime mortar, its massive cubical hall supports a colossal hemispherical dome spanning roughly 44 meters externally (and ~37.9 meters internally) without a single central supporting column.',
    significance:
      'Gol Gumbaz solves two classic engineering problems simultaneously: converting a square chamber into a circular dome base using intersecting arches, and unintentionally creating one of the world’s finest acoustic whispering galleries.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Eight intersecting arches balance outward dome thrust, while the concave inner dome and circular walkway channel sound waves cleanly over 37 meters.',
      principles: [
        {
          title: 'Intersecting Pendentive Arches',
          detail:
            'Instead of squinches alone, eight intersecting arches span the square hall in two rotated squares, transferring the dome’s vertical weight and outward thrust inward toward thick corner walls.',
        },
        {
          title: 'Whispering Gallery Reflection',
          detail:
            'Along the 3.3-meter-wide circular gallery at the dome’s base, soft sound waves hug the curved smooth plaster wall via repeated grazing reflections ("whispering-gallery waves") with minimal energy loss.',
        },
        {
          title: 'Multiple Acoustic Echoes',
          detail:
            'A sharp clap near the center reflects back and forth across the curved ceiling and smooth vertical walls, producing 7 to 10 distinct audible echoes.',
        },
      ],
    },
    importantFeatures: [
      'External dome diameter of ~44 meters (~144 ft) and total height around 51 meters.',
      'Four 7-storey octagonal corner towers stabilizing the massive masonry cube.',
      '37-meter-wide interior Whispering Gallery running around the drum of the dome.',
      'Carved stone lotus-petal cornice masking the transition from square drum to hemisphere.',
    ],
    interestingFacts: [
      'Even the rustle of paper or a quiet whisper on one side of the gallery can be heard clearly nearly 38 meters away on the opposite side.',
      'The dome’s shell thickness tapers from roughly 3 meters near the base to around 2.7 meters at the crown, built with light porous brick and lime mortar.',
      'Gol Gumbaz encloses one of the largest single-chamber spaces ever covered by an unsupported masonry dome.',
    ],
    modes: [
      {
        id: 'standard',
        label: 'Exterior Monument',
        description: 'Inspect the cubical basalt hall, octagonal corner towers, and 44m dome.',
      },
      {
        id: 'cutaway',
        label: 'Pendentive Cross-Section',
        description: 'Cut away the front quadrant to reveal the 8 intersecting interior arches.',
      },
      {
        id: 'animated',
        label: 'Sound Wave Demo',
        description: 'Watch acoustic waves travel and reflect across the Whispering Gallery.',
      },
    ],
    hotspots: [
      {
        id: 'gg-dome',
        label: '37.9m Unsupported Dome',
        description: 'Brick-and-lime hemispherical vault spanning the hall without central pillars.',
        position: [0, 3.85, 0],
      },
      {
        id: 'gg-gallery',
        label: 'Whispering Gallery',
        description: 'Circular inner walkway where curved walls focus quiet sounds across 37+ meters.',
        position: [-1.45, 2.3, 0.2],
      },
      {
        id: 'gg-towers',
        label: 'Octagonal Corner Towers',
        description: 'Seven-storey stair turrets acting as corner buttresses against lateral thrust.',
        position: [2.25, 2.2, 2.25],
      },
    ],
    cameraPresets: {
      overview: [7.2, 4.8, 7.6],
      detail: [3.6, 3.2, 3.8],
      top: [0, 9.6, 0.6],
      target: [0, 2.0, 0],
    },
    quiz: [
      {
        id: 'gg-q1',
        exhibitId: 'gol-gumbaz',
        exhibitTitle: 'Gol Gumbaz',
        question: 'How does sound travel so clearly from one side of Gol Gumbaz’s Whispering Gallery to the other?',
        options: [
          'Through hidden copper speaking tubes inside the floor',
          'Sound waves repeatedly reflect along the smooth curved gallery wall with very little scattering loss',
          'Magnetic fields inside the dome amplify voices',
          'The dome is filled with helium gas',
        ],
        correctIndex: 1,
        explanation:
          'Curved concave masonry acts like a waveguide, reflecting shallow-angle sound waves repeatedly around the perimeter.',
      },
      {
        id: 'gg-q2',
        exhibitId: 'gol-gumbaz',
        exhibitTitle: 'Gol Gumbaz',
        question: 'What structural system allows Gol Gumbaz’s circular dome to sit atop a square hall without central columns?',
        options: [
          'Eight intersecting pendentive arches distributing weight to the perimeter walls',
          'A single giant wooden beam across the ceiling',
          'Steel suspension cables anchored to nearby hills',
          'Floating stone rafts',
        ],
        correctIndex: 0,
        explanation:
          'Two overlapping sets of four intersecting arches form an octagonal/circular support ring that directs dome weight into the thick walls.',
      },
      {
        id: 'gg-q3',
        exhibitId: 'gol-gumbaz',
        exhibitTitle: 'Gol Gumbaz',
        question: 'Approximately how many times can a sharp clap echo inside the chamber of Gol Gumbaz?',
        options: ['Only once', '7 to 10 distinct echoes', 'Zero echoes', '100 continuous echoes'],
        correctIndex: 1,
        explanation:
          'Because the vast hemispherical shell and smooth stone walls absorb very little sound energy, a single clap bounces 7–10 times.',
      },
      {
        id: 'gg-q4',
        exhibitId: 'gol-gumbaz',
        exhibitTitle: 'Gol Gumbaz',
        question: 'Who commissioned Gol Gumbaz in Vijayapura (Bijapur), Karnataka?',
        options: [
          'Rajaraja Chola I',
          'Sultan Mohammed Adil Shah',
          'King Lalitaditya Muktapida',
          'Tipu Sultan',
        ],
        correctIndex: 1,
        explanation:
          'Gol Gumbaz was built between 1626 and 1656 CE as the tomb of Mohammed Adil Shah of the Adil Shahi dynasty.',
      },
    ],
  },
  {
    id: 'martand-sun',
    number: '05',
    title: 'Martand Sun Temple',
    shortTitle: 'Martand Sun Temple',
    subtitle: 'Kashmiri Ashlar Limestone & Peristyle Geometry',
    galleryWing: 'Gallery V · Himalayan Stone Planning',
    location: 'Near Anantnag, Jammu & Kashmir',
    period: 'c. 8th Century CE (725 – 756 CE)',
    dynastyOrCulture: 'Karkota Dynasty (King Lalitaditya Muktapida)',
    accessionNumber: 'IHM-ARC-005',
    accentColor: '#6E5644',
    archivalImage: MUSEUM_ASSETS.martandSun,
    archivalCaption: 'Fig. 5 — Limestone peristyle colonnade and trefoil arches of Martand Sun Temple, Kashmir.',
    shortDescription:
      'Examine the monumental limestone peristyle courtyard and compare surviving archaeological ruins with scholarly roof reconstruction.',
    historicalIntro:
      'Perched on an elevated Karewa plateau overlooking the Kashmir Valley, the Martand Sun Temple was built in the 8th century CE by King Lalitaditya Muktapida of the Karkota Dynasty and dedicated to Surya (Martand). Constructed from huge, finely dressed blocks of local grey-buff limestone, the complex synthesizes indigenous Kashmiri timber-inspired forms with Gupta, Gandharan, and classical Greco-Roman colonnade geometry.',
    curatorialNote:
      'Evidence vs. Reconstruction Notice: The surviving temple today preserves the massive stone plinth, lower central shrine walls, and much of the 84-cell peristyle courtyard. Its upper two-tiered pyramidal Kashmiri roof (visible in the Reconstruction mode) no longer survives intact and is presented as a scholarly architectural reconstruction based on contemporary Kashmiri temples such as Avantipur and Pandrethan.',
    significance:
      'Martand demonstrates advanced seismic-zone ashlar stone fitting, monumental courtyard axial symmetry, and a unique pitched pyramidal roof geometry suited to heavy Himalayan snowfall.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Kashmiri architects adapted heavy limestone masonry to mountain snow loads and seismic forces using interlocking metal-dowel blocks and steep pyramidal stone roofs.',
      principles: [
        {
          title: 'Steep Pyramidal Snow-Shedding Geometry',
          detail:
            'Unlike the curved Nagara towers of northern plains, Kashmiri stone roofs used double-tiered steep triangular gables so winter snow slid off cleanly without overloading the masonry.',
        },
        {
          title: 'Peristyle Axial Courtyard',
          detail:
            'The central shrine sits within an open ~67 x 43 meter courtyard framed by 84 fluted columns and trefoil niches, aligning precisely with sunrise over the valley.',
        },
        {
          title: 'Heavy Limestone Ashlar & Dowels',
          detail:
            'Enormous cut limestone blocks were fitted flush and keyed together with stone mortises and iron clamps to endure Kashmiri winter freeze-thaw cycles.',
        },
      ],
    },
    importantFeatures: [
      'Elevated plateau site engineered for unobstructed solar orientation and wide valley drainage.',
      'Characteristic Kashmiri trefoil (three-lobed) arches framed inside triangular pediments.',
      '84-columned rectangular peristyle colonnade surrounding the central shrine.',
      'Monumental western gateway aligned directly with the inner sanctum.',
    ],
    interestingFacts: [
      'The courtyard originally contained 84 subsidiary niches—a number sacred in astronomical and solar traditions.',
      'Martand is one of the earliest and largest examples of classic Karkota-era Kashmiri stone architecture.',
      'Scholars reconstruct its missing roof by studying surviving miniature stone shrines and intact smaller temples nearby.',
    ],
    modes: [
      {
        id: 'standard',
        label: 'Surviving Ruins (Evidence)',
        description: 'View the verified surviving limestone plinth, sanctum walls, and courtyard ruins.',
      },
      {
        id: 'reconstruction',
        label: 'Scholarly 3D Reconstruction',
        description: 'Overlay the hypothesized two-tiered pyramidal Kashmiri stone roof and full colonnade.',
      },
      {
        id: 'cutaway',
        label: 'Courtyard Plan Section',
        description: 'Inspect the axial layout linking the gateway, central shrine, and perimeter niches.',
      },
    ],
    hotspots: [
      {
        id: 'ms-shrine',
        label: 'Central Sanctum & Reconstructed Roof',
        description: 'Inner stone shrine; toggle Reconstruction mode to see the scholarly pyramidal roof.',
        position: [0, 2.35, -0.2],
      },
      {
        id: 'ms-peristyle',
        label: 'Trefoil Peristyle Colonnade',
        description: 'Surrounding limestone colonnade featuring Kashmiri three-lobed arched niches.',
        position: [-2.8, 1.15, 0],
      },
      {
        id: 'ms-gateway',
        label: 'Axial Entrance Gateway',
        description: 'Monumental western entrance aligned along the east-west solar axis.',
        position: [0, 1.35, 3.25],
      },
    ],
    cameraPresets: {
      overview: [7.4, 5.2, 8.2],
      detail: [3.2, 2.4, 3.8],
      top: [0, 10.2, 0.8],
      target: [0, 0.8, 0],
    },
    quiz: [
      {
        id: 'ms-q1',
        exhibitId: 'martand-sun',
        exhibitTitle: 'Martand Sun Temple',
        question: 'Why did Kashmiri temples like Martand feature steep two-tiered pyramidal roofs instead of flat terraces?',
        options: [
          'To shed heavy Himalayan winter snowfall safely without structural collapse',
          'To catch monsoon rainwater for fountains',
          'To serve as archery watchtowers',
          'Because limestone cannot be cut flat',
        ],
        correctIndex: 0,
        explanation:
          'Steeply pitched stone gables prevented heavy winter snow accumulation on the limestone roof.',
      },
      {
        id: 'ms-q2',
        exhibitId: 'martand-sun',
        exhibitTitle: 'Martand Sun Temple',
        question: 'Which architectural motif is a hallmark of Martand Sun Temple’s colonnade niches?',
        options: [
          'Pointed Gothic flying buttresses',
          'Trefoil (three-lobed) arches framed beneath triangular pediments',
          'Steel truss domes',
          'Bamboo suspension arches',
        ],
        correctIndex: 1,
        explanation:
          'The trefoil arch nestled inside a triangular pediment is a signature feature of classical Kashmiri stone architecture.',
      },
      {
        id: 'ms-q3',
        exhibitId: 'martand-sun',
        exhibitTitle: 'Martand Sun Temple',
        question: 'How do historians know what the missing upper roof of Martand likely looked like?',
        options: [
          'From intact contemporary Kashmiri temples and miniature stone shrines showing the same pyramidal geometry',
          'From photographs taken in 750 CE',
          'From wooden shipwrecks found nearby',
          'It was never meant to have a roof',
        ],
        correctIndex: 0,
        explanation:
          'Because the original roof collapsed centuries ago, reconstructions compare surviving foundations with intact smaller Karkota-period shrines.',
      },
      {
        id: 'ms-q4',
        exhibitId: 'martand-sun',
        exhibitTitle: 'Martand Sun Temple',
        question: 'Under which ruler and century was Martand Sun Temple constructed?',
        options: [
          'King Lalitaditya Muktapida in the 8th century CE',
          'Emperor Ashoka in the 3rd century BCE',
          'Tipu Sultan in the 18th century CE',
          'King Narasimhadeva I in the 13th century CE',
        ],
        correctIndex: 0,
        explanation:
          'Martand Sun Temple was built in the 8th century CE (c. 725–756 CE) by King Lalitaditya Muktapida of the Karkota Dynasty.',
      },
    ],
  },
  {
    id: 'kailasa-ellora',
    number: '06',
    title: 'Kailasa Temple, Ellora',
    shortTitle: 'Kailasa Temple, Ellora',
    subtitle: 'Monolithic Top-Down Basalt Cliff Excavation',
    galleryWing: 'Gallery VI · Monolithic Subtractive Engineering',
    location: 'Ellora, Chhatrapati Sambhajinagar, Maharashtra',
    period: 'c. 756 – 773 CE',
    dynastyOrCulture: 'Rashtrakuta Dynasty (King Krishna I)',
    accessionNumber: 'IHM-MON-006',
    accentColor: '#5B4332',
    archivalImage: MUSEUM_ASSETS.kailasaEllora,
    archivalCaption: 'Fig. 6 — Monolithic rock-cut Kailasa Temple excavated downward into solid Ellora basalt.',
    shortDescription:
      'Witness how Rashtrakuta artisans carved an entire multi-storey temple complex downward out of a single basalt cliff.',
    historicalIntro:
      'Cave 16 at Ellora—the Kailasa (Kailasanatha) Temple—is the largest monolithic rock-cut structure in the world. Commissioned by Rashtrakuta ruler Krishna I in the 8th century CE, it was not built by stacking stones upward. Instead, sculptors isolated a massive block of solid volcanic basalt cliff by carving three deep vertical trenches, then sculpted the temple, towers, shrines, pillars, and life-size elephants from the top down.',
    significance:
      'Because subtractive carving allows zero structural mistakes—a mis-cut stone block cannot be replaced—the entire architectural geometry, drainage, and sculpture placement had to be pre-planned with extreme mathematical precision.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Removing an estimated 200,000+ tonnes of solid Deccan basalt required disciplined trench-quarrying sequences, geometric plumb-line surveying, and natural fissure control.',
      principles: [
        {
          title: 'Three-Trench Isolation Cut',
          detail:
            'Artisans excavated U-shaped vertical trenches nearly 30 meters deep into the hillside, leaving a freestanding rectangular core of living bedrock in the middle.',
        },
        {
          title: 'Zero-Error Top-Down Carving',
          detail:
            'Carving started at the summit finial of the 30-meter Vimana and progressed downward to the plinth, meaning workers always stood on solid uncut stone.',
        },
        {
          title: 'Load-Bearing Monolithic Continuity',
          detail:
            'Since the roof, walls, pillars, and elephant-carved plinth remain one continuous piece of bedrock, there are no mortar joints to slip or fail.',
        },
      ],
    },
    importantFeatures: [
      'Carved from a single continuous basalt ridge roughly 85m deep and 45m wide.',
      'Two freestanding monolithic Dhvajastambha flagstaff pillars over 15 meters tall.',
      'Elevated plinth supported by carved stone elephants appearing to bear the temple’s weight.',
      'Multi-storey side galleries carved directly into the surrounding vertical cliff walls.',
    ],
    interestingFacts: [
      'Archaeological estimates calculate at least 150,000 to 200,000 tonnes of basalt were chiseled out using iron hammers, chisels, and wooden wedges.',
      'Historians note the main complex took only around 18 to 20 years—an astonishing rate of roughly 25–30 tonnes of stone removed daily.',
      'A flying stone bridge originally connected the main Mandapa to the Nandi shrine—carved straight out of the rock without adding a single block.',
    ],
    modes: [
      {
        id: 'standard',
        label: 'Monolithic Courtyard',
        description: 'View the carved temple sitting inside its excavated basalt cliff trench.',
      },
      {
        id: 'animated',
        label: 'Top-Down Excavation',
        description: 'Watch the solid cliff mass peel away layer by layer from summit to plinth.',
      },
      {
        id: 'cutaway',
        label: 'Cliff Trench Section',
        description: 'Inspect the depth of the excavated U-trench relative to the surrounding hillside.',
      },
    ],
    hotspots: [
      {
        id: 'ke-shikhara',
        label: 'Monolithic Shikhara Summit',
        description: 'Carved first at the very start of excavation before lower storeys existed.',
        position: [0, 3.3, -0.8],
      },
      {
        id: 'ke-pillars',
        label: 'Twin Dhvajastambha Pillars',
        description: 'Freestanding obelisks left behind as rock around them was chiseled down.',
        position: [-1.4, 1.9, 1.3],
      },
      {
        id: 'ke-trench',
        label: '30m Deep Quarry Trench',
        description: 'Vertical cliff wall marking the original hillside height before excavation.',
        position: [2.75, 2.1, -0.5],
      },
    ],
    cameraPresets: {
      overview: [7.6, 5.6, 8.0],
      detail: [3.2, 3.0, 4.0],
      top: [0, 10.6, 1.2],
      target: [0, 1.2, 0],
    },
    quiz: [
      {
        id: 'ke-q1',
        exhibitId: 'kailasa-ellora',
        exhibitTitle: 'Kailasa Temple, Ellora',
        question: 'What makes the construction method of Kailasa Temple at Ellora extraordinary?',
        options: [
          'It was carved top-to-bottom out of a single living basalt cliff rather than built from blocks',
          'It was assembled from imported marble shipped from Rome',
          'It was built using fired clay bricks and bamboo',
          'It floats on a volcanic crater lake',
        ],
        correctIndex: 0,
        explanation:
          'Kailasa Temple is monolithic: artisans cut deep trenches into a hillside and sculpted the entire complex downward from one rock mass.',
      },
      {
        id: 'ke-q2',
        exhibitId: 'kailasa-ellora',
        exhibitTitle: 'Kailasa Temple, Ellora',
        question: 'Why did Ellora’s sculptors have zero room for structural mistakes during carving?',
        options: [
          'Because rock cut away from a monolith cannot be glued or stacked back',
          'Because iron tools broke after one strike',
          'Because the temple was carved underwater',
          'Because no drawings existed anywhere in India',
        ],
        correctIndex: 0,
        explanation:
          'In subtractive rock-cut architecture, removing rock is irreversible—every spire, pillar, and bridge must be planned before cutting.',
      },
      {
        id: 'ke-q3',
        exhibitId: 'kailasa-ellora',
        exhibitTitle: 'Kailasa Temple, Ellora',
        question: 'Which dynasty commissioned the Kailasa Temple at Ellora in the 8th century CE?',
        options: [
          'Rashtrakuta Dynasty (King Krishna I)',
          'Chola Dynasty',
          'Adil Shahi Dynasty',
          'Eastern Ganga Dynasty',
        ],
        correctIndex: 0,
        explanation:
          'King Krishna I of the Rashtrakuta Dynasty patronized the excavation of Cave 16 (Kailasa) in the mid-8th century CE.',
      },
      {
        id: 'ke-q4',
        exhibitId: 'kailasa-ellora',
        exhibitTitle: 'Kailasa Temple, Ellora',
        question: 'Roughly how much volcanic basalt rock was removed to create the Kailasa complex?',
        options: ['About 500 tonnes', 'At least 150,000–200,000 tonnes', 'About 10 tonnes', '10 million tonnes'],
        correctIndex: 1,
        explanation:
          'Conservative archaeological volume measurements estimate at least 150,000 to 200,000 tonnes of basalt were excavated.',
      },
    ],
  },
  {
    id: 'konark-sun',
    number: '07',
    title: 'Konark Sun Temple',
    shortTitle: 'Konark Sun Temple',
    subtitle: 'The Stone Chariot of Surya & Solar Sundial Wheels',
    galleryWing: 'Gallery VII · Astronomy & Timekeeping',
    location: 'Konark, Puri District, Odisha',
    period: 'c. 1250 CE',
    dynastyOrCulture: 'Eastern Ganga Dynasty (King Narasimhadeva I)',
    accessionNumber: 'IHM-AST-007',
    accentColor: '#A6791E',
    archivalImage: MUSEUM_ASSETS.konarkWheel,
    archivalCaption: 'Fig. 7 — Carved Khondalite sandstone chariot wheel with 8 major and 8 minor spokes.',
    shortDescription:
      'Spin the 24-spoke carved stone wheel and discover how Konark turns architecture into a precision solar sundial.',
    historicalIntro:
      'Built around 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty along the Bay of Bengal coast, the Konark Sun Temple was conceived as a colossal stone chariot for Surya, the Sun God. Resting on a high stone platform pulled by seven spirited carved horses, the chariot rolls on twelve pairs (24 total) of monumental sculpted wheels, each nearly 3 meters (9.8 feet) in diameter.',
    significance:
      'Beyond its artistic grandeur in Kalinga-style Khondalite stone, Konark embeds astronomical cycles directly into its structure—its 24 wheels act as functional sundials capable of telling time accurately to within minutes.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Each Konark wheel encodes the 24 hours of a day (and the 12 months of the year), using its protruding axle hub as a gnomon to cast solar shadows onto precision-divided spokes.',
      principles: [
        {
          title: 'Sundial Gnomon & Spoke Geometry',
          detail:
            'Each wheel features 8 wide primary spokes (separating 3-hour prahars) and 8 thinner secondary spokes, while 30 carved beads along the rim between major spokes track 3-minute intervals.',
        },
        {
          title: 'Iron Dowel & Beam Reinforcement',
          detail:
            'To hold massive Khondalite lintels across wide openings, Odishan engineers forged massive wrought-iron beams and clamped stones with rust-resistant iron dowels.',
        },
        {
          title: 'East-West Solar Alignment',
          detail:
            'Oriented strictly toward the rising sun over the eastern horizon, morning rays struck the Jagamohana and inner sanctum directly along the ceremonial axis.',
        },
      ],
    },
    importantFeatures: [
      'Twelve pairs of intricately carved stone wheels symbolizing the 12 months or 24 hours.',
      'Seven stone horses straining at the eastern staircase symbolizing the 7 days of the week.',
      'Stepped pyramidal Jagamohana roof (Pidha Deul) rising in three receding tiers.',
      'Forged wrought-iron structural beams and interlocking stone clamps.',
    ],
    interestingFacts: [
      'By noting which spoke and rim bead the axle hub’s shadow touches—and accounting for morning vs. afternoon faces—you can read local solar time without modern instruments.',
      'The main Rekha Deul tower originally stood roughly 60–70 meters tall before collapsing in earlier centuries, leaving the 39-meter Jagamohana hall intact.',
      'The wheels feature delicate medallions depicting seasons, musicians, daily life, and celestial motifs.',
    ],
    modes: [
      {
        id: 'standard',
        label: 'Chariot & Wheel',
        description: 'Inspect the carved stone chariot platform, horses, and 24-wheel alignment.',
      },
      {
        id: 'animated',
        label: 'Solar Sundial & Rotation',
        description: 'Rotate the hero stone wheel and sweep sunlight across the gnomon hub.',
      },
      {
        id: 'cutaway',
        label: 'Iron Beam Structure',
        description: 'Reveal the forged wrought-iron lintels supporting the stepped Jagamohana roof.',
      },
    ],
    hotspots: [
      {
        id: 'ks-wheel',
        label: 'Sundial Chariot Wheel',
        description: '3m carved wheel with 8 major spokes, 8 minor spokes, and beaded time-reading rim.',
        position: [1.55, 0.95, 1.45],
      },
      {
        id: 'ks-horses',
        label: 'Seven Chariot Horses',
        description: 'Symbolic harnessed steeds pulling the stone chariot toward the rising eastern sun.',
        position: [2.75, 0.7, 0],
      },
      {
        id: 'ks-jagamohana',
        label: 'Stepped Jagamohana Roof',
        description: 'Pyramidal Pidha Deul hall reinforced internally with forged wrought-iron beams.',
        position: [-0.8, 2.7, 0],
      },
    ],
    cameraPresets: {
      overview: [6.8, 4.2, 6.8],
      detail: [2.2, 1.3, 4.2],
      top: [0.2, 9.2, 0.4],
      target: [0, 1.1, 0],
    },
    quiz: [
      {
        id: 'ks-q1',
        exhibitId: 'konark-sun',
        exhibitTitle: 'Konark Sun Temple',
        question: 'How many total carved stone wheels flank the chariot platform of the Konark Sun Temple?',
        options: ['12 wheels (6 pairs)', '24 wheels (12 pairs)', '8 wheels (4 pairs)', '36 wheels (18 pairs)'],
        correctIndex: 1,
        explanation:
          'Twelve pairs—24 massive carved stone wheels—line the sides of the chariot base, representing the 12 months or 24 hours.',
      },
      {
        id: 'ks-q2',
        exhibitId: 'konark-sun',
        exhibitTitle: 'Konark Sun Temple',
        question: 'Which part of a Konark wheel acts as the gnomon (shadow-casting pin) when reading time as a sundial?',
        options: [
          'The central protruding stone axle hub',
          'The hooves of the stone horses',
          'The top finial of the roof',
          'A wooden pole tied next to the stairs',
        ],
        correctIndex: 0,
        explanation:
          'The projecting stone hub at the wheel’s center casts a crisp shadow across the 8 major spokes and beaded rim markings.',
      },
      {
        id: 'ks-q3',
        exhibitId: 'konark-sun',
        exhibitTitle: 'Konark Sun Temple',
        question: 'What metal did Eastern Ganga engineers forge into massive beams to reinforce Konark’s stone ceiling lintels?',
        options: ['Aluminum', 'Wrought iron', 'Tin', 'Zinc'],
        correctIndex: 1,
        explanation:
          'Heavy forged wrought-iron beams and clamps supported massive Khondalite stone slabs across the hall spans.',
      },
      {
        id: 'ks-q4',
        exhibitId: 'konark-sun',
        exhibitTitle: 'Konark Sun Temple',
        question: 'What do the seven stone horses sculpted at the front of the Konark Sun Temple represent?',
        options: [
          'Seven famous emperors',
          'The seven days of the week (or seven colors of sunlight)',
          'Seven rivers of Gujarat',
          'Seven iron foundries',
        ],
        correctIndex: 1,
        explanation:
          'In Vedic solar symbolism, Surya’s chariot is drawn by seven horses symbolizing the seven days of the week and seven rays of light.',
      },
    ],
  },
  {
    id: 'living-root-bridges',
    number: '08',
    title: 'Living Root Bridges',
    shortTitle: 'Living Root Bridges',
    subtitle: 'Bio-Engineered Suspension Bridges of Meghalaya',
    galleryWing: 'Gallery VIII · Living Sustainable Technology',
    location: 'Khasi & Jaintia Hills, Meghalaya',
    period: 'Living Tradition (Bridges spanning 150 – 500+ years)',
    dynastyOrCulture: 'Indigenous Khasi & Jaintia Communities',
    accessionNumber: 'IHM-BIO-008',
    accentColor: '#3D6B48',
    archivalImage: MUSEUM_ASSETS.livingRootBridge,
    archivalCaption: 'Fig. 8 — Interwoven Ficus elastica aerial roots forming a living bridge in Meghalaya.',
    shortDescription:
      'Discover living bridges grown—not built—by guiding aerial rubber-fig roots across mountain rivers.',
    historicalIntro:
      'In the misty rainforest gorges of Meghalaya—among the wettest places on Earth—wooden bridges rot rapidly in monsoon humidity and iron corrodes. Centuries ago, indigenous Khasi and Jaintia communities perfected a living bio-engineering solution: training the flexible aerial roots of the Indian rubber fig tree (Ficus elastica) across streams until they weave into self-healing, load-bearing suspension bridges.',
    significance:
      'Unlike dead timber or concrete bridges that weaken from the day they are built, a living root bridge grows stronger every decade as its secondary roots thicken, fuse through natural inosculation, and anchor deep into rocky riverbanks.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Living root bridges harness botanical thigmomorphogenesis (growth strengthening under mechanical stress) and natural root grafting (inosculation).',
      principles: [
        {
          title: 'Hollow Betel-Nut Guidance',
          detail:
            'Artisans hollow out split Areca (betel-nut) palm trunks or bamboo scaffolds across a stream, feeding young supple aerial roots inside so they grow straight toward the opposite bank.',
        },
        {
          title: 'Inosculation (Natural Root Fusion)',
          detail:
            'When living roots are twisted, knotted, and pressed together around stone slabs, their bark layers fuse biologically into a single unified structural mesh.',
        },
        {
          title: 'Adaptive Stress Strengthening',
          detail:
            'Foot traffic, monsoon winds, and gravity trigger wood-fiber thickening along load paths—meaning use actually reinforces the living span.',
        },
      ],
    },
    importantFeatures: [
      'Single and double-decker spans (such as Umshiang Double-Decker Bridge in Nongriat) capable of carrying 50+ people simultaneously.',
      'Zero industrial concrete, steel, or fossil-fuel transport required.',
      'Deep root anchors that simultaneously stabilize riverbanks against monsoon landslides.',
      'Natural stone pavers wedged cleanly into the living root deck for safe footing.',
    ],
    interestingFacts: [
      'A new root bridge typically takes 15 to 25 years of careful patient weaving before it can bear full human loads—an intergenerational gift from parents to grandchildren.',
      'Some living root bridges in Meghalaya have remained active for more than 400–500 years.',
      'Double-decker bridges were grown when peak monsoon floodwaters rose above the lower span.',
    ],
    modes: [
      {
        id: 'standard',
        label: 'Mature Root Bridge',
        description: 'Inspect the living Ficus elastica trees, interwoven root cables, and river gorge.',
      },
      {
        id: 'animated',
        label: 'Growth Over Decades',
        description: 'Watch young aerial roots grow through betel-nut guides into a mature living bridge.',
      },
      {
        id: 'cutaway',
        label: 'Root Anchor Anatomy',
        description: 'Reveal how subsurface root networks grip boulders to resist flash floods.',
      },
    ],
    hotspots: [
      {
        id: 'lr-anchor',
        label: 'Living Ficus Elastica Anchor',
        description: 'Parent rubber-fig tree anchoring the bridge deeply into rocky riverbank soil.',
        position: [-2.8, 1.4, 0],
      },
      {
        id: 'lr-deck',
        label: 'Interwoven Suspension Deck',
        description: 'Braided aerial roots fused by inosculation and inlaid with flat river stones.',
        position: [0, 0.72, 0],
      },
      {
        id: 'lr-guide',
        label: 'Betel-Nut Guide Channel',
        description: 'Hollowed palm trunk used in early years to direct growing roots across the stream.',
        position: [1.5, 1.05, 0.45],
      },
    ],
    cameraPresets: {
      overview: [6.8, 4.2, 7.2],
      detail: [2.8, 1.8, 3.6],
      top: [0, 9.0, 1.2],
      target: [0, 0.8, 0],
    },
    quiz: [
      {
        id: 'lr-q1',
        exhibitId: 'living-root-bridges',
        exhibitTitle: 'Living Root Bridges',
        question: 'Which tree species provides the aerial roots used to grow Meghalaya’s living root bridges?',
        options: [
          'Himalayan cedar',
          'Indian rubber fig (Ficus elastica)',
          'Coconut palm',
          'Teak wood',
        ],
        correctIndex: 1,
        explanation:
          'Ficus elastica produces tough, flexible aerial roots that thrive in high humidity and fuse naturally when woven together.',
      },
      {
        id: 'lr-q2',
        exhibitId: 'living-root-bridges',
        exhibitTitle: 'Living Root Bridges',
        question: 'How do Khasi and Jaintia engineers guide fragile young roots safely across rushing mountain streams?',
        options: [
          'By threading them through hollowed betel-nut palm trunks or bamboo frames',
          'By freezing the river every winter',
          'By tying them to iron bridges',
          'By spraying chemical growth hormones',
        ],
        correctIndex: 0,
        explanation:
          'Split hollowed betel-nut trunks protect and steer growing roots straight toward the opposite bank.',
      },
      {
        id: 'lr-q3',
        exhibitId: 'living-root-bridges',
        exhibitTitle: 'Living Root Bridges',
        question: 'How does a living root bridge change as decades pass and people walk across it?',
        options: [
          'It rots quickly in five years',
          'It grows thicker and stronger through natural root fusion and stress adaptation',
          'It turns into fossilized coal',
          'It shrinks back into the soil',
        ],
        correctIndex: 1,
        explanation:
          'Unlike dead timber or steel, living tissues thicken along stress lines and fuse via inosculation, increasing strength over centuries.',
      },
      {
        id: 'lr-q4',
        exhibitId: 'living-root-bridges',
        exhibitTitle: 'Living Root Bridges',
        question: 'Roughly how long does it take to grow a living root bridge before it supports regular human traffic?',
        options: ['2 weeks', '6 months', '15 to 25 years', '200 years'],
        correctIndex: 2,
        explanation:
          'Communities nurture and weave the roots patiently over 15–25 years until the span becomes safe for daily crossings.',
      },
    ],
  },
  {
    id: 'mysorean-rockets',
    number: '09',
    title: 'Mysorean Iron-Cased Rockets',
    shortTitle: 'Mysorean Iron-Cased Rockets',
    subtitle: 'Metal-Cased Ballistics & Propulsion Metallurgy',
    galleryWing: 'Gallery IX · Propulsion & Metallurgy',
    location: 'Kingdom of Mysore (Srirangapatna), Karnataka',
    period: 'c. 1760s – 1799 CE',
    dynastyOrCulture: 'Kingdom of Mysore (Hyder Ali & Tipu Sultan)',
    accessionNumber: 'IHM-PRO-009',
    accentColor: '#7C3F1E',
    archivalImage: MUSEUM_ASSETS.mysoreanRocket,
    archivalCaption: 'Fig. 9 — Hammered soft-iron Mysorean rocket casing strapped to its bamboo stabilizer shaft.',
    shortDescription:
      'Inspect the hammered soft-iron propellant cylinder that doubled rocket range and reshaped global rocketry.',
    historicalIntro:
      'While early rockets in Europe and East Asia relied on paper, pasteboard, or bamboo casings that burst under high pressure, engineers in the Kingdom of Mysore under Hyder Ali and his son Tipu Sultan achieved a historic breakthrough in the late 18th century. By encasing densely packed black powder inside hammered soft-iron cylinders strapped to bamboo guide poles and double-edged blades, Mysorean rocket corps achieved ranges of 1 to 2 kilometers.',
    significance:
      'Deployed decisively during the Anglo-Mysore Wars (including the Battles of Pollilur and Srirangapatna), captured Mysorean rockets were shipped to England, where Sir William Congreve reverse-engineered their metal-casing principle to develop the famous Congreve rockets.',
    scienceBehindIt: {
      heading: 'The Science Behind It',
      summary:
        'Soft-iron casings withstood far greater internal combustion pressure than paper or bamboo, producing higher exhaust velocity and stronger thrust per Newton’s Third Law.',
      principles: [
        {
          title: 'High-Pressure Iron Combustion Chamber',
          detail:
            'Soft hammered iron cylinders safely contained high-pressure gas expansion without bursting, allowing tightly rammed black powder to burn rapidly and forcefully.',
        },
        {
          title: 'Newton’s Third Law & Nozzle Thrust',
          detail:
            'Hot exhaust gases accelerated rearward through a constricted nozzle opening in the base plate; equal and opposite reaction force propelled the rocket forward.',
        },
        {
          title: 'Aerodynamic Stabilization Shaft',
          detail:
            'A 2-to-3-meter bamboo pole bound with leather strips shifted the center of pressure behind the center of mass, keeping flight stable like arrow fletching.',
        },
      ],
    },
    importantFeatures: [
      'Hammered soft-iron cylinder (typically 20 cm long, 4–7 cm diameter) sealed at the nose.',
      'Constricted circular exhaust nozzle in the base plate to accelerate gas velocity.',
      'Long bamboo guide shaft (2–3 meters) for aerodynamic flight stability.',
      'Optional attached steel blade or sword tip turning the rocket into a spinning airborne projectile.',
    ],
    interestingFacts: [
      'Tipu Sultan maintained dedicated rocket corps (Kushoons) numbering up to 5,000 rocketeers, using multi-tube mobile launch carts.',
      'Tipu’s military manual Fathul Mujahidin documented rocket organization, crews, and tactical deployment.',
      'Two captured Mysorean iron rockets are preserved in the Royal Artillery Museum collection in London, and Mysorean rocketry is widely recognized as a milestone in aerospace history.',
    ],
    modes: [
      {
        id: 'standard',
        label: '3D Rocket Assembly',
        description: 'Inspect the iron casing, leather bindings, bamboo stabilizer pole, and blade.',
      },
      {
        id: 'cutaway',
        label: 'Internal Cutaway',
        description: 'Slice open the iron cylinder to examine the packed black-powder grain and central bore.',
      },
      {
        id: 'animated',
        label: 'Propulsion Simulation',
        description: 'Ignite the combustion bore and visualize exhaust gas velocity vs. forward thrust.',
      },
    ],
    hotspots: [
      {
        id: 'mr-casing',
        label: 'Hammered Soft-Iron Cylinder',
        description: 'Withstood far higher chamber pressure than pasteboard or bamboo tubes.',
        position: [0, 1.35, 0.25],
      },
      {
        id: 'mr-nozzle',
        label: 'Constricted Exhaust Nozzle',
        description: 'Narrowed rear opening accelerates hot combustion gases downward/rearward.',
        position: [-0.95, 1.2, 0],
      },
      {
        id: 'mr-pole',
        label: 'Bamboo Stabilizer Pole',
        description: '2–3m guide shaft maintaining directional stability during high-speed launch.',
        position: [-2.4, 0.9, -0.15],
      },
    ],
    cameraPresets: {
      overview: [5.4, 2.8, 5.8],
      detail: [2.4, 1.8, 3.2],
      top: [0, 7.2, 0.5],
      target: [-0.5, 1.2, 0],
    },
    quiz: [
      {
        id: 'mr-q1',
        exhibitId: 'mysorean-rockets',
        exhibitTitle: 'Mysorean Iron-Cased Rockets',
        question: 'What material innovation made Mysorean rockets dramatically outperform earlier paper or bamboo rockets?',
        options: [
          'Hammered soft-iron casings capable of withstanding high internal combustion pressure',
          'Liquid oxygen tanks cooled with ice',
          'Glass windshields on the nose cone',
          'Rubber balloon boosters',
        ],
        correctIndex: 0,
        explanation:
          'Soft-iron cylinders withstood much higher chamber pressure without bursting, boosting exhaust velocity and range up to 1–2 km.',
      },
      {
        id: 'mr-q2',
        exhibitId: 'mysorean-rockets',
        exhibitTitle: 'Mysorean Iron-Cased Rockets',
        question: 'Which physical law explains how rearward-escaping hot gases push the rocket forward?',
        options: [
          'Archimedes’ buoyancy principle',
          'Newton’s Third Law (equal and opposite reaction)',
          'Kepler’s law of elliptical orbits',
          'Ohm’s electrical law',
        ],
        correctIndex: 1,
        explanation:
          'As high-pressure exhaust gases accelerate out of the nozzle rearward, an equal and opposite thrust force accelerates the rocket forward.',
      },
      {
        id: 'mr-q3',
        exhibitId: 'mysorean-rockets',
        exhibitTitle: 'Mysorean Iron-Cased Rockets',
        question: 'What role did the long bamboo pole strapped to the iron cylinder play?',
        options: [
          'It acted as extra gunpowder fuel',
          'It provided aerodynamic flight stability, similar to the feathers on an arrow',
          'It carried drinking water for soldiers',
          'It anchored the rocket to the ground permanently',
        ],
        correctIndex: 1,
        explanation:
          'The long trailing bamboo shaft kept the rocket pointed along its trajectory during flight.',
      },
      {
        id: 'mr-q4',
        exhibitId: 'mysorean-rockets',
        exhibitTitle: 'Mysorean Iron-Cased Rockets',
        question: 'Which European rocket designer studied captured Mysorean rockets to develop new military rockets in the early 1800s?',
        options: [
          'Sir Isaac Newton',
          'Sir William Congreve',
          'Galileo Galilei',
          'Johannes Gutenberg',
        ],
        correctIndex: 1,
        explanation:
          'After encountering Mysorean rockets in India, William Congreve studied captured specimens in England and designed the Congreve rocket.',
      },
    ],
  },
];
