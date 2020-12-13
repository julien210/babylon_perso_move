import React from "react"
import { Content } from "../components/content"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Scene from  "../components/scene"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    < Content />
    <Scene />
  </Layout>
)

export default IndexPage
