export type MuseumView =
  | 'welcome'
  | 'hall'
  | 'exhibits'
  | 'exhibit-detail'
  | 'guide'
  | 'knowledge'
  | 'quizzes'
  | 'about';

export type ExhibitId =
  | 'water-lab'
  | 'brihadeeswarar'
  | 'ajanta-caves'
  | 'gol-gumbaz'
  | 'martand-sun'
  | 'kailasa-ellora'
  | 'konark-sun'
  | 'living-root-bridges'
  | 'mysorean-rockets';

export type ViewerModeId = 'standard' | 'cutaway' | 'animated' | 'reconstruction';

export interface ViewerModeOption {
  id: ViewerModeId;
  label: string;
  description: string;
}

export interface ExhibitHotspot {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
}

export interface QuizQuestion {
  id: string;
  exhibitId: ExhibitId;
  exhibitTitle: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface SciencePrinciple {
  title: string;
  detail: string;
}

export interface ExhibitData {
  id: ExhibitId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  galleryWing: string;
  location: string;
  period: string;
  dynastyOrCulture: string;
  accessionNumber: string;
  accentColor: string;
  archivalImage?: string;
  archivalCaption?: string;
  shortDescription: string;
  historicalIntro: string;
  curatorialNote?: string;
  significance: string;
  scienceBehindIt: {
    heading: string;
    summary: string;
    principles: SciencePrinciple[];
  };
  importantFeatures: string[];
  interestingFacts: string[];
  modes: ViewerModeOption[];
  hotspots: ExhibitHotspot[];
  cameraPresets: {
    overview: [number, number, number];
    detail: [number, number, number];
    top: [number, number, number];
    target: [number, number, number];
  };
  quiz: QuizQuestion[];
}

export interface KnowledgeCategory {
  id: string;
  number: string;
  title: string;
  summary: string;
  explanation: string;
  keyPrinciples: string[];
  interestingFacts: string[];
  relatedExhibitIds: ExhibitId[];
  diagramType:
    | 'engineering'
    | 'geometry'
    | 'acoustics'
    | 'astronomy'
    | 'water'
    | 'sustainability'
    | 'materials';
}
