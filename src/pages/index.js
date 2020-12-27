import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Content from "../components/content"
import Scene from  "../components/scene"


const IndexPage = (scene) => {

  return(
  <Layout>
    <SEO title="Home"/>
    <Scene/>
    <Content />
  </Layout>
  )
  }
export default IndexPage
