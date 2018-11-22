# Podcast Aggregator

Takes a bunch of podcast feeds and combines them into one list of episodes as an output RSS feed.

Why? I want to make it easier for me to manage my podcasts aacross clients while also providing extra things like filtering episodes by keywords in the title or description.

## TODO

- Some sort of `/podcast/:id/fetch` to fetch latest episodes and store information in the db.
  - Perhaps use `Batch` and `Episode` entities to represent each run.
- `/feed/:id.rss` should retrieve the latest episode information from db instead of fetching directly.
- Output RSS feed should have some sort of episode filtering.
  - Perhaps some `/feed/:id/filters` type thing to add/remove them, are these just a list of strings to match against?
  - Are they tied to a specific `Podcast`? ie, is the filter `"Australia Correspondent"` only to be applied upon `Nine to Noon`?
- Some authentication and security, user accounts, etc so that feeds can be managed by the feed owner.
- figure out how to add some tests, because that's sometimes a bit of fun.
- figure out how to host it somewhere, because... otherwise what's the point?
