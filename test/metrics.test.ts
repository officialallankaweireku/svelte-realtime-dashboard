import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterServices, summarizeFleet, type ServiceMetric } from '../src/lib/metrics.js';

const sample: ServiceMetric[] = [
  {
    id: 'a',
    name: 'Auth',
    region: 'eu-west-1',
    p95LatencyMs: 40,
    uptimePercent: 99.99,
    errorRatePercent: 0.01,
    status: 'healthy'
  },
  {
    id: 'b',
    name: 'Stream',
    region: 'eu-west-2',
    p95LatencyMs: 200,
    uptimePercent: 99.5,
    errorRatePercent: 1.2,
    status: 'degraded'
  }
];

describe('Service telemetry helpers', () => {
  it('filters services by health status', () => {
    assert.equal(filterServices(sample, 'all').length, 2);
    assert.equal(filterServices(sample, 'healthy').length, 1);
    assert.equal(filterServices(sample, 'degraded')[0]?.id, 'b');
  });

  it('computes fleet summary metrics accurately', () => {
    const summary = summarizeFleet(sample);
    assert.deepEqual(summary, {
      total: 2,
      healthy: 1,
      degraded: 1,
      avgLatencyMs: 120
    });
  });

  it('handles empty fleet safely', () => {
    assert.deepEqual(summarizeFleet([]), {
      total: 0,
      healthy: 0,
      degraded: 0,
      avgLatencyMs: 0
    });
  });
});
