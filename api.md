# Feed API

## GET /feed

List aggregation feeds. See `GET /feed/:id` section below for details on `FeedResponse`.

Response:

```typescript
Array<{
  id: string,
  title: string,
  podcasts: Array<{ id: string, url: string }>,
}>
```

## POST /feed

Create a new feed. Request body should be the feed data to create. `podcasts` array can be a string of new line separated URLs (eg, from a `<textarea>`). Example:

Request:

```typescript
{
  title: string,
  podcasts: string | Array<{ id?: string, url: string }>,
}
```

Response:

```typescript
{
  id: string,
  authKey: string,
  title: string,
  podcasts: Array<{ id: string, url: string }>,
}
```

## GET /feed/:id

Get data about a given feed. Similar to the post data response, excludes the `authKey`.

Response:

```typescript
{
  id: string,
  title: string,
  podcasts: Array<{ id: string, url: string }>,
}
```

## GET /feed/:id.rss

Generate an XML based podcast feed for this aggregation.

## DELETE /feed/:id/:authKey

Delete this aggregation feed.

Response:

```typescript
{
  id: string,
  title: string,
  podcasts: Array<{ id: string, url: string }>,
}
```

# Podcast API

## GET /podcast

List podcasts. See `GET /podcast/:id` section below for details on `PodcastResponse`.

Response:

```typescript
Array<{
    id: string,
    url: string,
}>
```

## POST /podcast

Add a podcast feed.

Request:

```typescript
{
  url: string,
}
```

Response:

```typescript
{
  id: string,
  url: string,
}
```

## GET /podcast/:id

Get data about a podcast.

Response:

```typescript
{
  id: string,
  url: string,
  data: undefined | {
    title: string,
    description: {
      short: string,
      long: string,
    },
    link: string,
    image: string,
    language: string,
    copyright: string,
    updated: date,
    explicit: boolean,
    categories: Array<string>,
    episodes: Array<{
      id: string,
      guid: string,
      title: string,
      description: string,
      explicit: boolean,
      image: string,
      published: date,
      duration: number,
      categories: Array<string>,
      enclosure: {
        filesize: number,
        type: string,
        url: string,
      }
    }>
  }
}
```

## GET /podcast/:id/fetch

Fetch RSS data and episodes.

Response:

```typescript
{
  id: string,
  fetched: number,
  total: number,
}
```
