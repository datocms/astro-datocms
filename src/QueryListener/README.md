# Live real-time updates

`<QueryListener />` is an Astro component that you can use to implement client-side reload of the page as soon as the content of a query changes. It uses DatoCMS's [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api/api-reference) to receive the updated query results in real-time, and is able to reconnect in case of network failures.

Live reloads are great to get instant previews of your content while editing it inside DatoCMS.

`<QueryListener />` is based on the `subscribeToQuery` helper provided by the [datocms-listen](https://www.npmjs.com/package/datocms-listen) package.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Reference](#reference)
- [Initialization options](#initialization-options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install --save @datocms/astro
```

## Reference

Import `<QueryListener>` from `@datocms/astro` and use it inside your components setup function like this:

```astro
---
import { QueryListener } from '@datocms/astro/QueryListener';
import { executeQuery } from '@datocms/cda-client';

const query = gql`
  query {
    homepage {
      title
    }
  }
`;

const data = await executeQuery(query, { token: '<YOUR-API-TOKEN>' });
---

<h1>{data.homepage.title}</h1>

<QueryListener query={query} token="<YOUR-API-TOKEN>" />
```

## Initialization options

| prop               | type                                                                                       | required           | description                                                                                      | default                              |
| ------------------ | ------------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------ |
| enabled            | boolean                                                                                    | :x:                | Whether the subscription has to be performed or not                                              | true                                 |
| query              | string \| [`TypedDocumentNode`](https://github.com/dotansimha/graphql-typed-document-node) | :white_check_mark: | The GraphQL query to subscribe                                                                   |                                      |
| token              | string                                                                                     | :white_check_mark: | DatoCMS API token to use                                                                         |                                      |
| variables          | Object                                                                                     | :x:                | GraphQL variables for the query                                                                  |                                      |
| includeDrafts      | boolean                                                                                    | :x:                | If true, draft records will be returned                                                          |                                      |
| excludeInvalid     | boolean                                                                                    | :x:                | If true, invalid records will be filtered out                                                    |                                      |
| environment        | string                                                                                     | :x:                | The name of the DatoCMS environment where to perform the query (defaults to primary environment) |                                      |
| contentLink        | `'vercel-1'` or `undefined`                                                                | :x:                | If true, embed metadata that enable Content Link                                                 |                                      |
| baseEditingUrl     | string                                                                                     | :x:                | The base URL of the DatoCMS project                                                              |                                      |
| cacheTags          | boolean                                                                                    | :x:                | If true, receive the Cache Tags associated with the query                                        |                                      |
| initialData        | Object                                                                                     | :x:                | The initial data to use on the first render                                                      |                                      |
| reconnectionPeriod | number                                                                                     | :x:                | In case of network errors, the period (in ms) to wait to reconnect                               | 1000                                 |
| baseUrl            | string                                                                                     | :x:                | The base URL to use to perform the query                                                         | `https://graphql-listen.datocms.com` |
