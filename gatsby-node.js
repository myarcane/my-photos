// exports.createPages = async function({ actions, graphql }) {
//     const { data } = await graphql(`
//       query {
//         images: allFile(
//           filter: { fields: { FlikrImage: { eq: "true" } } }
//           sort: { fields: [fields___taken], order: DESC }
//         ) {
//           edges {
//             node {
//               childImageSharp {
//                 resolutions(width: 250) {
//                   ...GatsbyImageSharpResolutions
//                 }
//               }
//               id
//               fields {
//                 title
//                 taken
//               }
//             }
//           }
//         }
//       }
//     `)
//     data.allMarkdownRemark.edges.forEach(edge => {
//       const slug = edge.node.fields.slug
//       actions.createPage({
//         path: slug,
//         component: require.resolve(`./src/templates/blog-post.js`),
//         context: { slug: slug },
//       })
//     })
//   }
