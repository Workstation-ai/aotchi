import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const TEST_DIR = mkdtempSync(join(tmpdir(), "aotchi-erc8004-"));
const REAL_DIR = process.env.AOTCHI_DIR;
process.env.AOTCHI_DIR = TEST_DIR;

import { getOrCreateWallet, getWallet } from "../src/infra/erc8004.js";

describe("ERC-8004 Wallet", () => {
  after(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
    if (REAL_DIR) process.env.AOTCHI_DIR = REAL_DIR;
  });

  it("should generate a new wallet on first call", () => {
    const wallet = getOrCreateWallet();
    assert.ok(wallet.privateKey.startsWith("0x"));
    assert.ok(wallet.address.startsWith("0x"));
    assert.equal(wallet.privateKey.length, 66); // 0x + 64 hex chars
    assert.ok(wallet.address.length >= 42);
  });

  it("should return same wallet on subsequent calls", () => {
    const w1 = getOrCreateWallet();
    const w2 = getOrCreateWallet();
    assert.equal(w1.privateKey, w2.privateKey);
    assert.equal(w1.address, w2.address);
  });

  it("should persist wallet to disk", () => {
    rmSync(TEST_DIR, { recursive: true, force: true });
    const wallet = getOrCreateWallet();
    const file = join(TEST_DIR, "wallet.json");
    assert.ok(existsSync(file));

    const stored = JSON.parse(readFileSync(file, "utf-8"));
    assert.equal(stored.privateKey, wallet.privateKey);
    assert.equal(stored.address, wallet.address);
  });

  it("getWallet should return null if no wallet", () => {
    rmSync(TEST_DIR, { recursive: true, force: true });
    const wallet = getWallet();
    assert.equal(wallet, null);
  });
});
