import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Redirect AOTCHI_DIR to temp for tests
const TEST_DIR = mkdtempSync(join(tmpdir(), "aotchi-test-"));
process.env.AOTCHI_DIR = TEST_DIR;

import { Aotchi } from "../src/core/aotchi.js";
import { Ledger } from "../src/core/ledger.js";
import { SKILLS } from "../src/core/types.js";

describe("Aotchi Entity", () => {
  after(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  describe("create", () => {
    it("should create an egg with default values", () => {
      const a = Aotchi.create({ name: "Marcus", skill: "trading" });
      assert.equal(a.state.name, "Marcus");
      assert.equal(a.state.skill, "trading");
      assert.equal(a.state.status, "egg");
      assert.equal(a.state.balance, 0);
      assert.equal(a.state.jobsDone, 0);
      assert.ok(a.state.id.length > 0);
    });

    it("should reject unknown skill", () => {
      assert.throws(() => {
        Aotchi.create({ name: "Test", skill: "hacking" });
      }, /Unknown skill/);
    });

    it("should set custom description", () => {
      const a = Aotchi.create({ name: "Seneca", skill: "analysis", description: "Stoic analyst" });
      assert.equal(a.state.description, "Stoic analyst");
    });
  });

  describe("feed", () => {
    it("should add balance and activate from egg", () => {
      const a = Aotchi.create({ name: "Epictetus", skill: "alerts" });
      assert.equal(a.state.status, "egg");

      a.feed(10);
      assert.equal(a.state.status, "active");
      assert.equal(a.state.balance, 10);
    });

    it("should reject zero/negative amounts", () => {
      const a = Aotchi.create({ name: "Test", skill: "trading" });
      assert.throws(() => a.feed(0), /positive/);
      assert.throws(() => a.feed(-5), /positive/);
    });

    it("should accumulate balance", () => {
      const a = Aotchi.create({ name: "Test", skill: "trading" });
      a.feed(10);
      a.feed(20);
      assert.equal(a.state.balance, 30);
    });
  });

  describe("work", () => {
    it("should process a job correctly", () => {
      const a = Aotchi.create({ name: "Zeno", skill: "trading" });
      a.feed(50);

      const result = a.work(5.0, 0.5, "BTC analysis");
      assert.equal(result.earnings, 5.0);
      assert.equal(result.cost, 0.5);
      assert.equal(result.description, "BTC analysis");
      assert.equal(a.state.jobsDone, 1);
      assert.equal(a.state.balance, 54.5); // 50 - 0.5 + 5.0
      assert.equal(a.state.totalEarned, 5.0);
      assert.equal(a.state.totalSpent, 0.5);
    });

    it("should starve when balance hits zero", () => {
      const a = Aotchi.create({ name: "Test", skill: "trading" });
      a.feed(1);

      a.work(0, 1.0, "expensive job");
      assert.equal(a.state.status, "starved");
    });

    it("should not work if not active", () => {
      const a = Aotchi.create({ name: "Test", skill: "trading" });
      assert.throws(() => a.work(5, 0.5, "job"), /egg/);

      a.feed(10);
      a.pause();
      assert.throws(() => a.work(5, 0.5, "job"), /paused/);
    });
  });

  describe("pause / resume", () => {
    it("should pause and resume", () => {
      const a = Aotchi.create({ name: "Aurelius", skill: "research" });
      a.feed(20);

      a.pause();
      assert.equal(a.state.status, "paused");

      a.resume();
      assert.equal(a.state.status, "active");
    });

    it("should not pause twice", () => {
      const a = Aotchi.create({ name: "Test", skill: "trading" });
      a.feed(10);
      a.pause();
      assert.throws(() => a.pause(), /already paused/);
    });

    it("should not resume if not paused", () => {
      const a = Aotchi.create({ name: "Test", skill: "trading" });
      a.feed(10);
      assert.throws(() => a.resume(), /Cannot resume/);
    });
  });

  describe("fromState", () => {
    it("should restore from saved state", () => {
      const original = Aotchi.create({ name: "Chrysippus", skill: "analysis" });
      original.feed(25);
      original.work(3, 0.3, "test job");

      const restored = Aotchi.fromState(original.state, original.ledger.entries);
      assert.equal(restored.state.name, "Chrysippus");
      assert.equal(restored.state.balance, 27.7);
      assert.equal(restored.state.jobsDone, 1);
      assert.equal(restored.ledger.entries.length, 3); // feed + debit + credit
    });
  });
});

describe("Ledger", () => {
  it("should track credits and debits", () => {
    const l = new Ledger("test");
    l.addCredit(10, "feed");
    l.addDebit(2, "cost");

    assert.equal(l.getBalance(), 8);
    assert.equal(l.getTotalCredits(), 10);
    assert.equal(l.getTotalDebits(), 2);
  });

  it("should return recent entries", () => {
    const l = new Ledger("test");
    l.addCredit(1, "a");
    l.addCredit(2, "b");
    l.addCredit(3, "c");

    const recent = l.getRecent(2);
    assert.equal(recent.length, 2);
    assert.equal(recent[0].description, "b");
    assert.equal(recent[1].description, "c");
  });
});

describe("Skills", () => {
  it("should have 4 skills defined", () => {
    assert.equal(Object.keys(SKILLS).length, 4);
  });

  it("all skills should be profitable", () => {
    for (const [key, skill] of Object.entries(SKILLS)) {
      const dailyEarnings = skill.avgEarningPerJob * skill.avgJobsPerDay;
      const profit = dailyEarnings - skill.costPerDay;
      assert.ok(profit > 0, `${key} should be profitable`);
    }
  });
});
