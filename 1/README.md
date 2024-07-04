# Nethermind Forta Bot Monitor

## Description

This bot detects transactions related to the deployment and update of Nethermind Forta bots.

## Supported Chains

- Polygon

## Alerts

Describe each of the types of alerts fired by this bot:

- NETHERMIND-1
  - Fired when a transaction contains a call to the `createAgent` function, indicating the deployment of a new Forta bot from the Nethermind deployer address.
  - Severity is always set to "low".
  - Type is always set to "info".
  - Metadata fields included with this alert:
    - `agentID`: The ID of the deployed agent.
    - `from`: The address that deployed the agent.
    - `metadata`: Metadata associated with the deployment.
    - `chainIDs`: The IDs of the chains where the agent is deployed.

- NETHERMIND-2
  - Fired when a transaction contains a call to the `updateAgent` function, indicating an update to an existing Forta bot by the Nethermind deployer address.
  - Severity is always set to "low".
  - Type is always set to "info".
  - Metadata fields included with this alert:
    - `agentID`: The ID of the updated agent.
    - `metadata`: Metadata associated with the update.
    - `chainIDs`: The IDs of the chains where the agent is updated.

## Test Results

![image](https://github.com/sr2echa/forta-challenge/assets/65058816/80e79c18-e57d-4d3e-bcce-f9ab3d0e40ee)

