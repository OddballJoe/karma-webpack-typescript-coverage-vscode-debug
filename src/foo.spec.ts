import should from "should";

import Foo from "./foo";

describe("foo", () => {
  it("bar", () => {
    should.equal(new Foo("bar").name, "bar");
  });
});
