import React from "react"
import { graphql } from "gatsby"
import ReactTable from "react-table"
import mean from "lodash.mean"

import "react-table/react-table.css"

export const query = graphql`
  {
    gatsby {
      feedback: getFeedback {
        comment
        url: originUrl
        rating
        date
      }
    }
  }
`

export default ({ data }) => {
  const feedback = data.gatsby.feedback.map(rating => ({
    ...rating,
    url: rating.url
      .replace(/https:\/\/(www\.)?gatsbyjs.org/, "")
      .replace(/\/$/, ""),
    date: new Date(rating.date),
  }))
  return (
    <>
      <h1>Docs Feedback</h1>
      <ReactTable
        data={feedback}
        columns={[
          {
            Header: "Feedback",
            columns: [
              {
                Header: "URL",
                id: "url",
                accessor: d =>
                  d.url.replace(/https:\/\/(www\.)?gatsbyjs.org/, ""),
                filterMethod: (filter, row) =>
                  row[filter.id].includes(filter.value),
              },
              {
                Header: "Rating",
                accessor: "rating",
                aggregate: vals => mean(vals),
                Aggregated: row => <span>{row.value.toFixed(1)} (avg)</span>,
                width: 75,
                filterable: false,
              },
              {
                Header: "Comment",
                accessor: "comment",
                aggregate: () => 1,
                Aggregated: () => <span>expand to read comments</span>,
                filterable: false,
              },
              {
                Header: "Date",
                id: "date",
                accessor: d => d.date.toLocaleDateString(),
                aggregate: vals =>
                  vals
                    .map(d => new Date(d))
                    .sort((a, b) => b.getTime() - a.getTime())[0]
                    .toLocaleDateString(),
                Aggregated: row => <span>Last updated: {row.value}</span>,
                filterable: false,
              },
            ],
          },
        ]}
        pivotBy={["url"]}
        className="-striped -highlight"
        filterable
      />
    </>
  )
}
