export type ServiceStatus = 'healthy' | 'degraded';
export type StatusFilter = 'all' | ServiceStatus;

export interface ServiceMetric {
  id: string;
  name: string;
  region: string;
  p95LatencyMs: number;
  uptimePercent: number;
  errorRatePercent: number;
  status: ServiceStatus;
}

export function filterServices(
  services: readonly ServiceMetric[],
  filter: StatusFilter
): ServiceMetric[] {
  if (filter === 'all') return [...services];
  return services.filter((service) => service.status === filter);
}

export function summarizeFleet(services: readonly ServiceMetric[]): {
  total: number;
  healthy: number;
  degraded: number;
  avgLatencyMs: number;
} {
  if (services.length === 0) {
    return { total: 0, healthy: 0, degraded: 0, avgLatencyMs: 0 };
  }

  let healthy = 0;
  let latencySum = 0;
  for (const service of services) {
    if (service.status === 'healthy') healthy += 1;
    latencySum += service.p95LatencyMs;
  }

  return {
    total: services.length,
    healthy,
    degraded: services.length - healthy,
    avgLatencyMs: Math.round(latencySum / services.length)
  };
}
