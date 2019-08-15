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
                minWidth: 300,
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
                id: "comment",
                accessor: d => (
                  <span
                    style={{
                      display: "block",
                      whiteSpace: "normal",
                    }}
                  >
                    {d.comment}
                  </span>
                ),
                aggregate: () => 1,
                Aggregated: () => <span>expand to read comments</span>,
                filterable: false,
                minWidth: 300,
              },
              {
                Header: "Date",
                id: "date",
                width: 150,
                accessor: d => d.date.toISOString().split("T")[0],
                aggregate: vals =>
                  vals
                    .map(d => new Date(d))
                    .sort((a, b) => b.getTime() - a.getTime())[0]
                    .toISOString()
                    .split("T")[0],
                Aggregated: row => <span>Updated {row.value}</span>,
                filterable: false,
                sortMethod: (a, b) =>
                  new Date(b).getTime() - new Date(a).getTime(),
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
