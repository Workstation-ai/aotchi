Project PROJECT-AOTCHI

    Name

        AOTCHI

    Specification

        ASRS 1.0.0

    Document Version

        0.1.0

    Description

        Autonomous On-chain Technology for Creativity, Humanity, and Intelligence.
        An open-source SDK for building, deploying, and managing
        autonomous on-chain agents on BNB Chain.

    Compliance Level

        Level 2

    Owner

        Zocrates


Principal CREATOR

    Type

        Human

    Description

        Developer or team that creates and funds agents

    Can

        Create agents

        Deploy agents on-chain

        Fund agent balances

        Define agent skills

        Pause and resume agents


Principal CLIENT

    Type

        Human

    Description

        End user who hires agents for specific tasks

    Can

        Hire agents via ERC-8183

        Pay for completed jobs

        Rate agent performance

        Review agent history


Principal AGENT

    Type

        Agent

    Description

        Autonomous on-chain entity that performs tasks

    Can

        Accept or reject jobs

        Negotiate pricing

        Execute tasks using skills

        Pay for own operational costs

        Earn revenue from completed jobs


Principal LLM-PROVIDER

    Type

        External System

    Description

        Language model API accessed via x402 payments

    Can

        Process LLM requests

        Return inference results

        Accept micropayments via x402


Feature FEAT-IDENTITY

    Description

        On-chain agent identity via ERC-8004

    Requirements

        REQ-8004-001

        REQ-8004-002


Feature FEAT-COMMERCE

    Description

        Agent job marketplace via ERC-8183

    Requirements

        REQ-8183-001

        REQ-8183-002


Feature FEAT-PAYMENTS

    Description

        HTTP-native payments via x402

    Requirements

        REQ-X402-001

        REQ-X402-002


Feature FEAT-SKILLS

    Description

        Agent intelligence and task execution

    Requirements

        REQ-SKILL-001


Feature FEAT-CLI

    Description

        Command-line interface for agent management


Feature FEAT-WEB

    Description

        Web dashboard for visual agent management


Feature FEAT-MOBILE

    Description

        Mobile app for on-the-go agent control


Scenario SCN-CREATE-AGENT

    Principal

        CREATOR

    Uses

        COMP-CLI

        COMP-SDK

        COMP-STORAGE

    Given

        Creator has wallet funded with BNB

    When

        Create agent with name and skill

    Then

        Agent record created locally

        Wallet address generated

        Agent appears in agent list


Scenario SCN-DEPLOY-AGENT

    Principal

        CREATOR

    Uses

        COMP-CLI

        COMP-SDK

        COMP-ERC8004

    Given

        Agent exists locally

    When

        Deploy agent to BSC testnet or mainnet

    Then

        ERC-8004 register called

        Agent receives unique token ID

        Agent visible on 8004scan

        Transaction hash recorded

        Agent scan URL returned


Scenario SCN-FUND-AGENT

    Principal

        CREATOR

    Uses

        COMP-CLI

        COMP-SDK

        COMP-STORAGE

    Given

        Agent exists

    When

        Feed agent with BNB amount

    Then

        Agent balance updated

        Ledger entry created


Scenario SCN-HIRE-AGENT

    Principal

        CLIENT

    Uses

        COMP-ERC8183

        COMP-AGENT

    Given

        Agent is active and funded

    When

        Client submits job with payment

    Then

        Job created in escrow

        Agent notified

        Agent accepts or rejects

        Upon completion payment released


Scenario SCN-AGENT-PAYS-LLM

    Principal

        AGENT

    Uses

        COMP-X402

        COMP-LLM-PROVIDER

    Given

        Agent needs LLM inference

    When

        Agent requests inference via x402

    Then

        Micropayment sent via EIP-3009

        LLM response returned

        Balance deducted

        Ledger entry created


Scenario SCN-AGENT-EARNS

    Principal

        AGENT

    Uses

        COMP-ERC8183

        COMP-LEDGER

    Given

        Agent completes a job

    When

        Job completion verified on-chain

    Then

        Payment released from escrow

        Agent balance increased

        Ledger entry created


Scenario SCN-PAUSE-AGENT

    Principal

        CREATOR

    Uses

        COMP-CLI

        COMP-STORAGE

    Given

        Agent is active

    When

        Pause agent

    Then

        Agent state set to paused

        Agent stops accepting jobs


Scenario SCN-RESUME-AGENT

    Principal

        CREATOR

    Uses

        COMP-CLI

        COMP-STORAGE

    Given

        Agent is paused

    When

        Resume agent

    Then

        Agent state set to active

        Agent resumes accepting jobs


Scenario SCN-LIST-AGENTS

    Principal

        CREATOR

    Uses

        COMP-CLI

        COMP-STORAGE

    Given

        Creator has created agents

    When

        List agents

    Then

        All local agents displayed with status


Scenario SCN-CHECK-STATUS

    Principal

        CREATOR

    Uses

        COMP-CLI

        COMP-STORAGE

    Given

        Agent exists

    When

        Check agent status

    Then

        Agent details displayed including balance state network


Component COMP-CLI

    Type

        Frontend

    Technology

        TypeScript, Commander.js, Chalk

    Responsibilities

        User interaction

        Command parsing

        Display output

    Uses

        COMP-SDK

    Verify

        MUST support all 8 commands

        MUST display agent status with neon styling

        MUST handle network flag for testnet/mainnet


Component COMP-SDK

    Type

        Library

    Technology

        TypeScript, Viem

    Responsibilities

        Agent lifecycle management

        Blockchain integration

        Storage abstraction

    Uses

        COMP-ERC8004

        COMP-STORAGE

        COMP-LEDGER

    Creates

        RES-AGENTS

        RES-WALLETS

        RES-LEDGER

    Verify

        MUST create agents locally

        MUST deploy agents on-chain

        MUST support testnet and mainnet

        SHOULD work in any Node.js environment


Component COMP-ERC8004

    Type

        Library

    Technology

        TypeScript, Viem

    Responsibilities

        On-chain identity registration

        Token URI management

        Agent verification

    Uses

        RES-AGENTS

    Verify

        MUST register agents on ERC-8004

        MUST return unique token ID

        MUST support setAgentURI

        MUST verify agent ownership


Component COMP-ERC8183

    Type

        Library

    Technology

        Solidity, TypeScript

    Responsibilities

        Job escrow management

        Dispute resolution

        Payment settlement

    Verify

        MUST create escrow for jobs

        MUST release payment on completion

        MUST handle disputes fairly


Component COMP-X402

    Type

        Library

        Technology

        TypeScript, EIP-3009

    Responsibilities

        HTTP-native micropayments

        Gasless token transfers

    Verify

        MUST support EIP-3009 transfers

        MUST enable gasless payments

        MUST deduct from agent balance


Component COMP-STORAGE

    Type

        Library

    Technology

        TypeScript, Node.js fs

    Responsibilities

        Local JSON persistence

        Agent state management

    Creates

        RES-AGENTS

        RES-WALLETS

    Verify

        MUST persist agent data at ~/.aotchi/

        MUST support CRUD operations

        MUST handle missing data gracefully


Component COMP-LEDGER

    Type

        Library

    Technology

        TypeScript

    Responsibilities

        Transaction history tracking

        Balance management

    Creates

        RES-LEDGER

    Verify

        MUST record all balance changes

        MUST maintain chronological order


Component COMP-WALLET

    Type

        Library

    Technology

        TypeScript, Viem

    Responsibilities

        Wallet generation and management

        Key persistence

    Verify

        MUST generate deterministic wallets

        MUST persist keys securely at ~/.aotchi/wallet.json

        MUST support multiple networks


Resource RES-AGENTS

    Type

        Table

    Schema

        id: string

        name: string

        state: idle | active | paused | starving

        skill: trading | analysis | alerts | custom

        balance: string

        network: testnet | mainnet

        tokenId: bigint (optional)

        txHash: string (optional)


Resource RES-WALLETS

    Type

        Secret

    Schema

        address: string

        privateKey: string


Resource RES-LEDGER

    Type

        Table

    Schema

        id: uuid

        agentId: string

        type: create | fund | earn | spend | pause | resume

        amount: string (optional)

        txHash: string (optional)

        timestamp: timestamp


Resource RES-SKILLS

    Type

        Table

    Schema

        id: string

        name: string

        description: string

        type: trading | analysis | alerts | custom


Test TEST-CREATE-AGENT

    Validates

        SCN-CREATE-AGENT

        COMP-CLI

        COMP-SDK

    Given

        Wallet exists

    When

        Create agent with name and skill

    Then

        Agent created locally

        Agent appears in list


Test TEST-DEPLOY-AGENT

    Validates

        SCN-DEPLOY-AGENT

        COMP-SDK

        COMP-ERC8004

    Given

        Agent exists locally

        Wallet has BNB for gas

    When

        Deploy agent to testnet

    Then

        Transaction succeeds

        Token ID returned

        Agent verified on-chain


Test TEST-FUND-AGENT

    Validates

        SCN-FUND-AGENT

        COMP-SDK

        COMP-STORAGE

    Given

        Agent exists

    When

        Feed agent 0.01 BNB

    Then

        Balance updated

        Ledger entry created


Test TEST-VERIFY-AGENT

    Validates

        SCN-DEPLOY-AGENT

        COMP-ERC8004

    Given

        Agent deployed on testnet

    When

        Verify agent by token ID

    Then

        Owner matches wallet

        URI contains correct metadata


Test TEST-SET-AGENT-URI

    Validates

        SCN-DEPLOY-AGENT

        COMP-ERC8004

    Given

        Agent deployed on testnet

    When

        Update agent metadata URI

    Then

        Transaction succeeds

        New URI stored on-chain


Test TEST-ERC8004-WALLET

    Validates

        COMP-WALLET

    Given

        No wallet exists

    When

        Get or create wallet

    Then

        Wallet generated

        File persisted at ~/.aotchi/wallet.json


Test TEST-LIST-AGENTS

    Validates

        SCN-LIST-AGENTS

        COMP-CLI

        COMP-STORAGE

    Given

        Multiple agents created

    When

        List agents

    Then

        All agents displayed


Test TEST-PAUSE-RESUME

    Validates

        SCN-PAUSE-AGENT

        SCN-RESUME-AGENT

        COMP-CLI

        COMP-STORAGE

    Given

        Active agent

    When

        Pause then resume

    Then

        State transitions correctly


Test TEST-INTEGRATION-RPC

    Validates

        COMP-ERC8004

    Given

        BSC testnet RPC available

    When

        Read agent data from chain

    Then

        On-chain data matches local state
