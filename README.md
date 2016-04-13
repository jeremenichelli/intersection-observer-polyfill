## IntersectionObserver Polyfill

The IntersectionObserver API allows the developer to detect the intersection between a DOM elements and a reference element or the viewport.

**_BEWARE! This is still under development and doesn't cover all possible uses. Feel free to contribute!_**

You can see it working in this sample page built by [Wilson Page][1].

For more insight read [the official WICG draft][2].


### Contributing

Read the draft, fork this repo and help... there's a lot of stuff to do here yet:

- Support **rootMargin** in options
- Add support for intersection ratio under **threshold** option
- Add proper **this** context inside callback exposing **root** and **rootMargin** observer
- Support **root** element different from viewport
- ~~Support **unobserve** method~~
- ~~Support **disconnect** method~~
- Support **takeRecords** method
- Complete properties present in callback's context argument
  - ~~boundingClientRect~~
  - intersectionRect
  - rootBounds
  - ~~target~~
  - ~~time~~
- Support horizontal scrolling detection
- Improve frame rate performance on scroll
- Create sample page for root different for viewport case

### Browser support

This polyfill was tested in:

- **Chrome 49**
- **Firefox 45**
- **Safari 9**


[1]: https://github.com/wilsonpage
[2]: https://wicg.github.io/IntersectionObserver/
