import { KnowledgeCategory } from '../types/museum';

interface KnowledgeDiagramProps {
  type: KnowledgeCategory['diagramType'];
}

export function KnowledgeDiagram({ type }: KnowledgeDiagramProps) {
  const stroke = '#2A1E17';
  const accent = '#A6791E';
  const terracotta = '#8C3F23';
  const water = '#2B6E7D';

  return (
    <div className="w-full h-44 rounded-lg bg-[#F8F4EC] border border-[#2A1E17]/12 flex items-center justify-center p-4">
      <svg
        viewBox="0 0 260 130"
        className="w-full h-full max-w-[260px]"
        role="img"
        aria-label={`Technical illustration for ${type}`}
      >
        {type === 'engineering' && (
          <g fill="none" stroke={stroke} strokeWidth="1.6">
            <rect x="40" y="96" width="180" height="16" fill="#E5D9C3" />
            <polygon points="75,96 105,22 155,22 185,96" fill="#EFE7D8" />
            <polygon points="105,96 118,34 142,34 155,96" strokeDasharray="3 3" stroke={terracotta} />
            <circle cx="130" cy="18" r="7" fill={accent} stroke="none" />
            <path d="M22,96 L105,22" stroke={terracotta} strokeWidth="2" strokeDasharray="4 3" />
            <text x="12" y="124" fontSize="9" fill={stroke} stroke="none">
              Hollow Core Tower + Inclined Ramp Geometry
            </text>
          </g>
        )}

        {type === 'geometry' && (
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <rect x="75" y="30" width="110" height="75" fill="#EFE7D8" />
            <rect x="92" y="42" width="76" height="52" transform="rotate(45 130 68)" stroke={accent} />
            <circle cx="130" cy="68" r="34" stroke={terracotta} strokeWidth="2" />
            <circle cx="130" cy="68" r="3" fill={stroke} />
            <text x="48" y="124" fontSize="9" fill={stroke} stroke="none">
              Intersecting Arches Square-to-Circle Dome Ring
            </text>
          </g>
        )}

        {type === 'acoustics' && (
          <g fill="none" stroke={stroke} strokeWidth="1.6">
            <path d="M40,95 A90,75 0 0,1 220,95" fill="#EFE7D8" />
            <line x1="35" y1="95" x2="225" y2="95" />
            <path d="M62,90 Q95,36 130,30 Q165,36 198,90" stroke={accent} strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="62" cy="90" r="4" fill={terracotta} stroke="none" />
            <circle cx="198" cy="90" r="4" fill={water} stroke="none" />
            <text x="42" y="120" fontSize="9" fill={stroke} stroke="none">
              Grazing Sound Reflection in Concave Gallery
            </text>
          </g>
        )}

        {type === 'astronomy' && (
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <circle cx="130" cy="62" r="42" fill="#EFE7D8" />
            {[0, 45, 90, 135].map((deg) => (
              <line
                key={deg}
                x1="130"
                y1="20"
                x2="130"
                y2="104"
                transform={`rotate(${deg} 130 62)`}
                stroke={stroke}
              />
            ))}
            <circle cx="130" cy="62" r="8" fill={accent} stroke="none" />
            <line x1="130" y1="62" x2="164" y2="82" stroke={terracotta} strokeWidth="2.5" />
            <circle cx="52" cy="24" r="9" fill={accent} stroke="none" />
            <text x="42" y="122" fontSize="9" fill={stroke} stroke="none">
              Solar Hub Gnomon Casting Time Shadow on Spokes
            </text>
          </g>
        )}

        {type === 'water' && (
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <polyline points="25,30 65,30 65,50 90,50 90,72 115,72 115,96 145,96 145,72 170,72 170,50 195,50 195,30 235,30" fill="#EFE7D8" />
            <rect x="115" y="82" width="30" height="14" fill={water} stroke="none" opacity="0.85" />
            <path d="M18,24 L60,24" stroke={water} strokeWidth="2.5" />
            <text x="36" y="120" fontSize="9" fill={stroke} stroke="none">
              Stepped Retaining Walls & Shaded Aquifer Pool
            </text>
          </g>
        )}

        {type === 'sustainability' && (
          <g fill="none" stroke={stroke} strokeWidth="1.6">
            <rect x="20" y="68" width="54" height="38" fill="#E5D9C3" />
            <rect x="186" y="68" width="54" height="38" fill="#E5D9C3" />
            <rect x="74" y="92" width="112" height="14" fill={water} stroke="none" opacity="0.7" />
            <path d="M52,68 Q130,88 208,68" stroke="#3D6B48" strokeWidth="4" />
            <path d="M52,58 Q130,74 208,58" stroke="#5C4632" strokeWidth="2" />
            <circle cx="48" cy="40" r="14" fill="#3D6B48" opacity="0.85" stroke="none" />
            <circle cx="212" cy="40" r="14" fill="#3D6B48" opacity="0.85" stroke="none" />
            <text x="38" y="122" fontSize="9" fill={stroke} stroke="none">
              Inosculated Aerial Roots Spanning Monsoon Stream
            </text>
          </g>
        )}

        {type === 'materials' && (
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <rect x="65" y="42" width="110" height="36" rx="4" fill="#EFE7D8" />
            <rect x="78" y="50" width="84" height="20" fill="#CBB799" />
            <polygon points="175,42 206,60 175,78" fill={accent} />
            <polygon points="65,50 32,42 32,78 65,70" fill={terracotta} opacity="0.8" />
            <line x1="30" y1="90" x2="185" y2="90" stroke={stroke} strokeWidth="2" />
            <text x="36" y="118" fontSize="9" fill={stroke} stroke="none">
              Soft-Iron Cylinder + Combustion Chamber + Nozzle
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
