module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        url: "https://api.gatsbyjs.org/public",
        typeName: "GatsbyFeedback",
        fieldName: "gatsby",
      },
    },
  ],
}
