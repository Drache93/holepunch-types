# holepunch-types 🛠️

> **Unofficial TypeScript type definitions for the Holepunch ecosystem**

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Welcome! This package provides TypeScript type definitions for key modules in the [Holepunch](https://holepunch.to) ecosystem, making it easier for TypeScript developers to build on top of these amazing peer-to-peer tools.

## 📦 Installation

```bash
npm install holepunch-types
# or
yarn add holepunch-types
# or
bun add holepunch-types
```

## 🚀 Usage

Once installed, the type definitions will be automatically available when you import the corresponding modules:

```typescript
import Autobase from "autobase";
import Hyperswarm from "hyperswarm";
import BlindPairing from "blind-pairing";
import ReadyResource from "ready-resource";
import Corestore from "corestore";
import Hyperbee from "hyperbee";
import Hyperblobs from "hyperblobs";
import Hyperdrive from "hyperdrive";
import * as b4a from "b4a";
import { encode, decode } from "z32";

// TypeScript will now provide full type support for these modules
```

## 🍐 Using with Pear

Get started quickly with TypeScript support in your Pear project:

### 1. Initialize a new Pear project

```bash
pear init --yes --type terminal
```

### 2. Convert to TypeScript

```bash
mv index.js index.ts
```

### 3. Install dependencies

```bash
bun install
```

### 4. Add type definitions

```bash
bun add github:Drache93/holepunch-types#v0.1.9
```

### 5. You now have full TypeScript support! 🎉

### 6. Example: Build a P2P chat app

Install some of the supported libraries and start building:

```bash
bun add hyperswarm hyperbee
```

```typescript
// index.ts
import Hyperswarm from "hyperswarm";
import Hyperbee from "hyperbee";
import * as b4a from "b4a";

// Full TypeScript support with autocomplete!
const swarm = new Hyperswarm({
  keyPair: crypto.keyPair(), // Properly typed
  maxPeers: 10,
});

const bee = new Hyperbee(core, {
  keyEncoding: "utf-8",
  valueEncoding: "utf-8",
});

swarm.on("connection", (connection, peerInfo) => {
  // Both connection and peerInfo are fully typed
  console.log("Connected to peer:", b4a.toString(peerInfo.publicKey, "hex"));
});

await swarm.join(b4a.from("chat-room", "utf-8"));
```

### 7. Build and run your app

Build your TypeScript project:

```bash
bun build index.ts --outdir . --packages=external
```

Then run it like a normal(TM) Pear app!:

```bash
pear run -d .
```

### 8. Easy development workflow

Update your `package.json` dev script for easy development:

```json
{
  "scripts": {
    "dev": "bun build index.ts --outdir . --packages=external && pear run -d ."
  }
}
```

Then simply run:

```bash
bun run dev
```

## 📦 Modules Covered

### Core Infrastructure

- `autobase` ⚡ - Append-only log with automatic linearization
- `blind-pairing` 🕶️ - Secure peer discovery and pairing
- `corestore` 📦 - Hypercore factory and storage management
- `hyperswarm` 🌐 - Distributed peer discovery and networking
- `ready-resource` 🔧 - Resource lifecycle management

### Data Storage & File Systems

- `hyperbee` 🐝 - Sorted key-value store built on Hypercore
- `hyperblobs` 💾 - Binary large object storage
- `hyperdrive` 🚗 - P2P file system and versioning

### Utilities

- `z32` 🔢 - Base32 encoding/decoding
- `b4a` 🧩 - Buffer utilities for Node.js and browsers

> **Note:** This is not a conclusive list or fully tested. More modules may be added as the ecosystem grows and as usage expands.

## 🔧 Type Coverage

The type definitions include:

- **Full API coverage** for all public methods and properties
- **Proper inheritance** and interface implementations
- **Event emitter support** with typed events
- **Async iterator support** where applicable
- **Comprehensive options interfaces** for all method parameters
- **Stream support** for read/write operations
- **Batch operations** with proper typing
- **Versioning and snapshot support**

## 🎯 Key Features

- **Zero configuration** - Types are automatically available
- **Complete IntelliSense** - Full autocomplete and type checking
- **Event handling** - Properly typed event listeners and emitters
- **Async operations** - Full support for promises and async/await
- **Stream operations** - Typed read/write streams
- **Batch processing** - Efficient batch operations with type safety

---

## 🙏 Thanks

Special thanks to the folks at [Holepunch](https://holepunch.to) for their groundbreaking work on these projects! This package is community-maintained and **not officially affiliated** with Holepunch or the upstream projects.

## 🤝 Contributing

Contributions, suggestions, and corrections are very welcome! Please open an issue or pull request if you spot a problem or want to add more types.

## 📜 License

MIT — see [LICENSE](./LICENSE)
