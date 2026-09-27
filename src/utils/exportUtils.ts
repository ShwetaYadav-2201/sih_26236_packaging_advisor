import { SimulationResult, JourneyScenario } from '../types/simulation';
import { PackageStructure } from '../types/material';

export function exportTrajectoriesToCSV(result: SimulationResult, scenario: JourneyScenario, candidate: PackageStructure) {
  const headers = ['Transit_Day', 'Headspace_O2_Percent', 'Headspace_CO2_Percent', 'Headspace_N2_Percent', 'Moisture_Content_Percent', 'Quality_Status'];
  const rows = result.trajectories.map(pt => [
    pt.day,
    pt.o2Percent,
    pt.co2Percent,
    pt.n2Percent,
    pt.moistureContentPercent ?? 'N/A',
    pt.qualityStatus
  ]);

  const csvContent = [
    `# Packaging Advisor Simulation Export`,
    `# Commodity: ${scenario.commodity.name}`,
    `# Fill Weight: ${scenario.fillMassKg} kg`,
    `# Material: ${candidate.name} (${candidate.tradeName})`,
    `# Transit Temp: ${scenario.productTemperatureC} C`,
    `# Target Days: ${scenario.transitDurationDays}`,
    `# Effective Shelf Life: ${result.effectiveShelfLifeDays} Days`,
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `packaging_simulation_${scenario.commodity.id}_${candidate.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
