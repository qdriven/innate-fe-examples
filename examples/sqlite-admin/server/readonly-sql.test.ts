import { describe, expect, it } from "vitest"
import { validateReadOnlySql } from "./readonly-sql"

describe("validateReadOnlySql", () => {
  it("accepts SELECT and WITH", () => {
    expect(validateReadOnlySql("SELECT 1")).toBeNull()
    expect(validateReadOnlySql("WITH t AS (SELECT 1 AS x) SELECT x FROM t")).toBeNull()
  })

  it("rejects writes and multiple statements", () => {
    expect(validateReadOnlySql("DROP TABLE t")).not.toBeNull()
    expect(validateReadOnlySql("SELECT 1; SELECT 2")).not.toBeNull()
    expect(validateReadOnlySql("")).not.toBeNull()
  })
})
