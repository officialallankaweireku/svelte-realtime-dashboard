<script lang="ts">
  import {
    filterServices,
    summarizeFleet,
    type ServiceMetric,
    type StatusFilter
  } from './lib/metrics';

  const services: ServiceMetric[] = [
    {
      id: 'auth-api',
      name: 'Auth & Identity API',
      region: 'eu-west-1',
      p95LatencyMs: 38,
      uptimePercent: 99.98,
      errorRatePercent: 0.02,
      status: 'healthy'
    },
    {
      id: 'ledger-core',
      name: 'Ledger Settlement Core',
      region: 'eu-central-1',
      p95LatencyMs: 64,
      uptimePercent: 99.95,
      errorRatePercent: 0.04,
      status: 'healthy'
    },
    {
      id: 'media-ingest',
      name: 'Media Stream Ingest',
      region: 'eu-west-2',
      p95LatencyMs: 215,
      uptimePercent: 99.41,
      errorRatePercent: 1.15,
      status: 'degraded'
    }
  ];

  let filter = $state<StatusFilter>('all');
  const visible = $derived(filterServices(services, filter));
  const summary = $derived(summarizeFleet(services));
</script>

<main class="container">
  <header class="header">
    <h1>Service Telemetry</h1>
    <div class="filters" role="group" aria-label="Service status filter">
      <button type="button" aria-pressed={filter === 'all'} onclick={() => (filter = 'all')}>
        All ({summary.total})
      </button>
      <button type="button" aria-pressed={filter === 'healthy'} onclick={() => (filter = 'healthy')}>
        Healthy ({summary.healthy})
      </button>
      <button
        type="button"
        aria-pressed={filter === 'degraded'}
        onclick={() => (filter = 'degraded')}
      >
        Degraded ({summary.degraded})
      </button>
    </div>
  </header>

  <section class="summary" aria-label="Fleet summary">
    <div class="stat">Average p95 Latency: <strong>{summary.avgLatencyMs} ms</strong></div>
  </section>

  <section class="grid">
    {#each visible as service (service.id)}
      <article class="card" data-status={service.status}>
        <h2>{service.name}</h2>
        <p class="region">{service.region} · {service.status.toUpperCase()}</p>
        <ul>
          <li>p95 Latency: {service.p95LatencyMs} ms</li>
          <li>Uptime: {service.uptimePercent}%</li>
          <li>Error Rate: {service.errorRatePercent}%</li>
        </ul>
      </article>
    {/each}
  </section>
</main>

<style>
  .container {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 920px;
    margin: 2rem auto;
    padding: 0 1rem;
    color: #111827;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .filters {
    display: flex;
    gap: 0.5rem;
  }
  button {
    padding: 0.45rem 0.85rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background: #fff;
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    background: #1d4ed8;
    color: #fff;
    border-color: #1d4ed8;
  }
  .summary {
    margin: 1rem 0;
    color: #374151;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    background: #f9fafb;
  }
  .card[data-status='degraded'] {
    border-color: #f59e0b;
    background: #fffbeb;
  }
  .region {
    font-size: 0.85rem;
    color: #4b5563;
  }
</style>
