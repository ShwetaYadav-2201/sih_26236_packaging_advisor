import { EvidenceSource } from '../types/evidence';

export const EVIDENCE_SOURCES: Record<string, EvidenceSource> = {
  'ucdavis_lettuce': {
    id: 'ucdavis_lettuce',
    title: 'Lettuce, Iceberg: Recommendations for Maintaining Postharvest Quality',
    authorsOrOrg: 'UC Davis Postharvest Technology Center',
    urlOrDoi: 'https://postharvest.ucdavis.edu/Commodity_Resources/Fact_Sheets/Datastores/Vegetables_English/?uid=19',
    year: 2021,
    evidenceClass: 'reference',
    locator: 'Storage & Ethylene Sensitivity Section',
    reviewStatus: 'reviewed_reference',
    notes: 'Establishes optimum storage temperature of 0-2°C and extreme ethylene sensitivity causing russet spotting.'
  },
  'ucdavis_banana': {
    id: 'ucdavis_banana',
    title: 'Banana: Recommendations for Maintaining Postharvest Quality',
    authorsOrOrg: 'UC Davis Postharvest Technology Center',
    urlOrDoi: 'https://postharvest.ucdavis.edu/Commodity_Resources/Fact_Sheets/Datastores/Fruit_English/?uid=7',
    year: 2022,
    evidenceClass: 'reference',
    locator: 'Temperature & Ethylene Production Rates',
    reviewStatus: 'reviewed_reference',
    notes: 'Chilling injury below 13°C. Ethylene production rate 10-100 µL/kg·h at 20°C during climacteric ripening.'
  },
  'inrae_strawberry': {
    id: 'inrae_strawberry',
    title: 'INRAE Packaging DSS Database: Fresh Produce Respiration and Permeance Datasets',
    authorsOrOrg: 'INRAE (Institut National de Recherche pour l’Agriculture, l’Alimentation et l’Environnement)',
    urlOrDoi: 'https://doi.org/10.15454/INRAE-PACKAGING-DSS',
    year: 2023,
    evidenceClass: 'measured',
    locator: 'Dataset ID: Strawberry-Fragaria-v2, Table 4',
    reviewStatus: 'measured_case',
    notes: 'Contains measured O2 respiration rates and Q10 coefficients across 4°C to 20°C for fresh strawberries.'
  },
  'tomato_map_study': {
    id: 'tomato_map_study',
    title: 'Modelling Respiration and Headspace Gas Composition in Modified Atmosphere Packaging of Fresh Tomatoes',
    authorsOrOrg: 'Fonseca, S. C., Oliveira, F. A. R., & Brecht, J. K.',
    urlOrDoi: 'https://doi.org/10.1016/S0260-8774(01)00150-8',
    year: 2002,
    publisher: 'Journal of Food Engineering',
    evidenceClass: 'measured',
    locator: 'Vol 52(2), pp. 99–119',
    reviewStatus: 'reviewed_reference',
    notes: 'Defines Arrhenius activation energies for O2 consumption and lower aerobic threshold (2.5% O2) to prevent anaerobic fermentation.'
  },
  'chips_moisture_paper': {
    id: 'chips_moisture_paper',
    title: 'Moisture Sorption Isotherms and Shelf Life Prediction of Fried Potato Chips',
    authorsOrOrg: 'Katz, E. E., & Labuza, T. P.',
    urlOrDoi: 'https://doi.org/10.1111/j.1365-2621.1981.tb04462.x',
    year: 1981,
    publisher: 'Journal of Food Science',
    evidenceClass: 'measured',
    locator: 'Vol 46(2), pp. 403-409',
    reviewStatus: 'reviewed_reference',
    notes: 'Critical moisture limit for loss of crispness in potato chips established at 2.5% wet basis (water activity aw = 0.38).'
  },
  'astm_d3985': {
    id: 'astm_d3985',
    title: 'Standard Test Method for Oxygen Gas Transmission Rate Through Plastic Film and Sheeting Using a Coulometric Sensor',
    authorsOrOrg: 'ASTM International',
    urlOrDoi: 'https://www.astm.org/d3985-17.html',
    year: 2017,
    evidenceClass: 'reference',
    locator: 'ASTM D3985-17',
    reviewStatus: 'reviewed_reference',
    notes: 'Standardized test condition: 23°C, 0% RH, 1 atm pure oxygen gradient.'
  },
  'astm_f1249': {
    id: 'astm_f1249',
    title: 'Standard Test Method for Water Vapor Transmission Rate Through Plastic Film and Sheeting Using a Modulated Infrared Sensor',
    authorsOrOrg: 'ASTM International',
    urlOrDoi: 'https://www.astm.org/f1249-20.html',
    year: 2020,
    evidenceClass: 'reference',
    locator: 'ASTM F1249-20',
    reviewStatus: 'reviewed_reference',
    notes: 'Standardized test condition: 38°C, 90% RH gradient.'
  }
};
