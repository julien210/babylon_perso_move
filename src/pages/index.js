import React from "react"
import  Content  from "../components/content"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Scene from  "../components/scene"

 

 let  taille = window.innerWidth

 const IndexPage = () => (
 
  <Layout>
    <SEO title="Home" />
    { taille > 400 ?  <Content /> : null }

    
    <Scene />
  </Layout>
)

export default IndexPage
