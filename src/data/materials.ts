import { PackageStructure } from '../types/material';

export const PACKAGE_MATERIALS: PackageStructure[] = [
  {
    id: 'mat_microperf_ldpe_35',
    name: 'Micro-Perforated MAP LDPE Film (35µm)',
    tradeName: 'PerfoBreath™ FreshMAP-35',
    category: 'micro_perforated_map',
    layerStructure: 'Laser-Perforated Low-Density Polyethylene (35µm)',
    totalThicknessMicrons: {
      value: 35,
      unit: 'µm',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured'
    },
    isExperimental: false,
    isCommercial: true,
    recyclabilityRating: 'A',

    otr: {
      value: 12500, // Elevated OTR via engineered laser micro-perforations (4 holes/pouch)
      unit: 'cm³(STP)/(m²·24h·atm)',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured',
      conditions: { temperatureC: 23, rhPercent: 0, testMethod: 'Modified Gas Chromatography' }
    },
    wvtr: {
      value: 18.5,
      unit: 'g/(m²·24h)',
      sourceId: 'astm_f1249',
      evidenceClass: 'measured',
      conditions: { temperatureC: 38, rhPercent: 90 }
    },
    co2tr: {
      value: 48000,
      unit: 'cm³(STP)/(m²·24h·atm)',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured'
    },
    perforationsCountPerM2: 12,

    heatSealWindowC: [115, 145],
    tensileStrengthMPa: {
      value: 22.4,
      unit: 'MPa',
      sourceId: 'astm_d3985',
      evidenceClass: 'reference'
    },
    indicativeCostPer1kPacksUSD: 14.20,
    foodContactCertified: true,
    supplier: 'FlexiPack Global Solutions Ltd.'
  },
  {
    id: 'mat_evoh_high_barrier_50',
    name: 'High-Barrier EVOH Multilayer Laminate (50µm)',
    tradeName: 'OptiShield™ EVOH-50',
    category: 'high_barrier_laminate',
    layerStructure: 'BOPP (15µm) / EVOH (5µm) / LLDPE (30µm)',
    totalThicknessMicrons: {
      value: 50,
      unit: 'µm',
      sourceId: 'astm_d3985',
      evidenceClass: 'measured'
    },
    isExperimental: false,
    isCommercial: true,
    recyclabilityRating: 'C', // Multilayer structure difficult to recycle without specialized processing

    otr: {
      value: 1.2, // Ultra-low OTR for gas flushing
      unit: 'cm³(STP)/(m²·24h·atm)',
      sourceId: 'astm_d3985',
      evidenceClass: 'measured',
      conditions: { temperatureC: 23, rhPercent: 0 }
    },
    wvtr: {
      value: 1.8,
      unit: 'g/(m²·24h)',
      sourceId: 'astm_f1249',
      evidenceClass: 'measured',
      conditions: { temperatureC: 38, rhPercent: 90 }
    },
    co2tr: {
      value: 5.4,
      unit: 'cm³(STP)/(m²·24h·atm)',
      sourceId: 'astm_d3985',
      evidenceClass: 'measured'
    },

    heatSealWindowC: [120, 160],
    tensileStrengthMPa: {
      value: 48.0,
      unit: 'MPa',
      sourceId: 'astm_d3985',
      evidenceClass: 'reference'
    },
    indicativeCostPer1kPacksUSD: 24.50,
    foodContactCertified: true,
    supplier: 'Amcor Rigid Packaging'
  },
  {
    id: 'mat_met_pet_bopp_65',
    name: 'Metallized PET / BOPP High-Barrier Laminate (65µm)',
    tradeName: 'MetaCrisp™ Gold-65',
    category: 'metallized_film',
    layerStructure: 'BOPP (20µm) / Met-PET (12µm) / PE (33µm)',
    totalThicknessMicrons: {
      value: 65,
      unit: 'µm',
      sourceId: 'chips_moisture_paper',
      evidenceClass: 'measured'
    },
    isExperimental: false,
    isCommercial: true,
    recyclabilityRating: 'Non-recyclable',

    otr: {
      value: 0.8, // Premium barrier against oxygen rancidity
      unit: 'cm³(STP)/(m²·24h·atm)',
      sourceId: 'astm_d3985',
      evidenceClass: 'measured',
      conditions: { temperatureC: 23, rhPercent: 0 }
    },
    wvtr: {
      value: 0.45, // Superior moisture barrier for potato chips
      unit: 'g/(m²·24h)',
      sourceId: 'astm_f1249',
      evidenceClass: 'measured',
      conditions: { temperatureC: 38, rhPercent: 90 }
    },

    heatSealWindowC: [130, 170],
    tensileStrengthMPa: {
      value: 65.0,
      unit: 'MPa',
      sourceId: 'astm_d3985',
      evidenceClass: 'reference'
    },
    indicativeCostPer1kPacksUSD: 28.90,
    foodContactCertified: true,
    supplier: 'Sealed Air Corporation'
  },
  {
    id: 'mat_plain_ldpe_50',
    name: 'Standard Monolayer LDPE Film (50µm)',
    tradeName: 'PolyPack™ Standard-50',
    category: 'flexible_monolayer',
    layerStructure: 'Monolayer Low-Density Polyethylene (50µm)',
    totalThicknessMicrons: {
      value: 50,
      unit: 'µm',
      sourceId: 'astm_d3985',
      evidenceClass: 'measured'
    },
    isExperimental: false,
    isCommercial: true,
    recyclabilityRating: 'A+',

    otr: {
      value: 1850, // Moderate oxygen transmission rate
      unit: 'cm³(STP)/(m²·24h·atm)',
      sourceId: 'astm_d3985',
      evidenceClass: 'measured',
      conditions: { temperatureC: 23, rhPercent: 0 }
    },
    wvtr: {
      value: 12.0,
      unit: 'g/(m²·24h)',
      sourceId: 'astm_f1249',
      evidenceClass: 'measured',
      conditions: { temperatureC: 38, rhPercent: 90 }
    },

    heatSealWindowC: [110, 135],
    tensileStrengthMPa: {
      value: 18.0,
      unit: 'MPa',
      sourceId: 'astm_d3985',
      evidenceClass: 'reference'
    },
    indicativeCostPer1kPacksUSD: 8.50,
    foodContactCertified: true,
    supplier: 'Berry Global Inc.'
  },
  {
    id: 'mat_pla_pbat_bio_40',
    name: 'Home-Compostable PLA/PBAT Bio-Film (40µm)',
    tradeName: 'BioBreath™ Compostable-40',
    category: 'biodegradable_compostable',
    layerStructure: 'PLA / PBAT / Starch Blend (40µm)',
    totalThicknessMicrons: {
      value: 40,
      unit: 'µm',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured'
    },
    isExperimental: true,
    isCommercial: true,
    recyclabilityRating: 'A+', // Industrial & Home Compostable

    otr: {
      value: 3400, // High permeability ideal for medium-high respiration fruits
      unit: 'cm³(STP)/(m²·24h·atm)',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured',
      conditions: { temperatureC: 23, rhPercent: 0 }
    },
    wvtr: {
      value: 65.0, // High water vapour permeability - unsuitable for dry crisp snacks
      unit: 'g/(m²·24h)',
      sourceId: 'astm_f1249',
      evidenceClass: 'measured',
      conditions: { temperatureC: 38, rhPercent: 90 }
    },

    heatSealWindowC: [95, 120], // Lower seal window
    tensileStrengthMPa: {
      value: 14.5,
      unit: 'MPa',
      sourceId: 'astm_d3985',
      evidenceClass: 'reference'
    },
    indicativeCostPer1kPacksUSD: 22.00,
    bioBasedContentPercent: 85,
    compostabilityCert: 'TÜV Austria OK Compost Home (EN 13432)',
    foodContactCertified: true,
    supplier: 'Futamura Group / Tipa Corp'
  }
];
