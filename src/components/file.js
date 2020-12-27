import React from "react"
import { graphql } from "gatsby"

export default function MyFiles() {
  
  return (

      <div>
        <h1>My Site's Files</h1>
        <table>
          <thead>
            <tr>
              <th>relativePath</th>
              <th>prettySize</th>
              <th>extension</th>
              <th>birthTime</th>
            </tr>
          </thead>
          <tbody>
           
              <tr>
                <td>un</td>
                <td>deux</td>
                <td>trois</td>
                <td>quatre</td>
              </tr>

          </tbody>
        </table>
      </div>

  )
}