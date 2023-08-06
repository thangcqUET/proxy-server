const {MIN_QUERY, request} = require("../utils/request");
const {convertArrayRequestQuery} = require("../utils/utils");

async function findAll(req, res) {
  try {
    const genreMapList = {
      'Rap/Hip-Hop': ['rap', 'hip-hop', 'hiphop', 'hip hop', 'gangsta rap'],
      Rock: [
        'rock',
        'grunge',
        'alternative rock',
        'glam rock',
        'garage rock',
        'gothic rock',
        'experimental rock',
        'indie-rock',
        'southern rock',
        'hard rock',
        'blues rock',
      ],
      Pop: [
        'pop',
        'pop-punk',
        'alternative pop',
        'K-pop',
        'J-pop',
        'indie-pop',
        'dance-pop',
        'art pop',
        'dream pop',
        'bedroom pop',
        'synth-pop',
        'new wave',
      ],
      Metal: [
        'metal',
        'metalcore',
        'heavy metal',
        'alternative metal',
        'nu metal',
        'thrash metal',
        'doom metal',
        'death metal',
        'black metal',
      ],
      'Dance/Edm': [
        'Dance',
        'edm',
        'electronic',
        'electronica',
        'dancefloor classics',
        'electropop',
        'dance-pop',
      ],
      Punk: ['punk', 'punk rock', 'pop-punk', 'ska'],
      Country: ['Country', 'Alt-country&Americana', 'Americana'],
      Folk: ['folk', 'folk rock', 'indie folk', 'indie-folk'],
      Jazz: ['jazz', 'jazz vocals', 'jazz traditional', 'nu-jazz', 'soul-jazz&boogaloo'],
      'Soul/RnB': ['soul', 'r&b', 'soul/r&b', 'neo soul', 'alternative r&b'],
      Blues: ['blues', 'blues rock', 'blues traditional', 'rhythm and blues'],
      Disco: ['disco'],
      Classical: [
        'Classical artists',
        'classical composers',
        'classical vocal crossover',
        'opera/operetta',
      ],
      Latin: ['Latin pop/rock'],
      Reggae: ['reggae', 'reggaeton', 'ska'],
      Gospel: ['Gospel'],
      Christmas: ['Christmas'],
    };
    const {cursor, sortKey, reverse,minPrice,maxPrice,artist,genre,search,pageSize,id} = req.query;
    let query = '';
    if (search) {
      query += `title:${search}`
    }
    if (minPrice) {
      query += `variants.price:>=${minPrice} `;
    }
    if (maxPrice) {
      query += `variants.price:<${maxPrice} `;
    }
    if (convertArrayRequestQuery(artist)) {
      query += convertArrayRequestQuery(artist).map((mappedElement) => `title:'${mappedElement}'`).join(' OR ');
    }
    if (convertArrayRequestQuery(genre)) {
      const mappedGenres = convertArrayRequestQuery(genre).flatMap((genre) => genreMapList[genre] || []);
      query += mappedGenres.map((mappedElement) => `tag:'${mappedElement}'`).join(' OR ');
    }
    if (convertArrayRequestQuery(id)) {
      query += convertArrayRequestQuery(id).map((mappedElement) => `id:'${mappedElement}'`).join(' OR ');
    }
    const graphqlQuery = `{
		albums: products(
			first: ${pageSize || 20}${cursor ? `,after: "${cursor}"` : ''},
			${query ? `query: "${query}"` : ''}
			sortKey: ${sortKey || 'RELEVANCE'}, 
			reverse: ${reverse || false} 
		) {
			nodes {
				${MIN_QUERY}
				createdAt
			}
			pageInfo {
				endCursor
				hasNextPage
			}
    }
  }`;
    return await request(graphqlQuery)
  } catch (err) {
    console.log(err.message)
    res.status(err?.response?.status || 500).json({message: err?.message});
  }
}

module.exports = {
  findAll
}