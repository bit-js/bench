import { Serve, Context } from "ikari";
import { Controller, Get, Post } from "ikari/decorators";
import { Database } from "bun:sqlite";

const db = new Database(Bun.env.DB_PATH);
const items = db.query("select * from Items limit 50");

@Controller("/")
class Benchmark {
  @Get("/")
  index(ctx: Context) {
    return ctx.string("Hi");
  }

  @Get("/user/:id")
  user(ctx: Context) {
    return ctx.string(ctx.params.id);
  }

  @Get("/items")
  items(ctx: Context) {
    return ctx.json(items.all());
  }
}

Serve({
  controllers: [Benchmark],
  disableStartupMessage: true,
});
