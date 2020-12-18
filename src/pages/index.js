import React from "react"
import  Content  from "../components/content"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Scene from  "../components/scene"

 



 const IndexPage = () => (
 
  <Layout>
    <SEO title="Home" />

    {
     let  taille = window.innerWidth;
    taille > 400 ?  <Content /> : null }
    
    <Scene />
  </Layout>
)

export default IndexPage
