import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Scene from  "../components/scene"
//import LoadingScreen from "../components/LoadingScreen"

const IndexPage = (scene) => {

  return(
  <Layout>
    <SEO title="Home" />
     <Scene />
  </Layout>
  )
  }
export default IndexPage
