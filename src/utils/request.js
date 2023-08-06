const {request: graphqlRequest} = require('graphql-request');

const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.SHOPIFY_STORE_DOMAIN ||
  'https://get-vinyl.myshopify.com';
const URL = `${SHOPIFY_STORE_DOMAIN}/api/2023-01/graphql.json`;
const MIN_QUERY = `
	id
	handle
	content: description
	title
	availableForSale
	artist: metafield(namespace: "custom", key: "main_artist") {
		value
	}
	date: metafield(namespace: "custom", key: "date") {
		value
	}
	jaxsta_id: metafield(key: "jaxsta_release_id", namespace: "custom"){
        value
	}
	featuredImage {
		originalSrc
		width
		height
	}
	variants(first: 1) {
		nodes {
			id
			price {
				amount
			}
			compareAtPrice {
				amount
			}
		}
	}
`;
const request = (document, variables) => {
  const SHOPIFY_STOREFRONT_API_ACCESSTOKEN = process.env.SHOPIFY_STOREFRONT_API_ACCESSTOKEN || '';
  return graphqlRequest({
    url: URL,
    document: document.trim().split(/\s+/).join(' '),
    requestHeaders: {
      'content-type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_ACCESSTOKEN,
    },
    variables: variables,
  });
};

module.exports = {
  request,
  MIN_QUERY
}