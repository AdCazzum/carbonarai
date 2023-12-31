# Carbonarai (POC)

[![Netlify Status](https://api.netlify.com/api/v1/badges/3e468748-681a-4f13-b9bd-c59f460675c5/deploy-status)](https://app.netlify.com/sites/melodious-sawine-f52954/deploys)

https://melodious-sawine-f52954.netlify.app/

## PROJECT NAME
CarbonarAI 🍝

## DESCRIPTION OF THE PROJECT
Carbonarai is a tool that helps in decision making processes. Through a friendly web interface, AI and Machine Learning algorithms, it provides a natural way of querying on chain data.

In particular, by using BitTensor and The Graph, extracts information from the blockchain and to provide a natural language interface to query them.

## DISCORD AND TELEGRAM USER NAME 
### [Ivan Sala](https://github.com/slavni96)

discord: wonderdnal

tg: wonderdnal

### [Andrea Ciceri](https://github.com/aciceri)
discord: aciceri

matrix: @aciceri:nixos.dev

## REPOSITORY WITH PROJECT'S CODE 
https://github.com/slavni96/carbonarai

## VIDEO DEMO 
https://www.loom.com/share/ad002184a4d34de1a7c5c54aa7fe8850?sid=a66775ca-db4c-4a90-b6c8-38f67fa599b6

## Example:
https://melodious-sawine-f52954.netlify.app/ - requires a local backend, atm we cannot expose a public backend, sources are on GitHub except for the LLM API Key that can be issued by BitAPAI (Bittensor) :)

## Bounties 
The Graph: we used The Graph Subgraph GraphQL API to gather information about ENS and Azuro (or any other Subgraph in the future). Writing GraphQL is quite hard and not accessible to everyone. Using CarbonarAI users can get information about Subgraphs using natural language.

ENS: We leverage the ENS Subgraph (https://thegraph.com/hosted-service/subgraph/ensdomains/ens) and we facilitate access to the information for everyone.

Azuro: As ENS, we facilitate access to the information, allowing the public to read in an easy way the data in the Subgraph (https://gem.azuro.org/subgraph/overview)

Bittensor: We used BitAPAI and Bittensor to have an open gateway to an LLM engine as a free, decentralized and open alternative to OpenAI. We also tried to start a local miner node to support the network.

Interface: We do not integrate Interface but we do have a (User) Interface, and it's simple, clean, and thought to simplify the data access to The Graph to allow everyone to gather info using natural language.

Brian: We do not integrate Brian but we do use LLM, and we think that Brian could leverage tech from CarbonarAI to improve its service!

Cypher Party: Unfortunately EthereansOs do not have a Subgraph yet but we experimented around the protocol and created one for testing purposes! It is committed in the repository and accessible using the below link (test purpose only based on 0x38B45A359cA3855BCdc4Ad76DC616BdF2f58a0f9):
https://api.studio.thegraph.com/query/50149/cypher-party/version/latest

# The technical stuff that you need to know
## Frontend

```bash
cd frontend
npm i
npm run dev
```

## Backend

```bash
cd backend
pip install -r requirements.txt
export OPENAI_API_KEY=KEY
uvicorn app.main:app --reload
```

## API Key

Get your API key for Bittensor from BitApai:

```https://app.bitapai.io/```
