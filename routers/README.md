# URL routers benchmark
Note that this benchmark only measures router performance, not framework performance. 
So if a framework uses the fastest router doesn't mean that it is the fastest framework.
The main cause of this is people writing a large abstraction on top of the router which makes it slower.

This benchmark requires each router to:
- Create a request context based on the provided `Request` object to parse the pathname and hold the parameter.
- Match the route using the context
- Assign the URL parameters
- Run the matched handler.
