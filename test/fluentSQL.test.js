import { expect, describe, test } from "@jest/globals";
import FluentSQLBuilder from "../src/fluentSQL";

// arrange
const data = [
  {
    id: 0,
    name: "pedreca",
    category: "dev",
  },
  {
    id: 1,
    name: "cassia",
    category: "vet",
  },
  {
    id: 2,
    name: "valter",
    category: "barber",
  },
  {
    id: 3,
    name: "carlos",
    category: "barber",
  },
];

describe("Test Suite for FluentSQL Builder", () => {
  test("#for should return a FluentSQLBuilder instance", () => {
    // arrange
    const expected = new FluentSQLBuilder({ database: data });
    // act
    const result = FluentSQLBuilder.for(data);
    // assert
    expect(result).toStrictEqual(expected);
  });
  test("#build should return the empty object instance", () => {
    // arrange
    const expected = data;
    // act
    const result = FluentSQLBuilder.for(data).build();
    //assert
    expect(result).toStrictEqual(expected);
  });

  test("#limit given a collection it should limit results", () => {
    // arrange
    const expected = [data[0]];
    // act
    const result = FluentSQLBuilder.for(data).limit(1).build();
    //assert
    expect(result).toStrictEqual(expected);
  });
  test("#where given a collection it should filter data", () => {
    // arrange
    const expected = data.filter(
      ({ category }) => category.slice(0, 3) === "dev"
    );
    // act
    const result = FluentSQLBuilder.for(data)
      .where({
        category: /^dev/,
      })
      .build();
    //assert
    expect(result).toStrictEqual(expected);
  });
  test("#select given a collection it should return only specific fields", () => {
    // arrange
    const expected = data.map(({ name, category }) => ({ name, category }));
    // act
    const result = FluentSQLBuilder.for(data)
      .select(["name", "category"])
      .build();
    //assert
    expect(result).toStrictEqual(expected);
  });

  test("#orderBy given a collection it should order results by field", () => {
    // arrange
    const expected = [
      {
        id: 3,
        name: "carlos",
        category: "barber",
      },
      {
        id: 1,
        name: "cassia",
        category: "vet",
      },
      {
        id: 0,
        name: "pedreca",
        category: "dev",
      },
      {
        id: 2,
        name: "valter",
        category: "barber",
      },
    ];
    // act
    const result = FluentSQLBuilder.for(data).orderBy("name").build();
    // assert
    expect(result).toStrictEqual(expected);
  });

  test("pipeline", () => {
    // arrange
    const expected = data
      .filter(({ id }) => id === 2)
      .map(({ name, category }) => ({ name, category }));
    // act
    const result = FluentSQLBuilder.for(data)
      .where({ category: "barber" })
      .where({ name: /v/ })
      .select(["name", "category"])
      .orderBy("name")
      .build();

    console.log("result", result);
    expect(result).toStrictEqual(expected);
  });
});
