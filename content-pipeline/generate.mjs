import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ── Photo data (parsed from photos.js) ──────────────────────────────

const photosPath = join(rootDir, 'src', 'data', 'photos.js');
const raw = readFileSync(photosPath, 'utf-8');

function parseArray(varName) {
  const regex = new RegExp(`export const ${varName} = (\\[.*?\\])`, 's');
  const match = raw.match(regex);
  if (!match) return [];
  const cleaned = match[1]
    .replace(/objectFit:\s*"[^"]*",?/g, '')
    .replace(/objectPosition:\s*"[^"]*",?/g, '')
    .replace(/,\s*}/g, '}');
  return JSON.parse(cleaned);
}

const filmPhotos = parseArray('filmPhotos');
const digitalPhotos = parseArray('digitalPhotos');
const allPhotos = [
  ...filmPhotos.map(p => ({ ...p, type: 'film' })),
  ...digitalPhotos.map(p => ({ ...p, type: 'digital' }))
];

// ── Hashtag pools ────────────────────────────────────────────────────

const hashtagPools = {
  core: [
    '#macrophotography', '#naturephotography', '#wildlifephotography',
    '#jerseyci', '#channelislands', '#photography'
  ],
  jersey: [
    '#jersey', '#jerseylife', '#jerseyisland', '#jerseychannelislands',
    '#visitjersey', '#jerseylocal', '#jerseyphotography', '#jerseyphotographer',
    '#theislandofjersey', '#jerseybeaches', '#jerseycoast',
    '#jerseynature', '#jerseywidlife', '#lovjersey',
    '#channelislandlife', '#islandlife', '#islandphotography',
    '#bailiwickexpress', '#jerseyeveningpost'
  ],
  macro: [
    '#macro_brilliance', '#macro_perfection', '#macroworld',
    '#invertebrates', '#arthropod', '#closeup', '#macronature',
    '#canonr7', '#laowa100mm', '#macrolens', '#macro_drama',
    '#macro_highlight', '#macro_freaks', '#macrogardener',
    '#insectphotography', '#bugphotography'
  ],
  spider: [
    '#spiderphotography', '#spidersofinstagram', '#arachnid',
    '#britishspiders', '#ukarachnology', '#arachnology',
    '#spideridentification', '#jumpingspider', '#salticidae',
    '#spidersofig', '#arachnidsofinstagram', '#spiderlove',
    '#ilovespiders', '#spiderworld', '#araneae'
  ],
  nature: [
    '#naturelovers', '#naturalworld', '#biodiversity',
    '#ecology', '#naturalhistory', '#britishwildlife', '#islandlife',
    '#jerseynature', '#wildflowers', '#ukwildlife',
    '#naturephotography_uk', '#bbcwildlife', '#wildlifeplanet'
  ],
  film: [
    '#filmphotography', '#35mm', '#shootfilm', '#analogphotography',
    '#filmisnotdead', '#filmcommunity', '#grainisgood',
    '#kodakportra400', '#kodakgold200', '#kodakcolorplus',
    '#cinestill800t', '#fujicolor200', '#believeinfilm',
    '#filmfeed', '#thefilmcommunity', '#analog'
  ],
  filmCamera: [
    '#nikonf2', '#olympusmjuii', '#olympusstylus',
    '#vintagecamera', '#filmcamera', '#35mmfilm',
    '#shootfilmnotmegapixels', '#filmshooter'
  ],
  scienceComm: [
    '#sciencephotography', '#citizenscience', '#entomology',
    '#speciesidentification', '#taxonomy', '#scicomm',
    '#biologyphotography', '#naturalhistoryphotography'
  ]
};

function selectHashtags(photo, count = 20) {
  // Always include 2-3 Jersey tags for local visibility
  const jerseyTags = hashtagPools.jersey.sort(() => Math.random() - 0.5).slice(0, 3);
  let pools = [...hashtagPools.core];

  if (photo.type === 'film') {
    pools.push(...hashtagPools.film, ...hashtagPools.filmCamera);
    const filmStock = (photo.format || '').toLowerCase();
    if (filmStock.includes('portra')) pools.push('#portra400');
    if (filmStock.includes('cinestill')) pools.push('#cinestill', '#cinestill800t');
    if (filmStock.includes('gold')) pools.push('#kodakgold');
  }

  if (photo.type === 'digital') {
    pools.push(...hashtagPools.macro);
    if (photo.category === 'Nature') {
      pools.push(...hashtagPools.nature);
    }
  }

  if (isSpiderSubject(photo.subject)) {
    pools.push(...hashtagPools.spider, ...hashtagPools.scienceComm);
  }

  // Remove any Jersey duplicates from the main pool
  const jerseySet = new Set(jerseyTags);
  const unique = [...new Set(pools)].filter(t => !jerseySet.has(t));
  const shuffled = unique.sort(() => Math.random() - 0.5);

  // Jersey tags first, then fill remaining slots
  return [...jerseyTags, ...shuffled.slice(0, count - jerseyTags.length)];
}

// ── Caption generation ───────────────────────────────────────────────

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function isSpiderSubject(subject) {
  const s = (subject || '').toLowerCase();
  return s.includes('spider') || s.includes('salticidae') || s.includes('araneus') ||
    s.includes('steatoda') || s.includes('thomisidae') || s.includes('trichonephila');
}

function generateCaption(photo) {
  if (photo.type === 'film') return generateFilmCaption(photo);
  return generateDigitalCaption(photo);
}

function generateFilmCaption(photo) {
  const stock = photo.format?.replace('35mm — ', '').replace('35mm - ', '') || '35mm';

  const shortVariants = [
    `${photo.title}. ${stock}.`,
    `${photo.title}.`,
    `${stock}. ${photo.year}.`
  ];

  const mediumVariants = [
    `${photo.title}.\n\nNikon F2, ${stock}. ${photo.year}.`,
    `${photo.title}.\n\n${stock}. Shot on the Nikon F2.`,
    `${photo.title}.\n\nNikon F2 — ${stock}, ${photo.year}.`
  ];

  const detailedVariants = [
    `${photo.title}.\n\nNikon F2 — ${stock}.\n${photo.year}.`,
    `${photo.title}.\n\nShot on Nikon F2 with ${stock}. ${photo.year}.`,
    `${photo.title}.\n\n35mm — ${stock}. Nikon F2.\n${photo.year}.`
  ];

  return {
    short: pick(shortVariants),
    medium: pick(mediumVariants),
    detailed: pick(detailedVariants)
  };
}

function generateDigitalCaption(photo) {
  const hasSpecies = photo.subject && !photo.subject.includes('Organic') && !photo.subject.includes('Form');
  const spider = isSpiderSubject(photo.subject);

  const gear = `Canon R7, ${photo.lens}`;
  const settings = `${photo.shutter}, ${photo.aperture}, ISO ${photo.iso}`;
  const stackInfo = photo.stack !== '1 frame' ? `${photo.stack} focus stack` : '';

  if (spider) {
    const shortVariants = [
      `${photo.subject}.`,
      `${photo.subject}. Jersey, Channel Islands.`,
      `${photo.subject}. Garden find.`
    ];

    const mediumVariants = [
      `${photo.subject}.\n\n${gear}. ${settings}.${stackInfo ? ' ' + stackInfo + '.' : ''}`,
      `${photo.subject}. Found in the garden.\n\n${gear}. ${settings}.${stackInfo ? ' ' + stackInfo + '.' : ''}`,
      `${photo.subject}.\n\nJersey, Channel Islands.\n${gear}. ${settings}.${stackInfo ? ' ' + stackInfo + '.' : ''}`
    ];

    const detailedVariants = [
      `${photo.subject}.\n\nFound in Jersey, Channel Islands.\n\n${gear}. ${settings}.${stackInfo ? '\n' + stackInfo + '.' : ''}`,
      `${photo.subject}.\n\nGarden find, Jersey. ${stackInfo ? stackInfo + '. ' : ''}${gear}. ${settings}.`,
      `${photo.subject}.\n\nJersey, Channel Islands. Found around the house.\n\n${gear}. ${settings}.${stackInfo ? ' ' + stackInfo + '.' : ''}`
    ];

    return {
      short: pick(shortVariants),
      medium: pick(mediumVariants),
      detailed: pick(detailedVariants)
    };
  }

  if (hasSpecies) {
    return {
      short: `${photo.subject}.`,
      medium: `${photo.subject}.\n\n${gear}. ${settings}.${stackInfo ? ' ' + stackInfo + '.' : ''}`,
      detailed: `${photo.subject}.\n\n${gear}. ${settings}.${stackInfo ? '\n' + stackInfo + '.' : ''}`
    };
  }

  return {
    short: `${photo.title}.`,
    medium: `${photo.title}.\n\n${gear}. ${settings}.${stackInfo ? ' ' + stackInfo + '.' : ''}`,
    detailed: `${photo.title}.\n\n${gear}. ${settings}.${stackInfo ? '\n' + stackInfo + '.' : ''}`
  };
}

// ── Content batch generation ─────────────────────────────────────────

function generateBatch(photoIds, captionStyle = 'medium') {
  const posts = [];

  for (const id of photoIds) {
    const photo = allPhotos.find(p => p.id === id);
    if (!photo) {
      console.warn(`Photo ${id} not found, skipping.`);
      continue;
    }

    const captions = generateCaption(photo);
    const hashtags = selectHashtags(photo);
    const imagePath = join(rootDir, 'public', photo.src);

    posts.push({
      id: photo.id,
      type: photo.type,
      title: photo.title,
      imagePath,
      caption: captions[captionStyle] || captions.medium,
      allCaptions: captions,
      hashtags: hashtags.join(' '),
      hashtagList: hashtags,
      metadata: photo
    });
  }

  return posts;
}

function formatForReview(posts) {
  let output = `# Content Batch — Generated ${new Date().toISOString().split('T')[0]}\n`;
  output += `# ${posts.length} posts ready for review\n\n`;
  output += '---\n\n';

  for (const post of posts) {
    output += `## Post: ${post.title} (${post.id})\n`;
    output += `**Type:** ${post.type} | **Image:** ${post.imagePath}\n\n`;
    output += `### Caption\n${post.caption}\n\n`;
    output += `### Hashtags\n${post.hashtags}\n\n`;
    output += `### Alternative captions\n`;
    output += `- **Short:** ${post.allCaptions.short}\n`;
    output += `- **Medium:** ${post.allCaptions.medium.replace(/\n/g, ' ')}\n`;
    output += `- **Detailed:** ${post.allCaptions.detailed.replace(/\n/g, ' ')}\n`;
    output += '\n---\n\n';
  }

  return output;
}

function formatForScheduler(posts) {
  return posts.map(post => ({
    image: post.imagePath,
    caption: `${post.caption}\n\n${post.hashtags}`,
    scheduled_at: null
  }));
}

// ── CLI ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
Photography Content Pipeline
=============================

Usage:
  node generate.mjs list                          List all available photos
  node generate.mjs list film|digital|spiders     Filter by type
  node generate.mjs preview <id>                  Preview content for one photo
  node generate.mjs batch <id1,id2,...>            Generate a content batch
  node generate.mjs batch <id1,id2> --style short|medium|detailed
  node generate.mjs random <count>                Generate a random batch (default: 5)
  node generate.mjs random <count> --type film|digital|spiders
  node generate.mjs week                          Generate a week of content (mix of types)

Examples:
  node generate.mjs list
  node generate.mjs list spiders
  node generate.mjs preview d6
  node generate.mjs batch d6,d8,d16,f1,f3
  node generate.mjs batch d6,d8,d16 --style detailed
  node generate.mjs random 5
  node generate.mjs random 3 --type spiders
  node generate.mjs week
  `);
}

function listPhotos(filter) {
  let photos = allPhotos;

  if (filter === 'film') photos = allPhotos.filter(p => p.type === 'film');
  if (filter === 'digital') photos = allPhotos.filter(p => p.type === 'digital');
  if (filter === 'spiders') {
    photos = allPhotos.filter(p => {
      const s = (p.subject || '').toLowerCase();
      return s.includes('spider') || s.includes('salticidae') || s.includes('araneus') ||
        s.includes('steatoda') || s.includes('thomisidae') || s.includes('trichonephila');
    });
  }

  console.log(`\n${photos.length} photos:\n`);
  for (const p of photos) {
    const subject = p.subject ? ` — ${p.subject}` : '';
    const format = p.format ? ` (${p.format})` : '';
    console.log(`  ${p.id.padEnd(5)} ${p.type.padEnd(8)} ${p.title}${subject}${format}`);
  }
  console.log('');
}

switch (command) {
  case 'list':
    listPhotos(args[1]);
    break;

  case 'preview': {
    const id = args[1];
    if (!id) { console.log('Usage: node generate.mjs preview <id>'); break; }
    const posts = generateBatch([id], 'detailed');
    if (posts.length) console.log(formatForReview(posts));
    break;
  }

  case 'batch': {
    const ids = (args[1] || '').split(',').filter(Boolean);
    if (!ids.length) { console.log('Usage: node generate.mjs batch <id1,id2,...>'); break; }

    const styleFlag = args.indexOf('--style');
    const style = styleFlag !== -1 ? args[styleFlag + 1] : 'medium';

    const posts = generateBatch(ids, style);
    const review = formatForReview(posts);
    const scheduler = formatForScheduler(posts);

    const outDir = join(__dirname, 'output');
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const date = new Date().toISOString().split('T')[0];
    const reviewPath = join(outDir, `batch-${date}.md`);
    const schedulerPath = join(outDir, `batch-${date}.json`);

    writeFileSync(reviewPath, review);
    writeFileSync(schedulerPath, JSON.stringify(scheduler, null, 2));

    console.log(`\n✓ Batch generated: ${posts.length} posts`);
    console.log(`  Review:    ${reviewPath}`);
    console.log(`  Scheduler: ${schedulerPath}`);
    console.log(`\nReview the .md file, edit captions as needed, then schedule.\n`);
    break;
  }

  case 'random': {
    const count = parseInt(args[1]) || 5;
    const typeFlag = args.indexOf('--type');
    const typeFilter = typeFlag !== -1 ? args[typeFlag + 1] : null;

    let pool = [...allPhotos];
    if (typeFilter === 'film') pool = pool.filter(p => p.type === 'film');
    if (typeFilter === 'digital') pool = pool.filter(p => p.type === 'digital');
    if (typeFilter === 'spiders') pool = pool.filter(p => isSpiderSubject(p.subject));

    const shuffled = pool.sort(() => Math.random() - 0.5);
    const ids = shuffled.slice(0, count).map(p => p.id);

    const posts = generateBatch(ids, 'medium');
    const review = formatForReview(posts);
    const scheduler = formatForScheduler(posts);

    const outDir = join(__dirname, 'output');
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const date = new Date().toISOString().split('T')[0];
    const reviewPath = join(outDir, `random-${date}.md`);
    const schedulerPath = join(outDir, `random-${date}.json`);

    writeFileSync(reviewPath, review);
    writeFileSync(schedulerPath, JSON.stringify(scheduler, null, 2));

    console.log(`\n✓ Random batch: ${posts.length} posts`);
    console.log(`  Review:    ${reviewPath}`);
    console.log(`  Scheduler: ${schedulerPath}\n`);
    break;
  }

  case 'week': {
    // Generate a week of content: 4 macro/spider, 2 film, 1 nature/other
    const spiders = allPhotos.filter(p => isSpiderSubject(p.subject)).sort(() => Math.random() - 0.5);
    const macroNonSpider = allPhotos.filter(p => p.type === 'digital' && !isSpiderSubject(p.subject)).sort(() => Math.random() - 0.5);
    const films = allPhotos.filter(p => p.type === 'film').sort(() => Math.random() - 0.5);

    const weekIds = [
      ...spiders.slice(0, 3).map(p => p.id),
      ...macroNonSpider.slice(0, 1).map(p => p.id),
      ...films.slice(0, 2).map(p => p.id),
      ...(macroNonSpider.length > 1 ? [macroNonSpider[1].id] : spiders.length > 3 ? [spiders[3].id] : [])
    ].slice(0, 7);

    // Shuffle the order so it's not all spiders then all film
    const shuffledWeek = weekIds.sort(() => Math.random() - 0.5);

    const posts = generateBatch(shuffledWeek, 'medium');
    const review = formatForReview(posts);
    const scheduler = formatForScheduler(posts);

    const outDir = join(__dirname, 'output');
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const date = new Date().toISOString().split('T')[0];
    const reviewPath = join(outDir, `week-${date}.md`);
    const schedulerPath = join(outDir, `week-${date}.json`);

    writeFileSync(reviewPath, review);
    writeFileSync(schedulerPath, JSON.stringify(scheduler, null, 2));

    console.log(`\n✓ Week batch: ${posts.length} posts (target mix: 3 spider, 1 macro, 2 film, 1 other)`);
    console.log(`  Review:    ${reviewPath}`);
    console.log(`  Scheduler: ${schedulerPath}\n`);
    break;
  }

  default:
    printHelp();
}
