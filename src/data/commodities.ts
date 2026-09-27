import { CommodityProfile } from '../types/commodity';

export const COMMODITY_PROFILES: CommodityProfile[] = [
  {
    id: 'tomato_vine_ripe',
    name: 'Tomato (Vine Ripe)',
    category: 'fresh_produce',
    cultivarOrForm: 'Solanum lycopersicum (Vine Ripe, Pink/Light Red)',
    maturityStage: 'Stage 4 (Pink)',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    description: 'Respiring fresh tomato. Requires balanced O2/CO2 levels in headspace to delay softening without inducing anaerobic fermentation off-flavors.',
    
    respirationRate20C: {
      value: 18.5,
      unit: 'mg CO2/(kg·h)',
      sourceId: 'tomato_map_study',
      evidenceClass: 'measured',
      conditions: { temperatureC: 20 }
    },
    q10Respiration: {
      value: 2.2,
      unit: 'ratio',
      sourceId: 'tomato_map_study',
      evidenceClass: 'reference'
    },
    respiratoryQuotient: {
      value: 1.05,
      unit: 'ratio (CO2/O2)',
      sourceId: 'tomato_map_study',
      evidenceClass: 'measured'
    },
    minO2Percent: {
      value: 2.5,
      unit: '% O2',
      sourceId: 'tomato_map_study',
      evidenceClass: 'measured',
      notes: 'Below 2.5% O2, fermentative ethanol and acetaldehyde accumulate.'
    },
    maxCO2Percent: {
      value: 5.0,
      unit: '% CO2',
      sourceId: 'tomato_map_study',
      evidenceClass: 'reference',
      notes: 'Above 5% CO2 causes internal browning and uneven ripening.'
    },
    targetO2Range: [3.0, 5.0],
    targetCO2Range: [3.0, 5.0],

    optimumTempRangeC: [12.0, 15.0],
    chillingInjuryThresholdC: 10.0,
    ethyleneProductionRate: 'moderate',
    ethyleneSensitivity: 'moderate',

    defaultPackWeightKg: 0.5,
    defaultHeadspaceRatio: 0.4,
    defaultDesiredShelfLifeDays: 14
  },
  {
    id: 'strawberry_fresh',
    name: 'Fresh Strawberry',
    category: 'fresh_produce',
    cultivarOrForm: 'Fragaria x ananassa (Elsanta / Albion)',
    maturityStage: 'Fully ripe (100% red)',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80',
    description: 'High-respiration delicate fruit. Tolerates elevated CO2 (10-15%) which suppresses Botrytis cinerea (grey mould) decay.',
    
    respirationRate20C: {
      value: 45.0,
      unit: 'mg CO2/(kg·h)',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured',
      conditions: { temperatureC: 20 }
    },
    q10Respiration: {
      value: 2.4,
      unit: 'ratio',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured'
    },
    respiratoryQuotient: {
      value: 1.1,
      unit: 'ratio',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured'
    },
    minO2Percent: {
      value: 2.0,
      unit: '% O2',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'reference'
    },
    maxCO2Percent: {
      value: 15.0,
      unit: '% CO2',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured',
      notes: '10-15% CO2 suppresses fungal grey mould development.'
    },
    targetO2Range: [5.0, 10.0],
    targetCO2Range: [10.0, 15.0],

    optimumTempRangeC: [0.0, 2.0],
    chillingInjuryThresholdC: undefined,
    ethyleneProductionRate: 'low',
    ethyleneSensitivity: 'low',

    defaultPackWeightKg: 0.25,
    defaultHeadspaceRatio: 0.5,
    defaultDesiredShelfLifeDays: 10
  },
  {
    id: 'mushroom_white_button',
    name: 'White Button Mushroom',
    category: 'fresh_produce',
    cultivarOrForm: 'Agaricus bisporus (Fresh Whole Sliced)',
    maturityStage: 'Closed Cap Harvest',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
    description: 'Ultra-high respiration produce (~110 mg CO2/kg·h). Requires laser micro-perforated MAP film to prevent rapid stipe elongation and cap browning.',

    respirationRate20C: {
      value: 110.0,
      unit: 'mg CO2/(kg·h)',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured',
      conditions: { temperatureC: 20 }
    },
    q10Respiration: {
      value: 2.6,
      unit: 'ratio',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured'
    },
    respiratoryQuotient: {
      value: 1.15,
      unit: 'ratio',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'measured'
    },
    minO2Percent: {
      value: 2.0,
      unit: '% O2',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'reference'
    },
    maxCO2Percent: {
      value: 12.0,
      unit: '% CO2',
      sourceId: 'inrae_strawberry',
      evidenceClass: 'reference'
    },
    targetO2Range: [3.0, 6.0],
    targetCO2Range: [8.0, 12.0],

    optimumTempRangeC: [0.0, 4.0],
    ethyleneProductionRate: 'low',
    ethyleneSensitivity: 'moderate',

    defaultPackWeightKg: 0.2,
    defaultHeadspaceRatio: 0.6,
    defaultDesiredShelfLifeDays: 8
  },
  {
    id: 'mango_alphonso',
    name: 'Alphonso Mango',
    category: 'fresh_produce',
    cultivarOrForm: 'Mangifera indica L. (Alphonso / Hapus)',
    maturityStage: 'Mature Green / Pre-climacteric',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
    description: 'High-value export fruit. Prone to chilling injury below 12°C and rapid ethylene-triggered ripening during air freight.',

    respirationRate20C: {
      value: 35.0,
      unit: 'mg CO2/(kg·h)',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    q10Respiration: {
      value: 2.3,
      unit: 'ratio',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    respiratoryQuotient: {
      value: 1.0,
      unit: 'ratio',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'assumed'
    },
    minO2Percent: {
      value: 3.0,
      unit: '% O2',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    maxCO2Percent: {
      value: 8.0,
      unit: '% CO2',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    targetO2Range: [3.0, 7.0],
    targetCO2Range: [4.0, 7.0],

    optimumTempRangeC: [12.0, 14.0],
    chillingInjuryThresholdC: 12.0,
    ethyleneProductionRate: 'high',
    ethyleneSensitivity: 'high',

    defaultPackWeightKg: 1.0,
    defaultHeadspaceRatio: 0.4,
    defaultDesiredShelfLifeDays: 16
  },
  {
    id: 'banana_cavendish',
    name: 'Cavendish Banana',
    category: 'fresh_produce',
    cultivarOrForm: 'Musa acuminata (Grand Naine)',
    maturityStage: 'Stage 2-3 (Green / Light Green)',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    description: 'Climacteric fruit with extreme sensitivity to temperature drops below 13°C and strong ethylene emission during ripening.',

    respirationRate20C: {
      value: 25.0,
      unit: 'mg CO2/(kg·h)',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    q10Respiration: {
      value: 2.1,
      unit: 'ratio',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    respiratoryQuotient: {
      value: 1.0,
      unit: 'ratio',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'assumed'
    },
    minO2Percent: {
      value: 2.0,
      unit: '% O2',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    maxCO2Percent: {
      value: 7.0,
      unit: '% CO2',
      sourceId: 'ucdavis_banana',
      evidenceClass: 'reference'
    },
    targetO2Range: [2.0, 5.0],
    targetCO2Range: [3.0, 5.0],

    optimumTempRangeC: [13.0, 14.5],
    chillingInjuryThresholdC: 13.0,
    ethyleneProductionRate: 'high',
    ethyleneSensitivity: 'extremely_high',

    defaultPackWeightKg: 1.2,
    defaultHeadspaceRatio: 0.3,
    defaultDesiredShelfLifeDays: 18
  },
  {
    id: 'lettuce_iceberg',
    name: 'Iceberg Lettuce (Whole Head)',
    category: 'fresh_produce',
    cultivarOrForm: 'Lactuca sativa L. var. capitata',
    maturityStage: 'Firm head harvest',
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&auto=format&fit=crop&q=80',
    description: 'Highly perishable leafy green. Vulnerable to russet browning when exposed to ethylene gas (>0.1 ppm).',

    respirationRate20C: {
      value: 30.0,
      unit: 'mg CO2/(kg·h)',
      sourceId: 'ucdavis_lettuce',
      evidenceClass: 'reference'
    },
    q10Respiration: {
      value: 2.3,
      unit: 'ratio',
      sourceId: 'ucdavis_lettuce',
      evidenceClass: 'reference'
    },
    respiratoryQuotient: {
      value: 1.0,
      unit: 'ratio',
      sourceId: 'ucdavis_lettuce',
      evidenceClass: 'assumed'
    },
    minO2Percent: {
      value: 1.5,
      unit: '% O2',
      sourceId: 'ucdavis_lettuce',
      evidenceClass: 'reference'
    },
    maxCO2Percent: {
      value: 2.0,
      unit: '% CO2',
      sourceId: 'ucdavis_lettuce',
      evidenceClass: 'reference',
      notes: 'High CO2 (>2%) causes brown stain physiological disorder.'
    },
    targetO2Range: [1.5, 3.0],
    targetCO2Range: [0.0, 2.0],

    optimumTempRangeC: [0.0, 2.0],
    chillingInjuryThresholdC: undefined,
    ethyleneProductionRate: 'very_low',
    ethyleneSensitivity: 'extremely_high',

    defaultPackWeightKg: 0.6,
    defaultHeadspaceRatio: 0.5,
    defaultDesiredShelfLifeDays: 21
  },
  {
    id: 'potato_chips',
    name: 'Fried Potato Chips',
    category: 'dry_food',
    cultivarOrForm: 'Crisp Sliced Potato Chips (Salted)',
    maturityStage: 'Processed Snack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    description: 'Low-moisture fried snack. Requires ultra-high water vapour barrier (WVTR < 1.0 g/m²·day) to prevent soggy texture and high OTR barrier to prevent rancidity.',

    initialMoisturePercent: {
      value: 1.2,
      unit: '% wet basis',
      sourceId: 'chips_moisture_paper',
      evidenceClass: 'measured'
    },
    criticalMoisturePercent: {
      value: 2.5,
      unit: '% wet basis',
      sourceId: 'chips_moisture_paper',
      evidenceClass: 'measured',
      notes: 'Exceeding 2.5% moisture results in complete loss of crispness.'
    },
    waterActivityLimit: {
      value: 0.38,
      unit: 'aw',
      sourceId: 'chips_moisture_paper',
      evidenceClass: 'measured'
    },

    optimumTempRangeC: [15.0, 25.0],
    ethyleneProductionRate: 'very_low',
    ethyleneSensitivity: 'low',

    defaultPackWeightKg: 0.15,
    defaultHeadspaceRatio: 0.6,
    defaultDesiredShelfLifeDays: 180
  },
  {
    id: 'roasted_almonds',
    name: 'Roasted Salted Almonds',
    category: 'dry_food',
    cultivarOrForm: 'Prunus dulcis (Roasted kernels)',
    maturityStage: 'Processed Nut',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=80',
    description: 'High-fat nut snack (50% lipid content). Susceptible to oxidative rancidity; requires nitrogen gas flushing and low OTR film.',

    initialMoisturePercent: {
      value: 1.5,
      unit: '% wet basis',
      sourceId: 'chips_moisture_paper',
      evidenceClass: 'reference'
    },
    criticalMoisturePercent: {
      value: 4.5,
      unit: '% wet basis',
      sourceId: 'chips_moisture_paper',
      evidenceClass: 'reference'
    },
    waterActivityLimit: {
      value: 0.45,
      unit: 'aw',
      sourceId: 'chips_moisture_paper',
      evidenceClass: 'reference'
    },

    optimumTempRangeC: [10.0, 22.0],
    ethyleneProductionRate: 'very_low',
    ethyleneSensitivity: 'low',

    defaultPackWeightKg: 0.2,
    defaultHeadspaceRatio: 0.4,
    defaultDesiredShelfLifeDays: 270
  }
];
