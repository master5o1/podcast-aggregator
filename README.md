# Podcast Aggregator

Takes a bunch of podcast feeds and combines them into one list of episodes as an output RSS feed.

Why? I want to make it easier for me to manage my podcasts aacross clients while also providing extra things like filtering episodes by keywords in the title or description.

## TODO

- Output RSS feed should have some sort of episode filtering.
  - Perhaps some `/feed/:id/filters` type thing to add/remove them, are these just a list of strings to match against?
  - Are they tied to a specific `Podcast`? ie, is the filter `"Australia Correspondent"` only to be applied upon `Nine to Noon`?
- Some authentication and security, user accounts, etc so that feeds can be managed by the feed owner.
- Perhaps replace/edit `node-podcast-parser` to allow for podcast channel `image` as in [Bang!](view-source:https://www.radionz.co.nz/oggcasts/bang.rss) from Radio NZ.
  ```xml
  <image>
    <title>RNZ: Bang!</title>
    <url>
      https://www.radionz.co.nz/assets/programmes/icons/764/300_TITLETILEFINALBANG.jpg?1501458145
    </url>
    <link>https://www.radionz.co.nz/programmes/bang</link>
  </image>
  ```
- figure out how to add some tests, because that's sometimes a bit of fun.
- figure out how to host it somewhere, because... otherwise what's the point?
