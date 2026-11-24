import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import { gunzip, gzipSync } from 'node:zlib';

import { VectorTile } from '@mapbox/vector-tile';
import { geoJSONToTile } from '@maplibre/geojson-vt';
import { fromGeojsonVt } from '@maplibre/vt-pbf';
import { PbfReader } from 'pbf';
import {
  buildCityDetails,
  CITY_FACADE_SOURCE_LAYER,
} from '../../src/widgets/map/model/city-details.ts';

const sourceURL =
  process.env.MAP_FACADES_BASE_TILEJSON ??
  'https://maps.divmaster.space/tiles/russia.json';
const output = resolve('.map-facades');
const extent = Number(process.env.MAP_FACADES_EXTENT ?? 8192);
if (extent !== 4096 && extent !== 8192)
  throw new Error('Use extent 4096 or 8192');

const windowLimit = 14_000;
const decodedLimit = 4 * 1024 * 1024;
const cacheLimit = 32 * 1024 * 1024;
const queueLimit = 12;
const maxWorkers = 2;

function tileAt(lng, lat, zoom) {
  const scale = 2 ** zoom;
  return [
    Math.floor(((lng + 180) / 360) * scale),
    Math.floor(
      ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * scale,
    ),
  ];
}

function tileURL(base, z, x, y) {
  return base.replace('{z}', z).replace('{x}', x).replace('{y}', y);
}

async function readLimited(response) {
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > decodedLimit) throw new Error('Source tile exceeds 4 MiB');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, size);
}

function styleGroups(features) {
  const groups = new Map();
  for (const feature of features) {
    const { kind, base, top } = feature.properties;
    const properties = {
      kind,
      base: Math.round(base * 20) / 20,
      top: Math.round(top * 20) / 20,
    };
    const key = JSON.stringify(properties);
    let group = groups.get(key);
    if (!group) {
      group = {
        type: 'Feature',
        properties,
        geometry: { type: 'MultiPolygon', coordinates: [] },
      };
      groups.set(key, group);
    }
    group.geometry.coordinates.push(feature.geometry.coordinates);
  }
  return [...groups.values()];
}

async function makeTile({ url, z, x, y, decorate }) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (response.status === 404 || response.status === 204) {
    await response.body?.cancel();
    return { status: 404 };
  }
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`Upstream tile returned HTTP ${response.status}`);
  }

  const original = await readLimited(response);
  const start = performance.now();
  const base = gzipSync(original);
  let compressed = base;
  let polygons = 0;
  let groups = 0;
  if (decorate) {
    const layer = new VectorTile(new PbfReader(original)).layers.buildings;
    if (layer?.length) {
      const buildings = Array.from({ length: layer.length }, (_, index) =>
        layer.feature(index).toGeoJSON(x, y, z),
      ).filter(
        ({ properties }) =>
          properties.kind === 'building' || properties.kind === 'building_part',
      );
      const { windows, parapets } = buildCityDetails(
        buildings,
        [],
        17,
        undefined,
        windowLimit,
        false,
      );
      const tile = geoJSONToTile(
        {
          type: 'FeatureCollection',
          features: styleGroups([...windows.features, ...parapets.features]),
        },
        z,
        x,
        y,
        { extent, tolerance: 0, clip: true, buffer: 0 },
      );
      groups = tile.features.length;
      if (groups) {
        polygons = tile.features.reduce(
          (count, feature) => count + feature.geometry.length,
          0,
        );
        const addition = fromGeojsonVt(
          { [CITY_FACADE_SOURCE_LAYER]: tile },
          { extent, version: 2 },
        );
        // Tile.layers is repeated protobuf data. Preserve every original layer.
        compressed = gzipSync(Buffer.concat([original, addition]));
      }
    }
  }
  return {
    status: 200,
    compressed,
    stats: {
      originalGzip: base.length,
      enrichedGzip: compressed.length,
      polygons,
      groups,
      processingMs: Math.round(performance.now() - start),
    },
  };
}

if (!isMainThread) {
  parentPort.on('message', async (job) => {
    try {
      const result = await makeTile(job);
      if (result.compressed) {
        const bytes = Uint8Array.from(result.compressed);
        parentPort.postMessage({ ...result, compressed: bytes }, [
          bytes.buffer,
        ]);
      } else {
        parentPort.postMessage(result);
      }
    } catch (error) {
      parentPort.postMessage({ error: error.message });
    }
  });
}

async function loadMetadata() {
  const response = await fetch(sourceURL, {
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`TileJSON HTTP ${response.status}`);
  }
  const metadata = JSON.parse(await readLimited(response));
  if (
    metadata.scheme === 'tms' ||
    !metadata.tiles?.length ||
    !Array.isArray(metadata.vector_layers) ||
    !Number.isInteger(metadata.maxzoom) ||
    metadata.maxzoom < 0 ||
    metadata.maxzoom > 22
  ) {
    throw new Error(
      'Expected XYZ TileJSON with vector_layers and integer maxzoom',
    );
  }
  return metadata;
}

async function build(metadata) {
  const z = metadata.maxzoom;
  const samples = [
    ['Moscow', 37.588, 55.797],
    ['Rostov-on-Don', 39.7152, 47.23325],
  ];
  await mkdir(output, { recursive: true });
  const tiles = [];
  for (const [name, lng, lat] of samples) {
    const [x, y] = tileAt(lng, lat, z);
    const id = `${z}-${x}-${y}`;
    const result = await makeTile({
      url: tileURL(metadata.tiles[0], z, x, y),
      z,
      x,
      y,
      decorate: true,
    });
    if (result.status !== 200)
      throw new Error(`Sample tile ${id} is unavailable`);
    await writeFile(resolve(output, `${id}.tmp`), result.compressed);
    await rename(resolve(output, `${id}.tmp`), resolve(output, `${id}.mvt.gz`));
    tiles.push({ name, id, ...result.stats });
  }
  await writeFile(
    resolve(output, 'report.tmp'),
    JSON.stringify(
      { sourceURL, metadata, extent, windowLimit, tiles },
      null,
      2,
    ),
  );
  await rename(resolve(output, 'report.tmp'), resolve(output, 'report.json'));
  console.table(tiles);
}

async function serve() {
  const report = await readFile(resolve(output, 'report.json'), 'utf8')
    .then(JSON.parse)
    .catch((error) => {
      if (error.code !== 'ENOENT') throw error;
      return null;
    });
  const compatible =
    report?.sourceURL === sourceURL &&
    report.extent === extent &&
    report.windowLimit === windowLimit;
  const metadata = compatible ? report.metadata : await loadMetadata();
  const cache = new Map();
  let cacheBytes = 0;
  const pending = new Map();
  const queue = [];
  const workers = new Set();
  let closing = false;

  function remember(id, entry) {
    if (entry.compressed.length > cacheLimit) return;
    while (
      cache.size &&
      (cache.size >= 256 || cacheBytes + entry.compressed.length > cacheLimit)
    ) {
      const oldest = cache.keys().next().value;
      cacheBytes -= cache.get(oldest).compressed.length;
      cache.delete(oldest);
    }
    cache.set(id, entry);
    cacheBytes += entry.compressed.length;
  }

  if (compatible) {
    for (const { id } of report.tiles) {
      if (!/^\d{1,2}-\d{1,7}-\d{1,7}$/.test(id)) continue;
      const compressed = await readFile(resolve(output, `${id}.mvt.gz`));
      remember(id, { status: 200, compressed });
    }
  }

  function dispatch(slot) {
    if (closing || slot.current || !queue.length) return;
    slot.current = queue.shift();
    slot.worker.postMessage(slot.current.job);
  }

  function spawn() {
    const slot = {
      worker: new Worker(new URL(import.meta.url)),
      current: null,
    };
    workers.add(slot);
    slot.worker.on('message', (result) => {
      const { id, resolve: complete, reject } = slot.current;
      slot.current = null;
      pending.delete(id);
      if (result.error) reject(new Error(result.error));
      else {
        if (result.compressed) remember(id, result);
        complete(result);
      }
      dispatch(slot);
    });
    slot.worker.on('error', (error) => console.error(error.message));
    slot.worker.once('exit', () => {
      workers.delete(slot);
      if (slot.current) {
        pending.delete(slot.current.id);
        slot.current.reject(new Error('Tile worker exited'));
      }
      if (!closing) spawn();
    });
    dispatch(slot);
  }
  for (let index = 0; index < maxWorkers; index += 1) spawn();

  function tile(z, x, y) {
    const id = `${z}-${x}-${y}`;
    const cached = cache.get(id);
    if (cached) {
      cache.delete(id);
      cache.set(id, cached);
      return Promise.resolve(cached);
    }
    if (pending.has(id)) return pending.get(id);
    if (pending.size >= queueLimit) return Promise.resolve({ status: 503 });

    const promise = new Promise((resolve, reject) => {
      queue.push({
        id,
        resolve,
        reject,
        job: {
          url: tileURL(metadata.tiles[0], z, x, y),
          z,
          x,
          y,
          decorate: z === metadata.maxzoom,
        },
      });
    });
    pending.set(id, promise);
    for (const slot of workers) dispatch(slot);
    return promise;
  }

  const port = Number(process.env.MAP_FACADES_PORT ?? 8094);
  const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      const route = new URL(req.url ?? '/', 'http://localhost').pathname;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405).end();
        return;
      }
      if (route === '/healthz') {
        res.end(
          JSON.stringify({
            pending: pending.size,
            queued: queue.length,
            cacheEntries: cache.size,
            cacheBytes,
            workers: workers.size,
          }),
        );
        return;
      }
      if (route === '/facades-v1.json') {
        const origin =
          process.env.MAP_FACADES_PUBLIC_URL ?? `http://${req.headers.host}`;
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        });
        res.end(
          req.method === 'HEAD'
            ? undefined
            : JSON.stringify({
                ...metadata,
                tiles: [`${origin}/facades-v1/{z}/{x}/{y}.mvt`],
                vector_layers: [
                  ...metadata.vector_layers.filter(
                    (layer) => layer.id !== CITY_FACADE_SOURCE_LAYER,
                  ),
                  {
                    id: CITY_FACADE_SOURCE_LAYER,
                    fields: { kind: 'String', base: 'Number', top: 'Number' },
                    minzoom: metadata.maxzoom,
                    maxzoom: metadata.maxzoom,
                  },
                ],
              }),
        );
        return;
      }
      const match = /^\/facades-v1\/(\d{1,2})\/(\d{1,7})\/(\d{1,7})\.mvt$/.exec(
        route,
      );
      if (!match) {
        res.writeHead(404).end();
        return;
      }
      const [z, x, y] = match.slice(1).map(Number);
      if (z > metadata.maxzoom || x >= 2 ** z || y >= 2 ** z) {
        res.writeHead(404).end();
        return;
      }
      const result = await tile(z, x, y);
      if (res.destroyed) return;
      if (result.status !== 200) {
        res
          .writeHead(
            result.status,
            result.status === 503 ? { 'Retry-After': '1' } : {},
          )
          .end();
        return;
      }
      const gzip = /(?:^|,)\s*gzip\s*(?:,|$)/i.test(
        req.headers['accept-encoding'] ?? '',
      );
      const headers = {
        'Content-Type': 'application/vnd.mapbox-vector-tile',
        'Cache-Control': 'public, max-age=60',
        Vary: 'Accept-Encoding',
      };
      if (gzip) {
        res.writeHead(200, {
          ...headers,
          'Content-Encoding': 'gzip',
          'Content-Length': result.compressed.length,
        });
        res.end(req.method === 'HEAD' ? undefined : result.compressed);
      } else if (req.method === 'HEAD') {
        res.writeHead(200, headers).end();
      } else {
        gunzip(result.compressed, (error, decoded) => {
          if (res.destroyed) return;
          if (error) res.writeHead(502).end();
          else res.writeHead(200, headers).end(decoded);
        });
      }
    } catch (error) {
      if (!res.destroyed) res.writeHead(502).end();
      console.error(error.message);
    }
  });
  server.listen(port, process.env.MAP_FACADES_BIND ?? '127.0.0.1', () => {
    console.log(`TileJSON: http://localhost:${port}/facades-v1.json`);
  });
  const shutdown = () => {
    if (closing) return;
    closing = true;
    for (const slot of workers) void slot.worker.terminate();
    for (const job of queue.splice(0)) {
      pending.delete(job.id);
      job.reject(new Error('Tile service is stopping'));
    }
    server.close();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

if (isMainThread) {
  const command = process.argv[2];
  if (command === 'build') await build(await loadMetadata());
  else if (command === 'serve') await serve();
  else
    throw new Error(
      'Usage: node --experimental-strip-types scripts/map-facades/pilot.mjs build|serve',
    );
}
