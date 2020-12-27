require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})


module.exports = {
  pathPrefix: "/gatsby-babylonjs-starter",
  siteMetadata: {
    title: `Gatsby Babylon Starter`,
    description: `Kick off your next, great Gatsby-Babylon project with this starter.`,
    author: `Andrija Perusic, https://red.com`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-preact`,   // reajoute  pour accelerer  javascript
  ],
}
