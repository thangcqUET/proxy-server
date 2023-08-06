const {MIN_QUERY, request} = require("../utils/request");
const {convertArrayRequestQuery, escapeValue} = require("../utils/utils");

async function findAll(req, res) {
  try {
    const {search, pageSize, cursor} = req.query
    const graphqlQuery = `
    {
      articles(
        first: ${pageSize || 5}${cursor ? `,after: "${cursor}"` : ''},
        sortKey: RELEVANCE,
        ${search ? `query: "${escapeValue(search)}"` : ''}
      ) {
        nodes {
          id
          handle
          title
          hero: metafield(namespace: "blog", key: "hero") {
            reference {
              ... on Metaobject {
                title: field(key: "title") {
                  value
                }
                link_handle: field(key: "link_handle") {
                  value
                }
                hide_title: field(key: "hide_title") {
                  value
                }
                navigation_bar_overlay: field(key: "navigation_bar_overlay") {
                  value
                }
                title_color: field(key: "title_color") {
                  reference {
                    ... on Metaobject {
                      color: field(key: "color") {
                        value
                      }
                    }
                  }
                }
                background_color: field(key: "background_color") {
                  reference {
                    ... on Metaobject {
                      color: field(key: "color") {
                        value
                      }
                    }
                  }
                }
                background_image: field(key: "background_image") {
                  reference {
                    ... on MediaImage {
                      image {
                        width
                        height
                        originalSrc
                      }
                    }
                  }
                }
                background_image_position: field(key: "background_image_position") {
                  value
                }
                background_mobile_image: field(key: "background_mobile_image") {
                  reference {
                    ... on MediaImage {
                      image {
                        width
                        height
                        originalSrc
                      }
                    }
                  }
                }
                mini_banner_text: field(key: "mini_banner_text") {
                  value
                }
                category: field(key: "category") {
                  value
                }
                category_color: field(key: "category_color") {
                  reference {
                    ... on Metaobject {
                      color: field(key: "color") {
                        value
                      }
                    }
                  }
                }
                category_position: field(key: "category_position") {
                  value
                }
              }
            }
          }
          social_date: metafield(namespace: "blog", key: "social_date") {
            value
          }
          image: metafield(namespace: "blog", key: "blog_preview") {
            reference {
              ... on MediaImage {
                image {
                  width
                  height
                  originalSrc
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    `
    return await request(graphqlQuery)
  } catch (err) {
    console.log(err.message)
    res.status(err?.response?.status || 500).json({message: err?.message});
  }
}

module.exports = {
  findAll
}